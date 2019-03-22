// 编写一个 JavaScript 函数，接受一个仅包含数字的 多维数组 ，返回拍平以后的结果。
// 例如传入：[1, [[2], 3, 4], 5]，返回 [1, 2, 3, 4, 5]。

// 方法一
const flatten = (arr) => {
    let result = []
    arr.forEach((item) => {
        Array.isArray(item) ? result = result.concat(flatten(item)) : result.push(item)
        }
    )
    return result
}
// 方法二
// const flatten2 = (arr) => {
//     return Array.prototype.concat.apply([], arr)
// }
// 方法三
const flatten3 = (arr) => {
    let res = []
    if (arr.length != 0) {
        const arrStr = arr.join().split(',')    //  !!!!!!
        arrStr.map(item => {
            res.push(Number(item))
        })
        return res
    }else{
        return arr
    }
}
// 方法四
function flatten4(arr) {
    while(arr.some(item=>Array.isArray(item))) {
        arr = [].concat(...arr);
    }
    return arr;
}
// 方法五
// Array.flat(n)是ES10扁平数组的api,n表示维度,n值为Infinity时维度为无限大

var arr = [1, [[2], 3, 4], 5];
console.log(flatten(arr));
// console.log(flatten2(arr));
console.log(flatten3(arr));

