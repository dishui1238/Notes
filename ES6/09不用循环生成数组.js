// 完成 arrWithoutLoop 函数，它会被传入一个整数 n 作为参数，返回一个长度为 n 的数组，
// 数组中每个元素的值等于它的下标。arrWithoutLoop 中不能使用循环控制结构。

// 方法一
const arrWithoutLoop = n => {
    return Array.from(Array(n), (item, i) => i)
}
// 方法二
// Array(3)  [empty × 3]
// [...Array(n)] [undefined, undefined, undefined]
const arrWithoutLoop2 = n => {
    return [...Array(n)].map((item, i) => i)
}

const arrWithoutLoop3 = n => {
    let arrStr = Object.keys([...Array(n)]) //["1","2","3"...]
    return arrStr.map(Number)
}

console.log(arrWithoutLoop(10));
console.log(arrWithoutLoop2(10));
console.log(arrWithoutLoop3(10));