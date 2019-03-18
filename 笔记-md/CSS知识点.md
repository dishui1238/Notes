# CSS易混知识点整合
1. <a href="#pseudo-class">伪类与伪元素</a>
2. <a href="#position">CSS定位</a>
3. <a href="#float">CSS浮动与清除浮动</a>
4. <a href="#middle">CSS水平居中与垂直居中</a>

子元素margin带动父元素移动
display:table-cell
flex布局
 ----------
 
## <span id="pseudo-class">一、CSS伪类与伪元素</span>
伪元素的效果类似于通过添加一个实际的元素才能达到，而伪类的效果类似于通过添加一个实际的类来达到。实际上css3为了区分两者，已经明确规定了伪类用一个冒号来表示，而伪元素则用两个冒号来表示(在IE8中只支持:(一个冒号)，所以为了兼容这些浏览器也可以使用 :befor、:after。)。
- 伪类：操作元素本身
- 伪元素：操作元素的子元素

### [伪类](http://www.cnblogs.com/xiaohuochai/p/5021121.html)

#### 锚点
> 关于锚点`<a>`，有常见的5个伪类：:link, :visited, :focus, :hover, :active. CSS层叠中有一条法则十分重要，就是后面覆盖前面，所以伪类的顺序是需要精心考虑的，口诀love-hate

1. link和visited必须在最前面，且没有先后顺序，否则link或visited的效果将被覆盖  注意:link和visited称为静态伪类，只能应用于超链接
2. hover、active、focus这三个伪类必须是focus、hover、active的顺序，因为在focus状态下，也需要触发hover和active，而要触发active一定要先触发hover，所以active要放在hover后面

#### UI元素伪类
> UI元素伪类包括:enabled、:disabled、:checked三个，主要针对于HTML中的form元素，IE8-浏览器不支持
```html
    input:enabled{
        border: 1px solid black;
        background-color: transparent;
    }
    input:disabled{
        border: none;
        background-color: gray;
    }
    input:checked{
        outline: 2px solid lightblue;
    }
    <button onclick = "btn.disabled = false;">按钮可用</button>
    <button onclick = "btn.disabled = true;">按钮不可用</button>
    <input type="button" id="btn" value="按钮">
```

#### 结构伪类
> 结构伪类可分为以下3种情况，IE8-浏览器不支持
1. :nth-child(n)、:nth-last-child(n)、:first-child、:last-child、:only-child

2. :nth-of-type(n)、:nth-last-of-type(n)、:first-of-type、:last-of-type、:only-of-type
```css
E F:nth-of-type(n)          选择父元素的具有指定类型的第n个子元素
E F:nth-last-of-type(n)     选择父元素的具有指定类型的倒数第n个子元素
E F:first-of-type           选择父元素中具有指定类型的第1个子元素，与E F:nth-of-type(1)相同
E F:last-of-type         　  选择父元素中具有指定类型的最后1个子元素，与E F:nth-last-of-type(1)相同
E F:only-of-type        　　 选择父元素中只包含一个同类型的子元素
```

3. :root、:not、:empty、:target
```css
    :root        　选择文档的根元素
    :not         　选择除某个元素之外的所有元素
    :empty         选择没有子元素的元素，而且该元素也不包含任何文本节点
    :target     　 匹配锚点对应的目标元素
```
***:not选择器常用于导航之间的竖线处理，如li:not(:last-of-type)*

#### 其他
1. :lang()　　 匹配某个语言，IE7-浏览器不支持
2. 不仅可以使用单一伪类，也可以伪类结合使用，注意：顺序无关
```css
    div:hover:first-child{background-color: lightgreen;}
    div:last-of-type:active{background-color: lightblue;}  
```

### [伪元素](http://www.cnblogs.com/xiaohuochai/p/5021121.html)

**重点：:before  :after 应用场景**
> 说明：CSS中的:befor、:after都会创建一个伪元素，其中:befor创建的伪元素是所选元素的第一个子元素，:after创建的伪元素是所选元素的最后一个子元素。:befor、:after创建的伪元素默认样式为内联样式。

#### 1.iconfont字体图标展示
```css
.wechat::before {
    content: "\e85b";
    font-family: "iconfont";
    font-size: 15px;
    font-style: normal;
    color: #44b549;
}
```
#### 2.进度线与时间线

