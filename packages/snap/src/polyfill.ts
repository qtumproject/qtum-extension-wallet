// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import intl from 'intl/lib/core';
// import 'setImmediate';
// eslint-disable-next-line import/no-unassigned-import

if (!window.setImmediate) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.setImmediate = function (callback) {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    setTimeout(callback, 0);
  };
}

global.Intl = intl;

// eslint-disable-next-line import/unambiguous
if (typeof global.crypto.getRandomValues !== 'function') {
  global.crypto.getRandomValues = (array: any) => {
    for (let i = 0, l = array.length; i < l; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
    return array;
  };
}
