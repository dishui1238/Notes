<!--
 * @Author: your name
 * @Date: 2020-12-24 15:16:26
 * @LastEditTime: 2020-12-28 11:22:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \0dailyUpdateNotes\Notes\TS\1.ts基础.md
-->

# 一、简介

TypeScript 是 JavaScript 的一个超集，主要提供了类型系统和对 ES6 的支持，它由 Microsoft 开发，代码开源于 GitHub 上。
TypeScript 增加了代码的可读性和可维护性。

## 1. 安装 TypeScript 的命令行工具

`npm install -g typescript`
`tsc hello.ts`

TypeScript 只会在编译时对类型进行静态检查，如果发现有错误，编译的时候就会报错。而在运行时，与普通 JavaScript 文件一样，不会对类型进行检查。

```ts
function sayHello(person: string) {
  return "Hello, " + person;
}

let user = "Tom";
console.log(sayHello([1, 2, 3]));
```

编辑器中会提示错误，编译的时候也会出错，但是还是生成了 js 文件。

这是因为 TypeScript 编译的时候即使报错了，还是会生成编译结果，我们仍然可以使用这个编译之后的文件。

如果要在报错的时候终止 js 文件的生成，可以在 tsconfig.json 中配置 noEmitOnError 即可。

# 二、基础部分

## 1. 原始数据类型

最新的 ECMAScript 标准定义了 8 种数据类型: 7 种原始类型 和 Object

JavaScript 的类型分为两种：**原始数据类型** 和 **对象类型**

原始数据类型：数字（number）、字符串（string）、布尔值（boolean）、undefined、null、Symbol、BigInt
对象类型包括：数组（Array）、函数（Function）、正则（RegExp）和日期（Date）

_注：BigInt 是一种内置对象，它提供了一种方法来表示大于 2^53 - 1 的整数。这原本是 Javascript 中可以用 Number 表示的最大数字。BigInt 可以表示任意大的整数。在一个整数字面量后面加 n 的方式定义一个 BigInt`BigInt(100) = 10n`_

1. 布尔值
   `let isDone: boolean = false;`

2. 数字
   `let num: number = 6;`

3. 字符串
   `let myName: string = 'Tom';`

4. 空值
   JavaScript 没有空值（Void）的概念，在 TypeScript 中，可以用 void 表示没有任何返回值的函数：

   ```ts
   function alertName(): void {
     alert("My name is Tom");
   }
   ```

   声明一个 void 类型的变量没有什么用，因为你只能将它赋值为 undefined 和 null：
   `let unusable: void = undefined;`

5. Null 和 Undefined

```ts
let u: undefined = undefined;
let n: null = null;
```

与 void 的区别是，undefined 和 null 是**所有类型的子类型**。也就是说 undefined 类型的变量，可以赋值给 number 类型的变量，而 void 类型的变量不能赋值给 number 类型的变量。

## 2. 任意值

```ts
let myFavoriteNumber: any = "seven";
```

变量如果在声明的时候，未指定其类型，那么它会被识别为任意值类型

## 3. 类型推论

如果没有明确的指定类型，那么 TypeScript 会依照类型推论（Type Inference）的规则推断出一个类型。

```ts
let myFavoriteNumber = "seven";
myFavoriteNumber = 7;
```

如果定义的时候没有赋值，不管之后有没有赋值，都会被推断成 any 类型而完全不被类型检查

## 4. 联合类型

联合类型（Union Types）表示取值可以为多种类型中的一种。联合类型使用 | 分隔每个类型。

```ts
let myFavoriteNumber: string | number;
myFavoriteNumber = "seven";
myFavoriteNumber = 7;
```

## 5. 对象的类型 —— 接口

```ts
interface Person {
  name: string;
  age: number;
}

let tom: Person = {
  name: "Tom",
  age: 25,
};
```

赋值的时候，变量的形状必须和接口的形状保持一致，多/少属性都是不允许的

**可选属性：**

```ts
interface Person {
  name: string;
  age?: number;
}

let tom: Person = {
  name: "Tom",
};
```

**任意属性:**
使用 [propName: string] 定义了任意属性取 string 类型的值。需要注意的是，一旦定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型的子集

```ts
interface Person {
  name: string;
  age?: number;
  [propName: string]: any;
}

let tom: Person = {
  name: "Tom",
  gender: "male",
};
```

```ts
interface Person {
  name: string;
  age?: number;
  [propName: string]: string | number;
}

let tom: Person = {
  name: "Tom",
  gender: "male",
};
```

**只读属性：readonly**

```ts
interface Person {
  readonly id: number;
  name: string;
  age?: number;
  [propName: string]: any;
}

let tom: Person = {
  id: 89757, // 只读，初始化后不准许再赋值
  name: "Tom",
  gender: "male",
};
```

