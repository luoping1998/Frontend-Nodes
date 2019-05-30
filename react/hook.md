# Hook
- 可选
- 向后兼容
- 现在可用 v16.8.0

## 目的 
- 复用状态逻辑（将不同逻辑代码分离到不同的 Hook 函数中去）
- 将组件中相互关联的部分拆分成更小的函数
- 使得在 **非 class组件** 的情况下也能使用更多 React 特性

## useState
允许在函数组件中使用 state
- 参数：initialValue，用于初始化变量的初始值
- 返回值：[ value, setValue ]，value 为当前存储到state 中的变量的值，setValue 为后续用于更改该变量的函数方法

可以理解如下：
```javascript
useState(initialValue) {
  const value = intialValue;
  const setValue = (newValue) => {
    value = newValue;
  }
  return [
    value,
    setValue
  ]
}
```
从上面可以看出，返回由 一个变量 和 一个用于修改该变量的函数 组成的数组。
### 使用方法
```javascript
function Example(props) {
  // 数组解构赋值 初始化 count 为 0
  const [count, setCount] = useState(0);
  
  // 调用 setCount 方法修改 count
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```
### 使用多个 state 变量
🌰 ：
```javascript
function ExampleWithManyStates() {
  // 声明多个 state 变量
  const [age, setAge] = useState(42);
  const [fruit, setFruit] = useState('banana');
  const [todos, setTodos] = useState([{ text: '学习 Hook' }]);
```
在以上组件中，我们有局部变量 age，fruit 和 todos，并且我们可以单独更新它们：
```javascript
function handleOrangeClick() {
  // 和 this.setState({ fruit: 'orange' }) 类似
  setFruit('orange');
}
```
你也可以不必使用多个 state 变量。State 变量可以很好地存储对象和数组，因此，你仍然可以将相关数据分为一组。

然而，不像 class 中的 this.setState，更新 state 变量总是 <span style="color: red;">替换</span> 它而不是合并它。

## useEffect
允许在函数组件中执行副作用操作
> 副作用操作❓ 数据获取，设置订阅以及手动更改 React 组件中的 DOM 都属于副作用。

- 参数：
  - callback，副作用执行的函数，如果返回一个清除函数，则会在组件卸载时执行。
  - [...values]，设置数组，当useEffect中使用到的变量们[...values]没变化时，会跳过对 effect 的调用。
    - 如果使用此优化方式，确保数组中包含了所有外部作用域中会随时间变化并且在 effect 中使用的变量，否则代码会引用到先前渲染中的旧变量。 
- 在组件每次渲染后执行

> 与 componentDidMount 或 componentDidUpdate 不同，使用 useEffect 调度的 effect 不会阻塞浏览器更新屏幕，这让你的应用看起来响应更快。大多数情况下，effect 不需要同步地执行。在个别情况下（例如测量布局），有单独的 useLayoutEffect Hook 供你使用，其 API 与 useEffect 相同。

### 在 React 组件中有两种常见副作用操作：需要清除的和不需要清除的。
#### 无需清除的 effect
我们只想在 React 更新 DOM 之后运行一些额外的代码。比如发送网络请求，手动变更 DOM，记录日志，这些都是常见的无需清除的操作。因为我们在执行完这些操作之后，就可以忽略他们了。
#### 需要清除的 effect
例如，订阅外部数据源。这种情况下，清除工作是非常重要的，可以防止引起内存泄露！

### 使用方法
🌰 ：
```javascript
function FriendStatus(props) {
  // ...
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  }, [count]); // 仅在 count 更改时更新

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    // 绑定订阅
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);

    // 返回一个清除函数 取消订阅
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  }, [props.friend.id]); // 仅在 props.friend.id 发生变化时，重新订阅
}
```
### 使用目的
- 实现关注点分离
- 在每次重渲染时都会执行

**React 会等待浏览器完成画面渲染之后才会延迟调用 useEffect，因此会使得额外操作很方便。**

