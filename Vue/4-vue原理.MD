## 1.Vue 设计思想

<img src="./imgs/vue-MVVM.jpg">

**MVVM 框架的三要素：数据响应式、模板引擎及其渲染**

- 数据响应式：监听数据变化并在视图中更新
  - Object.defineProperty()
  - Proxy
- 模版引擎：提供描述视图的模版语法
  - 插值：{{}}
  - 指令：v-bind，v-on，v-model，v-for，v-if
- 渲染：如何将模板转换为 html
  - 模板 => vdom => dom

## 数据响应式原理

defineReactive 函数实现

1. defineProperty 对对象进行拦截处理，更新数据时更新视图
2. 嵌套对象响应式处理，需要递归遍历

```js
const obj = { foo: "foo", bar: "bar", baz: { a: 1 } };
```

3. 赋值为对象问题处理

```js
const obj = {};
obj.baz = { a: 1 };
obj.baz.a = 10; // no ok
```

4. 数组 - defineProperty() ⽆法感知数组的 push、pop、shift、unshift、splice、reverse、sort (7 个)⽅法对数组的修改，vue 采用将这些方法重写，

```js
// 1.定义响应式
function defineReactive(obj, key, val) {
  // 递归遍历
  observe(val);
  Object.defineProperty(obj, key, {
    get() {
      console.log("get", key);
      return val;
    },
    set(newVal) {
      if (newVal !== val) {
        console.log("get", key);
        val = newVal;
        update(); // 更新视图
      }
    },
  });
}

//  2. 处理第二个问题 递归遍历
function observe(obj) {
  if (obj === null || typeof obj !== "object") {
    return;
  }
  // 遍历对象中的所有属性，响应式处理
  Object.keys(obj).forEach((key) => {
    defineReactive(obj, key, val);
  });
}

// 3. 处理第三个问题
function set(obj, key, val) {
  defineReactive(obj, key, val);
}

// 更新视图函数
function update() {
  div.innerText = obj.foo;
}

const obj = {
  bar: {
    a: 1,
  },
};
defineReactive(obj, "foo", "foo");
obj.foo = new Date().toLocaleTimeString();

//  1.测试 对象响应式、视图更新
setInterval(() => {
  obj.foo = new Date().toLocaleTimeString();
}, 1000);

conso.log(obj.foo);

// 2. 测试 嵌套对象的响应式
obj.bar.a = "barrrrrrr";
console.log(obj.bar.a); // barrrrrrr

// 3. 测试
let obj2 = { a: 1 };
// obj2.baz = { b: 10 }; // 不能使用这种直接赋值方式
set(obj2, "baz", { b: 10 });
console.log(obj2.baz.b); //
```

## 依赖收集

详细代码见， `4-vue-code` 里面添加了详细的注解
