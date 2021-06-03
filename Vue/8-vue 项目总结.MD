# Vue CLI

https://cli.vuejs.org/zh/guide/

## 项目配置

1. vue.config.js 配置 webpack

- configureWebpack

```js
const path = require("path");
module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        comps: path.join(__dirname, "src/components"), // comps 别名，指向 src/components
      },
    },
  },
};
```

- 链式操作

  - 修改 Loader 选项
  - 添加一个新的 Loader
  - 替换一个规则里的 Loader
  - 修改插件选项

2. 审查项目的 webpack 配置

vue inspect https://cli.vuejs.org/zh/guide/webpack.html#%E7%AE%80%E5%8D%95%E7%9A%84%E9%85%8D%E7%BD%AE%E6%96%B9%E5%BC%8F

## 模式和环境变量

### 模式

- development 模式用于 vue-cli-service serve
- test 模式用于 vue-cli-service test:unit
- production 模式用于 vue-cli-service build 和 vue-cli-service test:e2e

### 环境变量

请注意，只有 NODE_ENV，BASE_URL 和以 VUE_APP\_ 开头的变量将通过 webpack.DefinePlugin 静态地嵌入到客户端侧的代码中
