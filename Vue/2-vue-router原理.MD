# vue-router 原理

## 1. 相关知识

### vue 插件

[Vue2 文档](https://cn.vuejs.org/v2/guide/plugins.html#ad)
[Vue3 文档](https://v3.cn.vuejs.org/guide/plugins.html#%E7%BC%96%E5%86%99%E6%8F%92%E4%BB%B6)

#### vue2 使用插件

- Vue.use()方法用于插件安装，通过它可以将一些功能或 API 入侵到 Vue 内部；
- 它接收一个参数，如果这个参数有 install 方法，那么 Vue.use()会执行这个 install 方法，如果接收到的参数是一个函数，那么这个函数会作为 install 方法被执行
- install 方法在执行的时候也会接收到一个参数，这个参数就是当前 Vue 的实例

通过全局方法 Vue.use() 使用插件。它需要在你调用 new Vue() 启动应用之前完成：

```js
// 调用 `MyPlugin.install(Vue)`
Vue.use(MyPlugin);

new Vue({
  // ...组件选项
});
```

也可以传入一个可选的选项对象：

```js
Vue.use(MyPlugin, { someOption: true });
```

#### vue2 开发插件

> Vue.js 的插件应该暴露一个 install 方法。这个方法的第一个参数是 Vue 构造器，第二个参数是一个可选的选项对象

```js
MyPlugin.install = function (Vue, options) {
  // 1. 添加全局方法或 property
  Vue.myGlobalMethod = function () {
    // 逻辑...
  }

  // 2. 添加全局资源
  Vue.directive('my-directive', {
    bind (el, binding, vnode, oldVnode) {
      // 逻辑...
    }
    ...
  })

  // 3. 注入组件选项
  Vue.mixin({
    created: function () {
      // 逻辑...
    }
    ...
  })

  // 4. 添加实例方法
  Vue.prototype.$myMethod = function (methodOptions) {
    // 逻辑...
  }
}

```

### 混入 Mixin

[官方文档](https://v3.cn.vuejs.org/guide/mixins.html#%E5%9F%BA%E7%A1%80)

> Mixin 提供了一种非常灵活的方式，来分发 Vue 组件中的可复用功能。一个 mixin 对象可以包含任意组件选项。当组件使用 mixin 对象时，所有 mixin 对象的选项将被“混合”进入该组件本身的选项.

#### 选项合并

1. 当组件和 mixin 对象含有同名选项时，数据对象在内部会进行递归合并，并在发生冲突时以组件数据优先

```js
const myMixin = {
  data() {
    return {
      message: "hello",
      foo: "abc",
    };
  },
};

const app = Vue.createApp({
  mixins: [myMixin],
  data() {
    return {
      message: "goodbye",
      bar: "def",
    };
  },
  created() {
    console.log(this.$data); // => { message: "goodbye", foo: "abc", bar: "def" }
  },
});
```

2. 同名钩子函数将合并为一个数组，因此都将被调用。另外，mixin 对象的钩子将在组件自身钩子之前调用。

```js
const myMixin = {
  created() {
    console.log("mixin 对象的钩子被调用");
  },
};

const app = Vue.createApp({
  mixins: [myMixin],
  created() {
    console.log("组件钩子被调用");
  },
});

// => "mixin 对象的钩子被调用"
// => "组件钩子被调用"
```

3. 值为对象的选项，例如 methods、components 和 directives，将被合并为同一个对象。两个对象键名冲突时，取组件对象的键值对。

```js
const myMixin = {
  methods: {
    foo() {
      console.log("foo");
    },
    conflicting() {
      console.log("from mixin");
    },
  },
};

const app = Vue.createApp({
  mixins: [myMixin],
  methods: {
    bar() {
      console.log("bar");
    },
    conflicting() {
      console.log("from self");
    },
  },
});

const vm = app.mount("#mixins-basic");

vm.foo(); // => "foo"
vm.bar(); // => "bar"
vm.conflicting(); // => "from self"
```

#### 全局 mixin

Mixin 也可以进行全局注册。使用时格外小心！一旦使用全局 mixin，它将影响每一个之后创建的组件 (例如，每个子组件)。_推荐将其作为插件发布，以避免重复应用 mixin。_

Vue3 写法：

```js
const app = Vue.createApp({
  myOption: "hello!",
});

// 为自定义的选项 'myOption' 注入一个处理器。
app.mixin({
  created() {
    const myOption = this.$options.myOption;
    if (myOption) {
      console.log(myOption);
    }
  },
});

// 将myOption也添加到子组件
app.component("test-component", {
  myOption: "hello from component!",
});

app.mount("#mixins-global");

// => "hello!"
// => "hello from component!"
```

Vue2 写法

```js
// 为自定义的选项 'myOption' 注入一个处理器。
Vue.mixin({
  created: function () {
    var myOption = this.$options.myOption;
    if (myOption) {
      console.log(myOption);
    }
  },
});

new Vue({
  myOption: "hello!",
});
// => "hello!
```

#### 自定义选项合并策略 Vue.config.optionMergeStrategies

### render

[官方文档](https://cn.vuejs.org/v2/guide/render-function.html)

**类型**：`(createElement: () => VNode) => VNode`

字符串模板的代替方案，允许你发挥 JavaScript 最大的编程能力。该渲染函数接收一个 createElement 方法作为第一个参数用来创建 VNode，约定它的简写叫 h。

1. createElement 第一个参数是必填的，可以是 String | Object | Function

```js
    render: function (createElement) {
      // String
      return createElement('h1');

      //Object
      return createElement({
        template: "<div>qwqwq</div>"
      })

      // Function
      let domFun = function () {
        return {
          template: "<div>qwqwq</div>"
        }
      }
      return createElement(domFun())
    }
```

### Vue.util.defineReactive

**defineReactive**：监听变量，使其变成响应式

```js
/**
 * Define a reactive property on an Object.
 */
//Vue的data监听，也是通过这个方法
function defineReactive(obj, key, val, customSetter, shallow) {
  // Dep的作用就是用来收集属性值的变化，一旦set方法触发的时候，就更新视图。
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return;
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  var childOb = !shallow && observe(val);
  //双向绑定
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        //进行依赖收集
        dep.depend();
        /*采用依赖收集的原因：*/
        //1.data里面的数据并不是所有地方都要用到
        //2.如果我们直接更新整个视图，会造成资源浪费
        //3.将依赖于某个变量的组件收集起来
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value;
    },
    set: function reactiveSetter(newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return;
      }
      /* eslint-enable no-self-compare */
      if (customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) {
        return;
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      //触发依赖的组件产生更新
      dep.notify();
    },
  });
}
```

## 2. vue-router 原理

### 需求分析

单⻚⾯应⽤程序中，url 发⽣变化时候，不能刷新，显示对应视图内容

- spa ⻚⾯不能刷新

  - hash #/about
  - History api /about

- 根据 url 显示对应的内容

  - router-view
  - 数据响应式：current 变量持有 url 地址，⼀旦变化，动态重新执⾏ render

### 实现

```js
// 1.插件
// 2.两个组件

// vue插件：
// function
// 要求必须有一个install，将来会被Vue.use调用
let Vue; // 保存Vue构造函数，插件中要使用，不导入还能用
class VueRouter {
  constructor(options) {
    this.$options = options;
    this.matched = [];
    this.current = window.location.hash.slice(1) || "/";

    // 将来发生变化，router-view的render函数能够再次执行
    Vue.util.defineReactive(this, "matched", []);
    // 监控 hash 变化 hash变化的时候更新current，从而触发router-view组件的重新渲染
    window.addEventListener("hashchange", this.onHashChange.bind(this));
    // 初始执行一次
    this.match();
  }

  onHashChange() {
    this.current = window.location.hash.slice(1);
    console.log("this.current", this.current);
    this.matched = []; // 保存匹配的路由数组
    this.match();
  }

  // 递归遍历routes，获取当前hash匹配的路由
  match(routes) {
    routes = routes || this.$options.routes;
    for (const key in routes) {
      const route = routes[key];
      if (route.path === "/" && this.current === "/") {
        this.matched.push(route);
        return;
      }
      if (route.path !== "/" && this.current.indexOf(route.path) !== -1) {
        this.matched.push(route);
        if (route.children) {
          this.match(route.children);
        }
      }
    }
  }
}

export default VueRouter;
```

```js
import View from "xxx";
import Link from "xxx";
// 参数1是Vue.use调用时传入的
let Vue;
VueRouter.install = function (_Vue) {
  Vue = _Vue;

  // 1.挂载$router属性
  // this.$router.push()
  // 全局混入目的：延迟下面逻辑到router创建完毕并且附加到选项上时才执行
  Vue.mixin({
    beforeCreate() {
      /**
       * 此钩子在每个组件创建实例时都会调用， 根实例才有该选项
       * options是 new Vue 的参数，我们一般称之为选项或者构造选项
       */
      if (this.$options.router) {
        Vue.prototype.$router = this.$options.router;
      }
    },
  });
  Vue.component("RouterView", View);
  Vue.component("RouterLink", Link);
};
```

```js
// 2.注册实现两个组件router-view,router-link
export default {
  name: "Link",
  props: {
    to: {
      type: String,
      required: true,
    },
  },
  render(h) {
    // <a href="to">xxx</a>
    // return <a href={'#'+this.to}>{this.$slots.default}</a>
    return h(
      "a",
      {
        attrs: {
          href: "#" + this.to,
        },
      },
      this.$slots.default
    );
  },
};
```

```js
export default {
  name: "View",
  render(h) {
    this.$vnode.data.routerView = true;

    // 标记当前 router-view 深度
    let depth = 0;
    let parent = this.$parent;
    while (parent) {
      const vnodeData = parent.$vnode && parent.$vnode.data;
      if (vnodeData && vnodeData.routerView) {
        depth++;
      }
      parent = parent.$parent;
    }

    console.log("depth", depth, this.$router);

    // 获取当前路由对应的组件
    let component = null;
    const route = this.$router.matched[depth];
    if (route) {
      component = route.component;
    }

    return h(component);
  },
};
```
