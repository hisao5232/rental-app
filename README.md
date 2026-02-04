# Heavy Machine Rental Manager

建設機械の修理エンジニアが開発する、実地経験に基づいた重機レンタル管理システムです。
FastAPI (Python) と Next.js (TypeScript) をベースに、Dockerで構築されています。

## 現在のスタック
- **Frontend**: Next.js 15 (App Router), Tailwind CSS v4, TypeScript
- **Backend**: FastAPI, SQLAlchemy (Async), PostgreSQL
- **Infrastructure**: Docker Compose, Traefik, VPS (Ubuntu 24.04)

## システム構成
- `frontend/`: Next.js Webアプリケーション
- `backend/`: FastAPIによる非同期APIサーバー
- `db/`: PostgreSQL 16 (Alpine)

## 今後の拡張ロードマップ
- [ ] **重機の一覧・詳細表示機能**: 現場で必要なスペック（バケット容量、旋回半径等）の表示
- [ ] **予約管理システム**: カレンダー形式での貸出状況確認
- [ ] **点検記録機能**: 修理エンジニアの視点を活かした、日常点検・定期点検のデジタル化
- [ ] **QRコード連携**: 各重機に貼ったQRコードから、現場で即座に仕様書を確認できる機能

## 開発者
- **GitHub**: [hisao5232](https://github.com/hisao5232)
- **Domain**: [go-pro-world.net](https://go-pro-world.net)

## ライセンス
MIT
