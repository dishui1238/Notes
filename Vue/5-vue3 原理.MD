<!--
 * @Author: your name
 * @Date: 2021-05-20 06:30:11
 * @LastEditTime: 2021-05-24 10:58:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /Github/Notes/Vue/5-vue3 原理.MD
-->

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

## Vue3

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
