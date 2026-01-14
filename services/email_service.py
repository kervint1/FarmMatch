import os
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any

import aiosmtplib
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)


class EmailService:
    """メール送信サービス"""

    SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
    SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USERNAME = os.getenv("SMTP_USERNAME", "")
    SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
    SMTP_FROM_EMAIL = os.getenv("SMTP_FROM_EMAIL", "")
    SMTP_FROM_NAME = os.getenv("SMTP_FROM_NAME", "FarmMatch")

    @classmethod
    async def send_reservation_approved_email(
        cls,
        to_email: str,
        reservation_data: Dict[str, Any],
    ) -> bool:
        """
        予約承認メールを送信

        Args:
            to_email: 送信先メールアドレス
            reservation_data: 予約データ（farm_name, start_date, end_date, num_guests, total_price, approval_message）

        Returns:
            bool: 送信成功時True、失敗時False
        """
        try:
            # メール本文を構築
            subject = "【FarmMatch】予約が承認されました"

            farm_name = reservation_data.get("farm_name", "不明")
            start_date = reservation_data.get("start_date", "不明")
            end_date = reservation_data.get("end_date", "不明")
            num_guests = reservation_data.get("num_guests", 0)
            total_price = reservation_data.get("total_price", 0)
            approval_message = reservation_data.get("approval_message", "")

            # HTMLメール本文
            html_body = f"""
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background-color: #16a34a; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }}
                    .content {{ background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }}
                    .detail-item {{ margin: 10px 0; padding: 10px; background-color: white; border-left: 4px solid #16a34a; }}
                    .detail-label {{ font-weight: bold; color: #374151; }}
                    .detail-value {{ color: #1f2937; }}
                    .message-box {{ background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; margin: 20px 0; border-radius: 6px; }}
                    .footer {{ text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🌾 FarmMatch</h1>
                    </div>
                    <div class="content">
                        <h2 style="color: #16a34a;">予約が承認されました</h2>
                        <p>こんにちは、</p>
                        <p>あなたの予約が農家ホストによって承認されました。</p>

                        <h3 style="color: #374151; margin-top: 30px;">予約詳細</h3>
                        <div class="detail-item">
                            <span class="detail-label">ファーム名:</span>
                            <span class="detail-value">{farm_name}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">開始日:</span>
                            <span class="detail-value">{start_date}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">終了日:</span>
                            <span class="detail-value">{end_date}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">ゲスト数:</span>
                            <span class="detail-value">{num_guests}人</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">料金:</span>
                            <span class="detail-value">¥{total_price:,}</span>
                        </div>
            """

            if approval_message:
                html_body += f"""
                        <div class="message-box">
                            <h4 style="color: #16a34a; margin-top: 0;">ホストからのメッセージ:</h4>
                            <p style="margin: 0;">{approval_message}</p>
                        </div>
                """

            html_body += """
                        <p style="margin-top: 30px;">ご不明な点がございましたら、FarmMatchサポートまでお問い合わせください。</p>
                        <p>素敵な農業体験をお楽しみください！</p>
                    </div>
                    <div class="footer">
                        <p>© 2025 FarmMatch チーム</p>
                    </div>
                </div>
            </body>
            </html>
            """

            # プレーンテキスト版
            text_body = f"""
こんにちは、

あなたの予約が農家ホストによって承認されました。

予約詳細:
- ファーム名: {farm_name}
- 開始日: {start_date}
- 終了日: {end_date}
- ゲスト数: {num_guests}人
- 料金: ¥{total_price:,}
"""

            if approval_message:
                text_body += f"""
ホストからのメッセージ:
{approval_message}
"""

            text_body += """
ご不明な点がございましたら、FarmMatchサポートまでお問い合わせください。

素敵な農業体験をお楽しみください！

FarmMatch チーム
"""

            # メッセージを作成
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = f"{cls.SMTP_FROM_NAME} <{cls.SMTP_FROM_EMAIL}>"
            message["To"] = to_email

            part1 = MIMEText(text_body, "plain", "utf-8")
            part2 = MIMEText(html_body, "html", "utf-8")

            message.attach(part1)
            message.attach(part2)

            # SMTP設定の検証
            if not cls.SMTP_USERNAME or not cls.SMTP_PASSWORD:
                logger.error("SMTP credentials not configured")
                return False

            # メール送信
            await aiosmtplib.send(
                message,
                hostname=cls.SMTP_HOST,
                port=cls.SMTP_PORT,
                username=cls.SMTP_USERNAME,
                password=cls.SMTP_PASSWORD,
                start_tls=True,
            )

            logger.info(f"Reservation approval email sent successfully to {to_email}")
            return True

        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            return False
