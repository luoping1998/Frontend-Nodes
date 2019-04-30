# state（状态）✌️
state 用于组件内部，主要用于 **存储** 内部属性，并且 **仅能** 在构造函数中进行初始化。
> 举个例子🌰，有一个计数器组件，初始 count 展示为0，它有"➕"按钮，每次用于 +1；有"➖"按钮，每次用于 -1。那么，count 就属于内计数器组件内部的属性，就会被存在组件的state属性中。
## 更新
> state 的更新，只能使用setState()
## setState
如下，为 setState 的基本定义
```$xslt
/**
 * 1.需要把 this.state 视为 immutable (不可变的)
 *
 * 2.并不保证即时更新，所以，在调用了 this.setState 后也可能返回的是旧的state值
 * 原因：setState 并不保证是同步的，因为它们最终可能会被 '批处理'
 * 但是可以提供一个函数，当 setState 被调用的时候，这个函数就会被执行。
 *
 * 3.当提供了一个 callbcak 给 setState 时，它也是会在未来的某一时刻被执行，但并不同步。
 * 它将和最新的 component 参数（props, state, context）一起被调用。
 * 它会在 recevieProps 之后，shouldComponentUpdate 之前被调用，所以新的 state，props 和 context 此时并没有指派给 this 。
 *
 */
 
Component.prototype.setState = function(partialState, callback) {
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};
```
### partialState
- object: setState 会对传入的 partialState 和现有的 state 进行一层浅合并，这种情况下不保证即时更新，因为最终这些改变是存在一个队列当中，进行批处理
```angular2
    // TODO:此处存在一个队列中 进行批处理的代码 还没看到...
```
- function: 需要返回一个 object 用于更新 state (可见注释 2)，当setState被调用的时候，就会执行
```$xslt
  enqueueSetState(publicInstance, partialState, callback, callerName) {
    // 向队列中加入新 cb
    this._enqueueCallback(callback, publicInstance);
    // 获取当前的状态 new（记录最新state） 或 原 state（仅当第一次调用时）
    const currentState = this._renderer._newState || publicInstance.state;

    //如果传入的为function 在实例上调用 并且存储 返回值为 partialState
    if (typeof partialState === 'function') {
      partialState = partialState.call(
        publicInstance,
        currentState,
        publicInstance.props,
      );
    }

    // Null and undefined are treated as no-ops.
    if (partialState === null || partialState === undefined) {
      return;
    }

    // 浅合并
    this._renderer._newState = {
      ...currentState,
      ...partialState,
    };

    this._renderer.render(this._renderer._element, this._renderer._context);
  }
```

### callback
在 state 被更新后执行，即在执行的时候，会最新的 component 参数一起。
> 即为上述代码中加入队列的 cb
```
  render(element: ReactElement | null, context: null | Object = emptyObject) {
    // 省略一些判断

    // 走两条 ： 挂载 || 更新
    // 存在实例 直接更新
    if (this._instance) {
      // 存在 更新
      this._updateClassComponent(elementType, element, this._context);
    } else {
      // 是否是 ReactComponent 类型
      if (shouldConstruct(elementType)) {
        // 创建实例，走挂载
        this._instance = new elementType(
          element.props,
          this._context,
          this._updater,
        );
        
        // 省略走生命周期钩子代码

        // 挂载
        this._mountClassComponent(elementType, element, this._context);
      } else {
        let shouldRender = true;
        if (isMemo(element.type) && previousElement !== null) {
          // 默认浅比较
          const compare = element.type.compare || shallowEqual;
          if (compare(previousElement.props, element.props)) {
            // props 相同 则置为 false
            shouldRender = false;
          }
        }
        if (shouldRender) {
            // 省略判断是否渲染...
        }
      }
    }

    this._rendering = false; // 标识位置回 false
    // 🌿 重点：触发所有的 setState 的 callback 
    this._updater._invokeCallbacks();

    // 返回对应的输出
    return this.getRenderOutput();
  }
```
