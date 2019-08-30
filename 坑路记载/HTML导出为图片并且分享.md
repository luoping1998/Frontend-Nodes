# 将 HTML 导出为图片并且分享
> 背景：最近 PM 来了一个需求，如下：在手机端打开【用户使用报告（一个根据用户 ID 获取信息的静态展示页面）】时，允许 “保存为图片” 和 “分享”。👌 听到这个需求的当下，我想着直接用 canvas 画出来... 可是 canvas 只能画图片啊亲亲【扶额】

## 方案
### 方案一 使用 html2canvas 插件（纯前端方案）
通过使用 html2canvas 插件，将 html 画到 canvas 画布，然后通过它的 toDataURL/toBlob 导出为 base64 或者 blob ，再通过a标签 download 属性进行下载
### 方案二（后端方案）
直接用 phantom.js 或 casper.js 之类的 node 插件，用 headless WebKit 去模拟打开页面，然后导出为图片/ PDF ，接着上传到 OSS，把对应链接返回给前端，实现下载功能。
### 方案三 神奇的 svg ✨
利用 svg 标签，将要绘制的 HTML 结构，“绘制”到 svg 标签中，拼接成 url 传给 img 的 src ，在其 onload 事件中利用 canvas 绘制并转出成 url 返回。

## 坑路开启
### 前提概要（必要的知识 更好的理解）✈️
- [HTML、XML 和 XHTML 的区别和联系](./HTML&XML&XHTML.md)
- [SVG? Amazing!](./svg.md)
- [ XMLSerializer 对象](./XMLSerializer.md)
### 实现思路 💡
- 保存为图片

> 通过将要“导出成图片”的 DOM 节点及其内部的子节点的 CSS 样式通过 getComputedStyle() 方法获取到，然后设置成元素内联的样式，然后将整个 DOM 树放至 XMLSerializer 对象的 serializeToString() 方法中，序列化出它的结构字符串，然后使用数据 URL 内联 SVG, `data:xml+svg,${str}` str 位置，然后作为 img 的 src 属性值传入，并在 img 的 onload 函数中用 canvas 绘制出需要大小的 canvas 并利用其 toDataURL()，导出最后的 base64 字符串，利用 a 标签的 download 属性，保存在本地。

- 分享

### 坑路详情 🔎
1. 需要将元素的样式写成内联（因为导入 svg 中的时候其实还是 HTML 代码，但是此时的样式原本是在 css/less 的文件中的，而 svg 以 url 的形式作为 img 的 src 时，就不能动态获取到样式了 👌）
2. 对于 echarts 绘制出的 canvas，由于有 **动画** 的缘故，在最开始导出的时候为空白。
> 解决方案：在该组件 componentDidMount 钩子函数中，使用 setTimeout 模拟异步，在 canvas 动画完成后再去导出其 URL，并且新建一个 img，与canvas 置于同一位置，达到“覆盖”效果，在导出时进行判断，如果为 canvas 则不用导出，而 image 不受影响。（透明度的 canvas 覆盖时会出现颜色加深的情况，所以，在插入元素时可选择将原 canvas “隐藏”掉。
3. 头像与 reaction 表情均为 cdn，在导出时并没有展示出最终样式。
> 解决方案：绘制完后发现表情和头像均不展示，当下的想法💡是将图片用 canvas 绘制出来，导成 base64 替换原来的 url。然后你又会发现下面的问题：
4. canvas 绘制跨域的图片（例如<img src="http://xxxx.com/yyy/ddd.png"/>）时，会报错，如下：
```
  Failed to execute 'toDataURL' Tainted canvases may not be exported
  // ❌ 被污染的 canvas 不能使用 toDataURL 方法导出
```
> 原因： canvas 受到了同源策略的制裁 😢，虽然可以 append 到页面上展示出来，但是无法使用它的 toBlob(), toDataURL() 和 getImageData() 方法。

> 解决方案：为图片设置 crossOrigin 属性为 “Anonymous" （类似于前端 ajax 跨域）

参考链接🔗：

[启用了 cros 的图片](https://developer.mozilla.org/zh-CN/docs/Web/HTML/CORS_enabled_image)\
[canvas 图片跨域问题](https://www.zhangxinxu.com/wordpress/2018/02/crossorigin-canvas-getimagedata-cors/)

5. 对于这种思路，在浏览器中可以实现保存，但是在 webview 中并没有自动下载。
> 原因：在调试中发现，安卓的 webview 中是走到了 download 回调，但是将传入的 url 当作普通的 url 来处理，而不是当成一组 base64 的数据来处理。

> 解决方案：待解决
6. 并没有兼容 Safari 浏览器
> 原因：可能是 svg 拼成 base64 那块的问题，待查询。

## 总结
1. 使用 html2canvas，至少兼容性好。
2. 如果是嵌入Webview 的话，建议功能由端或者 sdk 提供，更加稳定。