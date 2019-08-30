Function.prototype.myApply = function (obj, args) {
  obj = obj || window;
  obj.fn = this;
  obj.fn(...args);
  obj.fn = null;
}

Function.prototype.myCall = function (obj) {
  obj = obj || window;
  let args = [...arguments].slice(0);
  obj.fn = this;
  obj.fn(...args);
  obj.fn = null;
}

Function.prototype.myBind = function (obj) {
  obj = obj || window;
  let outerArgs = [...arguments].slice(0);
  return (...args) => {
    obj.fn = this;
    obj.fn(...outerArgs, ...args);
    obj.fn = null;
  }
}

// var person = new Person('jim');
// person.setAge(21).setPosition('developer').sayHi();
// 输出‘Hello,my name is jim,21 years old, I am a developer’

function Person(name) {
  this.name = name;
}

Person.prototype.setAge = function (age) {
  this.age = age;
  return this;
}

Person.prototype.setPosition = function (position) {
  this.position = position;
  return this;
}

Person.prototype.sayHi = function () {
  console.log(`Hello, my name is ${this.name}, ${this.age} years old, i am a ${this.position}`);
}