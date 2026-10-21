import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { chapters } from './index';

/**
 * LOCAL-ONLY check, run with `npm run verify:sources`.
 * The lecture notes in source_materials/ are private and gitignored, so they are absent on
 * GitHub and Vercel. This file is excluded from `npm test` and `npm run build` (see vite.config.ts).
 */
describe('local source documents', () => {
  it.each(chapters.map((c) => [c.id, c.source.path] as const))('%s source exists at %s', (_id, path) => {
    expect(existsSync(resolve(process.cwd(), path)), `Missing private source file: ${path}`).toBe(true);
  });
});
