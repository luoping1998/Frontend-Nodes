# 基础 React
直接进入 react 中的 index.js 文件，可以看到如下：
```
const React = {
  Children: {
    map,
    forEach,
    count,
    toArray,
    only,
  },

  createRef,
  Component, // 创建 class 组件常用
  PureComponent,

  createContext,
  forwardRef,
  lazy,
  memo,

  error,
  warn,

  // react 16 中新增的一些 方法
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useDebugValue,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,

  Fragment: REACT_FRAGMENT_TYPE,
  Profiler: REACT_PROFILER_TYPE,
  StrictMode: REACT_STRICT_MODE_TYPE,
  Suspense: REACT_SUSPENSE_TYPE,

  // 创建 react 元素的方法
  createElement: __DEV__ ? createElementWithValidation : createElement,
  cloneElement: __DEV__ ? cloneElementWithValidation : cloneElement,
  createFactory: __DEV__ ? createFactoryWithValidation : createFactory,
  isValidElement: isValidElement,

  version: ReactVersion, // react 版本号

  unstable_ConcurrentMode: REACT_CONCURRENT_MODE_TYPE,

  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: ReactSharedInternals,
};
```
从上面的源码可以看到，React基础模块只包括了基础的API和组件相关的定义。如：createRef、Component等。

主要关注的是 [Component](./Component%20&&%20pureComponent.md)，[createElement](./createElement.md)。
