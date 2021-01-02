<!--
 * @Author: your name
 * @Date: 2020-12-28 11:24:08
 * @LastEditTime: 2020-12-31 16:04:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \0dailyUpdateNotes\Notes\TS\ts进阶.md
-->

# 二、进阶

## 1.类型别名

类型别名用来给一个类型起个新名字。

```ts
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
function getName(n: NameOrResolver): Name {
  if (typeof n === "string") {
    return n;
  } else {
    return n();
  }
}
```

## 2.字符串字面量类型

字符串字面量类型用来约束取值只能是某几个字符串中的一个。

```ts
type EventNames = "click" | "scroll" | "mousemove";
function handleEvent(ele: Element, event: EventNames) {
  // do something
}

handleEvent(document.getElementById("hello"), "scroll"); // 没问题
handleEvent(document.getElementById("world"), "dblclick"); // 报错，event 不能为 'dblclick'

// index.ts(7,47): error TS2345: Argument of type '"dblclick"' is not assignable to parameter of type 'EventNames'.
```

类型别名与字符串字面量类型都是使用 type 进行定义.

## 3.元组

数组合并了相同类型的对象，而元组（Tuple）合并了不同类型的对象。
元组起源于函数编程语言（如 F#），这些语言中会频繁使用元组。
`let tom: [string, number] = ['Tom', 25];`

越界的元素:
当添加越界的元素时，它的类型会被限制为元组中每个类型的联合类型

```ts
let tom: [string, number];
tom = ["Tom", 25];
tom.push("male"); // ["Tom", 25, 'male']
tom.push(true);

// Argument of type 'true' is not assignable to parameter of type 'string | number'.
```

## 3.枚举

枚举使用 enum 关键字来定义：`enum Days {Sun, Mon, Tue, Wed, Thu, Fri, Sat};`
枚举成员会被赋值为从 0 开始递增的数字，同时也会对枚举值到枚举名进行反向映射

## 4.类

**public private 和 protected**

- public 修饰的属性或方法是公有的，可以在任何地方被访问到，默认所有的属性和方法都是 public 的
- private 修饰的属性或方法是私有的，不能在声明它的类的外部访问
- protected 修饰的属性或方法是受保护的，它和 private 类似，区别是它在子类中也是允许被访问的

```js
class Animal {
  static name;
  static age;
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}
let a = new Animal("Jack", 10);
console.log(a.name); // 'Jack'
console.log(a.age); // 10
```

```ts
class Animal {
  public name;
  private age;
  public constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}

let a = new Animal("Jack", 22);
console.log(a.name); // Jack
console.log(a.age);
a.name = "Tom";
console.log(a.name); // Tom
```
