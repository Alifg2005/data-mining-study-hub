import { describe, expect, it } from 'vitest';
import type { Chapter } from '../types/content';
import { formatSourceCitation, formatSourceLocation, resolveSource } from './sources';

const chapter = {
  sources: [
    { id: 'notes', title: 'Notes', unit: 'page' },
    { id: 'slides', title: 'Lecture slides', unit: 'slide' },
    { id: 'handout', title: 'Handout', unit: 'section' },
  ],
} as unknown as Chapter;
const single = { sources: [{ id: 'notes', title: 'Notes', unit: 'page' }] } as unknown as Chapter;

describe('source formatting', () => {
  it('formats pages, slides and sections with readable titles only', () => {
    expect(formatSourceLocation(chapter, { sourceId: 'notes', page: 4, section: 'Intro' })).toBe('Notes, p. 4');
    expect(formatSourceLocation(chapter, { sourceId: 'slides', slide: 18, section: 'Missing data' })).toBe('Lecture slides, slide 18');
    expect(formatSourceLocation(chapter, { sourceId: 'handout', section: 'OLTP vs OLAP' })).toBe('Handout');
    expect(formatSourceCitation(chapter, { sourceId: 'slides', slide: 18, section: 'Missing data' })).toBe(
      'Lecture slides, slide 18: Missing data',
    );
  });

  it('keeps the original single-source citation format', () => {
    expect(formatSourceCitation(single, { page: 4, section: 'Classification' })).toBe('Notes, p. 4: Classification');
  });

  it('resolves a missing sourceId only for single-source chapters', () => {
    expect(resolveSource(single, { page: 1, section: 'x' })?.id).toBe('notes');
    expect(resolveSource(chapter, { page: 1, section: 'x' })).toBeUndefined();
  });
});
