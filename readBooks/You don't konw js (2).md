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

```js
function baz() {
  // 当前调用栈是：baz
  // 因此，当前调用位置是全局作用域
  console.log("baz");
  bar(); // <-- bar 的调用位置
}
function bar() {
  // 当前调用栈是 baz -> bar
  // 因此，当前调用位置在 baz 中
  console.log("bar");
  foo(); // <-- foo 的调用位置
}
function foo() {
  // 当前调用栈是 baz -> bar -> foo
  // 因此，当前调用位置在 bar 中
  console.log("foo");
}
baz(); // <-- baz 的调用位置
```

注意我们是如何（从调用栈中）分析出真正的调用位置的，因为它决定了 this 的绑定。

### 2.2 绑定规则

必须找到调用位置，然后判断需要应用下面四条规则中的哪一条

#### 2.2.1 默认绑定

独立函数调用

```js
function foo() {
  console.log(this.a); // this 指向全局对象
}
var a = 2;
foo(); // 2
```

只有 foo() 运行在非 strict mode 下时，默认绑定才能绑定到全局对象；严格模式下与 foo() 的调用位置无关
如果使用严格模式（ strict mode ），那么全局对象将无法使用默认绑定，因此 this 会绑定
到 undefined ：

```js
function foo() {
  "use strict";
  console.log(this.a);
}
var a = 2;
foo(); // TypeError: this is undefined
```

#### 2.2.2 隐式绑定

另一条需要考虑的规则是调用位置是否有上下文对象，或者说是否被某个对象拥有或者包含

```js
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2,
  foo: foo,
};
obj.foo(); // 2
```

首先需要注意的是 foo() 的声明方式，及其之后是如何被当作引用属性添加到 obj 中的。但是无论是直接在 obj 中定义还是先定义再添加为引用属性，这个函数严格来说都不属于 obj 对象。
然而，调用位置会使用 obj 上下文来引用函数，因此你可以说函数被调用时 obj 对象“拥有”或者“包含”它。

**隐式丢失**

```js
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2,
  foo: foo,
};
var bar = obj.foo; // 函数别名！
var a = "oops, global"; // a 是全局对象的属性
bar(); // "oops, global"
```

虽然 bar 是 obj.foo 的一个引用，但是实际上，它引用的是 foo 函数本身，因此此时的 bar() 其实是一个不带任何修饰的函数调用，因此应用了默认绑定。

传入回调函数时：

```js
function foo() {
console.log( this.a );
}
function doFoo(fn) {
// fn 其实引用的是 foo
fn(); // <-- 调用位置！
}
var obj = {
a: 2,
foo: foo
};
var a = "oops, global"; // a 是全局对象的属性
doFoo( obj.foo ); // "oops, global"
```
参数传递其实就是一种隐式赋值，因此我们传入函数时也会被隐式赋值，所以结果和上一个例子一样

#### 2.2.3 显式绑定（call, apply）
