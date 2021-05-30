<!--
 * @Author: your name
 * @Date: 2021-05-20 06:30:11
 * @LastEditTime: 2021-05-30 12:18:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /Github/Notes/Vue/5-vue3 原理.MD
-->

# Vue3

## Vue3 新特性

https://v3.cn.vuejs.org/guide/migration/introduction.html#%E6%A6%82%E8%A7%88

### 1. 组合式 API

1. setup

- setup 组件选项在创建组件之前执行
- setup 选项应该是一个接受 props 和 context 的函数

  - 因为 props 是响应式的，你不能使用 ES6 解构，因为它会消除 prop 的响应性

  ```js
  import { toRefs } from "vue";
  setup(props) {
    const { title } = toRefs(props)

    console.log(title.value)
  }
  ```

- setup 返回的所有内容都将暴露给组件的其余部分 (计算属性、方法、生命周期钩子等等) 以及组件的模板

2. 响应式变量

通过一个新的 ref 函数使任何响应式变量在任何地方起作用

```js
import { ref } from "vue";

const counter = ref(0);
```

3. 生命周期钩子注册在 setup 内部
   onMounted

4. 独立的 computed 属性

```js
// src/components/UserRepositories.vue `setup` function
import { fetchUserRepositories } from '@/api/repositories'
import { ref, onMounted, watch, toRefs } from 'vue'

// 在我们组件中
setup (props) {
  // 使用 `toRefs` 创建对prop的 `user` property 的响应式引用
  const { user } = toRefs(props)

  const repositories = ref([])
  const getUserRepositories = async () => {
    // 更新 `prop.user` 到 `user.value` 访问引用值
    repositories.value = await fetchUserRepositories(user.value)
  }

  onMounted(getUserRepositories)

  // 在用户 prop 的响应式引用上设置一个侦听器
  watch(user, getUserRepositories)

  const searchQuery = ref('')
  const repositoriesMatchingSearchQuery = computed(() => {
    return repositories.value.filter(
      repository => repository.name.includes(searchQuery.value)
    )
  })

  return {
    searchQuery,
    repositories,
    getUserRepositories
  }
}
```

## 2. Vue3

1. createApp 工厂函数

createApp(配置对象，rootProps)

```js
createApp({
  data() {
    foo: "123";
  },
  comonents: {},
})
  .component("comp", {
    template: <div>comp</div>,
  })
  .mount("#app");
```

2. 用了才会打包，不用不会打包
3. 在 vue3 中如果要使⽤ composition-api，就需要写在 setup()中，它是如何⽣效并和 options-api 和谐共处
   的？

```html
<div id="app">
  <h1>setup()如何⽣效</h1>
  <p>{{foo}}</p>
</div>
<script src="../../dist/vue.global.js"></script>
<script>
  const { createApp, h, ref } = Vue;
  createApp({
    // 定义根组件属性
    props:{
      foo:{
        type: 'string',
        default: ''
      }
    }
    setup(props, {emit, slots, attrs} /**ctx*/) {
      const foo = ref("hello, vue3!");
      return { foo, myFoo: props,foo };
    },
  }, {foo: bar}).mount("#app");
</script>
```

4. composition

reactive 响应式处理，传一个对象

```js
 const { createApp, reactive, computed } = Vue;
  createApp({
    setup(props, {emit, slots, attrs} /**ctx*/) {
      const state = reactive({
        couter: 0
        doubleCounter: computed(() => state.couter * 2)
      })
      return { state };
    },
  }, {foo: bar}).mount("#app");
```

## 3. Vue3 响应式原理

### Vue2 缺陷

1. vue2.0 不能对对象的 delete 操作符进行属性拦截。
2. vue2.0 不能对对象的 in 操作符进行属性拦截 `a in object`
3. 数组需要拦截原型方法实现响应式， 无法监听数组基于下标的修改
4. 对象上新增的属性没有响应式 `obj.a = 1`, 需要使用 `this.$set`，因为 `Object.defineProperty(obj, key, fn)` 必须预先知道要拦截的 key 是什么，这也就是为什么 Vue2 里对于对象上的新增属性无能为力
5. 不支持 Map、Set、WeakMap 和 WeakSet

### 1. Proxy

参考文章： https://www.bookstack.cn/read/es6-3rd/spilt.1.docs-proxy.md

