// 编写一个 JavaScript 函数 uniqueNums，该函数有一个参数 n（一个不大 31 的整数），
// 其返回值是一个数组，该数组内是 n 个随机且不重复的整数，且整数取值范围是 [2, 32]。

const uniqueNums = (n) => {
  let set1 = new Set()
  while (set1.size !== n) {
    set1.add(Math.floor(31 * Math.random() + 2))
  }
  return [...set1]
}
console.log(uniqueNums(20));