<!--
 * @Author: your name
 * @Date: 2021-05-20 06:30:11
 * @LastEditTime: 2021-05-21 09:07:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /Github/Notes/Vue/5-vue3 原理.MD
-->

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
