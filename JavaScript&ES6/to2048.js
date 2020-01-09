function to2048(num, arrList) {
  return arrList.map(list => {
    let len = list.length;
    let arr = list.filter(item => item !== 0);
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] = 2 * arr[i];
        arr[i + 1] = 0;
        i++;
      }
    }

    let res = arr.filter(item => item !== 0);
    let count = len - res.length;
    return res.concat(new Array(count).fill(0));
  });
}

let arr = [
  [0, 0, 2],
  [0, 2, 2],
  [0, 4, 2],
  [0, 0, 0, 8, 8, 2]
]

console.log(to2048(4, arr));