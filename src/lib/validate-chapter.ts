import type { Chapter, ContentBlock, SourceReference } from '../types/content';

export const QUESTIONS_PER_CHAPTER = 20;
export const OPTIONS_PER_QUESTION = 4;
/** Guards against answer-position bias: no single option position may hold more than this many correct answers. */
export const MAX_CORRECT_AT_SAME_POSITION = 8;

const CHAPTER_ID_PATTERN = /^chapter-\d{2}$/;
/** Lecture-note formats accepted as chapter sources. */
export const SOURCE_EXTENSIONS = ['pdf', 'ppt', 'pptx', 'doc', 'docx', 'md', 'txt'] as const;
const SOURCE_FILE_PATTERN = new RegExp(`^[^/\\\\]+\\.(${SOURCE_EXTENSIONS.join('|')})$`, 'i');

/**
 * Checks the format of source.path only. The files themselves are private and are not
 * committed (see .gitignore); `npm run verify:sources` checks they exist locally.
 */
function checkSourcePath(chapterId: string, path: string, errors: string[], at: (s: string) => string) {
  const folder = `source_materials/${chapterId}/`;
  if (!path.startsWith(folder)) {
    errors.push(at(`source.path must be inside "${folder}".`));
    return;
  }
  if (!SOURCE_FILE_PATTERN.test(path.slice(folder.length)))
    errors.push(at(`source.path must name one file directly in "${folder}" with a ${SOURCE_EXTENSIONS.join('/')} extension.`));
}
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const isBlank = (value: string | undefined): boolean => value === undefined || value.trim().length === 0;
const normalize = (value: string): string => value.trim().toLowerCase().replace(/\s+/g, ' ');

export function expectedChapterId(number: number): string {
  return `chapter-${String(number).padStart(2, '0')}`;
}

function checkReference(ref: SourceReference | undefined, pageCount: number, where: string, errors: string[]) {
  if (!ref) return;
  if (!Number.isInteger(ref.page) || ref.page < 1 || ref.page > pageCount) {
    errors.push(`${where}: source page ${ref.page} is outside the source document (1-${pageCount}).`);
  }
  if (isBlank(ref.section)) errors.push(`${where}: source reference needs a section name.`);
}

function checkBlock(block: ContentBlock, where: string, errors: string[]) {
  switch (block.type) {
    case 'paragraph':
      if (isBlank(block.text)) errors.push(`${where}: empty paragraph.`);
      break;
    case 'list':
      if (block.items.length === 0 || block.items.some(isBlank)) errors.push(`${where}: list has empty items.`);
      break;
    case 'definitions':
      if (block.items.length === 0 || block.items.some((d) => isBlank(d.term) || isBlank(d.definition)))
        errors.push(`${where}: definitions need a term and a definition.`);
      break;
    case 'table':
      if (block.columns.length === 0 || block.rows.length === 0) errors.push(`${where}: table needs columns and rows.`);
      block.rows.forEach((row, i) => {
        if (row.length !== block.columns.length)
          errors.push(`${where}: table row ${i + 1} has ${row.length} cells, expected ${block.columns.length}.`);
      });
      break;
    case 'comparison':
      if (block.items.length < 2) errors.push(`${where}: comparison needs at least two items.`);
      break;
    case 'process':
      if (block.steps.length < 2) errors.push(`${where}: process needs at least two steps.`);
      break;
    case 'example':
      if (isBlank(block.title) || (isBlank(block.text) && (block.items?.length ?? 0) === 0))
        errors.push(`${where}: example needs a title and content.`);
      break;
    case 'callout':
      if (isBlank(block.text)) errors.push(`${where}: empty callout.`);
      break;
    case 'tree':
      if (isBlank(block.root.label)) errors.push(`${where}: tree root needs a label.`);
      break;
  }
}

