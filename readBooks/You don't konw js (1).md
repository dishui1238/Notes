# 1. 作用域和闭包

## 1.1 编译原理

- 传统编译语言流程

  1. 分词/词法分析

     将由字符组成的字符串分解成（对编程语言来说）有意义的代码块，var a = 2;，被分解成 var、a、=、2、;

  2. 解析/语法分析

     将词法单元流（数组）转换成一个由元素逐级嵌套所组成的代表了程序语法结构的树。这个树被称为“抽象语法树(AST)”

  3. 代码生成

- javaScript 编译

  javaScript 的编译过程不是发生在构建之前的。对于 JavaScript 来说，**大部分情况下编译发生在代码执行前的几微秒（甚至更短）的时间内。**

## 1.2 LHS 查询 和 RHS 查询

> 如果查找的目的是对变量进行赋值，那么就会使用 LHS 查询；如果目的是获取变量的值，就会使用 RHS 查询。赋值操作符会导致 LHS 查询。 ＝ 操作符或调用函数时传入参数的操作都会导致关联作用域的赋值操作。

- 区别：变量还没有声明（在任何作用域中都无法找到该变量）的情况下，这两种查询的行为是不一样的。

  ```js
  function foo(a) {
    console.log(a + b);
    b = a;
  }
  foo(2);
  ```

  第一次对 b 进行 RHS 查询时是无法找到该变量的。也就是说，这是一个“未声明”的变量，因为在任何相关的作用域中都无法找到它。

  如果 RHS 查询在所有嵌套的作用域中遍寻不到所需的变量，引擎就会抛出 ReferenceError 异常。值得注意的是， ReferenceError 是非常重要的异常类型。

  相较之下，当引擎执行 LHS 查询时，如果在顶层（全局作用域）中也无法找到目标变量，全局作用域中就会创建一个具有该名称的变量，并将其返还给引擎，前提是程序运行在非“严格模式”下。

  ES5 中引入了“严格模式”。同正常模式，或者说宽松 / 懒惰模式相比，严格模式在行为上有很多不同。其中一个不同的行为是严格模式禁止自动或隐式地创建全局变量。因此，在严格模式中 LHS 查询失败时，并不会创建并返回一个全局变量，引擎会抛出同 RHS 查询失败时类似的 ReferenceError 异常。

  接下来，如果 RHS 查询找到了一个变量，但是你尝试对这个变量的值进行不合理的操作，比如试图对一个非函数类型的值进行函数调用，或着引用 null 或 undefined 类型的值中的属性，那么引擎会抛出另外一种类型的异常，叫作 TypeError 。

  ReferenceError 同作用域判别失败相关，而 TypeError 则代表作用域判别成功了，但是对结果的操作是非法或不合理的。

# 2. 词法作用域

> 作用域两种主要的工作模型： 词法作用域（最普遍）、动态作用域，js 采用词法作用域

## 2.1 词法阶段

作用域查找会在找到第一个匹配的标识符时停止。在多层的嵌套作用域中可以定义同名的标识符，这叫作“遮蔽效应”（内部的标识符“遮蔽”了外部的标识符）。抛开遮蔽效应，作用域查找始终从运行时所处的最内部作用域开始，逐级向外或者说向上进行，直到遇见第一个匹配的标识符为止

全局变量会自动成为全局对象（比如浏览器中的 window 对象）的属性，因此可以不直接通过全局对象的词法名称，而是间接地通过对全局对象属性的引用来对其进行访问。
`window.a`
通过这种技术可以访问那些被同名变量所遮蔽的全局变量。但非全局的变量如果被遮蔽了，无论如何都无法被访问到。

## 2.2 欺骗词法

> 在运行时来“修改”（也可以说欺骗）词法作用域，JavaScript 中有两种机制来实现这个目的。欺骗词法作用域会导致性能下降

### 2.2.1 eval

eval(..) 函数可以接受一个字符串为参数，并将其中的内容视为好像在书写时就存在于程序中这个位置的代码

