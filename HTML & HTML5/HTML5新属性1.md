# HTML5 新属性（上）

> 简单介绍属性特征及使用方法。
> Canvas、SVG、SVG vs Canvas、Web 存储、服务器发送事件

## Canvas

用于使用 Javascript 在网页上绘制图形。

### 绘制过程

1. 创建 canvas 元素
```javascript
  let canvas = document.getElementById('#myCanvas');

  // 或者

  let myCanvas = document.createElement('canvas');
  document.body.append(myCanvas);
```

2. 创建 context 对象
```javascript
  let cxt = myCanvas.getContext('2d');
```

>   getContext("2d") 对象是内建的 HTML5 对象，拥有多种绘制路径、矩形、圆形、字符以及添加图像的方法。

3. 开始绘制
```javascript
  cxt.fillStyle="#FF0000";
  cxt.fillRect(0,0,150,75); 
```

### 更多方法
[🐷 canvas 教程 MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial)

## SVG

### What is SVG?
- SVG 指可伸缩矢量图形 (Scalable Vector Graphics)
- SVG 用于定义用于网络的基于矢量的图形
- SVG 使用 XML 格式定义图形
- SVG 图像在放大或改变尺寸的情况下其图形质量不会有损失
- SVG 是万维网联盟的标准

### SVG 的优势

与其他图像格式相比（比如 JPEG 和 GIF），使用 SVG 的优势在于：
- SVG 图像可通过文本编辑器来创建和修改
- SVG 图像可被搜索、索引、脚本化或压缩
- SVG 是可伸缩的
- SVG 图像可在任何的分辨率下被高质量地打印
- SVG 可在图像质量不下降的情况下被放大

### 更多

[🌟 SVG 深入浅出](../坑路记载/svg.md)

## SVG VS Canvas

### SVG

> SVG 是一种使用 XML 描述 2D 图形的语言。

SVG 基于 XML，这意味着 SVG DOM 中的每个元素都是可用的。您可以为某个元素附加 JavaScript 事件处理器。

在 SVG 中，每个被绘制的图形均被视为对象。如果 SVG 对象的属性发生变化，那么浏览器能够自动重现图形。

### Canvas

> Canvas 通过 JavaScript 来绘制 2D 图形。

Canvas 是逐像素进行渲染的。

在 canvas 中，一旦图形被绘制完成，它就不会继续得到浏览器的关注。如果其位置发生变化，那么整个场景也需要重新绘制，包括任何或许已被图形覆盖的对象。

### Canvas 与 SVG 的比较

#### Canvas

- 依赖分辨率
- 不支持事件处理器
- 弱的文本渲染能力
- 能够以 .png 或 .jpg 格式保存结果图像
- 最适合图像密集型的游戏，其中的许多对象会被频繁重绘

#### SVG

- 不依赖分辨率
- 支持事件处理器
- 最适合带有大型渲染区域的应用程序（比如谷歌地图）
- 复杂度高会减慢渲染速度（任何过度使用 DOM 的应用都不快）
- 不适合游戏应用

## Web 存储

HTML5 提供了两种在客户端存储数据的新方法：

- localStorage
- sessionStorage

### 背景
之前，这些都是由 cookie 完成的。但是 cookie 不适合大量数据的存储，因为它们由每个对服务器的请求来传递，这使得 cookie 速度很慢而且效率也不高。

在 HTML5 中，数据不是由每个服务器请求传递的，而是只有在请求时使用数据。它使在不影响网站性能的情况下存储大量数据成为可能。

对于不同的网站，数据存储于不同的区域，并且一个网站只能访问其自身的数据。

HTML5 使用 JavaScript 来存储和访问数据。

### 不同点
localStorage 保存的数据不会过期，除非用户手动 clear；sessionStorage 保存的数据仅在当前会话期间存在，会话结束，数据也就消失。

### 主要方法
- setItem(key: string, value: string): void
- getItem(key: string): string
- removeItem(key: string)
- clear()

## 服务器发送事件（SSE）

用于服务器主动向客户端发送消息，通常用于 **推送**。

> 使用 HTTP 轮询也可以达到目标，不过需要客户端 **定期的** 给服务器发送请求，而 SSE只要创立了连接，服务器之后就会主动的给客户端发送请求，客户端主需要处理就行。

### 使用方法

1. 创建连接
```javascript
  let evtSource = new EventSource(serverURL);
```

2. 监听事件
```
  evtSource.onmessage = function(e) {
    var newElement = document.createElement("li");
    var eventList = document.getElementById('list');

    newElement.innerHTML = "message: " + e.data;
    eventList.appendChild(newElement);
  }
```
> 监听了那些从服务器发送来的所有 **没有指定事件类型** 的消息(没有 event 字段的消息),然后把消息内容显示在页面文档中。

3. 监听指定事件
```
  evtSource.addEventListener("ping", function(e) {
    var newElement = document.createElement("li");
    
    var obj = JSON.parse(e.data);
    newElement.innerHTML = "ping at " + obj.time;
    eventList.appendChild(newElement);
  }, false);
```
> 只有在服务器发送的消息中包含一个值为 "ping" 的 event 字段的时候才会触发对应的处理函数,也就是将 data 字段的字段值解析为 JSON 数据,然后在页面上显示出所需要的内容。

4. 服务器端发送的响应内容应该使用值为 "text/event-stream" 的 MIME 类型。

### 消息流格式

- event：事件类型。如果指定了该字段，则在客户端接收到该条消息时，会在当前的 EventSource 对象上触发一个事件，事件类型就是该字段的字段值，可以使用 addEventListener() 方法在当前 EventSource 对象上监听任意类型的命名事件；如果该条消息没有 event 字段，则会触发onmessage 属性上的事件处理函数。

- data：消息的数据字段。如果该条消息包含多个 data 字段，则客户端会用换行符把它们连接成一个字符串来作为字段值。

- id：事件ID，会成为当前 EventSource 对象的内部属性"最后一个事件ID"的属性值。

- retry：一个整数值，指定了重新连接的时间(单位为毫秒)，如果该字段值不是整数，则会被忽略。
