import { defineConfig, globalIgnores } from 'eslint/config'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

export default defineConfig([
  globalIgnores(['dist/**', 'coverage/**', 'node_modules/**']),
  { name: 'app/files', files: ['**/*.{ts,mts,vue,js}'] },
  js.configs.recommended,
  ...defineConfigWithVueTs(pluginVue.configs['flat/recommended'], vueTsConfigs.recommended),
  {
    name: 'app/globals',
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  {
    name: 'app/rules',
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      'vue/block-lang': ['error', { script: { lang: 'ts' } }],
      'vue/component-api-style': ['error', ['script-setup']],
      'vue/define-props-declaration': ['error', 'type-based'],
      'vue/define-emits-declaration': ['error', 'type-based'],
      'vue/no-v-html': 'error',
      // Optional props are `undefined` by default, which the type-based declarations already express.
      'vue/require-default-prop': 'off',
    },
  },
  {
    name: 'app/tests',
    files: ['**/__tests__/**/*.ts', 'src/test/**/*.ts'],
    rules: { '@typescript-eslint/no-non-null-assertion': 'off' },
  },
  prettier,
])
