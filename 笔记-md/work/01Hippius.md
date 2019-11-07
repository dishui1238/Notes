## 第一周问题
react -> redux -> redux saga -> dva & umi
### 1.React 的 onClick 事件调用
1. **传递参数**
- 第一种方式
```js
 handleViewChange = view => {
    this.setState({
      view,
    });
  }
```
`<a onClick={() => this.handleViewChange('block')}>方块</a>`

- 第二种方式
```js
  openDetail = ({ id }) => () => {
    Route.push(`/site/plugin/detail-query/${id}`);
  };
```
`<a onClick={this.openDetail(item)}>`

2. **不传递参数**
- 第一种
```js
 handleViewChange = () => {
    this.setState({
      view: 'block'
    })
```
`<a onClick={this.handleViewChange}>方块</a>`

- 第二种e
```js
handleViewChange = (e) => {
    this.setState({
      view: e.target.value
    });
  };
```
`<Radio.Group onChange={this.handleViewChange}></Radio.Group>`

### 2.CSS3 使用 calc() 计算高度 vh px
`min-height: ~'calc(100vh - 120px)'`
*~ 是less的语法防止其计算，让浏览器执行*
- vw Viewport宽度， 1vw 等于viewport宽度的1%
- vh Viewport高度， 1vh 等于viewport高的的1%
- calc()函数用一个表达式作为它的参数，用这个表达式的结果作为值
- p~ul 选择前面有 <p> 元素的每个 <ul> 元素
 
### 3.umi
umi，中文可发音为乌米，是一个可插拔的企业级 react 应用框架

### 4.mock数据

### 5.flex布局
+ 盒子属性
  - flex-direction 设置子元素的布局方向
  - flex-wrap 是否自动换行，默认否，不自动换行子元素宽度会改变
  - flex-flow 
  - justify-content 子元素在主轴上的对齐方式
  - align-items 纵轴上对齐方式（如果是多行的话，会分散开对齐，行与行之间会有距离产生）
  - align-content 纵轴上多行子元素对其方式（将所有子元素看成一个div）

+ 子元素属性
  - order
  - flex-grow
  - flex-shrink
  - flex-basis
  - flex
  - align-self

#### 横向居中
- margin: 0 auto;
- justify-content: center;

#### 纵向居中
- align-items:center;

#### 横轴和纵轴均居中
- 单行元素
```css
align-items: center;
justify-content: center;
```
- 多行元素
```css
align-content: center;
justify-content: center;
```

### 6.BFC
> 设置padding或者border或者触发BFC(block formatting context 块级格式化上下文)
```
1.内部的box会一个接一个地垂直布局。
2. 两个相邻box的垂直距离由margin决定。属于同一个BFC的两个相邻Box的margin会发生重叠 每个盒子的左外边框紧挨着左边框的包含块(从左往右的格式化时，否则相反)。即使存在浮动也是如此
3. BFC的区域不会与float box重叠。
4. BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。
5. 计算BFC的高度时，浮动元素也参与计算.
```
1. 问题一：子元素float，子元素的高度不会撑开父元素的高度
- 给父元素添加 `overflow: hidden/auto;` 父元素会形成BFC区域

2. 问题二：一个元素与浮动的元素发生重叠
- 给两个元素中的为浮动元素添加 `overflow:hidden/auto;` 该元素会形成BFC区域，BFC区域不会与浮动的元素重叠；

3. 问题三：margin重叠(边距塌陷)问题
- 给其中一条边框加 `border: 1px solid transparent;`/`overflow: hidden/auto;`不在同一个BFC区就不会重叠。

> 总结:BFC如何形成
> float值不为none
> position:fixed / absolute
> display:table-cell / table-caption /inline-block / flex / inline-flex.
> overflow属性不为visible

### 7.less函数
```less
@pic: listView, blockView;

.picShow(@className, @pic) {
  .@{className} {
    margin: 0 17px 0 0;
    background: no-repeat center url('../../../../assets/appApproval/@{pic}-gray.svg');

    &:hover {
      background: no-repeat center url('../../../../assets/appApproval/@{pic}-blue.svg');
    }
  }

  .@{className}Active {
    margin: 0 17px 0 0;
    background: no-repeat center url('../../../../assets/appApproval/@{pic}-blue.svg');
  }
}

.loop(@i) when(@i < length(@pic)+1) {
  .picShow(extract(@pic, @i), extract(@pic, @i));
  .loop(@i+1)
}

:global {
  .loop(1);
}
```

### 8.css Modules
#### 1.局部作用域
> 构建工具会将类名`style.xxx`编译成一个哈希字符串，使用一个独一无二的class的名字，产生局部作用域

#### 2.全局作用域
> `:global(.className)`声明全局规则，这样的声明不会被编译成哈希字符串。
> 引入全局class `<h1 className="className">Hello</h1>`

#### 3.定制哈希类名

## 第二周问题

### 多行省略

```css
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  WebkitBoxOrient: 'vertical'; // 写在less文件里不生效，要写成行内样式 
```

### 接口调用
> service.js
```js

```


