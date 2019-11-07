// 最新的 Javascript 标准规定了六种基本数据类型(number, null, undefined, string, boolean, symbol)
//  和基于 Object 衍生的其它原生数据类型，写出 type 函数，它传入一个参数，返回它的数据类型（用小写字母），
// 比如: type(new Date)，返回 date。

// const type = (param) => {
//     if(typeof param !== 'object'){
//         return typeof param;
//     }else{

//     }
// }

const type = (obj) => {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
}
console.log(type(new Date));
console.log(type(true));
console.log(type(function () {}));
console.log(type(Symbol()));
console.log(type(Math));