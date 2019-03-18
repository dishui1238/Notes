
const fillEmpty = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        if (!(i in arr)) {
            arr[i] = "Hello";
        }
    }
    return arr;
 };

const a = [, , null, undefined, 'OK', , ]

console.log(fillEmpty(a));
console.log(fillEmpty2(a));
// a 变成 ['Hello', 'Hello', null, undefined, 'OK', 'Hello']