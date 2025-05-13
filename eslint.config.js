import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    plugins: { js },
    extends: ['js/recommended'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    rules: {
      'no-var': 'error', // var 키워드 사용 가능
      'prefer-const': 'warn', // 변수가 재할당 되지 않는다면 let 대신 const 사용
      'no-cond-assign': 'warn', // 조건문에서 변수값 할당식 사용
      'no-redeclare': 'warn', // 변수 중복 선언
      indent: ['warn', 2], // Prettier의 tabWidth와 일치하도록 2로 설정
    },
  },
  {
    ignores: ['.history', 'dist', 'node_modules'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    extends: [eslintConfigPrettier],
  },
  tseslint.configs.recommended,
]);
