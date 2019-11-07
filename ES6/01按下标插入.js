// func.apply(thisArg, [argsArray])
// thisArg: 在 func 函数运行时使用的 this 值
// [argsArray]:一个数组或者类数组对象，其中的数组元素将作为单独的参数传给 func 函数。

// arr.forEach() 返回值为 undefined

const injectSections = (items, sections) => {
  const res = items.map(item => [item])
  if (sections.length !== 0) {
    sections.forEach(el => {
      res[el.index].unshift(el.content)
    });
    return Array.prototype.concat.apply([], res)
  } else {
    return items
  }
}

// injectSections(
//     ['item1', 'item2', 'item3', 'item4', 'item5'],
//     [
//       { content: 'section1', index: 0 },
//       { content: 'section2', index: 2 }
//     ]
//   ) // => ['section1', 'item1', 'item2', 'section2', 'item3', 'item4', 'item5']

// console.log(injectSections([],[{ content: 'section2', index: 2 }]));
const result = injectSections(
  ["item1", "item2", "item3", "item4"],
  [{
    content: "section0",
    index: 3
  }, {
    content: "section1",
    index: 2
  }, {
    content: "section2",
    index: 1
  }])
console.log(result);