[ES6](#ES6)
[Babel](#Babel)


## ES6

### 字符串的扩展
- 具有遍历器接口，可以被 for...of循环遍历
```js
for (let codePoint of 'foo') {
  console.log(codePoint)
}//f o o
```
- includes():返回布尔值,第二个参数n，表示开始搜索的位置至字符串结束。
- startsWith():返回布尔值,第二个参数n，表示开始搜索的位置。
- endsWith():返回布尔值,第二个参数n，表示前n个字符。
- repeat():返回一个新的字符串，表示将字符串重复n次


## [Babel](http://www.ruanyifeng.com/blog/2016/01/babel.html)
> Babel是一个广泛使用的转码器，可以将ES6代码转为ES5代码，从而在现有环境执行。

#### 配置文件.babelrc

*注：Netscape公司从创造了JavaScript语言，提交给标准化组织 ECMA制定的浏览器的脚本语言的标准取名为ECMAScript2011 年，ECMAScript 5.1 版发布后，就开始制定 6.0 版了。因此，ES6 这个词的原意，就是指 JavaScript 语言的下一个版本，ES6 的第一个版本，就这样在 2015 年 6 月发布了，正式名称就是《ECMAScript 2015 标准》（简称 ES2015）标准委员会最终决定，标准在每年的 6 月份正式发布一次，作为当年的正式版本，也就是ES2015、16...*
*语法从提案到正式标准要经历以下几个阶段，webpack中的babel-loader的preset-stage0~4就是对应解析这4个提案阶段的语法*
```
Stage 0 - Strawman（展示阶段）
Stage 1 - Proposal（征求意见阶段）
Stage 2 - Draft（草案阶段）
Stage 3 - Candidate（候选人阶段）
Stage 4 - Finished（定案阶段）
```

#### 命令行转码babel-cli
基本用法
```js
# 转码结果输出到标准输出
$ babel example.js

# 转码结果写入一个文件
# --out-file 或 -o 参数指定输出文件
$ babel example.js --out-file compiled.js
# 或者
$ babel example.js -o compiled.js

# 整个目录转码
# --out-dir 或 -d 参数指定输出目录
$ babel src --out-dir lib
# 或者
$ babel src -d lib

# -s 参数生成source map文件
$ babel src -d lib -s
```



