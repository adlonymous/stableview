module.exports = {
  root: true,
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  overrides: [
    {
      files: ['packages/app/**/*.ts', 'packages/app/**/*.tsx'],
      extends: ['next/core-web-vitals'],
    },
    {
      files: ['packages/admin/**/*.ts', 'packages/admin/**/*.tsx'],
      extends: ['next/core-web-vitals'],
    },
  ],
}; 