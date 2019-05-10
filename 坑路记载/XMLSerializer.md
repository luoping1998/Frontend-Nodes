# XMLSerializer 对象
> 提供了 serializeToString() 方法，用于构造 DOM 树的 XML 字符串。

举个例子 🌰，
```
const xml = new XMLSerializer(); // 新建一个 XMLSerializer 对象
const el = document.querySelector('body'); // 获取一个元素
const str = xml.serializeToString(el); // 将整个 body 转换成了 XML 字符串
```

参考链接 🔗：
[DOM解析和序列化](https://w3c.github.io/DOM-Parsing/#the-xmlserializer-interface)、
[XMLSerializer MDN](https://developer.mozilla.org/en-US/docs/Web/API/XMLSerializer)