```js
function foo(str, a) {
  eval(str); // 欺骗！
  console.log(a, b);
}
var b = 2;
foo("var b = 3;", 1); // 1, 3
```

在严格模式的程序中， eval(..) 在运行时有其自己的词法作用域，意味着其中的声明无法修改所在的作用域。

```js
function foo(str) {
  "use strict";
  eval(str);
  console.log(a); // ReferenceError: a is not defined
}
foo("var a = 2");
```

### 2.2.2 with

with 可以将一个没有或有多个属性的对象处理为一个完全隔离的词法作用域，因此这个对象的属性也会被处理为定义在这个作用域中的词法标识符。

```js
function foo(obj) {
  with (obj) {
    a = 2;
  }
}
var o1 = {
  a: 3,
};
var o2 = {
  b: 3,
};
foo(o1);
console.log(o1.a); // 2

foo(o2);
console.log(o2.a); // undefined
console.log(a); // 2——不好，a 被泄漏到全局作用域上了！
```

> eval(..) 函数如果接受了含有一个或多个声明的代码，就会修改其所处的词法作用域，而
> with 声明实际上是根据你传递给它的对象凭空创建了一个全新的词法作用域。

**总结**
使用这其中任何一个机制都将导致代码运行变慢。不要使用它们。

# 3. 函数作用域和块作用域

## 3.1 函数作用域

```js
var a = 2;
function foo() {
  // <-- 添加这一行
  var a = 3;
  console.log(a); // 3
} // <-- 以及这一行
foo(); // <-- 以及这一行
console.log(a); // 2
```

**问题：** 首先，必须声明一个具名函数 foo() ，意味着 foo 这个名称本身“污染”了所在作用域（在这个例子中是全局作用域）。其次，必须显式地通过函数名（ foo() ）调用这个函数才能运行其中的代码。

```js
var a = 2;
(function foo() {
  // <-- 添加这一行
  var a = 3;
  console.log(a); // 3
})(); // <-- 以及这一行
console.log(a); // 2
```

函数会被当作函数表达式而不是一个标准的函数声明来处理。

**总结：** 区分函数声明和表达式最简单的方法是看 function 关键字出现在声明中的位置（不仅仅是一行代码，而是整个声明中的位置）。如果 function 是声明中的第一个词，那么就是一个函数声明，否则就是一个函数表达式。

函数声明和函数表达式之间最重要的区别是它们的名称标识符将会绑定在何处。比较一下前面两个代码片段。第一个片段中 foo 被绑定在所在作用域中，可以直接通过 foo() 来调用它。第二个片段中 foo 被绑定在函数表达式自身的函数中而不是所在作用域中。

换句话说， (function foo(){ .. }) 作为函数表达式意味着 foo 只能在 .. 所代表的位置中被访问，外部作用域则不行。 foo 变量名被隐藏在自身中意味着不会非必要地污染外部作用域。

### 3.1.1 匿名和具名

1. 匿名函数缺点

- 匿名函数在栈追踪中不会显示出有意义的函数名，使得调试很困难。
- 如果没有函数名，当函数需要引用自身时只能使用已经过期的 arguments.callee 引用，比如在递归中。另一个函数需要引用自身的例子，是在事件触发后事件监听器需要解绑自身。
- 匿名函数省略了对于代码可读性 / 可理解性很重要的函数名。一个描述性的名称可以让代码不言自明。

### 3.1.2 立即执行函数表达式

> IIFE，代表立即执行函数表达式（Immediately Invoked Function Expression）
> (function foo(){ .. })() & (function(){ .. }()) 两种形式

- 传递参数

```js
var a = 2;
(function IIFE(global) {
  var a = 3;
  console.log(a); // 3
  console.log(global.a); // 2
})(window);
console.log(a); // 2
```

- IIFE 还有一种变化的用途是倒置代码的运行顺序，将需要运行的函数放在第二位，在 IIFE
  执行之后当作参数传递进去。

```js
var a = 2;
(function IIFE(def) {
  def(window);
})(function def(global) {
  var a = 3;
  console.log(a); // 3
  console.log(global.a); // 2
});
```

