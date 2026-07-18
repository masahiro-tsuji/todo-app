## デプロイで順

### 1. AWS 認証（未設定なら初回のみ）

```bash
aws configure
```

### 2. infra ディレクトリへ

```bash
cd infra
```

### 3. 依存関係（初回 or esbuild 追加後）

```bash
npm ci
```

### 4. 初回のみ: CDK ブートストラップ（アカウント/リージョン初利用時）

```bash
cdk bootstrap
```

### 5. 変更内容の確認

```bash
cdk diff BackendStack
```

### 6. デプロイ

```bash
cdk deploy BackendStack
```

## APIGatewayの確認

ターミナルで下記を実行

```bash
curl -X POST "https://xxxxxx.execute-api.ap-northeast-1.amazonaws.com/xxx" -H "Content-Type: application/json"
```

## エラーの対処

### --app is required either in command-line, in cdk.json or in ~/.cdk.json

原因: `cdk.json` があるディレクトリ以外で `cdk deploy` を実行した
対処: `infra/` に移動してから実行する

### «PathNotUnderRoot» プロパティ名(depsLockFilePathなど) (/hogehoge/hoge/package-lock.json) should be under projectRoot (hoge/route)

- 対象のプロパティで指定しているパスが間違っている または 未設定

### FailedToBundleAsset (npm error npx canceled due to missing packages and no YES option: ["esbuild@0.28.1"])

原因: `projectRoot`先で `bundling` を実行するが `esbuild` が未インストールの状態
対処: `projectRoot`先 に `esbuild` を `devDependency` として追加 （インストールする）

## 　参考記事

### DynamoDB

- <https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_dynamodb-readme.html>

### Lambda

- <https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda-readme.html>

### APIGateway

- <https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigatewayv2-readme.html>
