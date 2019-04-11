// 在 JavaScript 的类当中，类实例如果不通过实例进行调用，方法中的 this 就不会指向实例，例如：

// class Person {
//   constructor (name) {
//     this.name = name
//   }
//   sayHi () {
//     console.log(`I am ${this.name}.`)
//   }
// }
// const jerry = new Person('Jerry')
// const sayHi = jerry.sayHi
// sayHi() // => 报错
// 所以在类似于 React.js 的组件的事件监听当中我们总是需要手动地进行 bind(this) 操作。为了简化这样的操作，请你完成一个方法 autoBind，它可以接受一个类作为参数，并且返回一个类。返回的类的实例和原来的类的实例功能上并无差别，只是新的类的实例所有方法都会自动 bind 到实例上。例如：

// const BoundPerson = autoBind(Person)

// const jerry = new BoundPerson('Jerry')
// const sayHi = jerry.sayHi
// sayHi() // => I am Jerry.

// const lucy = new BoundPerson('Lucy')
// const sayHi = lucy.sayHi
// sayHi() // => I am Lucy.
// 注意，如果 autoBind 以后给原来的类新增方法，也会自动反映在实例上，例如：

// Person.prototype.sayGood = function () {
//   console.log(`I am ${this.name}. I am good!`)
// }

// const sayGood = lucy.sayGood
// sayGood() // => I am Lucy. I am good!
// 请你完成 autoBind 的编写。


const autoBind = (fn) => new Proxy(fn, {
    construct(target, args) {
        return new Proxy(new fn(...args), {
            get: (target, key) => {
                return typeof target[key] === 'function' ? target[key].bind(target) : target[key]
            }
        })
    }
})

class Person {
  constructor (name) {
    this.name = name
  }
  sayHi () {
    console.log(`I am ${this.name}.`)
  }
}
const BoundPerson = autoBind(Person)

const jerry = new BoundPerson('Jerry')
const sayHi = jerry.sayHi
sayHi() // => I am Jerry.

const lucy = new BoundPerson('Lucy')
const sayHi1 = lucy.sayHi
sayHi1() // => I am Lucy.