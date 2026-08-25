# 依存関係のインストール（キャッシュ用ステージ）
FROM node:22-alpine AS deps
WORKDIR /app

# Next.jsの一部の高速化ツール（コンパイラなど）が、Alpine Linuxという軽量OSの上だと動かないケースがあるため
RUN apk add --no-cache libc6-compat

# 先に設定ファイルだけをコピーして npm ci する (キャッシュ)
COPY package.json package-lock.json* ./
RUN npm ci

# ========================================================
# 開発用ステージ
# 起動は docker-compose.yml の command: npm run dev に任せる（CMD なし）
# ========================================================
FROM deps as dev
WORKDIR /app
# deps ステージから、インストール済みのライブラリだけを引っ張ってくる
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ========================================================
# 本番用ステージ ※ 今回は CloudFront + S3 の構成にしたため下記は使用しない
# ========================================================

# 本番ステージ用: test + build
FROM deps AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run test && npm run build

FROM node:22-alpine AS prod
# https://nextjs.org/docs/messages/non-standard-node-env
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
# 静的ファイルのコピー
COPY --from=builder /app/public ./public
# 本番用プログラムのコピー
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
#  画面（CSSやJavaScript）データのコピー
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
