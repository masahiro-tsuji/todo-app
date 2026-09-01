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

# デプロイ手順

## 1. AWS 認証（未設定なら初回のみ）

```bash
aws configure
```

## 2. infra ディレクトリへ

```bash
cd infra
```

## 3. 依存関係（初回 or esbuild 追加後）

```bash
npm ci
```

Step 4〜6 は **`infra/` ディレクトリで実行** する（Step 2 で移動済みの想定）。

## 4. 初回のみ: CDK ブートストラップ（アカウント/リージョン初利用時）

```bash
cdk bootstrap
```

## 5. 変更内容の確認

```bash
cdk diff AuthStack
cdk diff BackendStack
cdk diff FrontendStack
```

## 6. デプロイ

```bash
cdk deploy AuthStack
cdk deploy BackendStack
cdk deploy FrontendStack
```

インフラのテスト手順・デプロイ時のエラー対処は [infra/README.md](infra/README.md) を参照。

## 7. デプロイ結果（Outputs）を控える

各 `cdk deploy` 完了時に表示される値をメモする。

- AuthStack: UserPoolId, UserPoolClientId
- BackendStack: ApiUrl
- FrontendStack: WebSiteUrl, S3BucketName

## 8. フロントをビルド

```bash
cd web
npm ci
NEXT_PUBLIC_COGNITO_USER_POOL_ID=<UserPoolId> \
NEXT_PUBLIC_COGNITO_CLIENT_ID=<UserPoolClientId> \
NEXT_PUBLIC_BASE_URL=<ApiUrl> \
npm run build
```

## 9. S3 にアップロード & CloudFront キャッシュ更新

```bash
aws s3 sync out/ s3://<S3BucketName>/ --delete
aws cloudfront create-invalidation --distribution-id <DistributionId> --paths "/*"
```

DistributionId は AWS コンソールの CloudFront から確認

# 参考資料

- [Deploying](https://nextjs.org/docs/app/getting-started/deploying)
- [非標準の`NODE_ENV`](https://nextjs.org/docs/messages/non-standard-node-env)
- [Next.jsアプリケーションをコンテナ化する](https://docs.docker.com/guides/nextjs/containerize/)
- [AWS CDK deploy コマンド](https://docs.aws.amazon.com/cdk/v2/guide/ref-cli-cmd-deploy.html)
- [aws s3 sync](https://docs.aws.amazon.com/cli/latest/reference/s3/sync.html)
- [aws cloudfront create-invalidation](https://docs.aws.amazon.com/cli/latest/reference/cloudfront/create-invalidation.html)
