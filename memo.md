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


## [Using Matchers](https://jestjs.io/docs/ja/using-matchers)

Matcher(マッチャー)、何とどのように比較検証するかについて。

基本形は `expect(<テスト対象>).toXXXX(<期待値>)` という構文。

API 一覧は [Expect · Jest](https://jestjs.io/docs/ja/expect) を参照。

### [`toBe(value)`](https://jestjs.io/docs/ja/expect#tobevalue)

値が等価であるかの確認には [`toBe(value)`](https://jestjs.io/docs/ja/expect#tobevalue) を使う。

```js
test('1 + 1 = 2', () => {
  expect(1 + 1).toBe(2);
});
```

ただし、浮動小数点数は丸め誤差があるため `toBe` ではなく [`toBeCloseTo(number, numDigits?)`](https://jestjs.io/docs/ja/expect#tobeclosetonumber-numdigits) を使う。

### [`toBeCloseTo(number, numDigits?)`](https://jestjs.io/docs/ja/expect#tobeclosetonumber-numdigits)

丸め誤差浮動小数点数は丸め誤差があるため [`toBeCloseTo(number, numDigits?)`](https://jestjs.io/docs/ja/expect#tobeclosetonumber-numdigits) で検証。

```js
test('0.1 + 0.2 = 0.3', () => {
  expect(0.1 + 0.2).toBeCloseTo(0.3, 5);
});
```

`numDigits` は小数点何位までを検証対象とするかというイメージ、デフォルト値は `2`。

試しにこんな感じでテストをしたら `numDigits = 16` でエラーになる。ちなみに `0.01 + 0.02 = 0.30000000000000004 ≒ 0.3e-16` 。

```js
// https://r17n.page/2020/01/11/js-simple-loop-N/
[...Array(20)].forEach((_, i) => {
  test(`0.1 + 0.2 = 0.3 (numDigits: ${i})`, () => {
    expect(sum(0.1, 0.2)).toBeCloseTo(0.3, i);
  });
})
// =>   ✓ 0.1 + 0.2 = 0.3 (numDigits: 0)
//      ✓ 0.1 + 0.2 = 0.3 (numDigits: 1)
//      ✓ 0.1 + 0.2 = 0.3 (numDigits: 2)
//      ✓ 0.1 + 0.2 = 0.3 (numDigits: 3)
//      ✓ 0.1 + 0.2 = 0.3 (numDigits: 4)
//      ✓ 0.1 + 0.2 = 0.3 (numDigits: 5)
//      ✓ 0.1 + 0.2 = 0.3 (numDigits: 6)
//      ✓ 0.1 + 0.2 = 0.3 (numDigits: 7)
//      ✓ 0.1 + 0.2 = 0.3 (numDigits: 8)
//      ✓ 0.1 + 0.2 = 0.3 (numDigits: 9)
//      ✓ 0.1 + 0.2 = 0.3 (numDigits: 10)
//      ✓ 0.1 + 0.2 = 0.3 (numDigits: 11)
//      ✓ 0.1 + 0.2 = 0.3 (numDigits: 12)
//      ✓ 0.1 + 0.2 = 0.3 (numDigits: 13)
//      ✓ 0.1 + 0.2 = 0.3 (numDigits: 14)
//      ✓ 0.1 + 0.2 = 0.3 (numDigits: 15)
//      ✕ 0.1 + 0.2 = 0.3 (numDigits: 16)
//      ...
```

より厳密に書くと `.toBeCloseTo(0.02, 4)` の場合は `0.01951 ~ 0.02049` であれば OK (期待値との誤差が `0.0005` 未満) という感じ。


### [`toEqual(value)`](https://jestjs.io/docs/ja/expect#toequalvalue)

Object を再帰的に検証。

```js
const hoge = { foo: 'bar' };
const fuga = { foo: 'bar' };

test(`hoge and fuga`, () => {
  expect(hoge).toEqual(fuga);
});
```

### [`not`](https://jestjs.io/docs/ja/expect#not)

異なることの検証。

```js
test('1 + 1 != 1', () => {
  expect(1 + 1).not.toBe(1);
});
```

### [真偽値, Truthy, Falsy な値の検証](https://jestjs.io/docs/ja/using-matchers#%E7%9C%9F%E5%81%BD%E5%80%A4%E3%81%8A%E3%82%88%E3%81%B3%E3%81%9D%E3%82%8C%E3%82%89%E3%81%97%E3%81%8F%E6%80%9D%E3%81%88%E3%82%8B%E5%80%A4)

メソッド | 概要 | 補足
|:--|:--|:--
[`toBeNull`](https://jestjs.io/docs/ja/expect#tobenull) | `null` のみ |
[`toBeNaN`](https://jestjs.io/docs/ja/expect#tobenan) | `NaN` のみ
[`toBeUndefined`](https://jestjs.io/docs/ja/expect#tobeundefined) | `undefined` のみ |
[`toBeDefined`](https://jestjs.io/docs/ja/expect#tobedefined) | `undefined` でない |
[`toBeTruthy`](https://jestjs.io/docs/ja/expect#tobetruthy) | `!= 0`, `true`, `!= null` など | [Truthy - MDN](https://developer.mozilla.org/ja/docs/Glossary/Truthy)
[`toBeFalsy`](https://jestjs.io/docs/ja/expect#tobefalsy) | `0`, `false`, `null`, `undefined` など | [Falsy - MDN](https://developer.mozilla.org/ja/docs/Glossary/Falsy)

### [数値](https://jestjs.io/docs/ja/using-matchers#%E6%95%B0%E5%80%A4)

メソッド | 概要 | 補足
|:--|:--|:--
[`toBeGreaterThan(number \| bigint)`](https://jestjs.io/docs/ja/expect#tobegreaterthannumber--bigint) | 超過(`>`) |
[`toBeGreaterThanOrEqual(number \| bigint)`](https://jestjs.io/docs/ja/expect#tobegreaterthanorequalnumber--bigint) | 以上(`>=`) |
[`toBeLessThan(number \| bigint)`](https://jestjs.io/docs/ja/expect#tobelessthannumber--bigint) | 未満(`<`) |
[`toBeLessThanOrEqual(number \| bigint)`](https://jestjs.io/docs/ja/expect#tobelessthanorequalnumber--bigint) | 以下(`<=`) |
[`toBe(value)`](https://jestjs.io/docs/ja/expect#tobevalue) | 一致 | 数値の場合は `toEqual` と同じ
[`toEqual(value)`](https://jestjs.io/docs/ja/expect#toequalvalue) | 一致 | 数値の場合は `toBe` と同じ
[`toBeCloseTo(number, numDigits?)`](https://jestjs.io/docs/ja/expect#tobeclosetonumber-numdigits) | 近似値 | 浮動小数点数向け

### [文字列](https://jestjs.io/docs/ja/using-matchers#%E6%96%87%E5%AD%97%E5%88%97)

[`toMatch(regexpOrString)`](https://jestjs.io/docs/ja/expect#tomatchregexporstring) で正規表現を使った検証が可能。

```js
test('search "me"', () => {
  expect('You meet!').toMatch(/me/);
});

test('search "you"', () => {
  expect('I meet!').not.toMatch(/you/);
});
```

### [配列など](https://jestjs.io/docs/ja/using-matchers#%E9%85%8D%E5%88%97%E3%81%A8%E5%8F%8D%E5%BE%A9%E5%8F%AF%E8%83%BD%E3%81%AA%E3%82%AA%E3%83%96%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88)

[`toContain(item)`](https://jestjs.io/docs/ja/expect#tocontainitem) で配列内の要素を検証可能。

```js
const arr = ['miki', 'ken', 'taro'];
test('contains "ken"', () => {
  expect(arr).toContain('ken');
});
```

### [例外](https://jestjs.io/docs/ja/using-matchers#%E4%BE%8B%E5%A4%96)

[`toThrow(error?)`](https://jestjs.io/docs/ja/expect#tothrowerror) で例外を投げるかを検証可能。

```js
const throwError = () => {
  throw new Error('This is JavaScript');
};

test('exception', () => {
  expect(throwError).toThrow();  // 例外を投げれば OK
  expect(throwError).toThrow(Error);  // instanceof Error となる例外を投げれば OK
  expect(throwError).toThrow('Java');  // メッセージに Java を含む例外を投げれば OK
  expect(throwError).toThrow(/Java/);  // メッセージに Java を含む例外を投げれば OK (正規表現)
});
```

## [Testing Asynchronous Code](https://jestjs.io/docs/ja/asynchronous)

非同期処理のテストについて

- コールバック: `done()` を使う
- Promises:
  - [`then`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Promise/then), [`catch`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch) 内で検証
  - [`resolves`](https://jestjs.io/docs/ja/expect#resolves) や [`rejects`](https://jestjs.io/docs/ja/expect#rejects) を使う
  - [`async`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/async_function), [`await`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/await) を使う
  - ↑の組合せでも可

### [コールバック](https://jestjs.io/docs/ja/asynchronous#%E3%82%B3%E3%83%BC%E3%83%AB%E3%83%90%E3%83%83%E3%82%AF)

コールバックを待つ場合は `done()` を使う

```js
const fetchData = callback => {
  const data = 'peanut butter';  // なにかデータを取得する処理
  callback(data);
};

test('the data is peanut butter', done => {
  function callback(data) {
    try {
      expect(data).toBe('peanut butter');
      done();  // done が無ければタイムアウトが発生して失敗する
    } catch (error) {
      done(error);  // expect が失敗した場合
    }
  }

  fetchData(callback);
});
```

### [Promises](https://jestjs.io/docs/ja/asynchronous#promises)

[`Promise`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Promise) の場合は [`then`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Promise/then), [`catch`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch) 内で検証できる。

(最後の)検証対象には `return` をつける必要がある、つけない場合は `then`, `catch` 内のコールバックが実行されない可能性がある。

[`expect.assertions(number)`](https://jestjs.io/docs/ja/expect#expectassertionsnumber) で検証対象の数を設定できる。

```js
const fetchData = (likePeanut = true) => {
  return new Promise((resolve, reject) => {
    const data = likePeanut ? 'peanut butter' : 'butter';  // なにかデータを取得する処理
    if (data === 'peanut butter') {
      resolve(data);
    } else {
      reject('not peanut butter');
    }
  });
};

test('the data is peanut butter', () => {
  expect.assertions(1);  // 検証回数
  return fetchData()
    .then(data => expect(data).toBe('peanut butter'));
});

test('the data is not peanut butter', () => {
  expect.assertions(1);  // 検証回数
  return fetchData(false)
    .catch(error => expect(error).not.toBe('peanut butter'));
});
```

---

> (最後の)検証対象には `return` をつける必要がある、つけない場合は `then`, `catch` 内のコールバックが実行されない可能性がある。  
> [`expect.assertions(number)`](https://jestjs.io/docs/ja/expect#expectassertionsnumber) で検証対象の数を設定できる。

前の例だとすぐにデータが返ってくるので、`expect.assertions(1);` で `return` 無しでもテストが成功する。

以下のように1秒後にデータが返ってくるようなテストを作ると分かりやすい。([`setTimeout`](https://developer.mozilla.org/ja/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) で wrap しただけ)

```js
const fetchDataWithTimer = (likePeanut = true) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = likePeanut ? 'peanut butter' : 'butter';  // なにかデータを取得する処理
      if (data === 'peanut butter') {
        resolve(data);
      } else {
        reject('not peanut butter');
      }
    }, 1000);
  });
};

// こっちは成功
test('the data is peanut butter (with return)', () => {
  expect.assertions(1);  // 検証回数
  return fetchDataWithTimer()
    .then(data => expect(data).toBe('peanut butter'));
});

// こっちは失敗(データが返ってくる前にテストが終了し、expect.assertions(1) の条件を満たせない)
test('the data is peanut butter (no return)', () => {
  expect.assertions(1);  // 検証回数
  fetchDataWithTimer()
    .then(data => expect(data).toBe('peanut butter'));
});
```

### [`.resolves` / `.rejects`](https://jestjs.io/docs/ja/asynchronous#resolves--rejects)

[`resolves`](https://jestjs.io/docs/ja/expect#resolves) や [`rejects`](https://jestjs.io/docs/ja/expect#rejects) を使って、`expect(fetchData()).resolves.toBe`, `expect(fetchData()).rejects.not.toBe` という検証も可能。

```js
const fetchData = (likePeanut = true) => {
  return new Promise((resolve, reject) => {
    const data = likePeanut ? 'peanut butter' : 'butter';  // なにかデータを取得する処理
    if (data === 'peanut butter') {
      resolve(data);
    } else {
      reject('not peanut butter');
    }
  });
};

test('the data is peanut butter', () => {
  expect.assertions(1);  // 検証回数
  return expect(fetchData()).resolve.toBe('peanut butter');
});

test('the data is not peanut butter', () => {
  expect.assertions(1);  // 検証回数
  return expect(fetchData()).rejects.not.toBe('peanut butter');
});
```

### [Async/Await](https://jestjs.io/docs/ja/asynchronous#asyncawait)

[`async`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/async_function), [`await`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/await) を使うことも可能。

```js
const fetchData = (likePeanut = true) => {
  return new Promise((resolve, reject) => {
    const data = likePeanut ? 'peanut butter' : 'butter';  // なにかデータを取得する処理
    if (data === 'peanut butter') {
      resolve(data);
    } else {
      reject('not peanut butter');
    }
  });
};

test('the data is peanut butter', async () => {
  const data = await fetchData();
  expect(data).toBe('peanut butter');
});

test('the data is not peanut butter', async () => {
  try {
    await fetchData(false);
  } catch (error) {
    return expect(error).not.toBe('peanut butter');
  }
});
```

---

[`resolves`](https://jestjs.io/docs/ja/expect#resolves) や [`rejects`](https://jestjs.io/docs/ja/expect#rejects) との組合せも可能。

```js
test('the data is peanut butter', async () => {
  await expect(fetchData()).resolves.toBe('peanut butter');
});

test('the fetch fails with an error', async () => {
  await expect(fetchData()).rejects.toThrow('error');
});
```
