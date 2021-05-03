/*
 * @Author: your name
 * @Date: 2021-05-03 10:10:11
 * @LastEditTime: 2021-05-03 16:47:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /Github/Notes/Vue/4-vue-code/vue.js
 */

// 代理 vm 实例中的 data 数据
function proxy(vm) {
  Object.keys(vm.$data).forEach((key) => {
    Object.defineProperty(vm, key, {
      get() {
        return vm.$data[key];
      },
      set(newData) {
        vm.$data[key] = newData;
      },
    });
  });
}

// 对 obj 中所有的数据做响应式处理
function observe(obj) {
  if (obj !== null && typeof obj !== "object") {
    return;
  }
  new Observer(obj);
}

// 定义响应式，data 中所有数据都需要在此定义
// get 时收集依赖，set 时触发视图更新
function defineReactive(obj, key, value) {
  observe(value);

  const dep = new Dep();
  Object.defineProperty(obj, key, {
    get() {
      Dep.target && dep.addDep(Dep.target);
      return value;
    },
    set(newVal) {
      if (newVal !== value) {
        // 保证如果newVal是对象，再次做响应式处理
        observe(newVal);
        value = newVal;
        dep.notify();
      }
    },
  });
}

class Vue {
  constructor(options) {
    this.$options = options;
    this.$data = options.data || {};

    // data 响应式处理
    observe(this.$data);

    // 代理， 使 data 可以直接访问其中的数据 {{counter}}
    proxy(this);

    // 编译模板，初始化视图
    new Compile(options.el, this);
  }
}

// 数组响应式
// 1. 替换数组原型中的 7 个方法
const originProto = Array.prototype;
// 备份一份，修改备份
const arrayProto = Object.create(originProto);
["push", "pop", "shift", "unshift", "splice", "reverse", "sort"].forEach(
  (method) => {
    arrayProto[method] = function () {
      // 原始操作
      originProto[method].apply(this, arguments);
      // todo: 覆盖操作：通知更新
      // const ob = this.__ob__
      // ob.dep.notify()
    };
  }
);
class Observer {
  constructor(options) {
    this.options = options;

    if (Array.isArray(options)) {
      // 覆盖原型，替换数组的 7 个变更操作
      options.__proto__ = arrayProto;
      this.walk(options);
    } else {
      this.walk(options);
    }
  }

  walk(obj) {
    Object.keys(obj).forEach((key) => {
      defineReactive(obj, key, obj[key]);
    });
  }
}

// 依赖收集
class Dep {
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

// 编译模板、初始化视图
class Compile {
  constructor(el, vm) {
    this.$vm = vm;
    this.$el = document.querySelector(el);

    if (this.$el) {
      this.compile(this.$el);
    }
  }

  compile(el) {
    // Node.childNodes 返回包含指定节点的子节点的集合，该集合为即时更新的集合
    // NodeList 不是一个数组，是一个类似数组的对象
    // 可以使用 forEach() 来迭代。你还可以使用 Array.from() 将其转换为数组
    const childNodes = el.childNodes || [];

    childNodes.forEach((node) => {
      // nodeType = 1 元素节点, 2 属性节点, 3 元素或属性中的文本内容
      const attrs = node.attributes;
      if (node.nodeType === 1 && attrs && attrs.length > 0) {
        // 处理指令和事件
        Array.from(attrs).forEach((attr) => {
          const attrName = attr.name;
          const exp = attr.value;
          // 判断 指令 v- 打头
          if (attrName.startsWith("v-")) {
            const dir = attrName.substring(2);
            this[dir] && this[dir](node, exp);
          }
          if (attrName.startsWith("@")) {
            const dir = attrName.substring(1); // click exp="onClick"
            this.eventHandler(node, exp, dir);
          }
        });
      } else if (this.isInterpolation(node)) {
        // 插值表达式
        this.compileText(node);
      }

      // 递归
      if (node.childNodes && node.childNodes.length > 0) {
        this.compile(node);
      }
    });
  }

  // 更新集合
  update(node, exp, dir) {
    const fn = this[dir + "Updater"];
    // exp 为 data 中的数据
    // 1. 初始化
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

  model(node, exp) {
    // 1. 赋值和更新
    this.update(node, exp, "model");
    // 2. 事件监听
    node.addEventListener("input", (e) => {
      this.$vm[exp] = e.target.value;
    });
  }
  modelUpdater = (node, val) => {
    node.value = val;
  };

  // 是否插值表达式
  isInterpolation(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
  }

  compileText(node) {
    this.update(node, RegExp.$1, "text");
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

// 监听器： 负责依赖更新
class Watcher {
  constructor(vm, key, updateFn) {
    this.vm = vm;
    this.key = key;
    this.updateFn = updateFn;

    // 触发依赖收集 触发 get
    Dep.target = this;
    // 触发 get , 触发依赖收集
    this.vm[this.key];
    Dep.target = null;
  }

  // 被 Dep 调用
  update() {
    // 执行实际更新操作  this.vm 上下文  this.vm[this.key] 参数
    this.updateFn.call(this.vm, this.vm[this.key]);
  }
}
