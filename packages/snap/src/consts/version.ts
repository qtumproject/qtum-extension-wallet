declare function require(path: string): any;

// eslint-disable-next-line @typescript-eslint/no-require-imports
const pkg = require('../../package.json') as { version?: string };

export const SNAP_VERSION: string = typeof pkg?.version === 'string' ? pkg.version : '';
