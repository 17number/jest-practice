# Jest に関する学習メモ

[Jest · 🃏快適なJavaScriptのテスト](https://jestjs.io/ja/)

## [Getting Started](https://jestjs.io/docs/ja/getting-started)

- `hoge.js` をテストしたい場合は `hoge.test.js` か `hoge.spec.js` という名前でファイルを作成
  - 変更したい場合は Config の [`testMatch`](https://jestjs.io/docs/ja/configuration#testmatch-arraystring) を設定

- `jest init`(グローバルインストールしてなければ `npx jest --init`) でコンフィグファイル [`jest.config.js`](https://github.com/17number/jest-practice/blob/master/jest.config.js) を作成可能
  - あとは [Configuring Jest · Jest](https://jestjs.io/docs/ja/configuration) などを見ながら適宜カスタマイズ

```bash
$ npx jest --init

The following questions will help Jest to create a suitable configuration for your project

✔ Choose the test environment that will be used for testing › node
✔ Do you want Jest to add coverage reports? … yes
✔ Which provider should be used to instrument code for coverage? › babel
✔ Automatically clear mock calls and instances between every test? … yes

📝  Configuration file created at /Users/hoge/.../jest.config.js
```

- `package.json` 内にコンフィグを定義することも可能
  - トップレベル("name" などと同じ階層)に `"jest"` で定義

```json
{
  "name": "my-project",
  "jest": {
    "verbose": true
  }
}
```

- [Babel](https://babeljs.io/) を使う場合は `npm i -D` でインストール
  - Babel の設定は [`babel.config.js`](https://github.com/17number/jest-practice/blob/master/babel.config.js) で実施
  - 設定詳細は [Configure Babel · Babel](https://babeljs.io/docs/en/configuration) を参照

```bash
$ npm i -D babel-jest @babel/core @babel/preset-env
$ touch babel.config.js
```

- [webpack](https://webpack.js.org/) を使う場合は [Using with webpack · Jest](https://jestjs.io/docs/ja/webpack) を参照