## 规则
- 只在最顶层使用 Hook，不要在循环，条件或嵌套函数中调用 Hook。
- 只在 React 函数中调用 Hook
### 多个 Hook
```javascript
function Form() {
  // 1. Use the name state variable
  const [name, setName] = useState('Mary');

  // 2. Use an effect for persisting the form
  useEffect(function persistForm() {
    localStorage.setItem('formData', name);
  });

  // 3. Use the surname state variable
  const [surname, setSurname] = useState('Poppins');

  // 4. Use an effect for updating the title
  useEffect(function updateTitle() {
    document.title = name + ' ' + surname;
  });

  // ...
}
```
React 中识别 state 及其对应 useState 靠的是 Hook 调用的顺序。
上述代码执行如下：
```javascript
// ------------
// 首次渲染
// ------------
useState('Mary')           // 1. 使用 'Mary' 初始化变量名为 name 的 state
useEffect(persistForm)     // 2. 添加 effect 以保存 form 操作
useState('Poppins')        // 3. 使用 'Poppins' 初始化变量名为 surname 的 state
useEffect(updateTitle)     // 4. 添加 effect 以更新标题

// -------------
// 二次渲染
// -------------
useState('Mary')           // 1. 读取变量名为 name 的 state（参数被忽略）
useEffect(persistForm)     // 2. 替换保存 form 的 effect
useState('Poppins')        // 3. 读取变量名为 surname 的 state（参数被忽略）
useEffect(updateTitle)     // 4. 替换更新标题的 effect

// ...
```
如果将某歌 Hook 放置到一个条件语句中去，例如：
```javascript
 // 🔴 在条件语句中使用 Hook 违反第一条规则
  if (name !== '') {
    useEffect(function persistForm() {
      localStorage.setItem('formData', name);
    });
  }
```
在第一次渲染中 name !== '' 这个条件值为 **true**，所以我们会执行这个 Hook。但是下一次渲染时我们可能清空了表单，表达式值变为 false。此时的渲染会跳过该 Hook，Hook 的调用顺序发生了改变：
```javascript
useState('Mary')           // 1. 读取变量名为 name 的 state（参数被忽略）
// useEffect(persistForm)  // 🔴 此 Hook 被忽略！
useState('Poppins')        // 🔴 2 （之前为 3）。读取变量名为 surname 的 state 失败
useEffect(updateTitle)     // 🔴 3 （之前为 4）。替换更新标题的 effect 失败
```
React 不知道第二个 useState 的 Hook 应该返回什么。React 会以为在该组件中第二个 Hook 的调用像上次的渲染一样，对应得是 persistForm 的 effect，但并非如此。从这里开始，后面的 Hook 调用都被提前执行，导致 bug 的产生。

**这就是为什么 Hook 需要在我们组件的最顶层调用。** 如果我们想要有条件地执行一个 effect，可以将判断放到 Hook 的内部：
```javascript
useEffect(function persistForm() {
  // 👍 将条件判断放置在 effect 中
  if (name !== '') {
    localStorage.setItem('formData', name);
  }
});
```

## 自定义 Hook
重用状态逻辑的机制，将重复的代码单独提取出来，作为 Hook 函数供其他函数组件调用。自定义 Hook 是一种自然遵循 Hook 设计的约定，而并不是 React 的特性。
> 必须以 “use” 开头吗？必须如此。这个约定非常重要。不遵循的话，由于无法判断某个函数是否包含对其内部 Hook 的调用，React 将无法自动检查你的 Hook 是否违反了 Hook 的规则。

### useReducer
```javascript
// 对不同 action 返回不同 state 的 reducer 函数
function todosReducer(state, action) {
  switch (action.type) {
    case 'add':
      return [...state, {
        text: action.text,
        completed: false
      }];
    // ...
    default:
      return state;
  }
}

// reducer: 对 state 进行相应修改的纯函数
// initialState: state 的初始值
function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState); // 唯一可读state

  // 定义 dispatch 方法对state进行修改
  function dispatch(action) {
    const nextState = reducer(state, action);
    setState(nextState);
  }

  return [state, dispatch];
}

// Todos 函数组件
function Todos() {
  const [todos, dispatch] = useReducer(todosReducer, []);

  function handleAddClick(text) {
    dispatch({ type: 'add', text});
  }
  // ...
}
```