# Rudux 状态管理库
一直处于一知半解的状态 希望写完之后能让我 醍醐灌顶 💆🏻‍♀️

## 基本概念
- store 用于存储 state，提供 dispatch 方法用于触发 reducer 得到新的 state，提供 subscribe 方法用于增加监听

- action 用于描述更改的对象，type 必须，其他自定义。

- reducer 用于给出新 state 的**纯函数**，接收 preState 和 action，通过 action 的 type 给出相应的新 state。

## 三大原则
- 单一数据源 Store
- state 只读，唯一修改方式是 dispatch(action)
- 纯函数修改（reducer 为纯函数），不能改变传入参数、不做带副作用的操作、不调用非纯函数

## 基本使用

### Action 创建函数
> 用于创建 action，因为同一种 type 的 action，可能要改变的数据不一样，所以使用创建函数，为每次变更创建 action。

```javascript
function actionChange(text) {
  return {
    type: 'CHANGE',
    text
  }
}
```

### reducer
1. 纯函数！！！【很重要】

2. 可分割为多个 reducer，针对不同类型的数据变更，处理给出不同的结果。

```javascript
// sleepReducer.js
function sleepReducer(state = initalSleepState, action) {
  switch(action.type) {
    // 针对睡眠质量的 Type 返回不同的 newState
    default: return initalState;
  }
}

// reducerEat.js
function eatReducer(state = initalEatState, action) {
  switch(action.type) {
    // 针对吃的怎么样 Type 返回不同的 newState
    default: return initalState;
  }
}
```
然后在使用的时候，利用 combineReducers，生成一个最终的 BossReducer。

```javascript
import { combineReducers } from 'redux'

const bossReducer = combineReducers({
  sleepReducer,
  eatReducer
})

// {
//   sleepReducer,
//   eatReducer
// }

export default bossReducer
```

### mapStateToProps
mapStateToProps(state, ownProps) 用于建立组件跟store的state的映射关系，返回一个object。

传入 mapStateToProps 之后，会 **订阅** store 的状态改变，在每次 store 的 state 发生变化的时候，都会被调用。

ownProps 代表组件本身的 props，如果写了第二个参数 ownProps，那么当 prop 发生变化的时候，mapStateToProps 也会被调用。

例如，当 props 接收到来自父组件一个小小的改动，那么你所使用的 ownProps 参数，mapStateToProps 都会被重新计算）。

mapStateToProps 可以不传，如果不传，组件不会监听 store 的变化，也就是说 Store 的更新不会引起 UI 的更新

```
class SleepComp extends Component {
  // ...
}

const mapStatetoProps = state => {
  return {
    isSleep: state.isSleep,
    sleepStatus: state.sleppStatus
  }
}

export default connect(SleepCmp)(map)
```

### React 中使用

```javascript
import { createStore } from 'redux';
import bossReducer from './reducers';
import initalState from './const';

// 创建 store, 传入 reducer 和 初始 state
let store = createStore(bossReducer, initalState);
```

## 简单实现
```javascript
// enhancer 中间件 先不说
const createStore = (reducer, initialState, enhancer) {
  const store = {};
  store.state = initialState || {};
  store.listeners = [];

  // 订阅变化
  store.subscribe = (listener) => {
    store.listeners.push(listener);
    let key = listeners.length - 1;

    // 返回对应订阅的取消
    return () => {
      store.listeners[key] = null;
    }
  }

  // 更改state
  store.dispatch = (action) => {
    store.state = reducer(store.state, action);
    store.listener.forEach(listener => listener && listener());
  }

  // 获取state
  store.getState = () => store.state;

  return store;
}
```

## Why Reducer ?
> reduce(callback(cur, val, index, array), initialState);

可以看到，reduce 函数是对数组中的值进行一次指定的操作，得到的新值作为下次操作时的 cur 值，继续和当前的 val 值做操作...

把数组中的值当作 state 的话，就可以发现，其实在项目中，对 state 的一些修改，也是基于上次的 state，且这次的新 state 会影响下次的操作结果。

## 扩展
[combineReducers](./combineReducers.md)