# 正则表达式

### 基本语法
single char | quantities(数量) | position(位置)
-|-|-
\d 匹配数字 | * 任意个 | ^ 一行的开头
\w 匹配word(数字、字母) | + 1个或更多，至少1个 |	$ 一行的结尾
\W 匹配非word(数字、字母) | ? 0个或1个,一个Optional	| \b 单词"结界"(word bounds)
\s 匹配white space(包括空格、tab等) | {min,max}出现次数在一个范围内|
\S 匹配非white space(包括空格、tab等) | {n}匹配出现n次的
. 匹配任何，任何的字符| |

#### 匹配模式
flag | 含义
--|-- 
g | 全局匹配
i | 忽略大小写
m | 多行匹配

### [] 
1. **[]或:** `[abc]`表示a或b或c
2. **[]中的^** 表示非，`[^ab]` 啥都行，只要不是a或b
### ()
1. 除了使用[]表示或逻辑,()也是可以的。用法是(a|b)表示a或者b
2. **分组捕获**

    ```js
    const name1 = 'shiffina, Daniel'
    const reg = /(\w+),\s(\w+)/
    console.log(name1.replace(reg,'$2 $1')); //Daniel shiffina
    ```
    ```js
    const link1 = '[google](http://google.com)' 
    const reg2 = /\[(.*?)\]\((http:.*)\)/
    console.log(link1.replace(reg2,'$2')); //http://google.com
    ```
3. 使用\选择器
    ![例子](https://github.com/dishui1238/Notes/blob/master/%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F/imgs/reg.PNG)
    ```js
    const str = 'This is is a a dog , I think think this is is really a a good good dog. Don\'t you you thinks so so ?'
    const reg3 = /\b(\w+)\s\1\b/
    ```

### 使用
- **reg.test()** 测试是否包含，返回一个bool变量。
- **reg.exec()** 每次调用，返回一个匹配的结果，匹配结果和分组以数组的形式返回，不断的调用即可返回下一个结果，直到返回null
------
- **str.match()** 返回了第一个可以匹配的序列
- **str.split()**
- **str.replace(reg,replace|function)**

### 总结

1. 分组捕获，使用()进行数据分组，编号0代表整个匹配项，选择的分组从1号开始
2. 选择器可以使用$1和\1，但是使用场景不同，\用在正则表达式自己身上
3. ?符号可以禁止贪婪属性，放在.*之后，表示一次匹配遇到重点就可以停止。否则将会一直向后匹配
4. 在js中，正则表达式字面量/reg/和字符串字面量"str"用于创建正则和字符串。其中正则上有两个方法reg.test()和reg.exec()
5. reg.test(str)方法，返回布尔变量，用于指示是否有所匹配； reg.exec(str)有点类似与迭代器，每次执行，返回匹配结果和分组，直到返回为null结束。
6. 字符串方法主要有str.match(reg),str.split(reg)和str.replace(reg,str|function) 三种方法。
7. match比较特殊，如果正则包含了分组，且没有g标志，则返回匹配内容和分组; 如果没有分组，且有g标志，返回所有匹配内容
8. split方法主要用于字符串分割，如果想要保存分隔符，记得将匹配内容分组(用小括号包起来)
9. replace是最强大的方法，当使用回掉函数时，返回值就是替换值; 参数分别为匹配值 group1 group2...

