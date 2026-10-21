import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { chapters, getChapter } from './index';
import { OPTIONS_PER_QUESTION, QUESTIONS_PER_CHAPTER, validateChapter, validateChapterRegistry } from '../../lib/validate-chapter';

/**
 * Content validation for every registered chapter. Runs in `npm run build`, so
 * malformed chapter data fails the build (and the Vercel deployment).
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
});

describe.each(chapters.map((c) => [c.id, c] as const))('%s', (_id, chapter) => {
  it('passes validation', () => {
    expect(validateChapter(chapter)).toEqual([]);
  });

  it(`has exactly ${QUESTIONS_PER_CHAPTER} questions with ${OPTIONS_PER_QUESTION} options each`, () => {
    expect(chapter.questions).toHaveLength(QUESTIONS_PER_CHAPTER);
    for (const q of chapter.questions) {
      expect(q.options).toHaveLength(OPTIONS_PER_QUESTION);
      expect(q.options.filter((o) => o.id === q.correctOptionId)).toHaveLength(1);
    }
  });

  it('points at a source document that exists in the repository', () => {
    expect(existsSync(resolve(process.cwd(), chapter.source.path))).toBe(true);
  });

  it('uses question ids prefixed with the chapter number', () => {
    const prefix = `ch${String(chapter.number).padStart(2, '0')}-q`;
    for (const q of chapter.questions) expect(q.id.startsWith(prefix)).toBe(true);
  });
});
