// 完成一个函数 isUSDFormat 返回 true/false 来判断一个字符串是否符合美元格式：

// 以 $ 开头
// 如果是小数，保留两位小数；如果不是小数则不显示小数部分
// 整数部分从小数点上一位开始每隔三位用 , 分割开来
// 如果整数部分从数字 0 开始，则只会显示一位 0
// 例如：

// isUSDFormat('$1') // => true
// isUSDFormat('$1.0') // => false
// isUSDFormat('$100,000.00') // => true
// isUSDFormat('$0,000.00') // => false
// isUSDFormat('$0.00') // => true
// isUSDFormat('$11,23,345.33') // => false
// isUSDFormat('$1,123,345.33') // => true

// /^\$([1-9]\d{0,2}(,\d{3})*|0)(\.\d{2})?$/
// /^\$ (0|[1-9]\d{0,2}(,\d{3})*) (\.\d{2})?$/

const isUSDFormat = (str) => /^\$(0|([1-9]\d{0,2}(,\d{3})*))(\.\d{2})?$/.test(str)
console.log(isUSDFormat('$0.00'));