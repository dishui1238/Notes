// 编写一个 JavaScript generator 函数，接受一个仅包含数字的 多维数组 ，返回一个迭代器，
// 可以遍历得到它拍平以后的结果。例如：

// const numbers = flatten([1, [[2], 3, 4], 5])
// numbers.next().value // => 1
// numbers.next().value // => 2
// numbers.next().value // => 3
// numbers.next().value // => 4
// numbers.next().value // => 5

function* flatten(arr) {
    for(let item of arr){
        // Array.isArray(item) ? yield *flatten(item) : yield item
        if(Array.isArray(item)){
            yield *flatten(item)
        }else{
            yield item
        }
    }
}
const numbers = flatten([1, [[2], 3, 4], 5])
console.log(numbers.next().value)
console.log(numbers.next().value)
console.log(numbers.next().value)
console.log(numbers.next().value)
console.log(numbers.next().value)

// 例子
function* demo() {
    console.log('Hello' + (yield 12455)); 
    console.log('Hello' + (yield 123)); 
  }
  const p = demo()
console.log(p.next()); 
console.log(p.next()); 
console.log(p.next()); 
