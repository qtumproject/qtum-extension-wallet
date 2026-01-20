declare function require(path: string): any;

const pkg = require('../../package.json') as { version?: string };

export const SNAP_VERSION: string =
  typeof pkg?.version === 'string' ? pkg.version : '';
