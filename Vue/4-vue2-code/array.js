/*
 * @Author: your name
 * @Date: 2021-05-21 14:46:54
 * @LastEditTime: 2021-05-21 14:46:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /Github/vue-1/examples/test/Myvue2/array.js
 */

// 数组响应式，替换数组原型的 7 个方法
const originProto = Array.prototype;
export const arrayProto = Object.create(originProto); // 复制数组原型

["push", "pop", "shift", "unshift", "splice", "reverse", "sort"].forEach(
  (method) => {
    const ob = this.__ob__;
    arrayProto[method] = function () {
      originProto[method].apply(this, arguments);
      // 通知更新
      ob.dep.notify();
    };
  }
);
