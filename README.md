# プロジェクト構成

- `web/` - Next.js フロントエンド
- `backend/` - バックエンド（Lambda ハンドラ等）
- `infra/` - AWS CDK インフラ

# ローカル開発（Docker なし）

ルートから実行する場合:

```bash
npm run dev:web
```

各パッケージで実行する場合:

```bash
cd web
npm ci
npm run dev
```

# Docker の起動方法

`web/` ディレクトリで実行してください。

## 開発環境の起動

```bash
cd web
docker compose up dev --build
```

- `package.json`が変更されていなければ `--build` オプションはなくても良い

## 本番環境の起動

```bash
cd web
docker compose up prod --build
```

## コンテナの停止

```bash
cd web
docker compose down
```

ライブラリ更新後は下記コマンドで停止

```bash
cd web
docker compose down -v
```

## 参考資料

- [Deploying](https://nextjs.org/docs/app/getting-started/deploying)
- [非標準の`NODE_ENV`](https://nextjs.org/docs/messages/non-standard-node-env)
- [Next.jsアプリケーションをコンテナ化する](https://docs.docker.com/guides/nextjs/containerize/)
