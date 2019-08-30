# 两栏布局
左侧盒子宽度 120px，右侧盒子自适应宽度。
```html
<div class="wrap">
  <div class="left"></div>
  <div class="right"></div>
</div>
```

公共css
```css
  .wrap {
    width: 100%;
    height: 100%;
  }

  .left {
    width: 120px;
  }

  .left, .right {
    height: 100%;
  }
```

## 双 inline-block

```css
  .wrap {
    font-size: 0; /* 消除空格的影响 */
  }

  .left, .right {
    display: inline-block;
    vertical-align: top;	/* 顶端对齐 */
  }

  .right {
    width: calc(100% - 120px);
  }
```

## 双 float

```css
  .wrap {
    overflow: hidden; /* BFC 才能内化浮动元素*/
  }

  .left, .right {
    float: left;
  }

  .right {
    width: calc(100% - 120px);
  }
```

## float + margin-left

```css
  .wrap {
    overflow: hidden; /* BFC 才能内化浮动元素*/
  }

  .left {
    float: left;
  }

  .right {
    margin-left: 120px;
  }
```

## absolute + margin-left

```css
  .wrap {
    position: relative;
  }

  .left {
    position: absolute;
    left: 0;
    top: 0;
  }

  .right {
    margin-left: 120px;
  }
```

## float + BFC

```css
  .wrap {
    overflow: hidden; /* BFC 才能内化浮动元素*/
  }

  .left {
    float: left;
  }

  .right {
    overflow: auto; /* BFC 不会与浮动元素重叠 */
  }
```

## flex

```css
  .wrap {
    dispaly: flex;
    flex-direction: row;
  }

  .left, .right {
    flex: none; /* 防止变形 */
  }
```

## grid

# 三栏布局
左右 120px，中间自适应。

## 双 float + margin

```html
  <div class="wrap">
    <div class="left"></div>
    <div class="right"></div>
    <div class="main"></div>
  </div>
```

```css
  .wrap {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .left {
    width: 120px;
    height: 100%;
    float: left;
  }

  .right {
    width: 120px;
    height: 100%;
    float: right;
  }

  .main {
    height: 100%;
    margin: 0 120px;
  }
```

## 双 float + BFC

```css
  .main {
    height: 100%;
    overflow: hidden;
  }
```

缺点: main 的内容无法最先加载


## 全 float + padding + relative （圣杯）

```html
  <div class="wrap">
    <div class="main"></div>
    <div class="left"></div>
    <div class="right"></div>
  </div>
```

```css
  .wrap {
    width: 100%;
    height: 100%;
    padding: 0 120px; /* 看这里 */
    overflow: hidden;
  }

  .main, .left, .right {
    width: 120px;
    height: 100%;
    float: left;
    position: relative;
  }

  .main {
    width: 100%;
  }

  .left {
    margin-left: -100%;
    left: -120px;
  }

  .right {
    margin-left: -120px;
    right: -120px;
  }

```
缺点：中间元素小于两变时会乱掉 于是出现了⬇️

## 全 float + margin 负值 + content margin（双飞翼）
```html
  <div class="wrap">
    <div class="main">
      <div class="content"></div>
    </div>
    <div class="left"></div>
    <div class="right"></div>
  </div>
```

```css
  .wrap {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .main, .left, .right {
    width: 120px;
    height: 100%;
    float: left;
  }

  .main {
    width: 100%;
  }

  .content {
    height: 100%;
    margin: 0 120px;
  }

  .left {
    margin-left: -100%;
  }

  .right {
    margin-left: -120px;
  }

```

## 双 absolute + margin

```html
  <div class="wrap">
    <div class="main"></div>
    <div class="left"></div>
    <div class="right"></div>
  </div>
```

```css
  .wrap {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .left, .right{
    position: absolute;
    top: 0;
    right: 0;
  }

  .left {
    left: 0;
  }

  .main {
    margin: 0 120px;
  }
```

## flex

```css
.wrap {
  display: flex;
}

.wrap > div {
  flex: none;
}
```

## Table

```css
.wrap {
  display: table-cell;
}
```