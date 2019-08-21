// fn.timer 来记录
function debounce(fn, time) {
  return () => {
    if (fn.timer) {
      clearTimeout(fn.timer);
    }
    fn.timer = setTimeout(fn, time);
  }
}