## 3.2 块作用域

> 函数作用域是最常见的作用域单元，当然也是现行大多数 JavaScript 中最普遍的设计
> 方法, 除 JavaScript 外的很多编程语言都支持块作用域. 块作用域是一个用来对之前的最小授权原则进行扩展的工具，将代码从在函数中隐藏信息扩展为在块中隐藏信息。

### 3.2.1 with

块作用域的一种形式

### 3.2.2 try/catch

```js
try {
  undefined(); // 执行一个非法操作来强制制造一个异常
} catch (err) {
  console.log(err); // 能够正常执行！
}
console.log(err); // ReferenceError: err not found
```

### 3.2.3 let

> ES6 改变了现状，引入了新的 let 关键字，提供了除 var 以外的另一种变量声明方式。

> let 关键字可以将变量绑定到所在的任意作用域中（通常是 { .. } 内部）。

但是使用 let 进行的声明不会在块作用域中进行提升。声明的代码被运行之前，声明并不“存在”。

**1. 垃圾收集**

另一个块作用域非常有用的原因和闭包及回收内存垃圾的回收机制相关。

- 不使用块作用域

```js
function process(data) {
// 在这里做点有趣的事情
}
var someReallyBigData = { .. };
process( someReallyBigData );
var btn = document.getElementById( "my_button" );
btn.addEventListener( "click", function click(evt) {
console.log("button clicked");
}, /*capturingPhase=*/false );
```

click 函数的点击回调并不需要 someReallyBigData 变量。理论上这意味着当 process(..) 执
行后，在内存中占用大量空间的数据结构就可以被垃圾回收了。但是，由于 click 函数形成
了一个覆盖整个作用域的闭包，JavaScript 引擎极有可能依然保存着这个结构（取决于具体
实现）。

- 使用块作用域

块作用域可以打消这种顾虑，可以让引擎清楚地知道没有必要继续保存 someReallyBigData 了.

```js
function process(data) {
// 在这里做点有趣的事情
}
// 在这个块中定义的内容可以销毁了！
{
  let someReallyBigData = { .. };
  process( someReallyBigData );
}
var btn = document.getElementById( "my_button" );
btn.addEventListener( "click", function click(evt){
console.log("button clicked");
}, /*capturingPhase=*/false );
```

**2.let 循环**

一个 let 可以发挥优势的典型例子就是之前讨论的 for 循环。

```js
for (let i = 0; i < 10; i++) {
  console.log(i);
}
console.log(i); // ReferenceError
```

for 循环头部的 let 不仅将 i 绑定到了 for 循环的块中，事实上它将其重新绑定到了循环
的每一个迭代中，确保使用上一个循环迭代结束时的值重新进行赋值。

### 3.2.4 const

除了 let 以外，ES6 还引入了 const ，同样可以用来创建块作用域变量，但其值是固定的（常量）。之后任何试图修改值的操作都会引起错误。

# 4. 提升

## 4.1 变量声明和函数声明的提升

```js
a = 2;
var a;
console.log(a); // 2
```

```js
console.log(a); // undefined
var a = 2;
```

引擎会在解释 JavaScript 代码之前首先对其进行编译。编译阶段中的一部分工作就是找到所有的声明，并用合适的作用域将它们关联起来。所以，包括变量和函数在内的所有声明都会在任何代码被执行前首先被处理。

分析： var a = 2， JavaScript 实际上会将其看成两个声明： var a; 和 a = 2; 。第一个定义声明是在编译阶段进行的。第二个赋值声明会被留在原地等待执行阶段。这个过程就好像变量和函数声明从它们在代码中出现的位置被“移动”到了最上面。这个过程就叫作提升。先声明，后赋值。

```js
foo();
function foo() {
  console.log(a); // undefined
  var a = 2;
}
```

另外值得注意的是，每个作用域都会进行提升操作。尽管前面大部分的代码片段已经简化了（因为它们只包含全局作用域），而我们正在讨论的 foo(..) 函数自身也会在内部对 var a 进行提升（显然并不是提升到了整个程序的最上方）。因此上面的代码实际上会被理解为下面的形式：

