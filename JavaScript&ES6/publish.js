class myEvent {
  constructor() {
    this.events = [];
  }

  on(event, callback) {
    if (this.events[event]) {
      this.events[event].push(callback);
    }else {
      this.events[event] = [callback];
    }
  }

  remove(event, callback) {
    if (this.events[event]) {
      this.events[event].filter(cb => cb !== callback);
    }
  }

  fire(event) {
    if (this.events[event]) {
      this.events[event].forEach(cb => cb());
    }else {
      throw(`no event "${event}"`);
    }
  }
}