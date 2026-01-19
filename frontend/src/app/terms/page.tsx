"use client";

import { Container } from "@/components/layout/container";

export default function TermsPage() {
  return (
    <div className="bg-gray-50 py-12">
      <Container size="md">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">利用規約</h1>
          <p className="text-gray-600 mb-8">最終更新日：2026年1月</p>

          <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
            {/* 第1条 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">第1条　総則</h2>
              <div className="space-y-3">
                <p>
                  本利用規約（以下「本規約」といいます）は、Farm
                  Match（以下「当プラットフォーム」といいます）が提供するサービスの利用に関する条件を定めています。本プラットフォームの利用者（以下「ユーザー」といいます）は、本規約に完全に同意することで、本プラットフォームのサービスをご利用いただけます。
                </p>
                <p className="bg-red-50 border-l-4 border-red-500 p-4">
                  <strong className="text-red-700">重要</strong>
                  ：本プラットフォームはプラットフォームの提供のみを行い、ホストとゲスト間のすべての取引、安全性、品質、正当性等に関する一切の責任を負いません。ユーザーはすべての行動、決定、結果について完全に自己責任を負うものとします。
                </p>
              </div>
            </section>

            {/* 第2条 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">第2条　会員登録</h2>
              <div className="space-y-3">
                <p>
                  <strong>1. 会員の種類</strong>
                </p>
                <p className="ml-4">本プラットフォームの会員は、以下の2種類に分類されます：</p>
                <ul className="ml-8 space-y-2 list-disc">
                  <li>
                    <strong>農業体験提供者（ホスト）</strong>：農業体験を提供する農家・農業事業者
                  </li>
                  <li>
                    <strong>農業体験利用者（ゲスト）</strong>：農業体験を予約・体験する利用者
                  </li>
                </ul>
                <p className="mt-4">
                  <strong>2. 登録要件</strong>
                </p>
                <p className="ml-4">会員登録には以下の条件を満たす必要があります：</p>
                <ul className="ml-8 space-y-2 list-disc">
                  <li>18歳以上であること</li>
                  <li>有効なメールアドレスを所有していること</li>
                  <li>正確な個人情報を提供すること</li>
                  <li>本規約に同意すること</li>
                </ul>
                <p className="mt-4">
                  <strong>3. 登録情報の管理と責任</strong>
                </p>
                <p className="ml-4">
                  ユーザーは自身のアカウント情報を完全に管理する責任を負います。登録情報は正確で最新の状態を保つ義務があります。ユーザーのアカウントで行われたすべての取引、投稿、行為はユーザー自身の責任です。パスワード漏洩、不正アクセス、アカウント乗っ取り等による被害や損害について、当プラットフォームは一切の責任を負いません。
                </p>
              </div>
            </section>

            {/* 第3条 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                第3条　体験予約と申し込み - ユーザーの完全な責任
              </h2>
              <div className="space-y-3">
                <p>
                  <strong>1. 予約の責任</strong>
                </p>
                <p className="ml-4">
                  ユーザーが予約を申し込んだ場合、その取引内容、条件、相手方に関する確認はすべてユーザーの責任です。当プラットフォームは相手方ユーザーの適切性、信頼性、誠実性を保証しません。ユーザーは予約前に十分な調査を行い、自己判断で取引を行ってください。
                </p>
                <p className="mt-4">
                  <strong>2. キャンセルと返金</strong>
                </p>
                <p className="ml-4">
                  キャンセル料は以下の通りとなります。すべてのキャンセルはユーザーの一方的な行為であり、その結果はユーザーが負担します：
                </p>
                <ul className="ml-8 space-y-2 list-disc">
                  <li>体験予定日の7日以前：無料キャンセル</li>
                  <li>体験予定日の4～6日前：予約金額の25%</li>
                  <li>体験予定日の2～3日前：予約金額の50%</li>
                  <li>体験予定日の1日前～当日：予約金額の100%</li>
                </ul>
                <p className="mt-4">
                  ホスト側の理由によるキャンセルや返金に関するトラブルはユーザー間で直接解決してください。当プラットフォームは仲裁や返金処理に関与しません。
                </p>
                <p className="mt-4">
                  <strong>3. 支払いの責任</strong>
                </p>
                <p className="ml-4">
                  ユーザーは支払い手段（クレジットカード等）に関する一切の責任を負います。支払い後のトラブル、クレジットカード情報の盗難、不正利用等について、当プラットフォームは対応しません。これらの問題は各ユーザーが支払い事業者に直接対応してください。
                </p>
              </div>
            </section>

            {/* 第4条 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                第4条　安全と責任 - ユーザーの完全責任
              </h2>
              <div className="space-y-3">
                <p className="bg-red-50 border-l-4 border-red-500 p-4">
                  <strong className="text-red-700">重要な責任事項</strong>
                  ：体験中のすべての安全性、怪我、事故、損害等に関する完全な責任はユーザーが負うものとします。当プラットフォームは一切の責任を負いません。
                </p>
                <p className="mt-4">
                  <strong>1. ホストの責任</strong>
                </p>
                <p className="ml-4">
                  ホストは農業体験を提供するのみです。ゲストの安全確保は
                  <strong>ゲスト自身の責任</strong>
                  です。当プラットフォームはホストが安全対策を実施しているかどうかの確認、監督、管理を一切行いません。ホストが不十分な安全対策を行っていても、当プラットフォームは責任を負いません。
                </p>
                <p className="mt-4">
                  <strong>2. ゲストの責任と義務</strong>
                </p>
                <p className="ml-4">
                  ゲストは体験に参加する前に、その危険性を十分に理解する責任があります。以下の事項を認識してください：
                </p>
                <ul className="ml-8 space-y-2 list-disc">
                  <li>農業体験は危険な作業を含む場合があります</li>
                  <li>怪我、感染症、その他の健康被害が発生する可能性があります</li>
                  <li>ホストの指示に従わなかった場合、その結果はゲストが負担します</li>
                  <li>自身の健康状態について完全に自己判断し、リスクを評価する責任があります</li>
                  <li>すべての事故、怪我、損害について完全に自己責任を負うことを認識します</li>
                </ul>
                <p className="mt-4">
                  <strong>3. 保険と損害賠償</strong>
                </p>
                <p className="ml-4">
                  ゲストは体験中の事故に備えて、個人の責任で保険に加入してください。ゲストの怪我や損害について、当プラットフォームおよびホストに損害賠償請求を行うことはできません。これはユーザーが体験に参加することで暗に承認する条件です。
                </p>
              </div>
            </section>

            {/* 第5条 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                第5条　コミュニティ利用
              </h2>
              <div className="space-y-3">
                <p>
                  <strong>1. 投稿の禁止行為</strong>
                </p>
                <p className="ml-4">以下のような投稿は禁止されています：</p>
                <ul className="ml-8 space-y-2 list-disc">
                  <li>暴力的、差別的、または侮辱的な内容</li>
                  <li>スパムまたは広告目的の投稿</li>
                  <li>個人情報の不正な開示</li>
                  <li>著作権やプライバシーを侵害する内容</li>
                  <li>虚偽の情報や詐欺的な投稿</li>
                </ul>
                <p className="mt-4">
                  <strong>2. 投稿の管理</strong>
                </p>
                <p className="ml-4">
                  当プラットフォームは、本規約に違反する投稿を予告なく削除する権利があります。繰り返し違反する場合、ユーザーのアカウント停止またはサービス利用の禁止を行うことがあります。
                </p>
              </div>
            </section>

            {/* 第6条 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                第6条　スタンプラリー機能
              </h2>
              <div className="space-y-3">
                <p>
                  <strong>1. スタンプについて</strong>
                </p>
                <p className="ml-4">
                  スタンプは、農業体験を完了したゲストに付与される電子ポイントです。スタンプの有効期限は付与から2年間です。
                </p>
                <p className="mt-4">
                  <strong>2. スタンプの失効</strong>
                </p>
                <p className="ml-4">以下の場合、スタンプは失効する可能性があります：</p>
                <ul className="ml-8 space-y-2 list-disc">
                  <li>有効期限の満了</li>
                  <li>アカウント削除</li>
                  <li>利用規約違反の場合</li>
                </ul>
              </div>
            </section>

            {/* 第7条 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">第7条　知的財産権</h2>
              <p>
                本プラットフォーム上で公開されているコンテンツ（画像、テキスト、動画等）の著作権は、当プラットフォームまたは各投稿者に帰属します。ユーザーは、個人的な利用を目的とする場合を除き、無断で複製、改変、配布などを行うことはできません。
              </p>
            </section>

            {/* 第8条 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                第8条　個人情報の取り扱い
              </h2>
              <p>
                個人情報の取り扱いについては、別途定める「プライバシーポリシー」をご参照ください。当プラットフォームは、ユーザーの個人情報を保護し、法令に従って適切に管理します。
              </p>
            </section>

            {/* 第9条 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                第9条　免責事項 - 当プラットフォームの完全免責
              </h2>
              <div className="space-y-3">
                <p className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                  <strong className="text-red-700">重要</strong>
                  ：当プラットフォームはサービスの提供のみを行い、プラットフォーム上のすべての取引、ユーザー間の紛争、損害、事故、事業結果、利益喪失等に関してあらゆる責任を放棄します。
                </p>
                <p>
                  <strong>1. サービスの現状提供</strong>
                </p>
                <p className="ml-4">
                  当プラットフォームは「現状のまま」で提供されます。以下の事項について、当プラットフォームは一切の保証を行いません：
                </p>
                <ul className="ml-8 space-y-2 list-disc">
                  <li>サービスが中断されないこと</li>
                  <li>エラー、バグ、セキュリティ脅威がないこと</li>
                  <li>プラットフォームが正常に機能すること</li>
                  <li>提供される情報が正確で最新であること</li>
                  <li>ユーザー体験が満足のいくものであること</li>
                </ul>
                <p className="mt-4">
                  <strong>2. ユーザー間の取引について</strong>
                </p>
                <p className="ml-4">
                  ホストとゲスト間のすべての取引、契約、合意、紛争について、当プラットフォームは関与しません。ユーザー間で発生したあらゆるトラブル、詐欺、契約不履行、金銭トラブル、安全問題等について、当プラットフォームは仲裁、解決、補償を行いません。これらはすべてユーザー間で解決してください。
                </p>
                <p className="mt-4">
                  <strong>3. ユーザーの選定と信頼</strong>
                </p>
                <p className="ml-4">
                  当プラットフォームはユーザーの身元確認、信用調査、適切性判断を行いません。ホストが本当に農業体験を提供する能力があるか、ゲストが信頼できるユーザーであるか、を当プラットフォームが確認することはありません。ユーザーは自己判断に基づいて他のユーザーを信頼してください。
                </p>
                <p className="mt-4">
                  <strong>4. 投稿内容の責任</strong>
                </p>
                <p className="ml-4">
                  ユーザーが投稿したすべてのコンテンツ（説明、画像、価格等）について、当プラットフォームは内容の真実性、正確性、適法性を保証しません。虚偽の投稿、詐欺的な説明、不適切な価格設定等が発生した場合、その責任は投稿したユーザーが負います。当プラットフォームは監視、検証、削除の義務を負いません。
                </p>
                <p className="mt-4">
                  <strong>5. 損害賠償免除</strong>
                </p>
                <p className="ml-4">
                  当プラットフォームの利用に関連して生じたいかなる損害（直接的、間接的、懲罰的、特別、結果的な損害を含む）について、当プラットフォームは補償を行いません。ユーザーが被った経済的損失、精神的苦痛、物的損害、機会喪失等は、ユーザーが完全に負担します。
                </p>
                <p className="mt-4">
                  <strong>6. セキュリティと個人情報</strong>
                </p>
                <p className="ml-4">
                  当プラットフォームはセキュリティの完全性を保証しません。ユーザーの個人情報、クレジットカード情報等が盗まれた場合、当プラットフォームは責任を負いません。高度なセキュリティ標準を提供しているかについても、当プラットフォームは保証しません。
                </p>
              </div>
            </section>

            {/* 第10条 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">第10条　規約の変更</h2>
              <p>
                当プラットフォームは、必要に応じて本規約を変更することがあります。変更後の規約は、本プラットフォーム上に掲示された時点で効力が生じます。継続してサービスを利用することは、変更内容に同意したものとみなします。
              </p>
            </section>

            {/* 第11条 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                第11条　アカウント停止と利用禁止
              </h2>
              <div className="space-y-3">
                <p>
                  <strong>1. 停止の権利</strong>
                </p>
                <p className="ml-4">
                  当プラットフォームは、本規約違反と判断した場合、予告なくアカウントを停止、削除、またはサービス利用を禁止する権利を有します。当プラットフォームはその判断について、説明や異議申し立ての機会を提供する義務を負いません。
                </p>
                <p className="mt-4">
                  <strong>2. 停止理由の例</strong>
                </p>
                <p className="ml-4">以下の行為（に限定されない）がある場合、停止対象となります：</p>
                <ul className="ml-8 space-y-2 list-disc">
                  <li>本規約に違反する行為</li>
                  <li>詐欺的または不正な行為</li>
                  <li>他のユーザーへの嫌がらせや脅迫</li>
                  <li>法令に違反する行為</li>
                  <li>虚偽の情報提供</li>
                  <li>不適切な取引行為</li>
                </ul>
                <p className="mt-4">
                  <strong>3. 異議申し立ての制限</strong>
                </p>
                <p className="ml-4">
                  アカウント停止の決定に対して、異議申し立てをすることはできます。ただし、当プラットフォームがその異議を認めず、決定を変更する義務はありません。当プラットフォームの判断は最終的なものです。
                </p>
              </div>
            </section>

            {/* 第12条 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">第12条　お問い合わせ</h2>
              <p>
                本規約に関するご質問やお問い合わせは、当プラットフォームのお問い合わせフォームよりお願いします。
              </p>
            </section>

            {/* 附則 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">附則</h2>
              <p>本利用規約は2026年1月より施行されます。</p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              <strong>最終確認：</strong>
              このプラットフォームを利用することで、ユーザーはすべての記載事項に同意し、完全に自己責任を負うことを承認します。当プラットフォームはプラットフォーム提供のみを行い、あらゆる損害、紛争、事故について責任を負いません。
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
