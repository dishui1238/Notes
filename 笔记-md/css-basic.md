# css

## css选择器

- 派生选择器
- id选择器
- 类选择器
- 属性选择器(IE6及以下版本不可使用)
   ```html
   <style>
        [title="t"]{
            color:blue;
        }
   </style>

   <p title="t">属性选择器</p>
   ```
**id是先找到结构内容再加载样式，class是先加载样式再找结构内容**

## CSS样式

### CSS背景

   - background-attachment 设置图像是否固定，scroll(默认),fixed,inherit
   - background-color
   - background-image:url('')
   - background-podition 设置背景图片的起始位置,right,bottom,center,left,可直接跟数值/百分数
   - background-repeat 设置图片是否及如何重复,no-repeat,inherit,repeat(默认),repeat-x,repeat-y

### CSS文本

- color
- direction
- line-height
- letter-spacing
- text-aligh
- text-decoration
- text-indent
- text-transform:none(默认)/capitalize单词以大写字母开头/uppercase全大写/lowercase全小写
- text-shadow:距左,距上,模糊度，颜色
- text-wrap:规定文本换行规则

### CSS字体

- font-size
- font-family

**自定义字体：**

```css
@font-face{
    font-family:myfont;
    src:url();
}
div{
    font-family:myfont;
}
```

### CSS链接

- a:link 未被访问的链接
- a:visited 已被点击过的链接
- a:hover 鼠标经过的链接
- a:active 正在被点击的链接

### CSS列表

- list-style:none
- list-style-image:url('')
- list-style-position:inside/outside点的位置

### CSS表格

### CSS轮廓

- outline
- outline-color
- outline-style
- outline-width

### CSS定位

1. CSS定位机制：普通流，浮动，绝对布局
2. CSS定位属性：position,top,left,right,bottom,overflow,clip,vertical-aligh,z-index
3. CSS浮动
- `float:left,right,none,inherit(从父级继承浮动属性)`
- `clear：left,right,both,inherit`

### CSS选择器

## CSS动画

1. 2D3D转换
- tranform

2. 过渡效果
- transition

3. 多列
- `column-count:数值;`规定元素被分隔的列数
- `column-gap:像素值;`规定列之间的间隔
- `column-rule:3px outset #ff0000;`(间隔线的宽度，样式，颜色)

4. CSS瀑布流

**CSS注意点：**
1. CSS盒模型
> 块级元素的上外边距和下外边距有时会合并（或折叠）为一个外边距，其大小取其中的最大者，这种行为称为外边距折叠（margin collapsing），有时也翻译为外边距合并。注意浮动元素和绝对定位元素的外边距不会折叠。

**CSS3总结**
1. CSS3边框
- `border-radius` 四个值：左上，右上，右下，左下
- `box-shadow` 四个值：右偏移量，下偏移量，模糊度，颜色 
- `boder-image`
*Internet Explorer 9+ 支持 `border-radius` 和 `box-shadow` 属性。Firefox、Chrome 以及 Safari 支持所有新的边框属性。IE不支持 `border-image` 属性*

2. CSS3 背景
- `background-size:width height;`规定背景图片的尺寸
- `background-origin`规定背景图片的定位区域
```css
div{
    background:url(bg_flower.gif);
    background-repeat:no-repeat;
    background-size:100% 100%;
    -webkit-background-origin:content-box; /* Safari */
    background-origin:content-box;
}
```
*Internet Explorer 9+、Firefox、Chrome、Safari 以及 Opera 支持新的背景属性。*

3. CSS3文本效果
- `text-shadow` 规定水平阴影、垂直阴影、模糊距离，以及阴影的颜色
- `word-wrap` 强制文本进行换行。可选 `normal|break-word;`
*Internet Explorer 10、Firefox、Chrome、Safari 以及 Opera 支持 text-shadow 属性。所有主流浏览器都支持 word-wrap 属性。*

4. CSS3字体
- 在`@font-face`中自定义字体
```css
    @font-face
    {
        font-family: myFirstFont;
        src: url('Sansation_Light.ttf'),
            url('Sansation_Light.eot'); /* IE9+ */
    }

    div
    {
        font-family: myFirstFont;
    }
```

*Firefox、Chrome、Safari 以及 Opera 支持 .ttf (True Type Fonts) 和 .otf (OpenType Fonts) 类型的字体。Internet Explorer 9+ 支持新的 @font-face 规则，但是仅支持 .eot 类型的字体 (Embedded OpenType)。*

5. CSS3 2D 转换
- `translate(x,y)` 移动，元素向x,y移动
- `rotate()` 旋转，元素顺时针旋转给定的角度。允许负值，元素将逆时针旋转
- `scale(x,y)` 缩放，元素的尺寸放大的倍数
- `screw(x,y)` 翻转，元素翻转给定的角度
- `matrix()` 把所有 2D 转换方法组合在一起，需要六个参数，包含数学函数：旋转、缩放、移动以及倾斜元素。
*Internet Explorer 10、Firefox 以及 Opera 支持 transform 属性。Chrome 和 Safari 需要前缀 -webkit-。注释：Internet Explorer 9 需要前缀 -ms-。*
```css

```

