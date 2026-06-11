# 依存関係のインストール（キャッシュ用ステージ）
FROM node:22-alpine AS deps
WORKDIR /app

# Next.jsの一部の高速化ツール（コンパイラなど）が、Alpine Linuxという軽量OSの上だと動かないケースがあるため
RUN apk add --no-cache libc6-compat

# 先に設定ファイルだけをコピーして npm ci する (キャッシュ)
COPY package.json package-lock.json* ./
RUN npm ci

# ========================================================
# 開発用ビルド
# ========================================================
FROM deps as dev
WORKDIR /app
# deps ステージから、インストール済みのライブラリだけを引っ張ってくる
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# テストを実行し、成功したらビルドする
# Jest入れたらこっちを使用
# RUN npm run test && npm run build 
RUN npm run build

# ========================================================
# 本番用開発ビルド
# ========================================================
FROM node:22-alpine AS prod
# https://nextjs.org/docs/messages/non-standard-node-env
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
# 静的ファイルのコピー
COPY --from=dev /app/public ./public
# 本番用プログラムのコピー
COPY --from=dev --chown=nextjs:nodejs /app/.next/standalone ./
#  画面（CSSやJavaScript）データのコピー
COPY --from=dev --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
# TODO ECSでの環境変数の切り替え問題