```js
var handler = {
  get: function (target, name) {
    if (name === "prototype") {
      return Object.prototype;
    }
    return "Hello, " + name;
  },
  apply: function (target, thisBinding, args) {
    return args[0];
  },
  construct: function (target, args) {
    return { value: args[1] };
  },
};
var fproxy = new Proxy(function (x, y) {
  return x + y;
}, handler);
fproxy(1, 2); // 1
new fproxy(1, 2); // {value: 2}
fproxy.prototype === Object.prototype; // true
fproxy.foo === "Hello, foo"; // true
```

对于可以设置、但没有设置拦截的操作，则直接落在目标对象上，按照原先的方式产生结果。

下面是 Proxy 支持的拦截操作一览，一共 13 种。

- **get(target, propKey, receiver)**：拦截对象属性的读取，比如 `proxy.foo` 和 `proxy['foo']`， 参数依次为目标对象、属性名和 proxy 实例本身。
- **set(target, propKey, value, receiver)**：拦截对象属性的设置，比如` proxy.foo = v` 或 `proxy['foo'] = v`，返回一个布尔值。
- **has(target, propKey)**：拦截 `propKey in proxy` 的操作，返回一个布尔值。
- **deleteProperty(target, propKey)**：拦截 `delete proxy[propKey]`的操作，返回一个布尔值。
- **ownKeys(target)**：拦截 `Object.getOwnPropertyNames(proxy)`、`Object.getOwnPropertySymbols(proxy)`、`Object.keys(proxy)`、`for...in` 循环，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而 `Object.keys()`的返回结果仅包括目标对象自身的可遍历属性。
- **getOwnPropertyDescriptor(target, propKey)**：拦截 `Object.getOwnPropertyDescriptor(proxy, propKey)`，返回属性的描述对象。
- **defineProperty(target, propKey, propDesc)**：拦截 `Object.defineProperty(proxy, propKey, propDesc）`、`Object.defineProperties(proxy, propDescs)`，返回一个布尔值。
- **preventExtensions(target)**：拦截 `Object.preventExtensions(proxy)`，返回一个布尔值。
- **getPrototypeOf(target)**：拦截 `Object.getPrototypeOf(proxy)`，返回一个对象。
- **isExtensible(target)**：拦截 `Object.isExtensible(proxy)`，返回一个布尔值。
- **setPrototypeOf(target, proto)**：拦截 `Object.setPrototypeOf(proxy, proto)`，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。
- **apply(target, object, args)**：拦截 Proxy 实例作为函数调用的操作，比如 `proxy(...args)`、`proxy.call(object, ...args)`、`proxy.apply(...)`。
- **construct(target, args)**：拦截 Proxy 实例作为构造函数调用的操作，比如 `new proxy(...args)`。

### 2. Reflect

Reflect 对象的设计目的有这样几个：

1. 将 Object 对象的一些明显属于语言内部的方法（比如 Object.defineProperty），放到 Reflect 对象上。现阶段，某些方法同时在 Object 和 Reflect 对象上部署，未来的新方法将只部署在 Reflect 对象上。也就是说，从 Reflect 对象上可以拿到语言内部的方法。

2. 修改某些 Object 方法的返回结果，让其变得更合理。比如，`Object.defineProperty(obj, name, desc)`在无法定义属性时，会抛出一个错误，而 `Reflect.defineProperty(obj, name, desc)`则会返回 false。

3. 让 Object 操作都变成函数行为。某些 Object 操作是命令式，比如`name in obj`和`delete obj[name]`，而`Reflect.has(obj, name)`和`Reflect.deleteProperty(obj, name)`让它们变成了函数行为。

```js
// 老写法
"assign" in Object; // true
// 新写法
Reflect.has(Object, "assign"); // true
```

4. Reflect 对象的方法与 Proxy 对象的方法一一对应，只要是 Proxy 对象的方法，就能在 Reflect 对象上找到对应的方法。这就让 Proxy 对象可以方便地调用对应的 Reflect 方法，完成默认行为，作为修改行为的基础。也就是说，不管 Proxy 怎么修改默认行为，你总可以在 Reflect 上获取默认行为

```js
Proxy(target, {
  set: function (target, name, value, receiver) {
    var success = Reflect.set(target, name, value, receiver);
    if (success) {
      console.log("property " + name + " on " + target + " set to " + value);
    }
    return success;
  },
});
```

上面代码中，Proxy 方法拦截 target 对象的属性赋值行为。它采用 Reflect.set 方法将值赋值给对象的属性，确保完成原有的行为，然后再部署额外的功能。

