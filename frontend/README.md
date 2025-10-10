# Farm Match - フロントエンド

Farm Matchのフロントエンドアプリケーション（Next.js 14）

## 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **認証**: NextAuth.js (Google OAuth 2.0)
- **パッケージマネージャー**: npm

## 開発環境セットアップ

### 必要要件

- Node.js 20.x
- Dev Container環境（推奨）

### 開発サーバー起動

```bash
npm run dev
```

開発サーバーが起動し、[http://localhost:3000](http://localhost:3000) でアクセスできます。

### その他のコマンド

```bash
# ビルド
npm run build

# プロダクションサーバー起動
npm start

# Linter実行
npm run lint

# コードフォーマット（Prettier）
npm run format
```

## ディレクトリ構成

```
frontend/
├── public/                     # 静的ファイル
│   ├── images/                 # 画像ファイル
│   └── icons/                  # アイコンファイル
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # 認証が必要なルートグループ
│   │   │   ├── mypage/         # マイページ
│   │   │   │   ├── page.tsx
│   │   │   │   ├── profile/    # プロフィール編集
│   │   │   │   ├── reservations/ # 予約履歴
│   │   │   │   └── reviews/    # 投稿レビュー
│   │   │   ├── farms/          # 農家用管理画面
│   │   │   │   ├── page.tsx    # ファーム一覧
│   │   │   │   ├── [id]/       # ファーム編集
│   │   │   │   └── new/        # 新規ファーム登録
│   │   │   ├── admin/          # 管理者画面
│   │   │   │   ├── users/      # ユーザー管理
│   │   │   │   ├── farms/      # ファーム管理
│   │   │   │   └── content/    # コンテンツ管理
│   │   │   └── community/      # SNS画面
│   │   │       ├── page.tsx    # 投稿フィード
│   │   │       └── [postId]/   # 投稿詳細
│   │   ├── login/              # ログイン画面
│   │   │   └── page.tsx
│   │   ├── search/             # ホーム/検索画面
│   │   │   └── page.tsx
│   │   ├── stays/              # ステイ先関連
│   │   │   ├── page.tsx        # 一覧（検索結果）
│   │   │   └── [id]/           # 詳細・予約
│   │   │       ├── page.tsx    # 詳細画面
│   │   │       └── reserve/    # 予約画面
│   │   │           └── page.tsx
│   │   ├── api/                # API Routes
│   │   │   └── auth/           # NextAuth.js
│   │   │       └── [...nextauth]/
│   │   │           └── route.ts
│   │   ├── layout.tsx          # ルートレイアウト
│   │   ├── page.tsx            # トップページ
│   │   └── globals.css         # グローバルスタイル
│   ├── components/             # 共通コンポーネント
│   │   ├── ui/                 # 基本UIコンポーネント
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Rating.tsx      # 5段階評価
│   │   │   └── ImageGallery.tsx
│   │   ├── layout/             # レイアウトコンポーネント
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   ├── features/           # 機能別コンポーネント
│   │   │   ├── search/
│   │   │   │   ├── SearchBar.tsx
│   │   │   │   ├── PrefectureSelect.tsx
│   │   │   │   └── FilterPanel.tsx
│   │   │   ├── farm/
│   │   │   │   ├── FarmCard.tsx       # 一覧カード
│   │   │   │   ├── FarmDetail.tsx
│   │   │   │   └── FarmForm.tsx       # 農家用登録/編集
│   │   │   ├── reservation/
│   │   │   │   ├── ReservationForm.tsx
│   │   │   │   └── ReservationCard.tsx
│   │   │   ├── review/
│   │   │   │   ├── ReviewForm.tsx
│   │   │   │   ├── ReviewCard.tsx
│   │   │   │   └── ReviewList.tsx
│   │   │   ├── community/
│   │   │   │   ├── PostCard.tsx
│   │   │   │   ├── PostForm.tsx
│   │   │   │   ├── CommentList.tsx
│   │   │   │   └── LikeButton.tsx
│   │   │   └── auth/
│   │   │       ├── GoogleLoginButton.tsx
│   │   │       └── ProtectedRoute.tsx
│   │   └── providers/          # Context Providers
│   │       ├── AuthProvider.tsx
│   │       └── ThemeProvider.tsx
│   ├── lib/                    # ユーティリティ・ヘルパー
│   │   ├── api/                # APIクライアント
│   │   │   ├── client.ts       # Axios/Fetch設定
│   │   │   ├── farms.ts        # ファーム関連API
│   │   │   ├── reservations.ts
│   │   │   ├── reviews.ts
│   │   │   ├── posts.ts        # SNS投稿API
│   │   │   └── users.ts
│   │   ├── hooks/              # カスタムフック
│   │   │   ├── useAuth.ts
│   │   │   ├── useFarms.ts
│   │   │   ├── useReservations.ts
│   │   │   └── usePosts.ts
│   │   ├── utils/              # ヘルパー関数
│   │   │   ├── format.ts       # 日付・料金フォーマット
│   │   │   ├── validation.ts   # フォームバリデーション
│   │   │   └── constants.ts    # 定数（都道府県リスト等）
│   │   └── auth.ts             # NextAuth設定
│   └── types/                  # TypeScript型定義
│       ├── api.ts              # API レスポンス型
│       ├── farm.ts             # ファーム関連型
│       ├── reservation.ts
│       ├── review.ts
│       ├── post.ts             # SNS投稿型
│       ├── user.ts
│       └── index.ts            # 型エクスポート
├── .eslintrc.json
├── .prettierrc.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 主要機能（フェーズ1）

### 1. ユーザー認証
- Google OAuth 2.0による認証
- NextAuth.jsを使用した認証フロー

### 2. ファームステイ検索・予約
- キーワード検索
- 都道府県別検索
- ステイ先一覧表示（2列カード形式）
- 詳細情報表示
- 予約申込み機能

### 3. 体験記録・評価
- 5段階評価システム
- レビューコメント投稿
- 写真投稿機能

### 4. SNS機能
- 体験投稿・共有
- いいね・コメント機能
- ユーザー間交流

### 5. マイページ
- プロフィール表示・編集
- 予約履歴管理
- 投稿レビュー管理
- 農家用: ファーム情報管理、予約管理

## コーディング規約

- **TypeScript**: 厳格な型チェックを使用
- **ESLint**: Next.js推奨設定 + Prettier統合
- **Prettier**: コードフォーマットを自動化
- **コンポーネント**: 機能別に分類し、再利用性を重視
- **命名規則**:
  - コンポーネント: PascalCase
  - ファイル: コンポーネントファイルは PascalCase.tsx
  - フック: useXxx形式
  - 型: PascalCase (interface/type)

## デプロイ

Vercelへのデプロイを想定しています。

```bash
npm run build
```

詳細は[Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying)を参照してください。

## 参考リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
