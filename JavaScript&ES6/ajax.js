function ajax({methods, url, params, data, async}) {
  const isGet = methods === 'get';

  function getUrl() {
    if (isGet) {
      return url + Object.keys(params).reduce((pre, cur) => `${pre}&${cur}=${params[cur]}`, '?');
    }
    return url;
  }

  function createXHR() {
    if (typeof XMLHttpRequest != "undefined") {
      return new XMLHttpRequest();
    }
  }
  return new Promise((resolve, reject) => {
    const xhr = createXHR();

    xhr.open(methods, getUrl(), async);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if ((xhr.status >= 200 && xhr.status < 300) || (xhr.status == 304)) {
          resolve(xhr.responseText);
        }else {
          reject(xhr.status);
        }
      }
    }
    xhr.send(isGet ? null : data);
  })
}