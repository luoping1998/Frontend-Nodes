// 两两比较
function maopao(arr) {
  for(let i = 0; i < arr.length; i ++) {
    for(let j = 0; j < arr.length - 1 - i; j ++) {
      if (arr[j] > arr[j + 1]) { // 大的放后面
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
}

// 选择下标 每趟最小下标
function xuanze(arr) {
  for(let i = 0; i < arr.length; i ++) {
    let index = i;
    for(let j = i + 1; j < arr.length; j ++) {
      if (arr[j] < arr[index]) {
        index = j;
      }
    }
    let temp = arr[i];
    arr[i] = arr[index];
    arr[index] =temp;
  }
}

// 插入排序
function charu(arr) {
  let temp;

  for(let i = 1; i < arr.length; i ++) {
    temp = arr[i];

    let j = i - 1;
    while(arr[j] > temp && j >= 0) {
      arr[j + 1] = arr[j];
      j --;
    }
    arr[j+1] = temp;
  }
}

function kuaipai(arr, left, right) {

  if (left < right) {
    let p = partition(arr, left, right);
    partition(arr, 0, p - 1);
    partition(arr, p, right);
  }
  function partition (arr, left, right) {
    let pivotkey = arr[left];
    let i = left;
    let j = right;

    while(i < j) {
      while(i < j && arr[j] > pivotkey) {
        j --;
      }
      arr[i] = arr[j];

      while(i < j && arr[i] < pivotkey) {
        i ++;
      }
      arr[j] = arr[i];
    }

    arr[i] = pivotkey;
    return i;
  }
}
