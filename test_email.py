"""
メール送信機能のテストスクリプト

使い方:
    python test_email.py your-email@iniad.org
"""

import asyncio
import sys
from services.email_service import EmailService


async def test_email_sending(recipient_email: str):
    """
    メール送信のテスト

    Args:
        recipient_email: テストメールの送信先アドレス
    """
    print("=" * 60)
    print("FarmMatch メール送信テスト")
    print("=" * 60)
    print()

    # SMTP設定の確認
    print("SMTP設定:")
    print(f"  Host: {EmailService.SMTP_HOST}")
    print(f"  Port: {EmailService.SMTP_PORT}")
    print(f"  Username: {EmailService.SMTP_USERNAME}")
    print(f"  Password: {'*' * len(EmailService.SMTP_PASSWORD) if EmailService.SMTP_PASSWORD else '未設定'}")
    print(f"  From Email: {EmailService.SMTP_FROM_EMAIL}")
    print(f"  From Name: {EmailService.SMTP_FROM_NAME}")
    print()

    # SMTP設定のバリデーション
    if not EmailService.SMTP_USERNAME or not EmailService.SMTP_PASSWORD:
        print("❌ エラー: SMTP_USERNAMEまたはSMTP_PASSWORDが設定されていません")
        print()
        print(".envファイルに以下を追加してください:")
        print()
        print("SMTP_HOST=smtp.gmail.com")
        print("SMTP_PORT=587")
        print("SMTP_USERNAME=your-email@iniad.org")
        print("SMTP_PASSWORD=your-app-password")
        print("SMTP_FROM_EMAIL=your-email@iniad.org")
        print("SMTP_FROM_NAME=FarmMatch")
        print()
        return False

    # テストメールデータ
    test_data = {
        "farm_name": "テストファーム",
        "start_date": "2025-01-15",
        "end_date": "2025-01-16",
        "num_guests": 2,
        "total_price": 10000,
        "approval_message": "この度はご予約ありがとうございます。お会いできることを楽しみにしています！",
    }

    print(f"送信先: {recipient_email}")
    print("メール送信を開始します...")
    print()

    try:
        # メール送信
        success = await EmailService.send_reservation_approved_email(
            recipient_email, test_data
        )

        if success:
            print("✅ メール送信成功！")
            print()
            print(f"{recipient_email} の受信トレイを確認してください。")
            print("迷惑メールフォルダも確認してください。")
            return True
        else:
            print("❌ メール送信失敗")
            return False

    except Exception as e:
        print(f"❌ エラーが発生しました: {str(e)}")
        print()
        print("よくあるエラー:")
        print("  - アプリパスワードが正しくない")
        print("  - 2段階認証が有効になっていない")
        print("  - メールアドレスが間違っている")
        print("  - ネットワーク接続の問題")
        return False


def main():
    """メイン関数"""
    if len(sys.argv) < 2:
        print("使い方: python test_email.py <送信先メールアドレス>")
        print("例: python test_email.py your-email@iniad.org")
        sys.exit(1)

    recipient = sys.argv[1]

    # メールアドレスの簡易バリデーション
    if "@" not in recipient:
        print(f"❌ エラー: 無効なメールアドレス: {recipient}")
        sys.exit(1)

    # 非同期関数を実行
    result = asyncio.run(test_email_sending(recipient))

    print()
    print("=" * 60)
    if result:
        print("テスト完了: 成功 ✅")
    else:
        print("テスト完了: 失敗 ❌")
    print("=" * 60)

    sys.exit(0 if result else 1)


if __name__ == "__main__":
    main()
