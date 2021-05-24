/*
 * @Author: your name
 * @Date: 2021-05-21 14:43:33
 * @LastEditTime: 2021-05-21 16:12:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /Github/vue-1/examples/test/Myvue2/compiler.js
 */
import { Watcher } from "./vue2";
// 编译模板，初始化视图
export default class Compiler {
  constructor(el, vm) {
    this.$vm = vm;
    this.$el = document.querySelector(el);

    if (this.$el) {
      this.compile(this.$el);
    }
  }

  compile(el) {
    const childNodes = el.childNodes || [];

    childNodes.forEach((node) => {
      // nodeType = 1 元素节点, 2 属性节点, 3 元素或属性中的文本内容
      const attrs = node.attributes;
      // 元素节点， 处理 指令 和 事件
      if (node.nodeType === 1 && attrs && attrs.length > 0) {
        Array.from(attrs).forEach((attr) => {
          const attrName = attr.name;
          const exp = attr.value; // 表达式
          if (attrName.startsWidth("v-")) {
            const dir = attrName.substring(2);
            // 执行对应指令的方法
            this[dir] && this[dir](node, exp);
          }
          if (attrName.startsWith("@")) {
            const dir = attrName.substring(1); // click exp="onClick"
            this.eventHandler(node, exp, dir);
          }
        });
      }

      if (node.childNodes && node.childNodes.length > 0) {
        this.compile(node.childNodes);
      }
    });
  }

  // update 集合
  update(node, exp, dir) {
    const fn = this[dir + "Updater"];
    // 初始化
    fn && fn(node, this.$vm[exp]);

    // 2. 更新
    new Watcher(this.$vm, exp, function (val) {
      fn && fn(node, val);
    });
  }

  // 定义指令 v-text
  text(node, exp) {
    this.update(node, exp, "text");
  }
  textUpdater(node, val) {
    node.textContent = val;
  }

  // 定义指令 v-html
  html(node, exp) {
    this.update(node, exp, "html");
  }
  htmlUpdater(node, val) {
    node.innerHTML = val;
  }

  /**
   * @description: 事件处理
   * @param {*} node 节点
   * @param {*} exp 事件名称 onClick
   * @param {*} dir 指令 click
   * @return {*}
   */
  eventHandler(node, exp, dir) {
    const fn = this.$vm.$options.methods && this.$vm.$options.methods[exp];
    // ! 绑定 this.$vm
    node.addEventListener(dir, fn.bind(this.$vm));
  }
}
