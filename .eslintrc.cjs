module.exports = {
  root: true,
  env: { es2022: true, browser: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module',
    extraFileExtensions: ['.vue'],
  },
  globals: {
    uni: 'readonly',
    UniApp: 'readonly',
    App: 'readonly',
    Page: 'readonly',
    getCurrentPages: 'readonly',
  },
  rules: {
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
  ignorePatterns: [
    'dist',
    'node_modules',
    '.cache',
    '.dsh-permission-recovery',
    'components.d.ts',
    'src/uni_modules',
  ],
}
