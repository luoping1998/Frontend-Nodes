```js
let array = [1, 2, 3, undefined, 4, null, 'ok'];

let str1 = array.join('+');

let str2 = array.toString();

array.push(10); // 返回数组长度，原数组变化
array.unshift('p'); // 返回数组长度，原数组变化

array.shift(); // 返回首部的第一个元素，原数组变化
array.pop(); // 返回尾巴最后一个元素，原数组变化

array.sort(); // 小 -> 大 默认 Unicode 排序

/**
 * 如果想按照其他标准进行排序，就需要提供比较函数，该函数要比较两个值，
 * 然后返回一个用于说明这两个值的相对顺序的数字。比较函数应该具有两个参数 a 和 b，其返回值如下：
 *
 * 若 a 小于 b，在排序后的数组中 a 应该出现在 b 之前，则返回一个小于 0 的值;
 * 若 a 等于 b，则返回 0;
 * 若 a 大于 b，则返回一个大于 0 的值。
 */
array.sort((a, b) => a - b); // 小 -> 大， 原数组变化

array.reverse(); // 数组颠倒，原数组变化

/**
 * pre: 上一轮函数返回的值，默认为 intialValue || 第一个元素
 * cur: 当前指向元素
 * curIndex: 当前 index
 * arr: 当前 array
 *
 * 在空数组上，不带初始值参数调用reduce()将导致类型错误异常。
 * 如果 调用它的时候只有一个值，数组只有一个元素并且没有指定初始值，
 * 或者 有一个空数组并且指定一个初始值，reduce()只是简单地返回那个值而不会调用化简函数。
 *
 * 返回最后的处理结果
 */

array.reduce((pre, cur, curIndex, arr) => {
  console.log(curIndex, arr === array);
  return pre + cur;
}, initialValue);

array.reduceRight(); // 从右向左

/**
 * concat()方法基于当前数组中的所有项创建一个新数组，先创建当前数组一个副本，
 * 然后将接收到的参数添加到这个副本的末尾，最后返回新构建的数组。
 *
 * 浅拷贝
 */

array.concat();

/**
 * 创建子数组
 *
 * slice()方法基于当前数组中的一个或多个项创建一个新数组，接受一个或两个参数，
 * 即要返回项的起始和结束位置，最后返回新数组，所以slice()不影响原数组
 *
 * slice(start, end) 方法需要两个参数 start 和 end，返回这个数组中从 start 位置到(但不包含) end 位置的一个子数组；
 * 如果 end 为 undefined 或不存在，则返回从 start 位置到数组结尾的所有项
 * 如果 start 是负数，则 start = max(length + start,0)
 * 如果end是负数，则end = max(length + end,0)
 * start和end无法交换位置
 * 如果没有参数，则返回原数组
 *
 * 浅拷贝
 */

array.slice();
array.slice(1); // 1 ... 之后
array.slice(1,4); // 1 ... 3

/**
 * splice()方法用于删除 **原数组** 的一部分成员，
 * 并可以在被删除的位置添加入新的数组成员，该方法会改变原数组
 *
 * splice()返回一个由 **删除元素** 组成的数组，或者如果没有删除元素就返回一个空数组
 * splice()的第一个参数 start 指定了插入或删除的起始位置。
 * 如果 start 是负数，则 start = max(length + start,0)；
 * 如果 start 是NaN，则相当于start = 0
 *
 * 如果只提供一个元素，相当于将原数组在指定位置拆分成两个数组
 *
 * splice(index, deleteNumber, ...ele);
 *
 * 如不提供第二个参数，则从开始位置到最后位置的元素都会被删除
 */

array.splice(0); // array = []
array.splice(3); // array = [ 0...2 ]

array.slice(2, 1); // array = [ 0...1, 3...end ]
array.slice(2, 1, ...args); // array = [ 0...1, 3...end, ...args];

array.indexOf(10); // 从头找 10，返回 index，没有返回 -1；
array.lastIndexOf(10) // 从末尾找 10， 返回 index，没有返回 -1

/**
 * 对数组中的每个元素进行处理，返回每个元素处理之后的值的数组第，二个参数指定一个 this
 *
 * 不改变原数组
 */
array.map((val, index, arr) => {}, context);

/**
 * 对数组中的每个元素进行处理，没有返回值，第二个参数指定一个 this
 *
 * 不改变原数组
 */
array.forEach((val, index, arr) => {}, context);

/**
 * 对数组中进行处理，存在一个返回 true，则返回 true,第二个参数指定一个 this
 *
 * 不改变原数组
 */
array.some((val, index, arr) => val > 3, context);

/**
 * 对数组中进行处理，全部返回 true，则返回true，第二个参数指定一个 this
 *
 * 不改变原数组
 */
array.every((val, index, arr) => val > 3, context);

/**
 * 对数组中进行处理，返回 条件为 true 的元素组成的数组，第二个参数指定一个 this
 *
 * 不改变原数组
 */
array.filter((val, index, arr) => val, context)
```