// 在前端的 MVVM 框架当中，我们经常需要监听数据的变化，而数组是需要监听的重要对象。
// 请你完成 ObserverableArray，它的实例和普通的数组实例功能相同，但是当调用：
// push,pop,shift,unshift,splice,sort,reverse
// 这些方法的时候，除了执行相同的操作，还会把方法名打印出来。

var obj = new Proxy({}, {
    get: function (target, key, receiver) {
        console.log(`getting ${key}!`);
        return Reflect.get(target, key, receiver);
    },
    set: function (target, key, value, receiver) {
        console.log(`setting ${key}!`);
        return Reflect.set(target, key, value, receiver);
    }
});

obj.count = 1
    ++obj.count

// var object = {
//     proxy: new Proxy(target, handler)
// };

// object.proxy.target = {}
// object.proxy.handler = {
//     get: function (target, key, value) {
//         console.log(target, key, value);
//     }
// }

var person = {
    name: "张三"
};

var proxy = new Proxy(person, {
    get: function (target, property, receiver) {
        if (property in target) {
            console.log(target)
            console.log(property)
            // console.log(receiver)
        } else {
            throw new ReferenceError("Property \"" + property + "\" does not exist.");
        }
    }
});

proxy.name // "张三"


function createArray(...elements) {
    let handler = {
        get(target, propKey, receiver) {
            let index = Number(propKey);
            if (index < 0) {
                propKey = String(target.length + index);
            }
            return Reflect.get(target, propKey, receiver);
        }
    };

    let target = [];
    target.push(...elements);
    return new Proxy(target, handler);
}

let arr = createArray('a', 'b', 'c');
arr[-1] // c