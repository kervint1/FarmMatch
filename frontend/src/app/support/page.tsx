"use client";

import { Container } from "@/components/layout/container";

export default function SupportPage() {
  const contactEmail = "s1f102302124@iniad.org";
  return (
    <div className="bg-gray-50 py-12">
      <Container size="md">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">サポート</h1>
          <p className="text-gray-600 mb-8">ヘルプセンター / お問い合わせ / FAQ</p>

          {/* ヘルプセンター */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">ヘルプセンター</h2>
            <p className="text-gray-700">
              使い方やトラブルシュートの基本情報をまとめています。まずはFAQをご確認ください。
            </p>
          </section>

          {/* お問い合わせ */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">お問い合わせ</h2>
            <p className="text-gray-700 mb-2">
              ご不明点や不具合のご連絡は、以下のメール宛にお願いします。
            </p>
            <a
              href={`mailto:${contactEmail}`}
              className="text-green-600 font-medium hover:underline"
            >
              {contactEmail}
            </a>
            <ul className="mt-4 list-disc ml-6 text-gray-700">
              <li>件名に「お問い合わせ内容の要約」をご記載ください</li>
              <li>本文に「発生日時」「画面URL」「再現手順」を含めてください</li>
              <li>スクリーンショットがあると迅速に対応できます</li>
            </ul>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">FAQ</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900">
                  予約の変更やキャンセルはできますか？
                </h3>
                <p className="text-gray-700">
                  予約ページから変更・キャンセルが可能です。各体験のキャンセル規定をご確認ください。
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">ログインできない場合は？</h3>
                <p className="text-gray-700">
                  パスワード再設定をご利用ください。解決しない場合は上記の連絡先へお問い合わせください。
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">投稿が反映されない時は？</h3>
                <p className="text-gray-700">
                  ネットワーク状況をご確認の上、数分後に再度お試しください。改善しない場合は詳細を添えてご連絡ください。
                </p>
              </div>
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}
