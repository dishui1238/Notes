## 1. legend 图例

官网： https://echarts.apache.org/zh/option.html#legend

1. x : 可以设定图例在----左（left）、右（right）、居中（center）、填写数字（如:100px）
2. y : 可以设定图例在----上（top）、下（bottom）、居中（center）、填写数字（如:100px）
3. padding: 可使用 padding:[0,50,0,0] [（距离上方距离），（距离右方距离）、（距离下方距离）、（距离左方距离）]
4. type: 图例的类型 ---- plain(普通)、scroll(可滚动翻页,图例较多时使用)
5. show: 是否展示图例，默认 true
6. orient: 图例方向，默认 'horizontal，' 可选 'vertical'
7. icon: 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'，可以通过 'image://url' 设置为图片，其中 URL 为图片的链接，或者 dataURI
8. textStyle: 文字的样式

```js
legend: {
      orient: 'vertical', // 方向
      data: ['一月销量', '二月销量'],
      x: 'left',
      y: 'center',
      textStyle: {
          color: 'green',
        },
    },

```

## 2. series-bar 柱状图



1. legendHoverLink: boolean 是否启用图例 hover 时的联动高亮

2. itemStyle: Object 图形样式

   - color: string 柱条的颜色
   - borderColor: string 柱条的描边颜色
   - borderWidth: number 柱条的描边宽度，默认不描边
   - borderRadius: number | Array 圆角半径，数组时 （顺时针左上，右上，右下，左下）

3. label: Object 图形上的文本标签，可用于说明图形的一些数据信息，比如值，名称等

   - show: boolean 是否显示标签
   - position: string | Array 标签的位置, 支持 top / left / right / bottom / inside / insideLeft / insideRight / insideTop / insideBottom / insideTopLeft / insideBottomLeft / insideTopRight / insideBottomRight 或 position: [10, 10]
   - rotate: number 标签旋转。从 -90 度到 90 度。正值是逆时针
   - formatter: string | Function 标签内容格式器，支持字符串模板和回调函数两种形式，字符串模板与回调函数返回的字符串均支持用 \n 换行。

4. emphasis: Object 高亮的图形样式和标签样式

   - 'none' 不淡出其它图形，默认使用该配置。
   - 'self' 只聚焦（不淡出）当前高亮的数据的图形。
   - 'series' 聚焦当前高亮的数据所在的系列的所有图形。
