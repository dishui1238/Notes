## react fiber

为了使 react 渲染过程中可以被中断， 可以将控制权交给浏览器，可以让位给高优先级的任务，浏览器空闲后再恢复渲染。

对于计算量比较大的 js 计算或 dom 计算，就不会显得特别卡顿，而是一帧一帧的有规律执行任务。

```js
const task = [];

function run() {
  let task;
  while ((task = task.shift())) {
    excute(task);
  }
}
```

generator

```js
const task = [];

function* run() {
  let task;
  while ((task = task.shift())) {
    if (hasHighPritorityTask()) {
      yield;
    }
    excute(task);
  }
}

const interator = run();
interator.next();
```

1. generator 有类似的功能，为什么不直接使用？

- 要使用 generator，需要将涉及到的所有代码都包装成 generator 的形式，麻烦，工作量大。
- generator 内部是有状态的

```js
function doWork(a, b, c) {
  const x = deExpensiveWorkA(a);
  yield;
  const y = deExpensiveWorkB(b);
  yield;
  const z = deExpensiveWorkC(c);
  return z;
}
```

2. 如何判断当前是否有高优任务呢？

当前 js 的环境其实并没有办法去判断是否有高优任务。

只能约定一个合理的执行时间，当超过了这个时间，如任务仍没有完成，中断当前任务，将控制权交给浏览器

每秒 60 帧， 1000ms/60f = 16ms.

requestIdleCallback

使浏览器在有空的时候执行回调，回调会传入一个参数，表示浏览器有多少时间执行任务。

3. 浏览器要在一帧内做什么事情？

- 处理用户输入事件
- JS 的执行
- requestAnamation 调用
- 布局 layout
- 绘制 paint

4. 浏览器很忙怎么办？

- requestIdleCallback timeout 参数，如果超过 timeout 后还没有被执行，会在下一帧强制执行回调

5. 兼容性如何？

- requestIdleCallback 兼容性很差，通过 messageChannel 模拟实现了 requestIdleCallback 功能

6. timeout 超时后就一定要被执行吗？

   不是的， react 里预定了 5 个优先级的等级

   - Immediate 最高优先级， 这个游戏那几的任务一个马上执行不能中断
   - UserBlocking 这些任务一般是用户交互的结果，需要即时得到反馈
   - Normal 不需要用户立即就感受到变化，比如网络请求
   - Low 这些任务可以延后，但最终也需要被执行
   - Idle 可以被无限期延后

## 平时用过高阶组件吗? 什么是高阶组件？高阶组件能用来做什么？

HOC 是一个函数，参数是一个组件，返回一个组件行

## react hooks 有什么优势？

class 缺点：

1. 组件间的状态逻辑很难复用
2. 复杂业务的有状态组件会越来越复杂
3. 监听和定时器的操作，被分散在多个区域

didMount: document.addEventListener('xxx')
unMount: document.removeEventListener('xxx')

4. this 指向问题

```js

```

hooks 优点：

1. 利于业务逻辑的封装和拆分，可以非常自由的组合各种自定义的 hooks
2. 可以在无需修改组件结构的情况下，复用状态逻辑
3. 定时器、监听都被聚合到同一块代码下

hooks 使用注意事项：

1. 只能在函数内部的最外层调用 hook，不要在循环、条件判断或者子函数中调用
   why: 索引很重要，取值会出现偏移

```js
const [count, setCount] = useState(0);

let stateArray = [];
let cursor = 0;
function useState(initialState) {
  const currentCursor = cursor;
  stateArray[currentCursor] = stateArray[currentCursor] || initialState;
  function setState(newState) {
    stateArray[currentCursor] = newState;
    render();
  }
  ++cursor;
  return [stateArray[currentCursor], setState];
}
```

```js
const allDeps = []; // 二维数组
let currentCursor = 0;

function useEffect(callback, depArray = []) {
  if (!depArray) {
    callback();
    allDeps[currentCursor] = depArray;
    currentCursor++;
    return;
  }
  // 代表上一次存储的依赖项
  const deps = allDeps[currentCursor];
  const hasChange = deps ? depArray.some((el, i) => el !== deps[i]) : true;
  if (hasChange) {
    callback();
    allDeps[currentCursor] = depArray;
  }
  currentCursor++;
}
```

2. 只能在 react 的函数组件中调用 hook

自定义 hook 怎么操作组件的？
