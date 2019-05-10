# Component && pureComponent
## Component
```
// 工厂模式 定义基本属性 初始化
function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  
  this.refs = emptyObject;
  // 提供了默认的 updater，但是实际上是在 render 中会传入一个具体的 updater 
  this.updater = updater || ReactNoopUpdateQueue;
}

Component.prototype.isReactComponent = {};

// setState (具体可见 state.md)
Component.prototype.setState = function(partialState, callback) {
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};

// 强制更新
Component.prototype.forceUpdate = function(callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
};

```
## pureComponent
```
function ComponentDummy() {}
ComponentDummy.prototype = Component.prototype;

// 具有sCU默认浅等式检查的便捷组件 同Component
function PureComponent(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}

// 构造原型链
const pureComponentPrototype = (PureComponent.prototype = new ComponentDummy());
pureComponentPrototype.constructor = PureComponent;

Object.assign(pureComponentPrototype, Component.prototype);

// 代表该组件为 pureComponent 的标志
pureComponentPrototype.isPureReactComponent = true;

```

> 后续应该跟进 标志位在哪有作用 如何作用 具体步骤