/** Returns a list of human-readable problems. An empty list means the chapter is valid. */
export function validateChapter(chapter: Chapter): string[] {
  const errors: string[] = [];
  const at = (suffix: string) => `${chapter.id || '(missing id)'} ${suffix}`;

  if (!CHAPTER_ID_PATTERN.test(chapter.id)) errors.push(at(`id must match "chapter-XX".`));
  if (!Number.isInteger(chapter.number) || chapter.number < 1) errors.push(at('number must be a positive integer.'));
  else if (chapter.id !== expectedChapterId(chapter.number))
    errors.push(at(`id must be "${expectedChapterId(chapter.number)}" for chapter number ${chapter.number}.`));
  if (isBlank(chapter.title)) errors.push(at('title is empty.'));
  if (isBlank(chapter.description)) errors.push(at('description is empty.'));
  if (isBlank(chapter.source.path)) errors.push(at('source.path is empty.'));
  else checkSourcePath(chapter.id, chapter.source.path, errors, at);
  if (!Number.isInteger(chapter.source.pageCount) || chapter.source.pageCount < 1)
    errors.push(at('source.pageCount must be a positive integer.'));
  if (chapter.learningObjectives.length === 0 || chapter.learningObjectives.some(isBlank))
    errors.push(at('needs non-empty learning objectives.'));
  if (chapter.keyTakeaways.length === 0 || chapter.keyTakeaways.some(isBlank))
    errors.push(at('needs non-empty key takeaways.'));

  // Review sections
  if (chapter.reviewSections.length === 0) errors.push(at('has no review sections.'));
  const sectionIds = new Set<string>();
  chapter.reviewSections.forEach((section, i) => {
    const where = at(`section ${i + 1} (${section.id})`);
    if (!SLUG_PATTERN.test(section.id)) errors.push(`${where}: id must be a lowercase slug.`);
    if (sectionIds.has(section.id)) errors.push(`${where}: duplicate section id.`);
    sectionIds.add(section.id);
    if (isBlank(section.title)) errors.push(`${where}: title is empty.`);
    if (section.blocks.length === 0) errors.push(`${where}: has no content blocks.`);
    section.blocks.forEach((block, j) => checkBlock(block, `${where} block ${j + 1}`, errors));
    checkReference(section.source, chapter.source.pageCount, where, errors);
  });

  // Questions
  if (chapter.questions.length !== QUESTIONS_PER_CHAPTER)
    errors.push(at(`must have exactly ${QUESTIONS_PER_CHAPTER} questions (found ${chapter.questions.length}).`));

  const questionIds = new Set<string>();
  const questionTexts = new Set<string>();
  const positionCounts = new Map<number, number>();

  chapter.questions.forEach((q, i) => {
    const where = at(`question ${i + 1} (${q.id})`);
    if (isBlank(q.id)) errors.push(`${where}: id is empty.`);
    if (questionIds.has(q.id)) errors.push(`${where}: duplicate question id.`);
    questionIds.add(q.id);

    if (isBlank(q.question)) errors.push(`${where}: question text is empty.`);
    else {
      const key = normalize(q.question);
      if (questionTexts.has(key)) errors.push(`${where}: duplicate question text.`);
      questionTexts.add(key);
    }
    if (isBlank(q.explanation)) errors.push(`${where}: explanation is empty.`);

    if (q.options.length !== OPTIONS_PER_QUESTION)
      errors.push(`${where}: must have exactly ${OPTIONS_PER_QUESTION} options (found ${q.options.length}).`);
    const optionIds = new Set(q.options.map((o) => o.id));
    if (optionIds.size !== q.options.length) errors.push(`${where}: option ids must be unique.`);
    const optionTexts = new Set(q.options.map((o) => normalize(o.text)));
    if (optionTexts.size !== q.options.length) errors.push(`${where}: option texts must be unique.`);
    if (q.options.some((o) => isBlank(o.id) || isBlank(o.text))) errors.push(`${where}: options need an id and text.`);

    const correctMatches = q.options.filter((o) => o.id === q.correctOptionId).length;
    if (correctMatches !== 1) errors.push(`${where}: correctOptionId "${q.correctOptionId}" must match exactly one option.`);
    else {
      const position = q.options.findIndex((o) => o.id === q.correctOptionId);
      positionCounts.set(position, (positionCounts.get(position) ?? 0) + 1);
    }

    checkReference(q.sourceReference, chapter.source.pageCount, where, errors);
  });

  for (const [position, count] of positionCounts) {
    if (count > MAX_CORRECT_AT_SAME_POSITION)
      errors.push(at(`has ${count} correct answers at option position ${position + 1}; vary answer positions.`));
  }

  return errors;
}

/** Validates every chapter plus registry-level rules (unique ids and numbers). */
export function validateChapterRegistry(chapters: readonly Chapter[]): string[] {
  const errors = chapters.flatMap(validateChapter);
  const ids = new Set<string>();
  const numbers = new Set<number>();
  for (const chapter of chapters) {
    if (ids.has(chapter.id)) errors.push(`Duplicate chapter id "${chapter.id}" in the registry.`);
    if (numbers.has(chapter.number)) errors.push(`Duplicate chapter number ${chapter.number} in the registry.`);
    ids.add(chapter.id);
    numbers.add(chapter.number);
  }
  return errors;
}
