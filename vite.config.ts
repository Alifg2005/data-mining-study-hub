import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/** Tests that need private, gitignored files. Run only via `npm run verify:sources`. */
export const LOCAL_ONLY_TESTS = '**/*.local.test.ts';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    exclude: [...configDefaults.exclude, LOCAL_ONLY_TESTS],
  },
});
