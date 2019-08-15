# HTML5 语义化的理解
> 语义化是指根据内容的结构化（内容语义化），选择合适的标签（代码语义化），便于开发者阅读和写出更优雅的代码的同时，让浏览器的爬虫和机器很好的解析。

## 语义化的意义

- 有利于SEO，有助于爬虫抓取更多的有效信息。（爬虫是依赖于标签来确定上下文和各个关键字的权重）

- 语义化的 HTML 在没有 CSS 的情况下，能呈现 **较好的** 内容结构与代码结构

- 方便其他设备的解析

- 便于团队开发和维护

## HTML5 新增的语义化标签
![HTML5 语义化](./images/html5-layout.jpg)

### header
> 定义 section 或 page 的页眉

```html
<header>
  <h1>Welcome to my homepage</h1>
  <p>My name is Donald Duck</p>
</header>
<main>
  ...
</main>
<footer>
  <p>end</p>
</footer>
```

### nav
定义导航链接的部分。

> 如果文档中有“前后”按钮，则应该把它放到 \<nav> 元素中。

```html
<nav>
  <a href="index.asp">Home</a>
  <a href="html5_meter.asp">Previous</a>
  <a href="html5_noscript.asp">Next</a>
</nav>
```

### main
规定文档的主要内容。

\<main> 元素中的内容对于文档来说应当是唯一的。它不应包含在文档中重复出现的内容，比如侧栏、导航栏、版权信息、站点标志或搜索表单。
️
> ⚠️️ 注意：在一个文档中，不能出现一个以上的 \<main> 元素。\<main> 元素不能是以下元素的后代：\<article>、\<aside>、\<footer>、\<header> 或 \<nav>。

```html
<main>
  <h1>Web Browsers</h1>
  <p>Google Chrome、Firefox 以及 Internet Explorer 是目前最流行的浏览器。</p>

  <article>
    <h1>Google Chrome</h1>
    <p>Google Chrome 是由 Google 开发的一款免费的开源 web 浏览器，于 2008 年发布。</p>
  </article>

  <article>
    <h1>Internet Explorer</h1>
    <p>Internet Explorer 由微软开发的一款免费的 web 浏览器，发布于 1995 年。</p>
  </article>

  <article>
    <h1>Mozilla Firefox</h1>
    <p>Firefox 是一款来自 Mozilla 的免费开源 web 浏览器，发布于 2004 年。</p>
  </article>
</main> 
```

### section
定义文档中的节（section、区段)

```html
<section>
  <h1>PRC</h1>
  <p>The People's Republic of China was born in 1949...</p>
</section>
```

### article
规定独立的自包含内容（常用于文章）。

```html
<article>
  <h1>Internet Explorer 9</h1>
  <p>Windows Internet Explorer 9（简称 IE9）于 2011 年 3 月 14 日发布.....</p>
</article>
```

### aside
标签定义其所处内容之外的内容

```html
<p>Me and my family visited The Epcot center this summer.</p>
<aside>
<h4>Epcot Center</h4>
The Epcot Center is a theme park in Disney World, Florida.
</aside>
```

> \<aside> 的内容可用作文章的侧栏。

### footer
定义文档或节的页脚。

> \<footer> 元素应当含有其包含元素的信息。页脚通常包含文档的作者、版权信息、使用条款链接、联系信息等等。可以在一个文档中使用多个 \<footer> 元素。

```html
<footer>
  <p>Posted by: W3School</p>
  <p>Contact information: <a href="mailto:someone@example.com">someone@example.com</a>.</p>
</footer>
```





## 总结
共勉：培养好良好的代码习惯和规范，在开发过程中给自己和团队成员都会减少不少的麻烦。

> 本文例子及概念描述摘自 W3CScholl 