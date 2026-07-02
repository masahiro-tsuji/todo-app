<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# プロジェクト規約

プロジェクト全体のディレクトリ構成、コード規約は下記の通りにすること

## ディレクトリ構成

ディレクトリ構成は下記の通りにすること

```text
src/
└─ components/  # 共通コンポーネントをまとめるディレクトリ
|   └─ [ComponentName].tsx # MUI でカスタムした共通コンポーネント
|   └─ index.ts  # 共通コンポーネントの export をまとめる
└─ features/
│   └─ [feature-name]/
│       ├─ components/  # この中のファイルはfeature外から直接importしてはならない
│       │   ├─ UI.tsx  # 純粋な見た目（Presentational）
│       │   └─ UI.tsx
│       ├─ hooks/
│       │   └─ use〇〇.ts  # index.tsxのみで呼び出すカスタムhook
│       ├─ tests/
│       │   └─ [index.tsxのコンポーネント名].test.tsx  # Jestのテストコード
│       └─ index.tsx  # 外部への公開用（エクスポート）
└─ hooks/ # 共通カスタムhooksをまとめるディレクトリ
│   ├─ use〇〇.ts  # 複数箇所で使用するカスタムhookファイル
│   ├─ use△△.ts
│   └─ index.ts  # hooks内の export をまとめる
└─ utils/ # 共通で使用する関数をまとめるディレクトリ
    ├─ 〇〇.ts  # 各関数は役割ごとに個別のファイル（`〇〇.ts`）として作成
    ├─ △△.ts
    └─ index.ts  # utils内の export をまとめる
```

### `src/components/`

- プロジェクト全体で使用する共通コンポーネントをまとめる
- [ComponentName].tsx
  - `MUI` のコンポーネントを元に作成すること
  - `MUI` の`プロパティ`、`ref` を使える様に作成すること
  - 作成したコンポーネントは、`index.ts`で`export`し、`index.ts`から呼び出すこと
    参考：`src/components/Button.tsx`

### `src/features/`

#### index.tsx

- 1つのコンポーネントを `export` すこと
- ファイル名は index.tsx とし、内部で export const Login = ... のようにアロー関数で名前付きエクスポート（Named Export）する
- 300行を超える場合は、コンポーネントを`/components/UI.tsx`の様に切り分けること
- 機能にまつわるロジックをまとめること
  - UIに関するロジックは、`index.tsx`に記述すること
  - それ以外のロジックについては、`src/features/hooks` にまとまること
- 必要な `page.tsx` で `import` すること
- `feature` 同士で `import` しないこと（依存関係にならないこと）
- 300行以内に収まる場合は、`components`への切り分け禁止

#### tests/

- `index.tsx`の`UI`が正しく動作するかのテストコードを記述すること

### `src/hooks/`

- `hooks`のファイル名は、`useLogin.ts`など`use[機能名].ts`にすること
- 作成した`hooks`は`index.ts`で`export`し、`index.ts`から呼び出すこと

### `src/utils/`

#### 構成ルール

- 各関数は役割ごとに個別のファイル（`〇〇.ts`）とすること。
- 外部（`src` 配下など）から利用する関数は、必ず `index.ts` を経由してエクスポート（バレルファイル運用）すること

#### index.ts の書き方

新しい関数を追加した際は、`index.ts` に以下のように追記すること

```ts
export * from './〇〇';
export * from './△△';
```

## コーディング規約

### ツールと品質

- `Biome` の `lint/format` に従う（`npm run lint` / `npm run format`）
- 1ファイル300行以内とし、超える場合はファイルを適切に分割すること

### TypeScriptとReactの記述

- 型定義は `type` を使用すること
- 関数コンポーネントの `return` 内にロジックを記述しないこと（`return`の外で関数定義し、コンポーネントに渡すこと）
- 他の機能に同じ処理がある場合、`src/utils`, `src/hooks`に移して共通化すること（同じ処理を複数箇所で定義しないこと）

### 制御フロー

- 三項演算子を積極的に使用すること。但し、ネストする場合は `if - else` を使用すること
- 基本的に`switch文`は使用しないこと
- `if - else` 内の処理が1行で済む場合は、`{}` は不要とする

### スタイリング(MUI)

- `MUI`の`sx`プロパティで使用する色は`/theme.ts`を使用すること
- `UI`は`src/components`の共通コンポーネントを使用すること。もし存在しない場合は、「### `src/components`」を参考に共通コンポーネントを作成して、使用すること
