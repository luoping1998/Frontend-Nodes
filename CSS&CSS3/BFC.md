# BFC
块级格式化上下文

## BFC 的特征
- 内部的Box会在垂直方向，一个接一个地放置

- Box 垂直方向的距离由 margin 决定。属于同一个 BFC 的两个相邻 Box 的 margin 会发生重叠

- 每个元素的 margin box 的左边，与包含块 border box 的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此。

- BFC 的区域不会与浮动元素重叠。

- BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。

- 计算BFC的高度时，浮动元素也参与计算

## BFC 的条件
- 根元素 `html`;

- `float` 不为 `none`;

- `display` 为 `inline-block`, `table-cell`, `table-caption`, `flex/inline-flex`, `grid/inline-grid`;

- `position` 为 `absolute` 或者 `fixed`;

- `overflow` 不为 `visible`;