function maxNum(n, arr) {
  arr = arr.map(item => item.map(i => i - 1));

  let car1 = [];
  let car2 = [];

  let dir = new Array(n).fill(0).map((item, index) => ({ num: index, count: 0 }));

  arr.forEach(item => {
    dir[item[0]].count++;
    dir[item[1]].count++;
  });

  dir.sort((a, b) => a.count - b.count);

  for(let i = 0; i < n; i ++) {
    let now = dir[i].num;
    if (dir[i].count === 0) {
      car1.length > car2.length ? car2.push(now) : car1.push(now);
    }else {
      let not = [];
      arr.forEach(item => {
        if (item[0] === now) {
          not.push(item[1]);
        }else if (item[1] === now) {
          not.push(item[0]);
        }
      });
      if (car1.length > car2.length) {
        if(car1.every(item => not.indexOf(item) === -1)) {
          car1.push(now);
        }else if (car2.every(item => not.indexOf(item) === -1)) {
          car2.push(now);
        }
      }else {
        if(car2.every(item => not.indexOf(item) === -1)) {
          car2.push(now);
        }else if (car1.every(item => not.indexOf(item) === -1)) {
          car1.push(now);
        }
      }
    }
  }

  return 2 * Math.min(car1.length, car2.length);
}

let test = maxNum(5, [
  [1, 4],
  [3, 4]
])

console.log(test);