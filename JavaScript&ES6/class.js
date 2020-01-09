class Parent {
  constructor(name) {
    this.name = name;
  }

  sayHello() {
    console.log(`Hello, my name is ${this.name}`);
  }
}

class Child extends Parent {
  constructor(name, sex) {
    super(name);
    this.sex = sex;
  }

  sayHi() {
    console.log(`Hi, I'm a ${this.sex}`);
  }
}

let c = new Child('xiaohong', 'girl');

c.sayHello();
c.sayHi();