```js
function foo() {
  var a;
  console.log(a); // undefined
  a = 2;
}
foo();
```

可以看到，函数声明会被提升，但是函数表达式却不会被提升。

```js
foo(); // 不是 ReferenceError, 而是 TypeError!
var foo = function bar() {
  // ...
};
```

这段程序中的变量标识符 foo() 被提升并分配给所在作用域（在这里是全局作用域），因此 foo() 不会导致 ReferenceError 。但是 foo 此时并没有赋值（如果它是一个函数声明而不是函数表达式，那么就会赋值）。 foo() 由于对 undefined 值进行函数调用而导致非法操作，因此抛出 TypeError 异常。

## 4.2 函数优先

> 函数声明和变量声明都会被提升。但是一个值得注意的细节是函数会首先被提升，然后才是变量。

```js
foo(); // 1
var foo;
function foo() {
  console.log(1);
}
foo = function () {
  console.log(2);
};
```

这个代码片段会被引擎理解为如下形式：

```js
function foo() {
  console.log(1);
}
foo(); // 1
foo = function () {
  console.log(2);
};
```

# 5. 作用域闭包

> 当函数可以记住并访问所在的词法作用域时，就产生了闭包，即使函数是在当前词法作用域之外执行。

## 5.1 实质问题

当函数可以记住并访问所在的词法作用域时，就产生了闭包，即使函数是在**当前词法作用域之外**执行。

```js
function foo() {
  var a = 2;
  function bar() {
    console.log(a);
  }
  return bar;
}
var baz = foo();
baz(); // 2 ——这就是闭包的效果。 foo()();
```

函数 bar() 的词法作用域能够访问 foo() 的内部作用域。然后我们将 bar() 函数本身当作一个值类型进行传递。在这个例子中，我们将 bar 所引用的函数对象本身当作返回值。

在 foo() 执行后，其返回值（也就是内部的 bar() 函数）赋值给变量 baz 并调用 baz() ，实际上只是通过不同的标识符引用调用了内部的函数 bar() 。

bar() 显然可以被正常执行。但是在这个例子中，它在自己定义的词法作用域以外的地方执行。

在 foo() 执行后，通常会期待 foo() 的整个内部作用域都被销毁，因为我们知道引擎有垃圾回收器用来释放不再使用的内存空间。由于看上去 foo() 的内容不会再被使用，所以很自然地会考虑对其进行回收。

而闭包的“神奇”之处正是可以阻止这件事情的发生。事实上内部作用域依然存在，因此没有被回收。谁在使用这个内部作用域？原来是 bar() 本身在使用。

拜 bar() 所声明的位置所赐，它拥有涵盖 foo() 内部作用域的闭包，使得该作用域能够一直存活，以供 bar() 在之后任何时间进行引用。

bar() 依然持有对该作用域的引用，而这个引用就叫作闭包。

```js
var fn;
function foo() {
  var a = 2;
  function baz() {
    console.log(a);
  }
  fn = baz; // 将 baz 分配给全局变量
}
function bar() {
  fn(); // 这就是闭包！
}
foo();
bar(); // 2
```

无论通过何种手段将内部函数传递到所在的词法作用域以外，它都会持有对原始定义作用域的引用，无论在何处执行这个函数都会使用闭包。

**再来一个例子：**

```js
function wait(message) {
  setTimeout(function timer() {
    console.log(message);
  }, 1000);
}
wait("Hello, closure!");
```

将一个内部函数（名为 timer ）传递给 setTimeout(..) 。 timer 具有涵盖 wait(..) 作用域的闭包，因此还保有对变量 message 的引用。

wait(..) 执行 1000 毫秒后，它的内部作用域并不会消失， timer 函数依然保有 wait(..) 作用域的闭包。

