let arr = [0, 1, 2, null, 4, 5, 6, 7];

function xianxu(root) {
  let current = root;
  let stack = [];
  let result = [];

  while(current || stack.length) {
    while(current) {
      result.push(current.value);
      stack.push(current);
      current = current.left;
    }
    current = stack.pop();
    current = current.right;
  }
  return result;
}

function zhongxu(root) {
  let current = root;
  let stack = [];
  let result = [];

  while(current || stack.length) {
    while(current) {
      stack.push(current);
      current = current.left;
    }
    current = stack.pop();
    result.push(current.value);
    current = current.right;
  }
  return result;
}

function zhongxu(root) {
  let current = root;
  let stack = [];
  let result = [];

  while(current || stack.length) {
    while(current) {
      stack.push(current);
      current = current.left;
    }
    current = current.right;
  }
  return result;
}