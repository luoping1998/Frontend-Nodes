> React 的核心机制之一就是可以在内存中创建虚拟的 DOM 元素。React 利用虚拟 DOM 来减少对实际 DOM 的操作从而提升性能。
# createElement
## JSX（熟知可跳过 ✈️ ）
JSX(JavaScript XML)是一种在 React 组件内部构建标签的类 XML 语法。React 发明了 JSX，利用 HTML 语法来创建虚拟 DOM。当遇到<，JSX 就当 HTML 解析，遇到 { 就当 JavaScript 解析。

> 实际上 HTML 也是 XML 协议，由浏览器解析，而 JSX 是由 JS 解析，当然也可以通过构建工具解析完成，如 grunt、webpack，可以避免 JS 在运行中解析 JSX 所消耗的时间。JSX 原本是使用官方自己提供的方法处理，不过，2015-7-12日官方博客文章声明其自身用于 JSX 语法解析的编译器 JSTransform 已经过期，不再维护，React JS 和 React Native 已经全部采用第三方 Babel 的 JSX 编译器实现。

JSX 并不是一门新的语言，仅仅是个语法糖，允许开发者在 JavaScript 中书写 HTML 语法。最后，每个 HTML 标签都转化为 JavaScript 代码来运行。
- JSX 必须借助 ReactJS 环境才能运行，所以使用前要先加载 ReactJS 文件（react.js、react-dom.js）
-  除了 ReactJS 环境，还需要加载 JSX 的解析器（babel.js）

### 代码转换
使用 JSX 的书写是为了让我们能更直观地看到组件的 DOM 结果，其最终还是通过解析器转化为 JavaScript 代码才能在浏览器端执行。比如我们写了如下一段代码：
```
var msg = <h1 width="10px">hello hangge.com</h1>;
```
那么解析器就会转化为：
```
var msg = React.createElement("h1", {width: "10px"}, "hello hangge.com");
```
也就是说，我们每写一个标签，就相当于调用一次 React.createElement 方法并最后返回一个 ReactElement 对象给我们。也可以不使用 JSX，而是直接通过 React.createElement 方法来创建 ReactElement 对象。

>  JSX 的基本语法规则：遇到 HTML 标签（以 < 开头），就用 HTML 规则解析；遇到代码块（以 { 开头），就用JavaScript 规则解析。
## ReactElement
> 在 React 中，一个 react 元素就对应着一个普通的对象，即 ReactElement 类型对象。
```
const ReactElement = function(type, key, ref, self, source, owner, props) {
  const element = {
    // 标志位，方便辨别它是 react 元素
    $$typeof: REACT_ELEMENT_TYPE,

    // 从创建的时候传入的属性
    type: type,
    key: key,
    ref: ref,
    props: props,

    // Record the component responsible for creating this element.
    _owner: owner,
  };

  if (__DEV__) {
    // dev 环境下，登记 _store，_self，_source，属性
  }

  return element;
};
```
从上面的代码中可以很清晰的看出，ReactElement 是一个**工厂模式**的对象生产机，每个 react 元素都具备着至少 7 个公共属性:
- type: 当前元素的类型，如 text，element...
- key: DOM 结构标识，提升更新的性能，在 list 中必选
- ref: DOM 节点或 React 元素的引用
- self: 
- source: 
- owner: 为创建当前组件的对象，默认值为null。
- props: 来自父组件的传参

## 创建 React 元素的方法
通常两种写法：
- JSX 语法（🌰 1）
```
// 在某组件的 render 中，返回一个 JSX 对象
render() {
    const { headText, pText } = this.props;
    return (
        <div>
            <h1>{headText}</h1>
            <p>{pText}</p>
        </div>
    )
}
```
- creatEmenlent 手动创建（🌰 2）
```
class Hello extends React.Component {
  render() {
    // 创建一个 div, children 为 `Hello ${this.props.toWhat}`
    return React.createElement('div', null, `Hello ${this.props.toWhat}`);
  }
}

ReactDOM.render(
  // 创建一个 Hello 组件，传入 toWhat 作为 props
  React.createElement(Hello, {toWhat: 'World'}, null),
  document.getElementById('root')
);
```
> JSX 本身并不是什么高深的技术，可以说只是一个比较高级但很直观的语法糖。它非常有用，却不是一个必需品，没有 JSX 的 React 也可以正常工作，如 🌰 2。
### createElement 创建
```
export function createElement(type, config, children) {
  let propName;

  // 初始化
  const props = {};

  let key = null;
  let ref = null;
  let self = null;
  let source = null;

  if (config != null) {
    // 获取 ref
    if (hasValidRef(config)) {
      ref = config.ref;
    }
    // 获取 key
    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    // 将config中的属性复制到 props 上
    for (propName in config) {
      if (
        hasOwnProperty.call(config, propName) &&
        !RESERVED_PROPS.hasOwnProperty(propName)
      ) {
        props[propName] = config[propName];
      }
    }
  }

  const childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    // 仅存在 1 children
    props.children = children;
  } else if (childrenLength > 1) {
    // >1 的情况下 复制到childArray中
    const childArray = Array(childrenLength);
    for (let i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    if (__DEV__) {
      if (Object.freeze) {
        Object.freeze(childArray);
      }
    }
    props.children = childArray;
  }

  // 对于设定了 defaultProps 的组件，如果没有传入对应值，则设置为 defaultProps 中的值
  if (type && type.defaultProps) {
    const defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }

  // 返回一个 react 元素对象
  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props,
  );
}
```
### jsx (react16 中新增)
```
export function jsx(type, config, maybeKey) {
  // 初始化会用到的一系列变量
  let propName;

  const props = {};

  let key = null;
  let ref = null;

  if (hasValidRef(config)) {
    ref = config.ref;
  }

  if (hasValidKey(config)) {
    key = '' + config.key;
  }

  // 将 config 中的属性，复制到 props 新对象中
  for (propName in config) {
    if (
      hasOwnProperty.call(config, propName) &&
      !RESERVED_PROPS.hasOwnProperty(propName)
    ) {
      props[propName] = config[propName];
    }
  }

  // 设置 key
  if (maybeKey !== undefined) {
    key = '' + maybeKey;
  }

  // 对于设置了 defaultProps 的元素进行检查
  if (type && type.defaultProps) {
    const defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      // 如果props属性中没有某属性，则设置为默认属性中的值
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }
  
  // 最后返回一个 ReactElement 对象
  return ReactElement(
    type,
    key,
    ref,
    undefined,
    undefined,
    ReactCurrentOwner.current,
    props,
  );
}
```
> 其实可以很清楚的看出来，jsx 和 createElement 创建 react 元素的步骤是一样的：
初始化变量 -> 获取属性 ref, key, props -> 对于设置了 defaultProps 的组件进行相应判断及操作 -> 返回相应的 ReactElement 对象

> Q: 为什么已经有了 createElement 还要一个 jsx ？
>
> A: we may want to special case jsxs internally to take advantage of static children.for now we can ship identical prod functions (引自代码注释，大概意思可能是说它是在特殊的情况下为静态的 children 使用的方法吧 🤷‍♀️ [这还有个链接](https://github.com/reactjs/rfcs/pull/107))

## 总结
- react 中的每个元素都是一个普通的 JS 对象
- JSX 其实就是用 createElement 创建了一个 ReactElement
- createElement 会返回一个 ReactElement 对象，这个对象在 react 中记录了当前元素的基本属性：type、key、ref、props ...