深入到引擎的内部原理中，内置的工具函数 setTimeout(..) 持有对一个参数的引用，这个参数也许叫作 fn 或者 func ，或者其他类似的名字。引擎会调用这个函数，在例子中就是内部的 timer 函数，而词法作用域在这个过程中保持完整。

这就是闭包。

## 5.2 循环和闭包

```js
for (var i = 1; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i);
  }, i * 1000);
}
```

正常情况下，我们对这段代码行为的预期是分别输出数字 1~5，每秒一次，每次一个。

但实际上，这段代码在运行时会以每秒一次的频率输出五次 6。

这是为什么？

首先解释 6 是从哪里来的。这个循环的终止条件是 i 不再 <=5 。条件首次成立时 i 的值是 6。因此，输出显示的是循环结束时 i 的最终值。

**延迟函数的回调会在循环结束时才执行**。事实上，当定时器运行时即使每个迭代中执行的是 setTimeout(.., 0) ，所有的回调函数依然是在循环结束后才会被执行，因此会每次输出一个 6 出来。

根据作用域的工作原理，实际情况是尽管循环中的五个函数是在各个迭代中分别定义的，但是它们都被封闭在一个共享的全局作用域中，因此实际上只有一个 i 。

---

这样可以达到目的：

```js
for (var i = 1; i <= 5; i++) {
  (function (j) {
    setTimeout(function timer() {
      console.log(j);
    }, j * 1000);
  })(i);
}
```

IIFE(立即执行函数表达式) 会通过声明并立即执行一个函数来创建作用域。在迭代内使用 IIFE 会为每个迭代都生成一个新的作用域，使得延迟函数的回调可以将新的作用域封闭在每个迭代内部，每个迭代中都会含有一个具有正确值的变量供我们访问。

**块作用域与闭包的结合**

IIFE 在每次迭代时都创建一个新的作用域。换句话说，每次迭代我们都需要一个块作用域。 let 声明，可以用来劫持块作用域，并且在这个块作用域中声明一个变量。**本质上这是将一个块转换成一个可以被关闭的作用域。** 因此，下面这段代码就可正常运行了：

```js
for (let i = 1; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i);
  }, i * 1000);
}
```

for 循环头部的 let 声明还会有一个特殊的行为。这个行为指出变量在循环过程中不止被声明一次，每次迭代都会声明。随后的每个迭代都会使用上一个迭代结束时的值来初始化这个变量。

## 5.3 模块

模块模式需要具备两个必要条件：

1. 必须有外部的封闭函数，该函数必须至少被调用一次（每次调用都会创建一个新的模块实例）。

2. 封闭函数必须返回至少一个内部函数，这样内部函数才能在私有作用域中形成闭包，并且可以访问或者修改私有的状态。

### 5.3.1 现代模块机制

```js
var MyModules = (function Manager() {
  var modules = {};
  function define(name, deps, impl) {
    for (var i = 0; i < deps.length; i++) {
      deps[i] = modules[deps[i]];
    }
    modules[name] = impl.apply(impl, deps);
  }
  function get(name) {
    return modules[name];
  }
  return {
    define: define,
    get: get,
  };
})();
```

apply 方法能劫持另外一个对象的方法，继承另外一个对象的属性。
使用上面的代码来定义模块：

```js
MyModules.define("bar", [], function () {
  function hello(who) {
    return "Let me introduce: " + who;
  }
  return {
    hello: hello,
  };
});

MyModules.define("foo", ["bar"], function (bar) {
  var hungry = "hippo";
  function awesome() {
    console.log(bar.hello(hungry).toUpperCase());
  }
  return {
    awesome: awesome,
  };
});

var bar = MyModules.get("bar");
var foo = MyModules.get("foo");

console.log(bar.hello("ctystal"));
foo.awesome();
```

import 可以将一个模块中的一个或多个 API 导入到当前作用域中，并分别绑定在一个变量
上（在我们的例子里是 hello ）。 module 会将整个模块的 API 导入并绑定到一个变量上（在我们的例子里是 foo 和 bar ）。 export 会将当前模块的一个标识符（变量、函数）导出为公
共 API。