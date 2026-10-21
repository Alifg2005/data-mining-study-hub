import { configDefaults } from 'vitest/config';
import viteConfig, { LOCAL_ONLY_TESTS } from './vite.config';

/** Runs only the local-only checks that need the private source_materials/ files. */
export default {
  ...viteConfig,
  test: { ...viteConfig.test, include: [LOCAL_ONLY_TESTS], exclude: [...configDefaults.exclude] },
};
