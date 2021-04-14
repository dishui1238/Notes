<!--
 * @Author: your name
 * @Date: 2021-04-13 09:39:29
 * @LastEditTime: 2021-04-13 09:57:28
 * @LastEditors: Please set LastEditors
 * @Description: vue 相关记录总结
 * @FilePath: /crystal-github/Notes/summary/2021/vue.md
-->

## 1. 附件上传

```html
<div class="upload-flie-btn">
  <div class="btn-tips" @click="openFileSelect">上传附件</div>
  <input
    style="display: none"
    type="file"
    ref="fileInput"
    multiple="multiple"
    @change="uploadFile"
  />
</div>
```

```js
 openFileSelect() {
  // dispatchEvent 向一个指定的事件目标派发一个事件,  并以合适的顺序同步调用目标元素相关的事件处理函数
    this.$refs.fileInput.dispatchEvent(new MouseEvent('click'));
 }

  // 多附件上传
  async uploadFile() {
    let _this = this;
    HmsMsg.showLoading();
    let files = [...this.$refs.fileInput.files];
    if (!files || !files.length) {
      return;
    }

    let url = `url`;

    // 请求后端接口
    Promise.all(
      files.slice(0, files.length).map((file) => {
        const data = new FormData();
        data.append('file', file);
        return request.post(url, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      })
    )
      .then((res) => {
        HmsMsg.hideLoading();
        _this.$refs.fileInput.value = null;
      })
      .catch((err) => {
        console.log(err);
      });
  }
```
