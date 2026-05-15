import js from '@eslint/js'
import ts from 'typescript-eslint'
import vue from 'eslint-plugin-vue'
import prettierConfig from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'

export default [
  // 1. Quản lý các file bỏ qua (Phải là object riêng)
  {
    ignores: ['dist/**', 'node_modules/**', '.nuxt/**', '.output/**', 'public/**']
  },

  // 2. Cấu hình cơ bản từ ESLint và TS
  js.configs.recommended,
  ...ts.configs.recommended,

  // 3. Cấu hình Vue (Sử dụng đúng thuộc tính mảng của plugin)
  ...vue.configs['flat/recommended'],

  // 4. Cấu hình chi tiết cho các file mã nguồn
  {
    files: ['**/*.{js,ts,vue,mjs,cjs}'],
    languageOptions: {
      parserOptions: {
        parser: ts.parser, // Ép Vue sử dụng parser của TypeScript
        extraFileExtensions: ['.vue'],
        sourceType: 'module'
      }
    },
    plugins: {
      prettier: prettierPlugin
    },
    rules: {
      // Tích hợp Prettier
      'prettier/prettier': 'error',

      // Tắt các rule gây phiền khi làm project cá nhân
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn'
    }
  },

  // 5. Luôn để Prettier cuối cùng để ghi đè các rule format
  prettierConfig
]
