import type { SnapConfig } from '@metamask/snaps-cli';

const config: SnapConfig = {
  input: 'src/index.ts',
  output: {
    path: 'dist',
    filename: 'bundle.js',
  },
  server: {
    enabled: true,
    port: 8081,
  },
  manifest: {
    update: true
  },
  polyfills: {
    buffer: true,
    crypto: true
  }
};

export default config;