#### 3.[几何图形](https://css-tricks.com/the-shapes-of-css/)

------------------------------------

## <span id="position">二、CSS定位<span>

### 介绍
> position 主要值   
1. **absolute:** 绝对定位；脱离文档流，遗留下的空间由后面的元素填充。定位的起始位置元素为最近的父元素(position不为static)，否则为body文档本身。
2. **relative:** 相对定位；不脱离文档流的布局，只改变自身的位置，在文档流原先的位置遗留空白区域。定位的起始位置为此元素原先在文档流的位置。
3. **fixed:** 固定定位；类似于absolute，但不随着滚动条的移动而改变位置。
4. **static:** 默认值；默认布局。

*辅助属性：top,bottom,left,right,表示元素向上，下，左，右插入多少元素*

> **position 与 display 之间的关系：** 
> relative : 原来是什么类型的依旧是什么类型。 
> absolute | fixed ： 元素就被重置为了区块(inline-bloc)元素,就算我们显式地设置 display:inline或者display:block，也仍然无效
> **position 与 float 的相互关系:**
>  position:static 和 position:relative 与 float 的效果可以叠加
> 但 position:absolute、position:fixed 这两个定位属性依赖于自身元素之外的参照，将使 float 的效果无法表现出来。
> **display, position, float 之间的相互关系：**
> 1.如果display等于none，则用户端必须忽略position和float。在这种情况下，元素不产生盒子。
> 2.否则，如果position等于absolute，则display与float皆强制为none(list-item保持不变)。盒子的位置由边界偏移量确定。
> 3.否则，如果float不等于none或该元素是根元素，则display强制为block(list-item保持不变)。
> 4.否则，使用指定的display属性。
------------

## <span id="flaot">三、CSS浮动</span>
 [结论](http://www.cnblogs.com/polk6/p/3142187.html)
1. 内联元素浮动：下一个紧邻块级元素会填充遗留下来的空间(内联元素不会填充)
2. 块级元素浮动，下一个紧邻块级元素会填充遗留下的位置（若紧邻的是内联元素，则不会移动）

### 浮动的影响
#### 1.浮动元素对文本的影响
- 浮动概念的基础是图文混排，因此同辈元素的在排版时如果浮动元素与非浮动元素之间发生覆盖，无论是谁覆盖谁，非浮动的元素内的文字将会被挤走
```html
#a {
        background-color: Red;
        height: 50px;
        width: 100px;
        float: left;
    }

        #b {
            background-color: Yellow;
            height: 50px;
            width: 200px;
            /* float: left; */
            clear: both;
        }
    <div id=a>div-a</div>
    <!-- 非浮动元素覆盖浮动元素，非浮动元素的文字将会被挤走 -->
    <div id=b>div-b 文字文字文字文字文字文字文字文字文字文字文字</div>
```
#### 2.浮动元素对父元素的影响
- 浮动元素无法撑开其父元素的block 高度

#### 3.浮动元素对自身的影响
- 浮动元素将按 inline-block 形式布局

### 清除浮动
#### 1.使用clear
- 在浮动元素后使用一个空元素如`<div class="clear"></div>`，并在CSS中赋予`.clear{clear:both;}`属性即可清理浮动。亦可使用`<br class="clear" />`或`<hr class="clear" />`来进行清理。
- 给浮动元素后面的元素添加clear属性。

#### 2.使用CSS的overflow属性
- 给浮动元素的容器添加overflow:hidden;或overflow:auto;可以清除浮动

#### 3.使用CSS的:after伪元素
- 给浮动元素的容器添加一个clearfix的class，然后给这个class添加一个:after伪元素实现元素末尾添加一个看不见的块元素（Block element）清理浮动
*需要注意的是为了IE6和IE7浏览器，要给clearfix这个class添加一条zoom:1;触发haslayout。*
```css
.clearfix:after{
  content: ""; 
  display: block; 
  height: 0; 
  clear: both; 
  visibility: hidden;  
  }

.clearfix {
  /* 触发 hasLayout */ 
  zoom: 1; 
  }

```
--------------

## <span id="flaot">四、垂直居中与水平居中</span>

### 水平居中

1. **子元素为内联样式：** 设置父元素的 text-align:center;
2. **子元素为块级样式：** 设置子元素的 margin: 0 auto;
3. **子元素 position:absolute**  


