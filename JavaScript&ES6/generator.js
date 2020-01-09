function* gen() {
  let res = yield 1;
  console.log('hhh');
  yield 2;
  return 0;
  yield 3;
}

let g = gen();

for (let i of g) {
  console.log(i);
}

let obj = {
  name: 'ok',
  sex: 'nv',
  age: 10
}

function run(gen) {
  let g = gen();

  function run() {
    
  }
}