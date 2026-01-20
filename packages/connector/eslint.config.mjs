import rootConfig from '../../eslint.config.mjs';

export default [
  ...rootConfig,
  {
    ignores: [
      'dist/',
      '**/*.js',
      '**/scripts/**/*.js',
      '**/jest.config.ts',
      '**/*.test.ts',
      '**/src/**/types/**/contracts/**/*.ts',
      '**/src/**/types/**/graphql/**/*.ts',
    ],
  },
];
