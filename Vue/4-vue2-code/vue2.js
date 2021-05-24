// 代理 vm 中的 data 数据
function proxy(vm, key) {
  // 将 data 对象遍历
  Object.keys(vm[key]).forEach((k) => {
    // 依次放到 this (vue 实例)上
    Object.defineProperty(vm, k, {
      get() {
        return vm[key][k];
      },
      set(val) {
        vm[key][k] = val;
      },
    });
  });
}

// 将 obj 中所有数据进行响应式处理
function observe(obj) {
  if (obj !== null && typeof obj !== "object") {
    return;
  }
  new Observer(obj);
}

// 数组响应式，替换数组原型的 7 个方法
const originProto = Array.prototype;
const arrayProto = Object.create(originProto); // 复制数组原型

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

// 定义响应式函数
function defineReactive(obj, key, val) {
  // 递归遍历
  observe(val);

  const dep = new Dep();
  Object.defineProperty(obj, key, {
    get() {
      // 收集依赖
      Dep.target && dep.addDep(Dep.target);
      return val;
    },
    set(newVal) {
      if (newVal !== val) {
        // 保证如果newVal是对象，再次做响应式处理
        observe(newVal);
        val = newVal;
        // 触发更新
        dep.notify();
      }
    },
  });
}

class Vue {
  constructor(options) {
    this.$options = options;
    this.$data = options.data;

    // data 响应式处理
    observe(this.$data);

    // 代理，使data可以直接访问
    proxy(this, "$data");

    // new Compiler(options.el, this);

    if (options.el) {
      this.$mount(options.el);
    }
  }

  $mount(el) {
    this.$el = document.querySelector(el);
    const updateComponent = () => {
      const { render } = this.$options;
      const vnode = render.call(this, this.$createElement);
      this._update(vnode);
    };

    // 创建一个 watchwer 实例，一个组件一个 watcher
    new Watcher(this, updateComponent);
  }

  $createElement(tag, props, children) {
    return { tag, props, children };
  }

  // 将 虚拟 dom 变成真实 dom
  _update(vnode) {
    const prevVnode = this._vnode; // 老的 vnode
    if (!prevVnode) {
      // 初始化
      this.__patch__(this.$el, vnode); // 新增
    } else {
      this.__patch__(prevVnode, vnode);
    }
  }

  // 更新 dom
  __patch__(oldVnode, vnode) {
    // oldVnode 是 dom
    if (oldVnode.nodeType) {
      const parent = oldVnode.parentElement;
      const refEm = oldVnode.nextSibling;

      const el = this.createElm(vnode);
      parent.insertBefore(el, refEm);
      parent.removeChild(oldVnode);
    } else {
      const el = (vnode.el = oldVnode.el);
      // 简单判断，源码 sameVnode
      if (oldVnode.tag === vnode.tag) {
        // props 处理
        const oldProps = oldVnode.props || {};
        const newProps = vnode.props || {};
        for (const key in newProps) {
          const oldValue = oldProps[key];
          const newValue = newProps[key];

          // 属性更新
          if (oldValue !== newValue) {
            el.setAttribute(key, newValue);
          }
        }
        // 属性删除 - 老的里面有， 新的里面没有
        for (const key in oldProps) {
          if (!(key in newProps)) {
            el.removeAttribute(key);
          }
        }

        // children
        const oldChild = oldVnode.children;
        const newChild = vnode.children;
        if (typeof newChild === "string") {
          if (typeof oldChild === "string") {
            // 文本更新
            if (newChild !== oldChild) {
              el.textContent = newChild;
            }
          } else {
            el.textContent = newChild;
          }
        } else {
          // 老的是 文本, 新的是数组
          if (typeof oldChild === "string") {
            el.innerHTML = "";
            newChild.forEach((vnode) => this.createElm(vnode));
          } else {
            this.updateChildren(el, oldChild, newChild);
          }
        }
      }
    }
    this._vnode = vnode;
  }

  // 递归创建 dom 树
  createElm(vnode) {
    const el = document.createElement(vnode.tag);

    // props
    if (vnode.props) {
      for (const key in vnode.props) {
        el.setAttribute(key, vnode.props[key]);
      }
    }

    // children
    if (vnode.children) {
      if (typeof vnode.children === "string") {
        el.textContent = vnode.children;
      } else {
        vnode.children.forEach((vnode) => {
          const child = this.createElm(vnode);
          el.appendChild(child);
        });
      }
    }
    vnode.el = el;
    return el;
  }

  // 更新孩子节点
  updateChildren(parentEl, oldChild, newChild) {
    const len = Math.min(oldChild, newChild);
    // 遍历较短的数组
    for (let i = 0; i < len; i++) {
      this.__patch__(oldChild[i], newChild[i]);
    }

    // 新子节点更长，新增
    if (newChild.length > oldChild.length) {
      newChild.slice(len).forEach((child) => {
        const el = this.createElm(child);
        parentEl.appendChild(el);
      });
    } else if (newChild.length < oldChild.length) {
      oldChild.splice(len).forEach((child) => {
        parentEl.removeChild(child);
      });
    }

    // 旧的子节点更长， 删除
  }
}

// 根据传⼊options类型做不同操作
class Observer {
  constructor(options) {
    this.options = options;

    Object.defineProperty(options, "__ob__", {
      value: this,
      enumerable: false,
      writable: true,
      configurable: true,
    });

    if (Array.isArray(options)) {
      // 数据处理，覆盖原型
      options.__proto__ = arrayProto;
      this.observeArray(options);
    } else {
      this.walk(options);
    }
  }

  // 遍历数据，定义响应式
  walk(obj) {
    Object.keys(obj).forEach((key) => {
      defineReactive(obj, key, obj[key]);
    });
  }

  // 数组响应式处理
  observeArray(items = []) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  }
}

// 监听器：负责依赖更新
class Watcher1 {
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

  update() {
    this.updateFn.call(this.vm, this.vm[this.key]);
  }
}
class Watcher {
  constructor(vm, expOrFn) {
    this.vm = vm;
    this.getter = expOrFn;

    // 依赖收集触发
    this.get();
  }

  get() {
    Dep.target = this;
    this.getter.call(this.vm);
    Dep.target = null;
  }

  update() {
    this.get();
  }
}

class Compiler {
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
          if (attrName.startsWith("v-")) {
            const dir = attrName.substring(2);
            // 执行对应指令的方法
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

      if (node.childNodes && node.childNodes.length > 0) {
        this.compile(node.childNodes);
      }
    });
  }

  // 是否插值表达式
  isInterpolation(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
  }

  // update 集合
  update(node, exp, dir) {
    const fn = this[dir + "Updater"];
    // 初始化
    fn && fn(node, this.$vm[exp]);

    // 2. 更新
    new Watcher1(this.$vm, exp, function (val) {
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

  // 定义指令 v-model
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

class Dep {
  constructor() {
    this.deps = new Set(); // 不重复
  }
  addDep(dep) {
    this.deps.add(dep);
  }
  notify() {
    this.deps.forEach((dep) => dep.update());
  }
}
