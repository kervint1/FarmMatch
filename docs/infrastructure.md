# インフラストラクチャ設計

## 概要

Farm Matchのインフラ構成をフェーズごとに定義します。段階的な移行を前提とした設計により、開発・検証・本番環境を効率的に管理します。

---

## フェーズ1: 開発・検証環境（現在）

### アーキテクチャ図

```
┌─────────────────────────────────────────────────┐
│ フロントエンド (Vercel)                          │
│  - Next.js 14 App Router                        │
│  - NextAuth.js (Google OAuth)                   │
│  - Tailwind CSS                                 │
└──────────────┬──────────────────────────────────┘
               │ HTTPS
    ┌──────────┴──────────┐
    │                     │
┌───▼────────────────┐  ┌▼─────────────────────┐
│ Backend (Heroku)   │  │ Appwrite Cloud       │
│  - FastAPI         │  │  - Storage (画像)    │
│  - Python 3.11     │  │  - Functions (非同期)│
│  - REST API        │  │  - Realtime (通知)   │
│                    │  └──────────────────────┘
│  - PostgreSQL      │
│    (Heroku Postgres)│
└────────────────────┘
```

### サービス構成

| コンポーネント | サービス | プラン | 用途 |
|--------------|---------|--------|------|
| **フロントエンド** | Vercel | Hobby (無料) | Next.js ホスティング |
| **バックエンドAPI** | Heroku | Eco Dynos ($5/月) | FastAPI REST API |
| **データベース** | Heroku Postgres | Mini (無料) | メインDB (10,000行まで) |
| **ストレージ** | Appwrite Storage | Free | 画像ファイル (2GB) |
| **関数** | Appwrite Functions | Free | 非同期処理・バッチ処理 |
| **リアルタイム** | Appwrite Realtime | Free | SNS通知・いいね更新 |

### データ配置戦略

#### PostgreSQL (Heroku)
- ユーザー情報 (users)
- ファーム情報 (farms)
- 予約情報 (reservations)
- レビュー・評価 (reviews)
- SNS投稿 (posts)
- コメント (comments)

#### Appwrite Storage
- ファーム画像 (farm_images)
  - バケット: `farm-images`
  - 最大5枚/ファーム
  - 画像サイズ: 最大2MB
- 投稿画像 (post_images)
  - バケット: `post-images`
  - 最大3枚/投稿
  - 画像サイズ: 最大2MB

### 認証フロー

```
1. ユーザーがGoogleログインボタンをクリック
   ↓
2. NextAuth.js がGoogle OAuth画面にリダイレクト
   ↓
3. Google認証成功
   ↓
4. NextAuth.js がJWTトークンを発行
   ↓
5. バックエンドでJWT検証
   ↓
6. PostgreSQLにユーザー情報保存
```

### 環境変数

#### Vercel (Frontend)
```env
NEXTAUTH_URL=https://farm-match.vercel.app
NEXTAUTH_SECRET=xxx
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
NEXT_PUBLIC_API_URL=https://farm-match-api.herokuapp.com
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=xxx
```

#### Heroku (Backend)
```env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
NEXTAUTH_SECRET=xxx
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=xxx
APPWRITE_API_KEY=xxx
```

---

## フェーズ2: AWS移行後（本番環境）

### アーキテクチャ図

```
┌──────────────────────────────────────────────────┐
│ CloudFront (CDN)                                  │
└──────────────┬───────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────┐
│ AWS Amplify (フロントエンド)                      │
│  - Next.js 14 SSR                                │
│  - Cognito認証                                    │
└──────────────┬───────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────┐
│ API Gateway                                       │
└──────────────┬───────────────────────────────────┘
               │
    ┌──────────┴──────────┬──────────────┐
    │                     │              │
┌───▼─────────┐  ┌───────▼───────┐  ┌──▼─────┐
│ Lambda      │  │ Aurora        │  │ S3     │
│ (FastAPI)   │  │ PostgreSQL    │  │(画像)  │
└─────────────┘  └───────────────┘  └────────┘
```

