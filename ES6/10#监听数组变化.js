// 在前端的 MVVM 框架当中，我们经常需要监听数据的变化，而数组是需要监听的重要对象。
// 请你完成 ObserverableArray，它的实例和普通的数组实例功能相同，但是当调用：
// push,pop,shift,unshift,splice,sort,reverse
// 这些方法的时候，除了执行相同的操作，还会把方法名打印出来。

function ObserverableArray(...args) {
    // console.log(...args);

    return new Proxy(new Array(...args), {
        // get参数：目标对象，访问的属性
        get(target, propKey) {
            const res = target[propKey]
            if (typeof res == 'function') {
                return function (...args) {
                    console.log(propKey);
                    return res.apply(this, args)
                }
            }
            return res
        }
    })
}

let arr = ObserverableArray(1, 2, 3)
// console.log(arr);
arr.push(4, 5, 6, 7, 8);
arr.sort()


// const target = Object.defineProperties({}, {
//     foo: {
//         value: 123,
//         writable: false,
//         configurable: false
//     }
// })

// let ObserverableArray = new Proxy(function () {
//     return 'hello'
// }, {
//     // get方法的第三个参数的例子，它总是指向原始的读操作所在的那个对象，一般情况下就是 Proxy 实例。
//     // get: function (target, key, receiver) {
//     //     console.log(target); //{}
//     //     console.log(key);
//     //     return receiver
//     // },
//     // set: function (target, propKey, value, receiver) {
//     //     console.log(target); //{}
//     //     console.log(propKey); //foo
//     //     console.log(value); //2
//     //     // console.log(receiver);
//     // },
//     apply: function (target, ctxs, args) {
//         console.log(target);
//         console.log(ctxs);
//         console.log(args);
//         return 1
//     }
// })
// // console.log(ObserverableArray.bar === ObserverableArray); //true
// // console.log(ObserverableArray.bar);
// // ObserverableArray.foo;
// ObserverableArray()
// ObserverableArray.apply(null,[1,2])

// var target1 = function () {
//     return 'I am the target';
// };
// var handler = {
//     apply: function () {
//         return 'I am the proxy';
//     }
// };

// var p = new Proxy(target1, handler);

// console.log(p());