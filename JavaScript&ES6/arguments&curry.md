# arguments
arguments 对象是所有 **（非箭头）** 函数中都可用的局部变量。可以使用 arguments 对象在函数中引用函数的参数。此对象包含传递给函数的每个参数，第一个参数在索引0处。

## 比较
Function.length 表示函数预期(定义时)需要的参数个数
[Function.length MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/length)

arguments.length 表示函数实际接受到的参数个数
[arguments MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/arguments)

## curry 函数

一个接受任意多个参数的函数，如果执行的时候传入的参数不足，那么它会返回新的函数，新的函数会接受剩余的参数，直到所有参数都传入才执行操作。这种技术就叫柯里化。

## Do it

```javascript
function curry(fn) {
  // 获取第一次 curry 的时候传入的参数
  let outArgs = [...arguments].slice(1);
  return f1() {
    let tarN = fn.length; // 预期需要的参数个数
    // 合并参数
    let args = [...outArgs, ...arguments];
    let len = args.length; // 实际接收到的参数个数

    if (len < tarN) {
      // 如果个数不足，返回预计还需要 tarN - len 个参数的函数
      return curry.call(this, fn, ...args);
    }else {
      // 否则的话，返回计算出的值
      return fn.apply(this, args);
    }
  }
}
```

## 性能
柯里化肯定会有一些开销（函数嵌套，比普通函数占更多内存），但性能瓶颈首先来自其它原因（DOM 操作等）。

从另外一个角度分析，不管你用不用柯里化这个思维，你的代码很可能已经步入了更复杂的模式，会有更大的开销。

有关性能的一些事：

- 存取 arguments 对象通常要比存取命名参数要慢一些。

- 一些老版本的浏览器在 arguments.length 的实现上相当慢。

- 使用 fn.apply() 和 fn.call() 要比直接调用 fn() 要慢点。

- 创建大量嵌套作用域和闭包会带来开销，无论是内容还是速度上。

- 大多数瓶颈来自 DOM 操作