### サービスマッピング

| フェーズ1 | フェーズ2 (AWS) | 移行難易度 |
|----------|----------------|----------|
| Vercel | AWS Amplify | 中 |
| NextAuth.js | Amazon Cognito | 中 |
| Heroku (FastAPI) | API Gateway + Lambda | 中〜高 |
| Heroku Postgres | Aurora PostgreSQL | **易** ✅ |
| Appwrite Storage | Amazon S3 | 中 |
| Appwrite Functions | AWS Lambda | 中 |
| - | AWS Secrets Manager | - |
| - | CloudWatch (監視) | - |

### 移行手順

#### 1. データベース移行 (最優先)
```bash
# Heroku PostgreSQLからエクスポート
heroku pg:backups:capture
heroku pg:backups:download

# Aurora PostgreSQLにインポート
psql -h aurora-endpoint -U username -d farmatch_db < latest.dump
```

#### 2. 認証システム移行
- NextAuth.js → Cognito User Pool
- Google OAuth連携設定
- ユーザーデータ移行スクリプト作成

#### 3. ストレージ移行
- Appwrite → S3バケット
- 画像ファイル一括転送
- URL書き換え

#### 4. API移行
- FastAPI → Lambda関数化
- API Gateway設定
- パフォーマンステスト

---

## 開発環境

### ローカル開発 (Dev Container)

```
┌─────────────────────────────────────┐
│ VS Code Dev Container               │
│  - Node.js 20                       │
│  - Python 3.11                      │
│  - PostgreSQL 15 (Docker)           │
│  - ホットリロード有効               │
└─────────────────────────────────────┘
```

### 起動方法

```bash
# VS Codeで開く
code .

# Dev Container で再起動
Ctrl+Shift+P → "Dev Containers: Reopen in Container"

# フロントエンド起動
cd frontend && npm install && npm run dev

# バックエンド起動
cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload
```

---

## コスト見積もり

### フェーズ1 (月額)
- Vercel: $0 (Hobby)
- Heroku Eco Dynos: $5
- Heroku Postgres: $0 (Mini)
- Appwrite: $0 (Free)
- **合計: $5/月**

### フェーズ2 (月額予測)
- AWS Amplify: ~$15
- API Gateway + Lambda: ~$10
- Aurora Serverless v2: ~$30
- S3 + CloudFront: ~$5
- Cognito: ~$5
- Secrets Manager: ~$1
- **合計: ~$66/月**

---

## セキュリティ

### フェーズ1
- [x] HTTPS通信 (Vercel/Heroku自動)
- [x] 環境変数の暗号化
- [x] JWT署名検証
- [x] CORS設定
- [ ] レート制限 (TODO)
- [ ] WAF (フェーズ2)

### フェーズ2 (AWS)
- [x] AWS WAF
- [x] Secrets Manager
- [x] VPC内配置
- [x] Security Groups
- [x] CloudWatch監視

---

## 監視・ログ

### フェーズ1
- Vercel Analytics (フロントエンド)
- Heroku Metrics (バックエンド)
- Appwrite Console (ストレージ)

### フェーズ2
- CloudWatch Logs
- CloudWatch Metrics
- X-Ray (分散トレーシング)
- CloudWatch Alarms

---

## バックアップ戦略

### フェーズ1
- **データベース**: Heroku自動バックアップ (日次)
- **画像**: Appwrite自動レプリケーション

### フェーズ2
- **データベース**: Aurora自動バックアップ (継続)
- **画像**: S3バージョニング + Glacier

---

## スケーリング戦略

### フェーズ1 制約
- Heroku Eco: 1 dyno (スリープあり)
- Postgres: 10,000行制限
- Appwrite: 2GB制限

### フェーズ2 拡張性
- Lambda: 自動スケール
- Aurora: Auto Scaling (2-16 ACU)
- S3: 無制限
- CloudFront: グローバルCDN

---

*最終更新: 2025年10月*
