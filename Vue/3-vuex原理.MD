<!--
 * @Author: your name
 * @Date: 2021-04-26 20:38:31
 * @LastEditTime: 2021-04-29 22:02:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /Github/Notes/Vue/3-vuex原理.MD
-->

## 分析

需要实现功能：

- state 状态、数据
- mutations 更改状态的函数
- actions 异步操作
- store 包含以上概念的容器

## 原理实现

```js
let Vue;
class Store{
    // Vue 实例被创建时，它将 data 对象中的所有的 property 加入到 Vue 的响应式系统中。当这些 property 的值发生改变时，视图将会产生“响应”，即匹配更新为新的值

    // options 为 new Vuex.Store 时传入的数据 {state: {…}, getters: {…}, mutations: {…}, actions: {…}}
  constructor(options) {
    this._mutations = options.mutations;
    this._actions = options.actions;
    this._wrappedGetters = options.getters;

    this.commit = this.commit.bind(this);
    this.dispatch = this.dispatch.bind(this);
    this.getters = {}; // 仓库上面挂载一个getters, 暴露给用户
    const computed = {}; // {doubleCounter: doubleCounter(){return state.counter * 2}}
    // $store.getters.doubleCounter
    const store = this;
    Object.keys(this._wrappedGetters).forEach((key) => {
      const fn = store._wrappedGetters[key];

      // 转化为 computed 可以转化为无参数形式
      computed[key] = function() {
        return fn(store.state);
      };
      // 为 getters 定义只读属性
      Object.defineProperty(store.getters, key, {
        get: () => {
          return store._vm[key];
        },
      });
    });

    // data响应式处理
    // this.$store.state.xx
    this._vm = new Vue({
      data: {
        $$state: options.state,
      },
      computed,
    });
  }

    get state(){
      // _vm._data === _vm.$data === _vm.data
      return this._vm._data.$$state;
    }

    // 不准许直接更改
    set state(v) {
      console.error('please use replaceState to reset state');
    }

    // this.$store.commit(), 实现 commit
    commit(type, payload)(){
      // 获取对应的 mutation
      const entry = this._mutations[type];
      if (!entry) {
        console.error(`unknown mutation type: ${type}`);
        return;
      }
      entry(this.state, payload);
    }

    /**
     * 使用 getters
     * $store.getters.doubleCounter
     *
     * export default new Vuex.Store({
     *    getters: {
     *        doubleCounter(state) { // 计算剩余数量
     *            return state.counter * 2;
     *         }
     *    }
     * )}
     *
    */
    /**
     * actions: {
     *  add: ({commit}){
     *    setTimeout(() => {commit('add')}, 3000)
     *  }
     * }
    */
    // 实现 dispatch
    dispatch(type, payload)(){
      const entry = this._actions[type];
      if (!entry) {
        console.error(`unknown action type: ${type}`);
        return;
      }
      entry(this, payload);
    }
  }
```

```js
let Vue;
function install(_Vue) {
  Vue = _Vue;
  // 组件创建的过程是 先父后子
  Vue.mixin({
    beforeCreate() {
      // 含有 this.$options.store 的是根实例
      console.log("this.$options", this.$options);
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store;
      }
    },
  });
}
// new Vuex.Store({})
export default { Store, install };
```

## 总结

Vuex 的 state 状态是响应式，是借助 vue 的 data 是响应式，将 state 存入 vue 实例组件的 data 中；Vuex 的 getters 则是借助 vue 的计算属性 computed 实现数据实时监
