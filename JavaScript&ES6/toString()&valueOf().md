# toString() & valueOf()

> 为了帮助自己分清楚这两个方法的区别

- valueOf()：返回最适合该对象类型的原始值；
- toString(): 将该对象的原始值以字符串形式返回。

这两个方法一般是交由JS去隐式调用，以满足不同的运算情况。
在数值运算里，会优先调用valueOf()，在字符串运算里，会优先调用toString()。

## toString()

**返回一个对象的字符串表示。**

> 个人理解：toString 方法定义在 Object 上，【Function、Array、Date、RegExp】(内置对象)、【String、Number、Boolean】(基本包装对象) 、【Symbol】(由 Symbol 函数生成？)均有该方法，而 Undefined 和 Null 没有。所以，一个一个来看。

- Object "[Object Type]"

- Function 返回一个表示当前函数源代码的字符串

- Array 返回一个字符串，表示指定的数组及其元素。

- String 返回一个字符串。

- Number 返回指定数字的字符串表示

- Boolean 返回指定布尔值的字符串表示

- Date 返回一个字符串，把 Date 对象转换为字符串。

- RegExp 返回一个表示该正则表达式的字符串。

```javascript
let a = new Object(); // "[object Object]"

let b = function say() {
  console.log('hello');
}
/*
  "function say() {
    console.log('hello');
  }"
*/

let c1 = [1, 2, 3]; // "1,2,3"

let c2 = new Array(3); // ",,"

let d = new Date(); // "Wed Aug 21 2019 18:21:53 GMT+0800 (中国标准时间)"

let e = /[0-9]+/; //"/[0-9]+/"

let f1 = 'hhhh'; // "hhhh"

let f2 = new String('???'); // "???"

let g1 = 10; // "10"

let g2 = new Number(2); // "2"

let h1 = true; // "true"

let h2 = new Boolean(false); // "false"

let j = Symbol(); // "Symbol()"
```

## valueOf()

**返回最适合该对象类型的原始值**

```javascript
let a = new Object(); // {}

let b = function say() {
  console.log('hello');
}
/*
  ƒ say() {
    console.log('hello');
  }
*/
let c1 = [1, 2, 3]; // (3) [1, 2, 3]

let c2 = new Array(3); // (3) [empty × 3]

let d = new Date(); // Wed Aug 21 2019 18:41:09 GMT+0800 (中国标准时间)

let e = /[0-9]+/; // /[0-9]+/

let f1 = 'hhhh'; // "hhhh"

let f2 = new String('???'); // String {"???"}

let g1 = 10; // 10

let g2 = new Number(2); // Number {2}

let h1 = true; // true

let h2 = new Boolean(false); // Boolean {false}

let j = Symbol(); // Symbol()
```

<!-- 
个人认为之后的比较没有意义，可直接看数据类型转换。 ## 比较

这两个方法一般是交由JS去隐式调用，以满足不同的运算情况。
在数值运算里，会优先调用 valueOf()，在字符串运算里，会优先调用 toString()。

```javascript
let e2 = {
  n : 2,
  toString: function (){
    console.log('this is toString')
    return this.n
  },
  valueOf: function(){
    console.log('this is valueOf')
    return this.n*2
  }
}
alert(e2) //  2  this is toString
alert(+e2)  // 4 this is valueOf
alert('' + e2) // 4 this is valueOf
alert(String(e2)) // 2 this is toString
alert(Number(e2)) // 4 this is valueOf
alert(e2 == '4') // true  this is valueOf
alert(e2 === 4) // false === 操作符不进行隐式转换
```

第三个之所以会调用valueOf是因为，在有运算操作符的情况下，对象默认走 ToPrimitive，而 e2 不是 Date 对象，默认先走 valueOf。

```javascript
let e3 = {
  n : 2,
  toString : function (){
  console.log('this is toString')
    return this.n
  }
}
alert(e3) //  2  this is toString
alert(+e3)  // 2 this is toString
alert(''+e3) // 2 this is toString
alert(String(e3)) // 2 this is toString
alert(Number(e3)) // 2 this is toString
alert(e3 == '2') // true this is toString
alert(e3 === 2) // false === 操作符不进行隐式转换
```
再看这个例子，发现改写了 toString，所有默认都走 toString，那改写 valueOf 呢？

```javascript
let e4 = {
  n : 2,
  valueOf : function (){
  console.log('this is valueOf')
    return this.n*2
  }
}
alert(e4) //  [Object object]
alert(+e4)  // 4 this is valueOf
alert(''+e4) // 4 this is valueOf
alert(String(e4)) // [Object object]
alert(Number(e4)) // 4 this is valueOf
alert(e3 == '2') // false this is valueOf
alert(e3 === 2) // false === 操作符不进行隐式转换
```

发现 String 和第一个还是走的 toString（从 Object 上继承下来的）,而其他的都走 valueOf，除了最后一个。

那假如把默认的 toString 去了。

```javascript
Object.prototype.toString = null;

let e4 = {
  n : 2,
  valueOf : function (){
  console.log('this is valueOf')
    return this.n*2
  }
}
alert(e4) //  4 this is valueOf
alert(+e4)  // 4 this is valueOf
alert(''+e4) // 4 this is valueOf
alert(String(e4)) // 4 this is valueOf
alert(Number(e4)) // 4 this is valueOf
alert(e3 == '2') // false this is valueOf
alert(e3 === 2) // false === 操作符不进行隐式转换
```

如果只重写了 toString，对象转换时会无视 valueOf 的存在来进行转换。但是，如果只重写了 valueOf 方法，在要转换为字符串的时候会优先考虑 toString 方法。在不能调用 toString 的情况下，只能让valueOf上阵了。重写会加大它们调用的优先级，而在有操作符的情况下，由于调用的是 ToPrimitive，只要对象不是 Date 类型，默认 valueOf 的优先级比 toString 高。 -->