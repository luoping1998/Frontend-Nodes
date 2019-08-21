# HTML5 新属性（下）

> Web Worker、拖拽、视频、音频、地理位置。

## Web Workers 🐮🍺

web worker 是运行在后台的 JavaScript，不会影响页面的性能。

### 什么是 Web Worker？
当在 HTML 页面中执行脚本时，页面的状态是不可响应的，直到脚本已完成。

web worker 是运行在后台的 JavaScript，独立于其他脚本，不会影响页面的性能。您可以继续做任何愿意做的事情：点击、选取内容等等，而此时 web worker 在后台运行。

### 使用方法
1. 创建外部脚本。

在这里，我们创建了计数脚本。该脚本存储于"demo_workers.js" 文件中：
```javascript
  // onmessage || addEventListener('message', fun, false)
  self.addEventListener('message', function (e) {
    // 监听主线程发送的消息
    // 发送消息给主线程
    self.postMessage('You said: ' + e.data);
  }, false);

  // 关闭连接
  self.close();

  // onerror
```
以上代码中重要的部分是 **postMessage()** 方法，它用于向 HTML 页面传回一段消息。

2. 创建 Worker 对象
用 onmessage 方法监听 worker 发送的消息。
```javascript
  if(typeof(w)=="undefined") {
    w = new Worker("demo_workers.js");
    w.onmessage = function(event) {
      // 处理...
    };
  }
```

3. 主线程调用 postMessage 向 worker 对象发消息
```javascript
  w.postMessage('ok');
  w.postMessage({ name: 'a', age: '12' });
```

4. 终止 Worker
```javascript
  w.terminate();
```

### 注意事项
1. 同源限制
分配给 Worker 线程运行的脚本文件，必须与主线程的脚本文件同源。

2. DOM 限制
Worker 线程所在的全局对象，与主线程不一样，无法读取主线程所在网页的 DOM 对象，也无法使用 document、window、parent 这些对象。但是，Worker 线程可以访问 navigator 对象和 location 对象。

3. 通信联系
Worker 线程和主线程不在同一个上下文环境，它们不能直接通信，必须通过消息完成。

4. 脚本限制
Worker 线程不能执行 alert() 方法和 confirm() 方法，但可以使用  XMLHttpRequest 对象发出 AJAX 请求。

5. 文件限制
Worker 线程无法读取本地文件，即不能打开本机的文件系统（file://），它所加载的脚本，必须来自网络。

### 使用实例
1. 浏览器轮询
2. Worker 创建新 Worker

### 更多
#### 主线程
- Worker.onerror：指定 error 事件的监听函数。
- Worker.onmessage：指定 message 事件的监听函数，发送过来的数据在Event.data属性中。
- Worker.onmessageerror：指定 messageerror 事件的监听函数。发送的数据无法序列化成字符串时，会触发这个事件。
- Worker.postMessage()：向 Worker 线程发送消息。
- Worker.terminate()：立即终止 Worker 线程。

#### Worker 线程
Web Worker 有自己的全局对象，不是主线程的window，而是一个专门为 Worker 定制的全局对象。因此定义在window上面的对象和方法不是全部都可以使用。

Worker 线程有一些自己的全局属性和方法。

- self.name： Worker 的名字。该属性只读，由构造函数指定。
- self.onmessage：指定message事件的监听函数。
- self.onmessageerror：指定 messageerror 事件的监听函数。发送的数据无法序列化成字符串时，会触发这个事件。
- self.close()：关闭 Worker 线程。
- self.postMessage()：向产生这个 Worker 线程发送消息。
- self.importScripts()：加载 JS 脚本。

### 扩展
[☄️ Service Worker](https://juejin.im/post/5b06a7b3f265da0dd8567513)

[💥 Shared Worker](https://www.zhuwenlong.com/blog/article/590ea64fe55f0f385f9a12e5)

## 拖拽


## 视频


## 音频


## 地理位置 🧠

地理位置 API 通过 navigator.geolocation 提供。

### getgetCurrentPosition 获取定位
getgetCurrentPosition(success, error, options)

这会异步地请求获取用户位置，并查询定位硬件来获取最新信息。当定位被确定后，定义的回调函数就会被执行。您可以选择性地提供第二个回调函数，当有错误时会被执行。第三个参数也是可选的，您可以通过该对象参数设定最长可接受的定位返回时间、等待请求的时间和是否获取高精度定位。

- success: 成功得到位置信息时的回调函数，使用 Position 对象作为唯一的参数。 

- error【可选】: 获取位置信息失败时的回调函数，使用  PositionError 对象作为唯一的参数，这是一个可选项。 

- options【可选】: 一个可选的 PositionOptions 对象。

#### Position

- coords: 只读属性 , 表示地理状态:它包括位置，地球上的经度和纬度，相关的海拔和速度，可以重新组合内部返回的这些值，它还包含有关这些值的准确信息。

- timestamp: 返回一个时间戳DOMTimeStamp， 这个时间戳表示获取到的位置的时间。

#### PositionError

- code: 返回无符号的、简短的错误码。下列值是可能的：

|值|相关联的常量|描述|
|--|--|--|
|1|PERMISSION_DENIED|地理位置信息的获取失败，因为该页面没有获取地理位置信息的权限。|
|2|POSITION_UNAVAILABLE|地理位置获取失败，因为至少有一个内部位置源返回一个内部错误。|
|3|TIMEOUT|获取地理位置超时，通过定义PositionOptions.timeout 来设置获取地理位置的超时时长。|

- message: 返回一个开发者可以理解的 DOMString 来描述错误的详细信息。

#### PositionOptions
- enableHighAccuracy: 是一个 Boolean 值。这个布尔值用来表明应用是否使用其最高精度来表示结果。如果值为 true ，同时设备能够提供一个更精确的位置，那么设备就会使用这个位置。注意，这会导致较慢的响应时间或者增加电量消耗（比如对于支持gps的移动设备来说）。如果值为false ，设备会通过更快响应以及/或者使用更少的电量等方法来尽可能的节约资源。默认值： false。

- timeout: 是一个正的 long 值。它表明的是设备必须在多长时间（单位毫秒）内返回一个位置。默认值是 Infinity，意思是获取到一个位置之后， getCurrentPosition() 才会返回一个值。
- maximumAge: 一个正的 long 值。它表明可以返回多长时间（即最长年龄，单位毫秒）内的可获取的缓存位置。如果设置为 0, 说明设备不能使用一个缓存位置，而且必须去获取一个真实的当前位置。如果设置为 Infinity ，那么不管设置的最长年龄是多少，设备都必须返回一个缓存位置。默认值：0。

### watchPosition 监视定位
watchPosition(success[, error[, options]])

用于注册监听器，在设备的地理位置发生改变的时候自动被调用。也可以选择特定的错误处理函数。

该方法会返回一个 ID，如要取消监听可以通过  Geolocation.clearWatch() 传入该 ID 实现取消的目的。
