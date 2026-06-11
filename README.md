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
