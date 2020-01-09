class baseRouter {
  constructor(list, element) {
    this.list = list;
    this.element = element;
  }

  render(path) {
    // 筛选 route
    let route = this.list.find(route => route.path === path);
    // 没有符合的 走通配
    route = route ? route : this.list.find(route => route.path === '*');
    this.element.innerText = route.component;
  }
}

class hashRouter extends baseRouter {
  constructor(list, element) {
    super(list, element);
    window.onhashchange = this.handler;
  }

  handler() {
    let path = location.hash ? location.hash.slice(1) : '/';
    this.render(path);
  }

  go(num) {
    history.go(num);
  }

  push(path) {
    location.hash = path;
  }

  replace(path) {
    // 替换 url 中的 hash
    const href = location.href;
    const i = href.indexOf('#');
    const base = i >= 0 ? href.slice(0, i) : href;
    history.replaceState(null, null, `${base}#${path}`);
  }
}

class historyRouter extends baseRouter {
  constructor(list, element) {
    super(list, element);
    this.handler();
    window.onpopstate = this.handler;
    /**
     * 调用history.pushState()或者history.replaceState()不会触发popstate事件.
     * popstate事件只会在浏览器某些行为下触发, 比如点击后退、前进按钮
     * (或者在JavaScript中调用history.back()、history.forward()、history.go()方法)
     */
  }

  handler() {
    let path = location.pathname ? location.pathname : '/';
    this.render(path);
  }

  go(num) {
    history.go(num);
  }

  push(path) {
    history.pushState(null, null, path);
    this.handler();
  }

  replace(path) {
    history.replaceState(null, null, path);
    this.handler();
  }
}

class router {
  constructor(options) {
    const {
      mode,
      element,
      list
    } = options;
    this.router = mode === 'hash' ? new hashRouter(list, element) : new historyRouter(list, element);
  }

  go() {
    this.router.go();
  }

  push() {
    this.router.push();
  }

  replace() {
    this.router.replace();
  }

}

const routeList = [{
    path: '/',
    name: 'main',
    component: 'Main'
  },
  {
    path: '/home',
    name: 'home',
    component: 'Home'
  }
]