### 3. WeakMap

1. Map: 传统上只能用字符串当作键, Map“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键. 也就是说，Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现。

2. WeakMap 与 Map 的区别有两点:
   - WeakMap 只接受对象作为键名（null 除外），不接受其他类型的值作为键名
   - WeakMap 的键名所指向的对象，不计入垃圾回收机制

### 4. 响应式原理

源码对应位置：packages/reactivity/src/effect.ts

```js
/**
 * 返回 proxy 对象
 * 如果目标对象是引用类型，需要递归处理；shallowReactive 不递归处理，只建立一层的响应式
 */
function reactive(obj){
  if(typeof obj !== 'object'){
    // 报错处理， reactive 接受对象
    return obj;
  }
  return new Proxy(obj){
    // 拦截取值操作
    get(target, key, receiver){
      console.log('get', key);
      // 触发依赖收集
      const res = Reflect.get(target, key, receiver)
      track(target, key)

      // 如果目标数据是对象，需要递归
      if(typeof obj === 'object'){
        return eactive(res)
      }

      return res
    },
    // 拦截赋值操作
    set(target, key, value, receiver){
      console.log('set', key)
      //  触发更新
      trigger(target, key)
      return Reflect.set(target, key, value,receiver)
    },

    // 拦截删除属性操作
    deleteProperty(target, key){
      console.log('deleteProperty', key)
      return Reflect.deleteProperty(target, key)
    }

  }
}
```

```js
/**
 * 收集依赖，建立 数据 -> 依赖[key -> effects] 的关系
 */
const targetMap = new WeakMap();
function track(target, key) {
  // 获取副作用(更新)函数
  const effect = effectStack[effectStack.length - 1];
  if (effect) {
    let depMap = targetMap.get(target);

    // 初始化时，depMap不存在
    if (!depMap) {
      depMap = new Map();
      targetMap.set(target, depMap);
    }

    // 从 depMap 中获取 effect 的集合
    let deps = depMap.get(key);

    // 初始化时 deps 不存在
    if (!deps) {
      deps = new Set(); // 去重, 保证 effect 函数只放进去一次
      depMap.set(key, deps);
    }
    // 放入新的副作用函数
    deps.add(effect);
  }
}
```

```js
/**
 * 触发副作用函数(更新)
 */

function trigger(target, key) {
  const depMap = targetMap.get(target);
  if (!depMap) return;
  const deps = depMap.get(key);

  // 循环执行内部所有 effect 函数
  if (deps) deps.forEach((dep) => dep());
}
```

```js
/**
 * 副作用函数
 */

// 存储副作用函数
const effectStack = [];
function effect(fn) {
  const e = createReactiveEffect(fn);
  // 立即执行
  e();
  return e;
}

function createReactiveEffect(fn) {
  const effect = function (...args) {
    try {
      effectStack.push(effect);
      return fn(...args);
    } finally {
      effectStack.pop();
    }
  };
  return effect;
}
```

与 vue2.0 不同的是,即便是深度响应式我们也只能在获取上一级 get 之后才能触发下一级的深度响应式。 比如

```js
setup(){
 const state = reactive({ a:{ b:{} } })
 return {
     state
 }
}
```

在初始化的时候，只有 a 的一层级建立了响应式，b 并没有建立响应式，而当我们用 state.a 的时候，才会真正的将 b 也做响应式处理，也就是说我们访问了上一级属性后，下一代属性才会真正意义上建立响应式

### 5. 总结

vue3.0 建立响应式的方法有两种：

- 第一个就是运用 composition-api 中的 reactive 直接构建响应式，composition-api 的出现我们可以在.vue 文件中，直接用 setup()函数来处理之前的大部分逻辑，也就是说我们没有必要在 export default{ } 中在声明生命周期 ， data(){} 函数，watch{} , computed{} 等 ，取而代之的是我们在 setup 函数中，用 vue3.0 reactive watch 生命周期 api 来到达同样的效果，这样就像 react-hooks 一样提升代码的复用率，逻辑性更强。

- 第二个就是用传统的 data(){ return{} } 形式 ,vue3.0 没有放弃对 vue2.0 写法的支持，而是对 vue2.0 的写法是完全兼容的，提供了 **applyOptions** 来处理 options 形式的 vue 组件。但是 options 里面的 data , watch , computed 等处理逻辑，还是用了 composition-api 中的 API 对应处理。

## 编译原理