## 6. 数组的类型

1. **「类型 + 方括号」表示法**
   `let fibonacci: number[] = [1, 1, 2, 3, 5];` 数组的项中不允许出现其他的类型
2. **数组泛型**
   `let fibonacci: Array<number> = [1, 1, 2, 3, 5];`
3. **any 在数组中的应用**
   `let list: any[] = ['xcatliu', 25, { website: 'http://xcatliu.com' }];`

## 6. 函数的类型

函数声明：

```ts
function sum(x: number, y: number): number {
  return x + y;
}
```

函数表达式：

```ts
let mySum = function (x: number, y: number): number {
  return x + y;
};
```

上面的代码只对等号右侧的匿名函数进行了类型定义，而等号左边的 mySum，是通过赋值操作进行类型推论而推断出来的。如果需要我们手动给 mySum 添加类型，则应该是这样：

```ts
let mySum: (x: number, y: number) => number = function (
  x: number,
  y: number
): number {
  return x + y;
};
```

参数默认值:

```ts
function buildName(firstName: string, lastName: string = "Cat") {
  return firstName + " " + lastName;
}
let tomcat = buildName("Tom", "Cat");
let tom = buildName("Tom");
```

**剩余参数**

```ts
function push(array: any[], ...items: any[]) {
  items.forEach(function (item) {
    array.push(item);
  });
}

let a: any[] = [];
push(a, 1, 2, 3);
```

**重载**

重载允许一个函数接受不同数量或类型的参数时，作出不同的处理

```ts
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
  if (typeof x === "number") {
    return Number(x.toString().split("").reverse().join(""));
  } else if (typeof x === "string") {
    return x.split("").reverse().join("");
  }
}
```

## 7. 类型断言

将一个联合类型断言为其中一个类型

```ts
interface Cat {
  name: string;
  run(): void;
}
interface Fish {
  name: string;
  swim(): void;
}

function isFish(animal: Cat | Fish) {
  if (typeof (animal as Fish).swim === "function") {
    return true;
  }
  return false;
}
```

## 8. 声明文件

- declare var 声明全局变量
- declare function 声明全局方法
- declare class 声明全局类
- declare enum 声明全局枚举类型
- declare namespace 声明（含有子属性的）全局对象
- interface 和 type 声明全局类型
- export 导出变量
- export namespace 导出（含有子属性的）对象
- export default ES6 默认导出
- export = commonjs 导出模块
- export as namespace UMD 库声明全局变量
- declare global 扩展全局变量
- declare module 扩展模块
- /// <reference /> 三斜线指令

通常我们会把声明语句放到一个单独的文件（xxx.d.ts）中，这就是声明文件

TypeScript 作为 JavaScript 的超集，在开发过程中不可避免要引用其他第三方的 JavaScript 的库。虽然通过直接引用可以调用库的类和方法，但是却无法使用 TypeScript 诸如类型检查等特性功能。为了解决这个问题，需要将这些库里的函数和方法体去掉后只保留导出类型声明，而产生了一个描述 JavaScript 库和模块信息的声明文件。通过引用这个声明文件，就可以借用 TypeScript 的各种特性来使用库文件了。

## 8. 内置对象

JavaScript 中有很多内置对象，它们可以直接在 TypeScript 中当做定义好了的类型。

**[ECMAScript 的内置对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects)**

ECMAScript 标准提供的内置对象有：Boolean、Error、Date、RegExp、Math 等;

我们可以在 TypeScript 中将变量定义为这些类型，他们的定义文件，则在 TypeScript 核心库的定义文件中。

```ts
let b: Boolean = new Boolean(1);
let e: Error = new Error("Error occurred");
let d: Date = new Date();
let r: RegExp = /[a-z]/;
```

**DOM 和 BOM 的内置对象**

DOM 和 BOM 提供的内置对象有：Document、HTMLElement、Event、NodeList 等。
TypeScript 中会经常用到这些类型，它们的定义文件同样在 TypeScript 核心库的定义文件中。

```ts
let body: HTMLElement = document.body;
let allDiv: NodeList = document.querySelectorAll("div");
document.addEventListener("click", function (e: MouseEvent) {
  // Do something
});
```

**[TypeScript 核心库的定义文件](https://github.com/Microsoft/TypeScript/tree/master/src/lib)**

TypeScript 核心库的定义文件中定义了所有浏览器环境需要用到的类型，并且是预置在 TypeScript 中的。

**用 TypeScript 写 Node.js**

Node.js 不是内置对象的一部分，如果想用 TypeScript 写 Node.js，则需要引入第三方声明文件：
`npm install @types/node --save-dev`
