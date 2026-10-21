import { describe, expect, it } from 'vitest';
import type { Chapter, QuizQuestion } from '../types/content';
import type { SourceFileRecord } from '../data/source-manifest';
import { validateChapter, validateChapterRegistry } from './validate-chapter';
import { validateChapterSources } from './validate-sources';

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
    sources: [{ id: 'notes', title: 'Notes', unit: 'page' }],
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

  it('enforces the chapter id convention', () => {
    expect(validateChapter(makeChapter({ id: 'chapter-9' })).join()).toMatch(/chapter-XX/);
    expect(validateChapter(makeChapter({ id: 'chapter-08' })).join()).toMatch(/must be "chapter-09"/);
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

describe('source references', () => {
  const twoSources: Partial<Chapter> = {
    sources: [
      { id: 'notes', title: 'Notes', unit: 'page' },
      { id: 'slides', title: 'Slides', unit: 'slide' },
      { id: 'handout', title: 'Handout', unit: 'section' },
    ],
  };
  const withRef = (ref: NonNullable<QuizQuestion['sourceReference']>, overrides: Partial<Chapter> = {}) => {
    const questions = makeChapter().questions;
    questions[0] = { ...makeQuestion(1), sourceReference: ref };
    return makeChapter({ ...overrides, questions });
  };

  it('requires readable, unique source ids and at least one source', () => {
    expect(validateChapter(makeChapter({ sources: [] })).join()).toMatch(/at least one source/);
    const dup = makeChapter({
      sources: [
        { id: 'notes', title: 'Notes', unit: 'page' },
        { id: 'notes', title: ' ', unit: 'page' },
      ],
    });
    const errors = validateChapter(dup).join('\n');
    expect(errors).toMatch(/duplicate source id/);
    expect(errors).toMatch(/readable title/);
  });

  it('requires a sourceId when a chapter has several sources', () => {
    const chapter = withRef({ page: 1, section: 'Intro' }, twoSources);
    const errors = validateChapter({ ...chapter, questions: chapter.questions.map((q) => ({ ...q, sourceReference: { page: 1, section: 'Intro' } })) });
    expect(errors.join()).toMatch(/needs a sourceId/);
    expect(validateChapter(withRef({ sourceId: 'nope', page: 1, section: 'Intro' }, twoSources)).join()).toMatch(/unknown sourceId/);
  });

  it('matches the location field to the source unit', () => {
    const base = { ...twoSources };
    const check = (ref: NonNullable<QuizQuestion['sourceReference']>) => {
      const chapter = withRef(ref, base);
      // Give the other 19 questions a valid reference so only question 1 is under test.
      chapter.questions.slice(1).forEach((q) => (q.sourceReference = { sourceId: 'notes', page: 1, section: 'Intro' }));
      return validateChapter(chapter).join();
    };
    expect(check({ sourceId: 'slides', slide: 3, section: 'Intro' })).toBe('');
    expect(check({ sourceId: 'slides', page: 3, section: 'Intro' })).toMatch(/cited by slide/);
    expect(check({ sourceId: 'notes', slide: 3, section: 'Intro' })).toMatch(/cited by page/);
    expect(check({ sourceId: 'notes', page: 0, section: 'Intro' })).toMatch(/cited by page/);
    expect(check({ sourceId: 'handout', section: 'Intro' })).toBe('');
    expect(check({ sourceId: 'handout', page: 2, section: 'Intro' })).toMatch(/cited by section only/);
    expect(check({ sourceId: 'notes', page: 1, section: ' ' })).toMatch(/needs a section name/);
  });
});

describe('validateChapterSources (private manifest)', () => {
  const records = (overrides: Record<string, SourceFileRecord> = {}): Record<string, SourceFileRecord> => ({
    notes: { path: 'source_materials/chapter-09/Ch 9_Note.pdf', count: 3 },
    ...overrides,
  });

  it('accepts a chapter whose references fall inside its sources', () => {
    expect(validateChapterSources(makeChapter(), records())).toEqual([]);
  });

  it('requires a manifest entry for every source and no unknown entries', () => {
    expect(validateChapterSources(makeChapter(), undefined).join()).toMatch(/no entry in the source manifest/);
    expect(validateChapterSources(makeChapter(), {}).join()).toMatch(/has no manifest entry/);
    expect(validateChapterSources(makeChapter(), records({ extra: { path: 'source_materials/x.pdf', count: 1 } })).join()).toMatch(
      /unknown source "extra"/,
    );
  });

  it('validates the path format without requiring the file to exist', () => {
    const at = (path: string) => validateChapterSources(makeChapter(), records({ notes: { path, count: 3 } })).join();
    expect(at('source_materials/chapter-09/Ch 9_Note.pdf')).toBe('');
    expect(at('source_materials/pattern-mining/FP Growth Approach.pdf')).toBe('');
    expect(at('public/notes.pdf')).toMatch(/inside source_materials/);
    expect(at('source_materials/chapter-09/../secret.pdf')).toMatch(/inside source_materials/);
    expect(at('source_materials/chapter-09/notes.exe')).toMatch(/inside source_materials/);
    expect(at('source_materials\\chapter-09\\notes.pdf')).toMatch(/inside source_materials/);
  });

  it('rejects pages and slides outside the document', () => {
    const questions = makeChapter().questions;
    questions[0] = { ...makeQuestion(1), sourceReference: { page: 7, section: 'Intro' } };
    expect(validateChapterSources(makeChapter({ questions }), records()).join()).toMatch(/page 7 is outside "notes" \(1-3\)/);
    expect(validateChapterSources(makeChapter(), records({ notes: { path: 'source_materials/a.pdf' } })).join()).toMatch(
      /positive page count/,
    );
  });

  it('accepts only verified section headings for section sources', () => {
    const chapter = makeChapter({ sources: [{ id: 'handout', title: 'Handout', unit: 'section' }] });
    chapter.questions.forEach((q) => (q.sourceReference = { section: 'Known heading' }));
    const handout = (sections?: string[]) =>
      validateChapterSources(chapter, { handout: { path: 'source_materials/h.docx', ...(sections ? { sections } : {}) } }).join();
    expect(handout(['Known heading'])).toBe('');
    expect(handout(['Other heading'])).toMatch(/not a verified heading/);
    expect(handout()).toMatch(/list of verified section headings/);
  });
});
