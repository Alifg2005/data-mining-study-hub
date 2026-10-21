/**
 * TEST-ONLY validation of chapter sources against the private source manifest.
 * Never import this from application code: it handles repository file paths that must not
 * reach the production bundle (enforced by src/data/chapters/chapters.test.ts).
 */
import type { Chapter, SourceReference } from '../types/content';
import type { SourceFileRecord } from '../data/source-manifest';
import { resolveSource } from './sources';

/** Lecture-note formats accepted as chapter sources. */
export const SOURCE_EXTENSIONS = ['pdf', 'ppt', 'pptx', 'doc', 'docx', 'md', 'txt'] as const;
/** source_materials/<one or more folders>/<file>.<ext>, without "..", backslashes or empty segments. */
const SOURCE_PATH_PATTERN = new RegExp(
  `^source_materials(?:/[^/\\\\]+)+\\.(${SOURCE_EXTENSIONS.join('|')})$`,
  'i',
);

const isBlank = (value: string | undefined): boolean => value === undefined || value.trim().length === 0;
const isPositiveInt = (value: number | undefined): value is number => Number.isInteger(value) && (value ?? 0) >= 1;

function chapterReferences(chapter: Chapter): { where: string; ref: SourceReference }[] {
  return [
    ...chapter.reviewSections.flatMap((s) => (s.source ? [{ where: `section ${s.id}`, ref: s.source }] : [])),
    ...chapter.questions.flatMap((q) => (q.sourceReference ? [{ where: `question ${q.id}`, ref: q.sourceReference }] : [])),
  ];
}

/**
 * Validates a chapter's sources against the private manifest (test-only data): every source has
 * a file record, paths are well-formed, and every reference falls on a verified page, slide or
 * section. It does not check that the files exist, because they are not in the public repository.
 */
export function validateChapterSources(
  chapter: Chapter,
  records: Readonly<Record<string, SourceFileRecord>> | undefined,
): string[] {
  const at = (suffix: string) => `${chapter.id} ${suffix}`;
  if (!records) return [at('has no entry in the source manifest.')];
  const errors: string[] = [];

  for (const id of Object.keys(records)) {
    if (!chapter.sources.some((s) => s.id === id)) errors.push(at(`manifest lists unknown source "${id}".`));
  }
  for (const source of chapter.sources) {
    const record = records[source.id];
    if (!record) {
      errors.push(at(`source "${source.id}" has no manifest entry.`));
      continue;
    }
    if (!SOURCE_PATH_PATTERN.test(record.path) || record.path.split('/').some((part) => part === '..' || part === '.'))
      errors.push(
        at(`source "${source.id}" path must be a file inside source_materials/ with a ${SOURCE_EXTENSIONS.join('/')} extension.`),
      );
    if (source.unit === 'section') {
      if (!record.sections || record.sections.length === 0 || record.sections.some(isBlank))
        errors.push(at(`source "${source.id}" is cited by section and needs a list of verified section headings.`));
    } else if (!isPositiveInt(record.count)) {
      errors.push(at(`source "${source.id}" needs a positive ${source.unit} count.`));
    }
  }

  for (const { where, ref } of chapterReferences(chapter)) {
    const source = resolveSource(chapter, ref);
    const record = source && records[source.id];
    if (!source || !record) continue; // reported by validateChapter / above
    const location = source.unit === 'page' ? ref.page : source.unit === 'slide' ? ref.slide : undefined;
    if (location !== undefined && record.count !== undefined && location > record.count)
      errors.push(at(`${where}: ${source.unit} ${location} is outside "${source.id}" (1-${record.count}).`));
    if (source.unit === 'section' && !record.sections?.includes(ref.section))
      errors.push(at(`${where}: section "${ref.section}" is not a verified heading of "${source.id}".`));
  }
  return errors;
}
