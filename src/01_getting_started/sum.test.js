const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

// https://jestjs.io/docs/ja/using-matchers#%E4%B8%80%E8%88%AC%E7%9A%84%E3%81%AA%E3%83%9E%E3%83%83%E3%83%81%E3%83%A3%E3%83%BC
test(`0.02`, () => {
  expect(0.02).toBeCloseTo(0.02049, 3);
});

test(`0.02`, () => {
  expect(0.02).toBeCloseTo(0.01951, 3);
});

const hoge = { foo: 'bar' };
const fuga = { foo: 'bar' };
test(`hoge and fuga`, () => {
  expect(hoge).toEqual(fuga);
});

test('1 + 1 != 1', () => {
  expect(1 + 1).not.toBe(1);
});

// https://jestjs.io/docs/ja/using-matchers#%E7%9C%9F%E5%81%BD%E5%80%A4%E3%81%8A%E3%82%88%E3%81%B3%E3%81%9D%E3%82%8C%E3%82%89%E3%81%97%E3%81%8F%E6%80%9D%E3%81%88%E3%82%8B%E5%80%A4
test('null', () => {
  const n = null;
  expect(n).toBeNull();
  expect(n).toBeDefined();
  expect(n).not.toBeUndefined();
  expect(n).not.toBeTruthy();
  expect(n).toBeFalsy();
});

test('zero', () => {
  const z = 0;
  expect(z).not.toBeNull();
  expect(z).toBeDefined();
  expect(z).not.toBeUndefined();
  expect(z).not.toBeTruthy();
  expect(z).toBeFalsy();
});

test('search "me"', () => {
  expect('You meet!').toMatch(/me/);
});

test('search "you"', () => {
  expect('I meet!').not.toMatch(/you/);
});

const arr = ['miki', 'ken', 'taro'];
test('contains "ken"', () => {
  expect(arr).toContain('ken');
});

const throwError = () => {
  throw new Error('This is JavaScript');
};

test('exception', () => {
  expect(throwError).toThrow();  // 例外を投げれば OK
  expect(throwError).toThrow(Error);  // instanceof Error となる例外を投げれば OK
  expect(throwError).toThrow('Java');  // メッセージに Java を含む例外を投げれば OK
  expect(throwError).toThrow(/Java/);  // メッセージに Java を含む例外を投げれば OK (正規表現)
});
