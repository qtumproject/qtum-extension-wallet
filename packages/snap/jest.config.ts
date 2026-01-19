import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: '@metamask/snaps-jest',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
          jsxImportSource: '@metamask/snaps-sdk',
        },
        useESM: true,
      },
    ],
  },
};

export default config;
