# frontend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# 依存関係をコピー
COPY package*.json ./
RUN npm ci

# ソースをコピー
COPY . .

# ビルド実行
RUN npm run build

# ポート設定
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV=production

EXPOSE 3000

# 起動コマンド（npm start を使用）
CMD ["npm", "start"]
