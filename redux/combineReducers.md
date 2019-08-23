# combineReducers

## When ？
在面对 state 内部结构较为复杂的时候，希望对 state 进行再划分，单一 reducer 管理 单一 state 的某属性，例如：

```js
  state = {
    sleep: {
      // ...
    },
    eat: {
      // ...
    },
    play: {
      // ...
    },
    // ...
  }
```

对于上述状态我们希望有单独的 sleepReducer、eatReducer ... 对 sleep、eat ... 进行单一的变更管理。于是衍生出如下:

```js
  const sleepReducer = (state = initalSleepState, action) => {
    // ...
  }

  const eatReducer = (state = initalEatState, action) => {
    // ...
  }

  // ...
```

而 createStore 是仅支持传入一个 reducer 来创建 store 的，此时，就用到了我们滴 combineReducers。

```js
const reducer = combineReducers({
  sleep: sleepReducer,
  eat: eatReducer,
  // ...
})

const store = createStore(reducer, initalState);
```

## How ？

那它是怎么工作的呢？

combineReducers 会接收一个由 reducer 组成的对象，然后对 reducer 进行一个合并，最后返回的 state 也是经过这些 reducer 处理之后得到的最终的 state。

话不多说，看代码：

```js
import { ActionTypes } from './createStore'
import isPlainObject from 'lodash/isPlainObject'
import warning from './utils/warning'

// 对于 undefined 的 state 给出错误信息
function getUndefinedStateErrorMessage(key, action) {
  const actionType = action && action.type
  const actionName = (actionType && `"${actionType.toString()}"`) || 'an action'

  return (
    `Given action ${actionName}, reducer "${key}" returned undefined. ` +
    `To ignore an action, you must explicitly return the previous state. ` +
    `If you want this reducer to hold no value, you can return null instead of undefined.`
  )
}

// 对于非预期的 state 给出警告信息
function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
  const reducerKeys = Object.keys(reducers)
  const argumentName = action && action.type === ActionTypes.INIT ?
    'preloadedState argument passed to createStore' :
    'previous state received by the reducer'

  if (reducerKeys.length === 0) {
    return (
      'Store does not have a valid reducer. Make sure the argument passed ' +
      'to combineReducers is an object whose values are reducers.'
    )
  }

  if (!isPlainObject(inputState)) {
    return (
      `The ${argumentName} has unexpected type of "` +
      ({}).toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] +
      `". Expected argument to be an object with the following ` +
      `keys: "${reducerKeys.join('", "')}"`
    )
  }

  const unexpectedKeys = Object.keys(inputState).filter(key =>
    !reducers.hasOwnProperty(key) &&
    !unexpectedKeyCache[key]
  )

  unexpectedKeys.forEach(key => {
    unexpectedKeyCache[key] = true
  })

  if (unexpectedKeys.length > 0) {
    return (
      `Unexpected ${unexpectedKeys.length > 1 ? 'keys' : 'key'} ` +
      `"${unexpectedKeys.join('", "')}" found in ${argumentName}. ` +
      `Expected to find one of the known reducer keys instead: ` +
      `"${reducerKeys.join('", "')}". Unexpected keys will be ignored.`
    )
  }
}

// 遍历 reducers，对于 initalState 为 undefined 或者会返回 undefined 作为 state 的 reducer 抛出异常
function assertReducerShape(reducers) {
  Object.keys(reducers).forEach(key => {
    const reducer = reducers[key]
    const initialState = reducer(undefined, { type: ActionTypes.INIT })

    if (typeof initialState === 'undefined') {
      throw new Error(
        `Reducer "${key}" returned undefined during initialization. ` +
        `If the state passed to the reducer is undefined, you must ` +
        `explicitly return the initial state. The initial state may ` +
        `not be undefined. If you don't want to set a value for this reducer, ` +
        `you can use null instead of undefined.`
      )
    }

    const type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.')
    if (typeof reducer(undefined, { type }) === 'undefined') {
      throw new Error(
        `Reducer "${key}" returned undefined when probed with a random type. ` +
        `Don't try to handle ${ActionTypes.INIT} or other actions in "redux/*" ` +
        `namespace. They are considered private. Instead, you must return the ` +
        `current state for any unknown actions, unless it is undefined, ` +
        `in which case you must return the initial state, regardless of the ` +
        `action type. The initial state may not be undefined, but can be null.`
      )
    }
  })
}

// 重点在这！！！！！
export default function combineReducers(reducers) {
  //第一次筛选，对于不是 function 的 reducer 进行清理
  const reducerKeys = Object.keys(reducers)
  const finalReducers = {}
  for (let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i]

    if (process.env.NODE_ENV !== 'production') {
      if (typeof reducers[key] === 'undefined') {
        warning(`No reducer provided for key "${key}"`)
      }
    }

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key]
    }
  }

  //第二次筛选，检测`finalReducers`中是否存在 initalState 为 undefined 或者可能返回 undefined 作为 state 的 reducer。如果存在，则抛出异常，shapeAssertionError 记录。
  const finalReducerKeys = Object.keys(finalReducers)

  let unexpectedKeyCache
  if (process.env.NODE_ENV !== 'production') {
    unexpectedKeyCache = {}
  }

  let shapeAssertionError
  try {
    assertReducerShape(finalReducers)
  } catch (e) {
    shapeAssertionError = e
  }

  return function combination(state = {}, action) {
    //如果刚才检测 finalReducers 不合格 则抛出异常
    if (shapeAssertionError) {
      throw shapeAssertionError
    }
    //如果不是 production 环境则抛出 warning
    if (process.env.NODE_ENV !== 'production') {
      const warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache)
      if (warningMessage) {
        warning(warningMessage)
      }
    }

    // 初始化标志位
    let hasChanged = false
    // 记录新 state
    const nextState = {}

    //遍历所有的reducer，分别执行，将其计算出的 state 组合起来生成一个大的 state。所以，任何 action，redux 都会遍历所有的reducer。
    for (let i = 0; i < finalReducerKeys.length; i++) {
      const key = finalReducerKeys[i]
      const reducer = finalReducers[key]
      // 为每一个reducer 计算一个 state。
      const previousStateForKey = state[key]
      const nextStateForKey = reducer(previousStateForKey, action)
      //如果计算出来的 state 有 undefined，抛出错误.
      if (typeof nextStateForKey === 'undefined') {
        const errorMessage = getUndefinedStateErrorMessage(key, action)
        throw new Error(errorMessage)
      }

      //将每一个reducer计算出来的state合并成一个大的state.
      nextState[key] = nextStateForKey
      //只要有一个reducer计算出来的state和之前的不一样，就表明状态树改变了。
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey
    }

    return hasChanged ? nextState : state
  }
}
```

总而言之，就是接收一个 `{ stateKey: stateReducer, // ... }` 结构的对象，返回一个整合之后的 reducer，对于每次的 dispatch，所有的 reducer 都会走一遍，最后返回一个 `{ stateKey: stateValue, // ... }` 的最终 state。

## Q&A

Q：对于如下场景，输出的 state 结构，名称不符合自己预期，咋整？？

A：看源码就知道啦，你在 combineReducer 时传入一个什么样结构的 reducer 组成的对象，就会输出一个什么结构的 state。如：

```js
combineReducer({
  sleep: sleepReducer,
  eatReducer
})

// { sleep: xxx, eatReducer: xxx }
```
所以，自己在传入的时候进行修改就好了。另外，combineReducer 不仅可以用在根哦，如果某子 状态很复杂，也可以使用它～