import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { sourceManifest } from '../source-manifest';

/**
 * LOCAL-ONLY check, run with `npm run verify:sources`.
 * The lecture notes in source_materials/ are private and gitignored, so they are absent on
 * GitHub and Vercel. This file is excluded from `npm test` and `npm run build` (see vite.config.ts).
 */
const files = Object.entries(sourceManifest).flatMap(([chapterId, records]) =>
  Object.entries(records).map(([sourceId, record]) => [`${chapterId}/${sourceId}`, record.path] as const),
);

describe('local source documents', () => {
  it.each(files)('%s exists at %s', (_id, path) => {
    expect(existsSync(resolve(process.cwd(), path)), `Missing private source file: ${path}`).toBe(true);
  });
});
