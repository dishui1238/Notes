# React 组件化

## 组件跨层级通信 Context

和 Vue 中的 provide/inject 类似

1. React.createContext 创建一个 Context 对象

```js
// Context 文件
export const ThemeContext = React.createContext({ themeColor: "pink" });
```

2. Context.Provider
   Provider 接收一个 value 属性，传递给消费组件，当 Provider 的 value 值发生变化时，它内部的所有消费组件都会重新渲染

   ```jsx
   import React, { Component } from "react";
   import { ThemeContext } from "../Context";
   export default class ContextPage extends Component {
     state={theme: '#000'}

     render{
       const {theme} = this.state;
       return(
        <ThemeContext.Provider value={theme}>
          <child />
        </ThemeContext.Provider>
       )
     }
   }
   ```

3. Class.contextType
   用于 class 组件，只能订阅单一的 context。
   挂载在 class 上的 contextType 属性会被重赋值为一个由 React.createContext() 创建的 Context
   对象。这能让你使用 this.context 来消费最近 Context 上的那个值

   ```js
   // 子消费组件
   import React, { Component } from "react";
   import { ThemeContext } from "../Context";

   class child extends Component {
     static contextType = ThemeContext;

     render() {
       const { themeColor } = this.context;
       return (
         <div className="border">
           <h3 className={themeColor}>ContextTypePage</h3>{" "}
         </div>
       );
     }
   }
   ```

4. Context.Consumer
   可以用于函数组件和类组件中，可以订阅多个

5. useContext
   用于函数组件

   ```js
   import React, { useContext } from "react";
   import { ThemeContext } from "../Context";

   export default function UseContextPage(props) {
     const { themeColor } = useContext(ThemeContext);
     return (
       <div className="border">
         <h3 className={themeColor}>UseContextPage</h3>
       </div>
     );
   }
   ```

## 高阶组件

HOC 是一个函数，参数是一个组件，返回一个组件

```js
import React, { Component } from "react";

const foo = (Cmp) => (props) => {
  return (
    <div className="border">
      <Cmp {...props} />
    </div>
  );
};

function Child(props) {
  return <div> Child {props.name}</div>;
}
const Foo = foo(Child); // 产生的高阶组件

export default class HocPage extends Component {
  render() {
    return (
      <div>
        <h3>HocPage</h3> <Foo name="msg" />
      </div>
    );
  }
}
```

## 实现表单组件


