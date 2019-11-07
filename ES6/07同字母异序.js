// 同字母异序指的是两个字符串字母种类和字母的数量相同，但是顺序可能不同。

const isAnagram = (str1, str2) => {
  if (Array.from(str1).sort().join() == Array.from(str2).reverse().sort().join()) {
    return true
  } else {
    return false
  }
}

const str1 = 'anagram'
const str2 = 'nagaram'
// console.log(Array.from(str1).sort().join());
// console.log(Array.from(str2).reverse().sort().join());

console.log(isAnagram("anagram", "nagaram")); // => return true.
console.log(isAnagram("rat", "car")); // => return false.