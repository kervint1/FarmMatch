# データベーススキーマ設計

## 概要

Farm Matchアプリケーションで使用するデータベースのスキーマ定義です。
PostgreSQL（Aurora PostgreSQL）を使用し、SQLModelでのORM実装を前提としています。

## テーブル一覧

- [users](#users-ユーザー情報)
- [farms](#farms-ファーム情報)
- [reservations](#reservations-予約情報)
- [reviews](#reviews-レビュー・評価)
- [posts](#posts-sns投稿)
- [comments](#comments-コメント)
- [farm_images](#farm_images-ファーム画像)
- [post_images](#post_images-投稿画像)

---

## users (ユーザー情報)

| カラム名 | データ型 | 制約 | 説明 |
|----------|----------|------|------|
| id | SERIAL | PRIMARY KEY | ユーザーID |
| google_id | VARCHAR(255) | UNIQUE, NOT NULL | Google OAuth ID |
| email | VARCHAR(255) | UNIQUE, NOT NULL | メールアドレス |
| name | VARCHAR(100) | NOT NULL | 表示名 |
| avatar_url | TEXT | NULL | プロフィール画像URL |
| user_type | VARCHAR(20) | NOT NULL, DEFAULT 'guest' | ユーザー種別 |
| phone_number | VARCHAR(20) | NULL | 電話番号 |
| prefecture | VARCHAR(10) | NULL | 都道府県 |
| city | VARCHAR(50) | NULL | 市区町村 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 更新日時 |

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    google_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    user_type VARCHAR(20) NOT NULL DEFAULT 'guest' CHECK (user_type IN ('guest', 'host', 'admin')),
    phone_number VARCHAR(20),
    prefecture VARCHAR(10),
    city VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_type ON users(user_type);
CREATE INDEX idx_email ON users(email);
```

---

## farms (ファーム情報)

| カラム名 | データ型 | 制約 | 説明 |
|----------|----------|------|------|
| id | SERIAL | PRIMARY KEY | ファームID |
| host_id | INTEGER | FOREIGN KEY (users.id), NOT NULL | ホストユーザーID |
| name | VARCHAR(100) | NOT NULL | ファーム名 |
| description | TEXT | NOT NULL | 説明文 |
| prefecture | VARCHAR(10) | NOT NULL | 都道府県 |
| city | VARCHAR(50) | NOT NULL | 市区町村 |
| address | TEXT | NOT NULL | 詳細住所 |
| latitude | DECIMAL(10,8) | NULL | 緯度 |
| longitude | DECIMAL(11,8) | NULL | 経度 |
| experience_type | VARCHAR(20) | NOT NULL | 体験内容 |
| price_per_day | INTEGER | NOT NULL | 1日料金（円） |
| price_per_night | INTEGER | NULL | 1泊料金（円） |
| max_guests | INTEGER | NOT NULL | 最大定員 |
| facilities | JSONB | NULL | 設備情報 |
| access_info | TEXT | NULL | アクセス情報 |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | 公開状態 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 更新日時 |

```sql
CREATE TABLE farms (
    id SERIAL PRIMARY KEY,
    host_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    prefecture VARCHAR(10) NOT NULL,
    city VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    experience_type VARCHAR(20) NOT NULL CHECK (experience_type IN ('agriculture', 'livestock', 'fishery')),
    price_per_day INTEGER NOT NULL,
    price_per_night INTEGER,
    max_guests INTEGER NOT NULL,
    facilities JSONB,
    access_info TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (host_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_prefecture (prefecture),
    INDEX idx_experience_type (experience_type),
    INDEX idx_is_active (is_active),
    INDEX idx_host_id (host_id)
);
```

---

## reservations (予約情報)

| カラム名 | データ型 | 制約 | 説明 |
|----------|----------|------|------|
| id | SERIAL | PRIMARY KEY | 予約ID |
| guest_id | INTEGER | FOREIGN KEY (users.id), NOT NULL | ゲストユーザーID |
| farm_id | INTEGER | FOREIGN KEY (farms.id), NOT NULL | ファームID |
| start_date | DATE | NOT NULL | 開始日 |
| end_date | DATE | NOT NULL | 終了日 |
| num_guests | INTEGER | NOT NULL | 参加人数 |
| total_amount | INTEGER | NOT NULL | 合計金額（円） |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'pending' | 予約状態 |
| contact_phone | VARCHAR(20) | NOT NULL | 連絡先電話番号 |
| message | TEXT | NULL | 特記事項・メッセージ |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 申込日時 |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 更新日時 |

```sql
CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    guest_id INTEGER NOT NULL,
    farm_id INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    num_guests INTEGER NOT NULL,
    total_amount INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'completed', 'cancelled')),
    contact_phone VARCHAR(20) NOT NULL,
    message TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (guest_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE,
    INDEX idx_guest_id (guest_id),
    INDEX idx_farm_id (farm_id),
    INDEX idx_status (status),
    INDEX idx_start_date (start_date)
);
```

---

## reviews (レビュー・評価)

| カラム名 | データ型 | 制約 | 説明 |
|----------|----------|------|------|
| id | SERIAL | PRIMARY KEY | レビューID |
| reservation_id | INTEGER | FOREIGN KEY (reservations.id), UNIQUE, NOT NULL | 予約ID |
| guest_id | INT | FOREIGN KEY (users.id), NOT NULL | レビュー投稿者ID |
| farm_id | INTEGER | FOREIGN KEY (farms.id), NOT NULL | ファームID |
| rating | INTEGER | NOT NULL, CHECK (rating >= 1 AND rating <= 5) | 評価（1-5） |
| comment | TEXT | NULL | コメント |
| experience_date | DATE | NOT NULL | 体験日 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 投稿日時 |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 更新日時 |

```sql
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    reservation_id INTEGER UNIQUE NOT NULL,
    guest_id INTEGER NOT NULL,
    farm_id INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    experience_date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE,
    FOREIGN KEY (guest_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE,
    INDEX idx_farm_id (farm_id),
    INDEX idx_guest_id (guest_id),
    INDEX idx_rating (rating)
);
```

---

## posts (SNS投稿)

| カラム名 | データ型 | 制約 | 説明 |
|----------|----------|------|------|
| id | SERIAL | PRIMARY KEY | 投稿ID |
| user_id | INTEGER | FOREIGN KEY (users.id), NOT NULL | 投稿者ID |
| farm_id | INT | FOREIGN KEY (farms.id), NULL | 関連ファームID |
| title | VARCHAR(100) | NOT NULL | タイトル |
| content | TEXT | NOT NULL | 投稿内容 |
| like_count | INTEGER | NOT NULL, DEFAULT 0 | いいね数 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 投稿日時 |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 更新日時 |

```sql
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    farm_id INT,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    like_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_farm_id (farm_id),
    INDEX idx_created_at (created_at)
);
```

---

## comments (コメント)

| カラム名 | データ型 | 制約 | 説明 |
|----------|----------|------|------|
| id | SERIAL | PRIMARY KEY | コメントID |
| post_id | INTEGER | FOREIGN KEY (posts.id), NOT NULL | 投稿ID |
| user_id | INT | FOREIGN KEY (users.id), NOT NULL | コメント投稿者ID |
| content | TEXT | NOT NULL | コメント内容 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 投稿日時 |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 更新日時 |

```sql
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_post_id (post_id),
    INDEX idx_user_id (user_id)
);
```

---

## farm_images (ファーム画像)

| カラム名 | データ型 | 制約 | 説明 |
|----------|----------|------|------|
| id | SERIAL | PRIMARY KEY | 画像ID |
| farm_id | INTEGER | FOREIGN KEY (farms.id), NOT NULL | ファームID |
| image_url | TEXT | NOT NULL | 画像URL |
| is_main | BOOLEAN | NOT NULL, DEFAULT FALSE | メイン画像フラグ |
| display_order | INTEGER | NOT NULL, DEFAULT 0 | 表示順序 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 作成日時 |

```sql
CREATE TABLE farm_images (
    id SERIAL PRIMARY KEY,
    farm_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    is_main BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE,
    INDEX idx_farm_id (farm_id),
    INDEX idx_display_order (display_order)
);
```

---

## post_images (投稿画像)

| カラム名 | データ型 | 制約 | 説明 |
|----------|----------|------|------|
| id | SERIAL | PRIMARY KEY | 画像ID |
| post_id | INTEGER | FOREIGN KEY (posts.id), NOT NULL | 投稿ID |
| image_url | TEXT | NOT NULL | 画像URL |
| display_order | INTEGER | NOT NULL, DEFAULT 0 | 表示順序 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 作成日時 |

```sql
CREATE TABLE post_images (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    INDEX idx_post_id (post_id),
    INDEX idx_display_order (display_order)
);
```

---

## リレーション図

```
users (1) -----> (N) farms
  |                |
  |                |
  v                v
reservations -----> reviews (1:1)
  |
  v
comments <------ posts
             (N)    |
                    v
                post_images

farms (1) -----> (N) farm_images
```

## 主要なビジネスルール

### 予約関連
- 1つの予約に対して1つのレビューのみ作成可能
- 予約状態が'completed'の場合のみレビュー作成可能
- 過去の日付での予約は不可

### レビュー関連
- 評価は1-5の整数のみ
- 自分が予約したファームのみレビュー可能

### ファーム関連
- ホストユーザーのみ自分のファーム情報を編集可能
- メイン画像は1ファームにつき1枚のみ

### SNS関連
- 投稿の削除時はコメントも連動削除
- いいね数は非正規化して保存（パフォーマンス向上）

## インデックス戦略

### 検索パフォーマンス向上
- farms: prefecture, experience_type での検索
- posts: created_at での時系列ソート
- reservations: guest_id, farm_id での履歴検索

### データ整合性
- 外部キー制約による参照整合性保証
- ユニーク制約による重複データ防止

## 今後の拡張予定

### フェーズ2以降で追加予定のテーブル
- `likes` (いいね管理)
- `stamps` (スタンプラリー)
- `payments` (決済情報)
- `notifications` (通知)
- `messages` (メッセージ)

---

*最終更新: 2025年9月*