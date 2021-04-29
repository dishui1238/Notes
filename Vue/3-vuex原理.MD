<!--
 * @Author: your name
 * @Date: 2021-04-26 20:38:31
 * @LastEditTime: 2021-04-29 14:14:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /Github/Notes/Vue/3-vuex原理.MD
-->

```js
let Vue;
class Store{
  constructor(options = {}){
    // Vue 实例被创建时，它将 data 对象中的所有的 property 加入到 Vue 的响应式系统中。当这些 property 的值发生改变时，视图将会产生“响应”，即匹配更新为新的值

    // 嵌套两层是为了隐藏数据，不被用户拿到
    this._vm = new Vue({
      data: {
        $$state: options.state;
      }
    })
    this._mutations = options.mutations || {};
    this._actions = options.actions || {};
    this._getters = options.getters || {};

    // 绑定commit上下⽂否则action中调⽤commit时可能出问题!!
    // 同时也把action绑了，因为action可以互调
    this.commit = function boundCommit(type, payload) {
                    commit.call(store, type, payload)
                  };
    this.action = function boundAction(type, payload) {
                    action.call(store, type, payload)
                  };

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
    // 实现 getters
    getters(type, payload){
      const entry = this._getters[type]
    }

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
}

function install(_Vue){
  Vue = _Vue;
  Vue.mixin({
    beforeCreate(){
      if(this.$options.store){
        Vue.prototype.$store = this.$options.store;
      }
    }
  })
}
// new Vuex.Store({})
export default { Store, install };
```
