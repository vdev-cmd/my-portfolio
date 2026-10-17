import { existsSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'

import { resolveSite } from './vite/siteEnv.ts'
import { sitePlugin } from './vite/sitePlugin.ts'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const resolved = resolveSite(env)
  const hasResume = existsSync(fileURLToPath(new URL('./public/resume.pdf', import.meta.url)))

  return {
    base: resolved.base,
    plugins: [
      vue(),
      tailwindcss(),
      sitePlugin(resolved),
      // Dev-only helper; it never ends up in the production bundle or in tests.
      ...(command === 'serve' && mode !== 'test' ? [vueDevTools()] : []),
    ],
    define: {
      __HAS_RESUME__: JSON.stringify(hasResume),
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      target: 'es2022',
      sourcemap: false,
    },
    test: {
      environment: 'jsdom',
      include: ['src/**/*.test.ts', 'vite/**/*.test.ts'],
      setupFiles: ['src/test/setup.ts'],
      restoreMocks: true,
      // CSS is not processed in tests, except `?raw` reads (the design-token contrast test).
      css: { include: [/\.css\?raw$/] },
    },
  }
})
