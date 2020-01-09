let tar = [1, 2, 3, [4, 5, 6, [7, 8]],
  [9, 0, [1],
    [0]
  ],
  [3, 4, 5, [6, 7, [9, 0, [1, [9, [0]]]]]]
];

flat(tar);

function flat(arr) {
  let res = arr.concat();
  while (res.some(item => Array.isArray(item))) {
    let tar = [];
    res.forEach(item => Array.isArray(item) ? tar.push(...item) : tar.push(item));
    res = tar;
  }

  return res;
}