# Backend - Farm Match API

Farm Matchのバックエンドアプリケーション

## 技術スタック

- **フレームワーク**: FastAPI 0.115.5
- **ORM**: SQLModel 0.0.22
- **データベース**: PostgreSQL 17
- **言語**: Python 3.11
- **認証**: Google OAuth 2.0 (NextAuth.js経由)

## ディレクトリ構成

```
backend/
├── main.py              # FastAPIアプリケーションのエントリーポイント
├── database.py          # データベース接続設定
├── requirements.txt     # Pythonパッケージ依存関係
├── core/               # アプリケーション設定
│   ├── __init__.py
│   └── config.py       # 環境変数とアプリケーション設定
├── models/             # SQLModelデータモデル
│   └── __init__.py
├── routers/            # APIエンドポイント
│   └── __init__.py
├── schemas/            # Pydanticスキーマ (リクエスト/レスポンス)
│   └── __init__.py
└── services/           # ビジネスロジック
    └── __init__.py
```

## フェーズ1のAPIエンドポイント

### 認証
- `POST /api/auth/google` - Google OAuth認証
- `GET /api/auth/me` - 現在のユーザー情報取得

### ユーザー管理
- `GET /api/users/{user_id}` - ユーザー情報取得
- `PUT /api/users/{user_id}` - ユーザー情報更新

### 農園管理
- `GET /api/farms` - 農園一覧取得（検索・フィルタリング）
- `GET /api/farms/{farm_id}` - 農園詳細取得
- `POST /api/farms` - 農園登録（農家のみ）
- `PUT /api/farms/{farm_id}` - 農園情報更新（農家のみ）

### 予約管理
- `POST /api/reservations` - 予約作成
- `GET /api/reservations/{reservation_id}` - 予約詳細取得
- `GET /api/users/{user_id}/reservations` - ユーザーの予約一覧
- `PUT /api/reservations/{reservation_id}/status` - 予約ステータス更新

### レビュー
- `POST /api/reviews` - レビュー投稿
- `GET /api/farms/{farm_id}/reviews` - 農園のレビュー一覧
- `GET /api/users/{user_id}/reviews` - ユーザーのレビュー一覧

### コミュニティ
- `GET /api/posts` - 投稿一覧取得
- `POST /api/posts` - 投稿作成
- `GET /api/posts/{post_id}` - 投稿詳細取得

### 管理者機能
- `GET /api/admin/users` - ユーザー一覧（管理者のみ）
- `GET /api/admin/farms` - 農園一覧（管理者のみ）
- `PUT /api/admin/content/{content_id}/status` - コンテンツ承認/非承認

## 環境変数

### セットアップ

1. `.env.example`をコピーして`.env`を作成：

```bash
cp .env.example .env
```

2. `.env`ファイルを編集して、必要な環境変数を設定：

```env
# アプリケーション設定
APP_NAME=Farm Match API
APP_VERSION=0.1.0
DEBUG=True

# データベース（必須）
DATABASE_URL=postgresql://farmatch:farmatch_dev@db:5432/farmatch_db

# CORS Origins（カンマ区切り）
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# 認証（必須）
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Google OAuth (NextAuth.jsで使用)
# GOOGLE_CLIENT_ID=your-google-client-id
# GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 重要な環境変数

- **DATABASE_URL** (必須): PostgreSQLデータベース接続URL
- **SECRET_KEY** (必須): JWT トークン生成用のシークレットキー
  - 本番環境では必ず安全な値に変更してください
  - 生成例: `openssl rand -hex 32`
- **CORS_ORIGINS**: フロントエンドのオリジン（カンマ区切り）

## 開発環境のセットアップ

### Dev Container使用（推奨）

1. VS Codeで`.devcontainer`フォルダを開く
2. "Reopen in Container"を選択
3. `.env`ファイルを作成（上記参照）
4. コンテナが起動したら、以下のコマンドで確認：

```bash
python main.py
```

### ローカル環境

```bash
# 依存関係インストール
pip install -r requirements.txt

# 環境変数設定
cp .env.example .env
# .envファイルを編集

# アプリケーション起動
python main.py
```

APIドキュメント: http://localhost:8000/docs

## データベース

PostgreSQL 17を使用。Dev Container環境では自動的に起動します。

- **ホスト**: db (Docker内) / localhost (ローカル)
- **ポート**: 5432
- **データベース名**: farmatch_db
- **ユーザー**: farmatch
- **パスワード**: farmatch_dev

### マイグレーション

Alembicを使用してデータベーススキーマを管理しています。

#### 初回セットアップ（マイグレーション実行）

```bash
# マイグレーションを実行してテーブルを作成
alembic upgrade head

# サンプルデータをシード（開発環境用）
python -c "from init_db import create_db_and_tables, seed_sample_data; engine = create_db_and_tables(); seed_sample_data(engine)"
```

#### 新しいテーブル/カラムを追加した場合

```bash
# 新しいマイグレーションファイルを自動生成
alembic revision --autogenerate -m "テーブル名の説明"

# マイグレーションを実行
alembic upgrade head
```

#### マイグレーション履歴の確認

```bash
# 現在のマイグレーション状態を確認
alembic current

# マイグレーション履歴を表示
alembic history --indicate-current
```

#### 前のバージョンにロールバック

```bash
# 1つ前のバージョンに戻す
alembic downgrade -1

# 特定のリビジョンに戻す
alembic downgrade <revision_id>
```

## デプロイ

### Heroku
```bash
heroku create farm-match-api
heroku addons:create heroku-postgresql:mini
git push heroku main
```

### AWS (ECS + RDS)
1. RDSでPostgreSQLインスタンス作成
2. ECSタスク定義作成
3. Fargateでサービス起動

## トラブルシューティング

### ModuleNotFoundError
```bash
pip install -r requirements.txt
```

### データベース接続エラー
- PostgreSQLコンテナが起動しているか確認
- `DATABASE_URL`環境変数が正しいか確認
