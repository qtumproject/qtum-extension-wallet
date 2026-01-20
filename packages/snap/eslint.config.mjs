import rootConfig from '../../eslint.config.mjs';

export default [
  ...rootConfig,
  {
    ignores: [
      '**/*.test.ts',
      '**/codegen.ts',
      '**/jest.config.ts',
      '**/snap.config.ts',
      'dist/',
      '**/src/typia-generated/*.ts',
      '**/*.js',
      '**/scripts/**/*.js',
      '**/src/**/types/**/contracts/**/*.ts',
      '**/src/**/types/**/graphql/**/*.ts',
    ],
  },
];
