/**
 * 截流: 已最后一次触发为主
 * @param {*} fn
 * @param {*} time
 */

// fn.timer 来记录
function debounce(fn, time, immediate) {
  return () => {
    let args = arguments;
    if (fn.timer) {
      clearTimeout(fn.timer);
    }
    if (immediate) {

    }
    fn.timer = setTimeout(() => {
      fn.apply(this, ...args);
    }, time);
  }
}
