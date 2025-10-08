# Farm Match - ファームステイマッチングアプリ

## プロジェクト概要

Farm Matchは、ファームステイ先の検索・予約から体験の記録・共有まで一元管理できるWebアプリケーションです。
農業体験を通じた新しい旅行スタイルと地域活性化を目指します。

## 主要機能（フェーズ1）

- **ユーザー認証**: Google OAuth 2.0による認証
- **ファームステイ検索・予約**: キーワード・都道府県別検索、予約申込み
- **体験記録・評価**: 5段階評価とレビューコメント投稿
- **SNS機能**: 体験投稿・共有、いいね・コメント機能

## 技術構成

### フロントエンド
- Next.js 14 (TypeScript)
- Tailwind CSS
- NextAuth.js (Google Provider)

### バックエンド
- FastAPI + SQLModel
- Python 3.11+

### インフラ構成

#### フェーズ1（開発・検証環境）
- **フロントエンド**: Vercel
- **バックエンド**: Vercel Functions
- **データベース**: Aurora PostgreSQL
- **認証**: Google OAuth 2.0

#### フェーズ2以降（本格運用・AWS移行後）
- **フロントエンド**: AWS Amplify
- **API**: AWS API Gateway + AWS Lambda
- **データベース**: Aurora PostgreSQL
- **認証**: Amazon Cognito + Google OAuth
- **シークレット管理**: AWS Secrets Manager

## ユーザー種別

- **一般ユーザー**: 検索・予約・評価・SNS投稿
- **ステイ先提供者（農家）**: ファーム情報管理・予約管理
- **管理者**: システム全体管理

## 開発環境セットアップ

### 方法1: Dev Container（推奨）

VS Codeで開発する場合、Dev Containerを使用すると簡単に環境構築できます。

1. VS Codeで本プロジェクトを開く
2. `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`) でコマンドパレットを開く
3. `Dev Containers: Reopen in Container` を選択
4. コンテナのビルドと起動を待つ

Dev Containerには以下が含まれます：
- Node.js 18
- Python 3.11
- PostgreSQL 15
- 必要なVS Code拡張機能

### 方法2: Docker Compose

```bash
# 環境変数ファイルを作成
cp .env.example .env

# コンテナを起動
docker-compose up -d

# フロントエンド: http://localhost:3000
# バックエンド: http://localhost:8000
# API ドキュメント: http://localhost:8000/docs
```

### 方法3: ローカル環境

#### フロントエンド

```bash
cd frontend
npm install
npm run dev
```

#### バックエンド

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## 環境変数設定

`.env.example` をコピーして `.env` を作成し、以下の値を設定してください：

```env
# Database
DATABASE_URL=postgresql://farmatch:farmatch_dev@db:5432/farmatch_db

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## プロジェクト構造

```
FarmMatch/
├── .devcontainer/          # Dev Container設定
│   ├── devcontainer.json
│   ├── docker-compose.yml
│   └── Dockerfile
├── frontend/               # Next.js アプリ
│   ├── src/
│   │   ├── app/           # App Router
│   │   ├── components/    # 共通コンポーネント
│   │   └── lib/           # ユーティリティ
│   ├── Dockerfile
│   └── package.json
├── backend/                # FastAPI
│   ├── app/
│   │   ├── models/        # SQLModel
│   │   ├── routers/       # API エンドポイント
│   │   └── core/          # 認証・設定
│   ├── Dockerfile
│   └── requirements.txt
├── docs/                   # ドキュメント
│   ├── DB.md              # データベース設計
│   └── requirementsDefinition.md
├── docker-compose.yml      # 開発環境
├── .env.example
└── README.md
```

## ドキュメント

- [データベーススキーマ設計](docs/DB.md)
- [要件定義書](docs/requirementsDefinition.md)

## 開発期間

半年（大学プロジェクト）

---

*最終更新: 2025年10月*