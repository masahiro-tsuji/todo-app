# Docker の起動方法

## 開発環境の起動

```cli
docker compose up dev --build
```

- `package.json`が変更されていなければ `--build` オプションはなくても良い

## 本番環境の起動

```cli
docker compose up prod --build
```

## コンテナの停止

```cli
docker compose down
```

ライブラリ更新後は下記コマンドで停止

```cii
 docker compose down -v
```

## 参考資料

- [Deploying](https://nextjs.org/docs/app/getting-started/deploying)
- [非標準の`NODE_ENV`](https://nextjs.org/docs/messages/non-standard-node-env)
- [Next.jsアプリケーションをコンテナ化する](https://docs.docker.com/guides/nextjs/containerize/)
