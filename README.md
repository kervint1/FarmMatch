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

### Dev Container（推奨）

VS Code Dev Containerを使用すると、統一された開発環境で作業できます。

#### 前提条件
- Docker Desktop インストール済み
- VS Code + Dev Containers拡張機能

#### セットアップ手順

1. VS Codeで本プロジェクトを開く
2. `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`) でコマンドパレットを開く
3. `Dev Containers: Reopen in Container` を選択
4. コンテナのビルドと起動を待つ（初回3-5分）

#### Dev Container環境
- **Node.js 20** (LTS)
- **Python 3.11**
- **PostgreSQL 15** (自動起動)
- **VS Code拡張機能** (自動インストール)
  - ESLint, Prettier
  - Python, Pylance, Ruff
  - SQLTools

#### コンテナ起動後

```bash
# フロントエンド起動
cd frontend
npm install
npm run dev
# → http://localhost:3000

# バックエンド起動（別ターミナル）
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
# → http://localhost:8000
# → http://localhost:8000/docs (Swagger UI)
```

#### データベース接続

```
Host: db (コンテナ間) または localhost (ホストから)
Port: 5432
Database: farmatch_db
User: farmatch
Password: farmatch_dev
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
│   ├── devcontainer.json  # VS Code設定
│   ├── docker-compose.yml # コンテナ構成
│   └── Dockerfile         # 開発環境イメージ
├── frontend/               # Next.js アプリ
│   ├── src/
│   │   ├── app/           # App Router
│   │   ├── components/    # 共通コンポーネント
│   │   └── lib/           # ユーティリティ
│   └── package.json
├── backend/                # FastAPI
│   ├── app/
│   │   ├── models/        # SQLModel
│   │   ├── routers/       # API エンドポイント
│   │   └── core/          # 認証・設定
│   └── requirements.txt
├── docs/                   # ドキュメント
│   ├── DB.md              # データベース設計
│   ├── infrastructure.md  # インフラ設計
│   └── requirementsDefinition.md
├── .env.example
└── README.md
```

## ドキュメント

- [データベーススキーマ設計](docs/DB.md)
- [インフラストラクチャ設計](docs/infrastructure.md)
- [要件定義書](docs/requirementsDefinition.md)

## 開発期間

半年（大学プロジェクト）

---

*最終更新: 2025年10月*