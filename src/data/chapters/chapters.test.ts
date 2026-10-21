import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { chapters, getChapter } from './index';
import { sourceManifest } from '../source-manifest';
import {
  OPTIONS_PER_QUESTION,
  QUESTIONS_PER_CHAPTER,
  validateChapter,
  validateChapterRegistry,
} from '../../lib/validate-chapter';
import { validateChapterSources } from '../../lib/validate-sources';

/**
 * Content validation for every registered chapter. Runs in `npm run build`, so
 * malformed chapter data fails the build (and the Vercel deployment).
 *
 * The source documents are private and not committed, so these tests check source
 * metadata against src/data/source-manifest.ts only. `npm run verify:sources` checks
 * that the files exist locally.
 */
describe('chapter registry', () => {
  it('has no registry-level problems', () => {
    expect(validateChapterRegistry(chapters)).toEqual([]);
  });

  it('is sorted by chapter number', () => {
    const numbers = chapters.map((c) => c.number);
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
  });

  it('looks chapters up by id and handles unknown ids', () => {
    expect(getChapter('chapter-01')?.number).toBe(1);
    expect(getChapter('chapter-99')).toBeUndefined();
    expect(getChapter(undefined)).toBeUndefined();
  });

  it('has a source manifest entry for exactly the registered chapters', () => {
    expect(Object.keys(sourceManifest).sort()).toEqual(chapters.map((c) => c.id).sort());
  });
});

describe('source privacy', () => {
  it('keeps private source paths and their modules out of application code', () => {
    // Test-only modules that may contain repository paths.
    const privateModules = ['source-manifest.ts', 'validate-sources.ts'];
    const srcDir = resolve(process.cwd(), 'src');
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const name of readdirSync(dir)) {
        const full = join(dir, name);
        if (statSync(full).isDirectory()) walk(full);
        else if (/\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name) && !privateModules.includes(name)) files.push(full);
      }
    };
    walk(srcDir);
    expect(files.length).toBeGreaterThan(10);
    const importsPrivate = /from\s+['"][^'"]*(source-manifest|validate-sources)['"]/;
    const offenders = files.filter((f) => {
      const code = readFileSync(f, 'utf8');
      return /source_materials/.test(code) || importsPrivate.test(code);
    });
    expect(offenders).toEqual([]);
  });
});

describe.each(chapters.map((c) => [c.id, c] as const))('%s', (_id, chapter) => {
  it('passes validation', () => {
    expect(validateChapter(chapter)).toEqual([]);
  });

  it('cites only verified pages, slides and sections of its manifest sources', () => {
    expect(validateChapterSources(chapter, sourceManifest[chapter.id])).toEqual([]);
  });

  it('has at least one source reference', () => {
    const refs = [
      ...chapter.reviewSections.filter((s) => s.source),
      ...chapter.questions.filter((q) => q.sourceReference),
    ];
    expect(refs.length).toBeGreaterThan(0);
  });

  it(`has exactly ${QUESTIONS_PER_CHAPTER} questions with ${OPTIONS_PER_QUESTION} options each`, () => {
    expect(chapter.questions).toHaveLength(QUESTIONS_PER_CHAPTER);
    for (const q of chapter.questions) {
      expect(q.options).toHaveLength(OPTIONS_PER_QUESTION);
      expect(q.options.filter((o) => o.id === q.correctOptionId)).toHaveLength(1);
    }
  });

  it('uses question ids prefixed with the chapter number', () => {
    const prefix = `ch${String(chapter.number).padStart(2, '0')}-q`;
    for (const q of chapter.questions) expect(q.id.startsWith(prefix)).toBe(true);
  });
});
