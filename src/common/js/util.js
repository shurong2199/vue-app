function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function shuffle(arr) {
  // let _arr = arr.slice();
  const _arr = [...arr]; // ES6
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i);
    [_arr[i], _arr[j]] = [_arr[j], _arr[i]];
  }
  return _arr;
}

export function debounce(func, delay = 200) {
  let timer;
  return (...args) => {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}