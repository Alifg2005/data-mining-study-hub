import { describe, expect, it } from 'vitest';
import type { Chapter, QuizQuestion } from '../types/content';
import { validateChapter, validateChapterRegistry } from './validate-chapter';

const positions = ['a', 'b', 'c', 'd'];

function makeQuestion(n: number): QuizQuestion {
  return {
    id: `ch09-q${n}`,
    question: `Unique question ${n}?`,
    options: positions.map((id) => ({ id, text: `Answer ${id}` })),
    correctOptionId: positions[n % 4] ?? 'a',
    explanation: 'Explanation.',
    difficulty: 'medium',
    sourceReference: { page: 1, section: 'Intro' },
  };
}

function makeChapter(overrides: Partial<Chapter> = {}): Chapter {
  return {
    id: 'chapter-09',
    number: 9,
    title: 'Test chapter',
    description: 'A valid chapter used in tests.',
    source: { path: 'source_materials/chapter-09/notes.pdf', pageCount: 3 },
    learningObjectives: ['Learn things.'],
    keyTakeaways: ['Things were learned.'],
    reviewSections: [{ id: 'intro', title: 'Intro', blocks: [{ type: 'paragraph', text: 'Hello.' }] }],
    questions: Array.from({ length: 20 }, (_, i) => makeQuestion(i + 1)),
    ...overrides,
  };
}

describe('validateChapter', () => {
  it('accepts a valid chapter', () => {
    expect(validateChapter(makeChapter())).toEqual([]);
  });

  it('requires exactly 20 questions', () => {
    const errors = validateChapter(makeChapter({ questions: makeChapter().questions.slice(0, 19) }));
    expect(errors.join()).toMatch(/exactly 20 questions/);
  });

  it('requires four options with unique ids and texts', () => {
    const base = makeQuestion(1);
    const questions = makeChapter().questions;
    questions[0] = { ...base, options: base.options.slice(0, 3) };
    questions[1] = { ...makeQuestion(2), options: positions.map((id) => ({ id: 'a', text: id })) };
    questions[2] = { ...makeQuestion(3), options: positions.map((id) => ({ id, text: 'Same' })) };
    const errors = validateChapter(makeChapter({ questions })).join('\n');
    expect(errors).toMatch(/exactly 4 options/);
    expect(errors).toMatch(/option ids must be unique/);
    expect(errors).toMatch(/option texts must be unique/);
  });

  it('requires the correct option id to exist', () => {
    const questions = makeChapter().questions;
    questions[0] = { ...makeQuestion(1), correctOptionId: 'z' };
    expect(validateChapter(makeChapter({ questions })).join()).toMatch(/must match exactly one option/);
  });

  it('rejects duplicate question ids and empty text', () => {
    const questions = makeChapter().questions;
    questions[1] = { ...makeQuestion(2), id: 'ch09-q1' };
    questions[2] = { ...makeQuestion(3), explanation: '  ' };
    const errors = validateChapter(makeChapter({ questions })).join('\n');
    expect(errors).toMatch(/duplicate question id/);
    expect(errors).toMatch(/explanation is empty/);
  });

  it('rejects source pages outside the document', () => {
    const questions = makeChapter().questions;
    questions[0] = { ...makeQuestion(1), sourceReference: { page: 7, section: 'Intro' } };
    expect(validateChapter(makeChapter({ questions })).join()).toMatch(/outside the source document/);
  });

  it('enforces the chapter id convention', () => {
    expect(validateChapter(makeChapter({ id: 'chapter-9' })).join()).toMatch(/chapter-XX/);
    expect(validateChapter(makeChapter({ id: 'chapter-08' })).join()).toMatch(/must be "chapter-09"/);
  });

  it('validates the source path format without requiring the file to exist', () => {
    const at = (path: string) => validateChapter(makeChapter({ source: { path, pageCount: 3 } })).join();
    expect(at('source_materials/chapter-09/Ch 9_Note.pdf')).toBe('');
    expect(at('source_materials/chapter-08/notes.pdf')).toMatch(/must be inside "source_materials\/chapter-09\/"/);
    expect(at('public/notes.pdf')).toMatch(/must be inside/);
    expect(at('source_materials/chapter-09/../secret.pdf')).toMatch(/must name one file/);
    expect(at('source_materials/chapter-09/notes.exe')).toMatch(/must name one file/);
  });

  it('flags answer-position bias', () => {
    const questions = makeChapter().questions.map((q) => ({ ...q, correctOptionId: 'a' }));
    expect(validateChapter(makeChapter({ questions })).join()).toMatch(/vary answer positions/);
  });

  it('rejects malformed tables', () => {
    const errors = validateChapter(
      makeChapter({
        reviewSections: [{ id: 'intro', title: 'Intro', blocks: [{ type: 'table', columns: ['A', 'B'], rows: [['1']] }] }],
      }),
    );
    expect(errors.join()).toMatch(/expected 2/);
  });
});

describe('validateChapterRegistry', () => {
  it('rejects duplicate chapter ids', () => {
    expect(validateChapterRegistry([makeChapter(), makeChapter()]).join()).toMatch(/Duplicate chapter id/);
  });
});
