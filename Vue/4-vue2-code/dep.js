/*
 * @Author: your name
 * @Date: 2021-05-21 14:49:44
 * @LastEditTime: 2021-05-21 14:50:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /Github/vue-1/examples/test/Myvue2/dep.js
 */

export default class Dep {
  constructor() {
    this.deps = [];
  }
  addDep(dep) {
    this.deps.push(dep);
  }
  notify() {
    this.deps.forEach((dep) => dep.update());
  }
}
