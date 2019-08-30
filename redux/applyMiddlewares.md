# applyMiddlewares

它是 Redux 的原生方法，作用是将 **所有中间件** 组成一个数组，依次执行。

## When ?

一般情况下，使用 Redux 的数据流方向是 action -> dispatch -> reducer，而使用了中间件之后，数据流变成了 action -> dispatch -> middleware -> reducer，就等于子啊 dispatch 和 reducer 中间对 数据和 action 进行了一个拦截，可以做一些其他的操作，比如说 log 日志，或者是请求 api ...

## What ？

再看看 applyMiddlewares 的签名(enhancer)

```js
type StoreCreator = (reducer: Reducer, initialState: ?State) => Store

type enhancer = (next: StoreCreator) => StoreCreator
```

可以发现，实际上 applyMiddlewares 是对 createStore 进行了一个处理，再看看它的实现

```js
export default function applyMiddleware(...middlewares）{
  return (createStore) => (reducer, preloadedState, enhancer) => {
    // 接收到的原本 createStore 参数 创建一个 store
    var store = createStore(reducer, preloadedState, enhancer)
    var dispatch = store.dispatch
    var chain = []

    // 传递给中间件的参数
    var middlewareAPI = {
      getState: store.getState,
      dispatch: (action) => dispatch(action)
    }

    // 注册中间件调用链 所有的中间件最外层函数接收的参数都是 `{ getState,dispatch }`
    chain = middlewares.map(middleware => middleware(middlewareAPI))

    // compose 函数 把所有中间件结合起来
    // 所有的中间件第二层函数接收的参数为 dispatch，一般我们在定义中间件时这个形参叫 next，是由于此时的 dispatch 不一定是原始 store.dispatch，有可能是被包装过的新的 dispatch
    dispatch = compose(...chain)(store.dispatch)

    // 返回经 middlewares 增强后的 store
    return {
      ...store,
      dispatch
    }
  }
}
```

### 再看看 compose 做了什么。

compose 实际做的其实是对传入的系列函数做了一个组合，例如：

```js
compose(A, B, C)(data);

// 等价于

A(B(C(data)));
```

它的实现实际上是利用 reduce 函数，如下：

```js
function compose(...funcs) {
  // 如果没有传入 返回一个 纯函数
  if (funcs.length === 0) {
    return arg => arg
  }

  // 如果只有一个 返回它
  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
```

举个例子 🌰

```js
let x = 1;
let add1 = x => x + 1;
let add2 = x => x + 2;
let add3 = x => x + 3;
let add4 = x => x + 4;

compose(add1, add2, add3, add4);

// 1. a: add1, b: add2
(...args) => add1(add2(...args));

// 2. a: (...args) => add1(add2(...args)), b: add3
(...args) => add1(add2(add3(...args)))

// 3. a: (...args) => add1(add2(add3(...args))), b: add4
(...args) => add1(add2(add3(add4(...args))))
```

### 再者，实际上，我们可以看到一个 middleware 的结构应该如下:

```js
middleware = ({ dispatch, getState }) => next => action => {...}

// 比如 redux-thunk
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => next => action => {
    // 如果 action 是函数 传入 dispatch 可以在 action 内部进行 dispatch 和 state 的获取 ...
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }

    // 否则 日常用法 action 传入 next（下一个 dispatch）
    return next(action);
  };
}
```

## How

由上面我们可以看到，applyMiddlewares 只是对传入的中间件进行了一个合并，并且加强生成了一个新的 dispatch 方法，替代了原本 createStore 生成的 store 的 dispatch 方法。

如下:
```js
middles = [mid1, mid2, mid3];

createStore(reducer, intialState, applyMiddleWares(...middles));

// 内部步骤如下:
// 1. 创建日常的 store
let store = createStore(reducer, intialState, applyMiddleWares(...middles));

// 2. 初始化要用到的数据 
// 2.1 要加强使用的 dispatch
let dispatch = store.dispatch;
// 2.2 初始化要用的 middleware
let chain = [];
// 2.3 得到 middleware 需要的参数
let middlewareAPI = {
  getState: store.getState,
  dispatch: (action) => dispatch(action)
}

// 3. 得到 chain 实际是存储了注入 API 后返回的函数
chain = middles.map(middle => middle(middlewareAPI))

// 4. 得到加强后的 disptach 
disptach = compose(chain)(dispatch)
```

## Think

其实，到这里，就更加理解 reduce 对于 redux 的一个重要性了。从每次的 reducer 到 dispatch 实际上都是对上一个状态的一个变更。而 applyMiddlewares 则是对上一个中间件加强过的 dispatch 上又加强了。reduce 🐂🍺