import type { Chapter } from '../../types/content';
import { validateChapterRegistry } from '../../lib/validate-chapter';
import { chapter01 } from './chapter-01';
import { chapter02 } from './chapter-02';

/**
 * Chapter registry: the single list of chapters shown in the app.
 * To add a chapter, create chapter-XX.ts next to this file and append it here.
 * Pages, routes, and the home page read from this list; no other files need changes.
 */
export const chapters: readonly Chapter[] = [chapter01, chapter02].sort((a, b) => a.number - b.number);

if (import.meta.env.DEV) {
  const errors = validateChapterRegistry(chapters);
  if (errors.length > 0) {
    throw new Error(`Invalid chapter data:\n- ${errors.join('\n- ')}`);
  }
}

export function getChapter(id: string | undefined): Chapter | undefined {
  return chapters.find((chapter) => chapter.id === id);
}
