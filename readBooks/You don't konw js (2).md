# this 和对象原型

## 1. 关于 this

例子：思考以下代码：

```js
function foo(num) {
  console.log("foo: " + num); // 6, 7, 8, 9
  // 记录 foo 被调用的次数
  console.log(this.count); // 第一次 undefined，之后是 NAN
  this.count++;
}
foo.count = 0;
var i;
for (i = 0; i < 10; i++) {
  if (i > 5) {
    foo(i);
  }
}

console.log("count:", foo.count); // 0
```

如果要从函数对象内部引用它自身，那只使用 this 是不够的。一般来说你需要通过一个指向函数对象的词法标识符（变量）来引用它。

思考一下下面这两个函数：

```js
function foo() {
  foo.count = 4; // foo 指向它自身
}
setTimeout(function () {
  // 匿名（没有名字的）函数无法指向自身
}, 10);
```

第一个函数被称为具名函数，在它内部可以使用 foo 来引用自身。
但是在第二个例子中，传入 setTimeout(..) 的回调函数没有名称标识符（这种函数被称为
匿名函数），因此无法从函数内部引用自身

所以，对于我们的例子来说，另一种解决方法是使用 foo 标识符替代 this 来引用函数对象

```js
function foo(num) {
  console.log("foo: " + num); // 6, 7, 8, 9
  // 记录 foo 被调用的次数
  foo.count++;
}
foo.count = 0;
var i;
for (i = 0; i < 10; i++) {
  if (i > 5) {
    foo(i);
  }
}

console.log("count:", foo.count); // 4
```

或者

```js
function foo(num) {
  console.log("foo: " + num); // 6,7,8,9
  // 记录 foo 被调用的次数
  // 注意，在当前的调用方式下（参见下方代码），this 确实指向 foo
  this.count++;
}
foo.count = 0;
var i;
for (i = 0; i < 10; i++) {
  if (i > 5) {
    // 使用 call(..) 可以确保 this 指向函数对象 foo 本身
    foo.call(foo, i);
  }
}

console.log("count:", foo.count); // 4
```

this 既不指向函数自身也不指向函数的词法作用域，你也许被这样的解释误导过，但其实它们都是错误的。
this 实际上是在函数被调用时发生的绑定，它指向什么完全取决于函数在哪里被调用。


## 2. this 全面解析

每个函数的 this 是在调用时被绑定的，完全取决于函数的调用位置（也就是函数的调用方法）。

### 2.1 调用位置
