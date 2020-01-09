# Context 基础

> 「前人」栽树, 「后人」乘凉

通常情况下，组件间的通信需要通过 `props` 来进行，但是对于嵌套层级较深的组件而言，一层一层的进行传参，是一件很麻烦的事情，使用该属性的组件不能很快判断出属性的「来源」，并且在中间层的组件可能用不上这个属性，但是却得声明。

所以，`context` 就是为了实现一个允许跨「层级」的数据传递。

## v.15

1. 在父层级声明 `Context` 对象属性 `childContextTypes`;
2. 在父层级声明 `getChildContext` 方法，该方法返回一个 `Context` 对象;
3. 在子组件（要用 `Context` 内数据的组件）内部，通过声明静态属性 `contextTypes`，才能访问父层级 `Context` 对象的顺序，否则即使属性名没写错，拿到的对象也是 `undefined`;
4. 对于无状态组件（Function Component）可以通过 `(props, context) => ReactElement`，并声明 `ChildComponent.contextTypes` 来访问父组件的 `Context`

```js
class ParentComponent extends Component {
  // 声明 `Context` 对象属性
  static childContextTypes = {
    value1: PropTypes.string,
    value2: PropTypes.bool
  };

  // 声明 `getChildContext` 方法
  getChildContext() {
    return {
      value1: this.state.value1,
      value2: this.state.value2
    };
  }

  render() {
    return <MiddleComponent />;
  }
}

class ChildComponent1 extends Component {
  // 声明 `ContextTypes`
  static ContextTypes = {
    value1: PropTypes.string
  };

  render() {
    return <Button>{this.context.value1}</Button>;
  }
}

const FunctionComponent = (props, context) => <Button>{context.value2}</Button>;

// 声明 `ContextTypes`
FunctionComponent.ContextTypes = {
  value2: PropTypes.bool
};
```

## v.16

1. 通过 `React.createContext` 方法创建一个 `Context` 对象，这个对象内部包含有两个组件：`Provider` 和 `Consumer`;
2. 在父组件外层使用 `Provider`，提供给其 `children` 以 `context`；在要使用 `context` 的子组件外部，嵌套一层 `Consumer`，通过 `context => ReactElement` 的方式使用 `context`。
3. 无状态组件可以直接通过 `(props, context) => ReactElement` 直接访问组件的 `Context`；

>创建一个 `Context` 对象。当 `React` 渲染一个订阅了这个 `Context` 对象的组件，这个组件会从组件树中离自身最近的那个匹配的 `Provider` 中读取到当前的 `context` 值。
>
> 只有当组件所处的树中没有匹配到 `Provider` 时，其 `defaultValue` 参数才会生效。这有助于在不使用 `Provider` 包装组件的情况下对组件进行测试。注意：将 `undefined` 传递给 `Provider` 的 `value` 时，消费组件的 `defaultValue` 不会生效。

```js
const defaultContext = {
  name: "luoping"
};

// value 默认值
const Context = React.createContext(defaultContext);

class FatherComponent extends Component {
  render() {
    return (
      <Context.Provider value={{name: 'xiaoming'}}>
        <MiddleComponent />
      </Context.Provider>
    );
  }
}

class ChildComponent extends Component {
  render() {
    return (
      <Context.Customer>
        {context => <Button>{context.name}</Button>}
      </Context.Customer>
    );
  }
}

const FunctionComponent = (props, context) => <Button>{context.name}</Button>;
```

## more

除了实例的 `context` 属性(`this.context`)，React 组件还有很多个地方可以直接访问父组件提供的 `Context`。比如构造方法：

`constructor(props, context)`

比如生命周期：

`componentWillReceiveProps(nextProps, nextContext)`
`shouldComponentUpdate(nextProps, nextState, nextContext)`
`componetWillUpdate(nextProps, nextState, nextContext)`

[React Context](https://zh-hans.reactjs.org/docs/context.html#reactcreatecontext)

[相关博客](https://juejin.im/post/5a90e0545188257a63112977#heading-4)
