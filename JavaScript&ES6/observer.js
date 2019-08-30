class Subject {
  constructor(value) {
    this.value = value
    this.observers = [];
  }

  // 注册 observer
  add(observer) {
    this.observers.push[observer];
  }

  // 通知
  notify() {
    this.observers.forEach(observer => observer.update(this.value))
  }

  // 修改方式
  change(cb) {
    this.value = cb(this.value);
    this.notify();
  }
}

class Observer {
  constructor(update) {
    this.callUpdate = update;
  }

  update = value => this.callUpdate(value)
}
