// 编写一个函数 unique(arr)，返回一个去除数组内重复的元素的数组


// Set函数可以接受一个数组（或者具有 iterable 接口的其他数据结构）作为参数，用来初始化。
// // 去除数组的重复成员    [...new Set(array)]

const unique = (arr => {
  const res = new Set(arr)
  // 测试
  // console.log(res); //Set { 0, 1, 2, 3, 4 }
  // console.log(res.size);   //5
  // console.log(res.add(5));    // Set { 0, 1, 2, 3, 4, 5 }

  return [...res]
})
console.log(unique([0, 1, 2, 2, 3, 3, 4]));


// 方法二
const unique2 = (arr => {
  return Array.from(new Set(arr))
})
console.log(unique2([0, 1, 2, 2, 3, 3, 4]));