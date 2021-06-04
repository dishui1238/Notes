<!--
 * @Author: your name
 * @Date: 2021-06-02 20:11:53
 * @LastEditTime: 2021-06-03 22:05:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /Notes/summary/2021/js 异步模式.MD
-->

当前调用栈执行完毕，event loop 才会查看消息队列并（放入调用栈）执行

## 回调函数

所有异步方案的根基

55，22，4，6，3，1

## promise

## generator

github: tj/co

```js
function* func1{
  yield '1111'
}
func1()
```

函数调用的返回值是一个遍历器(迭代器)对象

## 手写 promise

```js
const FULFILLED = "fulfilled";
const PENDING = "pending";
const REJECT = "reject";

class MyPromise {
  constructor(executor) {
    executor(this.resolve, this.reject);
  }

  status = PENDING;
  value = undefined;
  err = undefined;

  resolve = (value) => {
    if (this.status !== PENDING) return;
    this.status = FULFILLED;
    this.value = value;
    this.successCb && this.successCb(this.value);
  };
  reject = (err) => {
    this.status = REJECT;
    this.err = err;
    this.failCb && this.failCb(this.err);
  };

  successCb = undefined;
  failCb = undefined;

  then = (successCb, failCb) => {
    if (this.status === "FULFILLED") {
      successCb(this.value);
    } else if (this.status === "REJECT") {
      failCb(this.err);
    } else {
      this.successCb = successCb;
      this.failCb = failCb;
    }
  };
}
```

promise A+ 规范
