import type { Chapter, ChapterSource, SourceReference } from '../types/content';

/** Finds the source a reference points to. A missing sourceId is allowed only for single-source chapters. */
export function resolveSource(chapter: Chapter, ref: SourceReference): ChapterSource | undefined {
  if (ref.sourceId === undefined) return chapter.sources.length === 1 ? chapter.sources[0] : undefined;
  return chapter.sources.find((s) => s.id === ref.sourceId);
}

/**
 * Readable citation for a source reference, e.g. "Notes, p. 4", "Lecture slides, slide 18",
 * or a section source's title. Never includes file names or paths.
 */
export function formatSourceLocation(chapter: Chapter, ref: SourceReference): string {
  const source = resolveSource(chapter, ref);
  if (!source) return ref.section;
  if (source.unit === 'page' && ref.page !== undefined) return `${source.title}, p. ${ref.page}`;
  if (source.unit === 'slide' && ref.slide !== undefined) return `${source.title}, slide ${ref.slide}`;
  return source.title;
}

/** Citation including the section heading, e.g. "Notes, p. 4: Classification". */
export function formatSourceCitation(chapter: Chapter, ref: SourceReference): string {
  return `${formatSourceLocation(chapter, ref)}: ${ref.section}`;
}
