## 聚合函数

思考：有如下函数， 聚合成⼀个函数，并把第⼀个函数的返回值传递给下⼀个函数，如何处理。

```js
function f1(arg) {
  console.log("f1", arg);
  return arg;
}
function f2(arg) {
  console.log("f2", arg);
  return arg;
}
function f3(arg) {
  console.log("f3", arg);
  return arg;
}
```

```js
f3(f2(f1("omg")));
// or
function compose(...funcs) {
  if (funcs.length === 0) {
    return (arg) => arg;
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reduce(
    (a, b) =>
      (...args) =>
        b(a(...args))
  );
}

console.log(compose(f1, f2, f3)("omg"));
```

## 函数式编程

### 合成

### 柯里化

是把接受多个参数的函数变成接受一个单一参数的函数

```js
const add = function (x) {
  return function (y) {
    return x + y;
  };
};

const increment = add(1);
increment(2); // 3

const addTen = add(10);
addTen(2); // 12
```
