function watch(obj, name, func) {
  let value = obj[name];
  let listeners = [];
  Object.defineProperty(obj, name, {
    get() {
      return value;
      listeners.push(func);
    },
    set(val) {
      value = val;
      listeners.forEach(func => func(val));
    }
  })
}