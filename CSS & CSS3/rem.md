# 网易 & 淘宝 rem 适配方案原理

## 😋 储备知识
[ 🌟 像素、设备像素、css 像素、viewport 等](https://github.com/jawil/blog/issues/21)

### rem
以 root 节点的 font-size 作为基础进行，即 1rem = 1 font-size（root）

### 物理像素(physical pixel)

一个物理像素是显示器(手机屏幕)上最小的物理显示单元，可以理解为我们 **平时说的分辨率** 。

### 设备独立像素(density-independent pixel)

设备独立像素(也叫密度无关像素)，可以认为是计算机坐标系统中得一个点，这个点代表一个可以由程序使用的虚拟像素(比如: css像素)，然后由相关系统转换为物理像素，在这里可以理解为我们说的 **视觉视口** 的大小。

所以说，物理像素和设备独立像素之间存在着一定的对应关系，这就是接下来要说的设备像素比。

### ⚠️ 设备像素比(device pixel ratio)

设备像素比(简称dpr)定义了物理像素和设备独立像素的对应关系，它的值可以按如下的公式的得到：

> 设备像素比 = 物理像素 / 设备独立像素 // 在某一方向上，x方向或者y方向

设备像素比也是设备生产的时候设置好的，在 Javascript 中，可以通过 window.devicePixelRatio 获取到当前设备的 dpr。

## 🤩 Begin

🤫 假设设计稿尺寸为 640px ～

### 网易方案

1. 首先，网易在设计稿尺寸下，认为 1 font-size = 1rem = 100px，布局时拿设计稿标注的尺寸除以100，就是rem的值。那么此时的屏宽我们认为是 640px / 100px = 6.4rem 宽度。

2. 那么在其他尺寸，比如说 320px（🤪 方便计算，瞎取的）的情况下，我当前的 font-size = 50px !

> 屏幕 / font-size = 某系数 x \
> 640px / 100px = deviceWidth / ?font-size \
> 320px / ?font-size = 某系数 x \
> 🌝 font-size = deviceWidth / 某系数

3. 如果采用网易这种做法，视口要如下设置
```html
<meta name="viewport" content="initial-scale=1,maximum-scale=1, minimum-scale=1">
```

4. 当 deviceWidth > 设计稿的横向分辨率时，html 的 font-size 始终等于 横向分辨率/ body 元素宽；之所以这么干，是因为当 deviceWidth > 640，则物理分辨率 > 1280（这就看设备的 devicePixelRatio 这个值了），应该去访问 PC 网站了。事实就是这样，你从手机访问网易，看到的是触屏版的页面，如果从 iPad 访问，看到的就是电脑版的页面。如果你也想这么干，只要把总结中第三步的代码稍微改一下就行了：

```javascript
  let deviceWidth = document.documentElement.clientWidth;
  if (deviceWidth > 640) deviceWidth = 640;
  document.documentElement.style.fontSize = deviceWidth / 6.4 + 'px';
```
5. font-size 使用 CSS3 媒介查询去进行适配

### 淘宝方案
1. 首先，淘宝认为屏幕宽度为 10rem，则对于设计稿而言，1 font-size = 1 rem = 640px / 10  = 6.4px。布局时的计算为，设计稿尺寸 / 6.4。

2. 对于任意屏宽而言，例如 320px 的屏宽而言，1 font-size = 3.2px。

> deviceWidth / 10 = font-size \
> 320 / 10 = font-size 

```javascript
  document.documentElement.style.fontSize = document.documentElement.clientWidth / 10 + 'px';
```

3. 但是对于不同设备像素比的手机，需要调整 scale 属性。

```javascript
  const scale = 1 / devicePixelRatio;
  document.querySelector('meta[name="viewport"]').setAttribute('content','initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
```

4. font-size 使用 CSS3 媒介查询去进行适配，并且当横向尺寸 > 1080 时，访问 PC 端。

## 比较

### 共同点
- 都能适配所有的手机设备，对于 pad，网易与淘宝都会跳转到pc页面，不再使用触屏版的页面
- 都需要动态设置 html 的 font-size
- 布局时各元素的尺寸值都是根据设计稿标注的尺寸计算出来，由于 html 的 font-size 是动态调整的，所以能够做到不同分辨率下页面布局呈现等比变化
- 容器元素的 font-size 都不用 rem，需要额外地对 font-size 做媒介查询
- 都能应用于尺寸不同的设计稿，只要按以上总结的方法去用就可以了

### 不同点

1. 淘宝的设计稿是基于750的横向分辨率，网易的设计稿是基于640的横向分辨率，还要强调的是，虽然设计稿不同，但是最终的结果是一致的，设计稿的尺寸一个公司设计人员的工作标准，每个公司不一样而已。

2. 淘宝还需要动态设置viewport的scale，网易不用

3. 最重要的区别就是：网易的做法，rem值很好计算，淘宝的做法肯定得用计算器才能用好了 。不过要是你使用了less和sass这样的css处理器，就好办多了，以淘宝跟less举例，我们可以这样编写less：

```less
  @baseSize: 6.4px;

  .px2rem(@property, @size) {
    @property: (@size / @baseSize) * 1rem;
  }

  .container {
    .px2rem(width, 300px);
  }
```

## Why
我之前一直在想，同样是适配移动端，为什么 网易需要定死 scale = 1？而 淘宝却要设置 scale 为 1 / devicePixelRatio？

🌚 现在我想通了！

1. 网易的适配方式，是在设计稿（640px）的基础上，以 100px 作为 1rem 进行的，即系数比为 6.4，所以无论屏幕以什么尺寸出现，它的 font-size 都是当前屏宽 / 设计稿屏款，按照比例进行了缩放，所以它需要定死 scale = 1，让最终展示为一个可观的样式。

2. 而淘宝的思路是，认为 屏宽为 10rem（注意，是 rem 单位），在不同屏宽下的 font-size 都为 屏宽 / 10，而由于屏宽为 **设备独立像素**，每个设备的 **设备像素比** 不同，展示出来的 1px 对应的 **物理像素** 不同，就会导致画面有 **大**，有 **小**。所以默认设计稿的 scale = 1 的情况下，设置 scale = 1 / devicePixelRatio。