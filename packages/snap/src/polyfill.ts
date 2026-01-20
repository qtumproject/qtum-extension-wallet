// @ts-ignore
import intl from 'intl/lib/core';
// import 'setImmediate';

if (!window.setImmediate) {
  // @ts-ignore
  window.setImmediate = function (callback) {
    setTimeout(callback, 0);
  };
}

global.Intl = intl;

if (typeof global.crypto.getRandomValues !== 'function') {
  global.crypto.getRandomValues = (array: any) => {
    for (let i = 0, l = array.length; i < l; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
    return array;
  };
}
