// 完成 isSameSet 函数，它接受了两个 Set 对象作为参数，
// 请你返回 true/false 来表明这两个 set 的内容是否完全一致
const isSameSet = (s1, s2) => {
    if(s1.size !== s2.size ){
      return  false
    }else{
        return [...s1].every(item => s2.has(item))
    }
}
const a = {}
const b = 1
const c = 'ScriptOJ'
const set1 = new Set([a, b, c])
const set2 = new Set([a, c, b])

console.log(isSameSet(set1, set2)) 

