function debounce(fn, wait) {
  wait = wait || 0;
  var timerId;

  function debounced() {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
    timerId = setTimeout(function () {
      fn();
      timerId = null;
    }, wait);
  }
  return debounced;
}

function outPutA() {
  console.log('a');
}

const debouncedOutPutA = debounce(outPutA, 350);

for (var i = 1; i < 10; i++) {
  setTimeout(debouncedOutPutA, i * 100); // 900
}

function outPutB() {
  console.log('b');
}

const debouncedOutPutB = debounce(outPutB, 350);

for (var i = 1, count = 1; i < 10; i++, count += i) {
  setTimeout(debouncedOutPutB, count * 100); // 4500
}