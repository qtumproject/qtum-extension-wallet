const fs = require('fs');
const pathUtils = require('path');
const { postProcessBundle } = require('@metamask/snaps-utils/node');

const bundlePath = pathUtils.join('dist', 'bundle.js');
console.log('Bundle replace code to SES', bundlePath);

// eslint-disable-next-line node/no-sync
let bundleString = fs.readFileSync(bundlePath, 'utf8');

console.log('[Start]: MetaMask Snaps transform');

bundleString = postProcessBundle(bundleString, {
  stripComments: true,
}).code;

// Alias `window` as `self`
bundleString = 'var self = window;\n'.concat(bundleString);

console.log('[End]: MetaMask Snaps transform');

console.log('[Start]: Custom transform');

bundleString = bundleString.replace(
  "/** @type {import('cborg').TagDecoder[]} */",
  '',
);

// Replace require calls for @metamask/snaps-sdk with proper module access
bundleString = bundleString.replace(
  /var\s+(\w+)\s+=\s+require\(["']@metamask\/snaps-sdk\/jsx["']\);/g,
  'var $1 = snap;'
);
bundleString = bundleString.replace(
  /var\s+(\w+)\s+=\s+require\(["']@metamask\/snaps-sdk\/jsx-runtime["']\);/g,
  'var $1 = snap;'
);
bundleString = bundleString.replace(
  /var\s+(\w+)\s+=\s+require\(["']@metamask\/snaps-sdk["']\);/g,
  'var $1 = snap;'
);

// [Polygon ID] Fix Worker
bundleString = 'var Worker = {};\n'.concat(bundleString);

// [Polygon ID] Fix promise
bundleString = bundleString.replaceAll(
  `new Function("return this;")().Promise`,
  'Promise',
);

// [Polygon ID] fix single thread
bundleString = bundleString.replaceAll(`if (singleThread)`, `if (true)`);

// [Polygon ID] fix single thread
bundleString = bundleString.replaceAll(
  `singleThread: singleThread ? true : false`,
  `singleThread: true`,
);

// [Polygon ID] Remove fs
bundleString = bundleString.replaceAll('fs2.readFileSync;', 'null;');
bundleString = bundleString.replaceAll('fs3.readFileSync;', 'null;');

// [qtum-ethers-wrapper / lodash] Replace Node Buffer.copy with Uint8Array.set
// Under SES/snap sandbox the source can be a plain Uint8Array without .copy.
// Both Buffer and Uint8Array have .set, which is equivalent when no source slice is used.
bundleString = bundleString.replaceAll(
  'buffer.copy(this._buffer, this._position);',
  'this._buffer.set(buffer, this._position);',
);
bundleString = bundleString.replaceAll(
  'buffer.copy(result);',
  'result.set(buffer);',
);
bundleString = bundleString.replaceAll(
  'buffer.copy(result2);',
  'result2.set(buffer);',
);

console.log('[End]: Custom transform');

fs.writeFileSync(bundlePath, bundleString);

console.log('Finished post-processing bundle');
