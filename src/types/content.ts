/**
 * Content schema for chapters, review notes, and quizzes.
 *
 * Chapter data lives in src/data/chapters/chapter-XX.ts and must satisfy these
 * types. Runtime rules that TypeScript cannot express (exactly 20 questions,
 * 4 unique options, valid correct option, ...) are enforced by
 * src/lib/validate-chapter.ts.
 *
 * Inline text fields typed as `RichText` support **bold** emphasis only.
 */

export type RichText = string;

/** How locations in a source document are cited. Word documents without fixed pages use `section`. */
export type SourceUnit = 'page' | 'slide' | 'section';

/**
 * A source document of a chapter, as shown to students. It holds a readable title only:
 * file paths and page counts live in src/data/source-manifest.ts, which is never bundled.
 */
export type ChapterSource = {
  /** Lowercase slug, unique within the chapter. */
  id: string;
  /** Readable title shown on the site, e.g. "Notes" or "Lecture slides". */
  title: string;
  unit: SourceUnit;
};

/**
 * A verified location in one of the chapter's sources. Only add one when the location is certain.
 * Exactly one of `page` / `slide` is set for page and slide sources; neither for section sources.
 */
export type SourceReference = {
  /** Id of a ChapterSource. May be omitted only when the chapter has a single source. */
  sourceId?: string;
  /** 1-based page number (sources with unit "page"). */
  page?: number;
  /** 1-based slide number (sources with unit "slide"). */
  slide?: number;
  /** Section heading as it appears in the source. For "section" sources it must be a verified heading. */
  section: string;
};

export type ContentBlock =
  | { type: 'paragraph'; text: RichText }
  | { type: 'list'; title?: string; ordered?: boolean; items: RichText[] }
  | { type: 'definitions'; items: { term: string; definition: RichText }[] }
  | {
      type: 'table';
      caption?: string;
      columns: string[];
      rows: string[][];
      /** Index of a column rendered as the row header. Defaults to 0. */
      rowHeaderColumn?: number;
    }
  | {
      type: 'comparison';
      items: { title: string; tag?: string; description?: RichText; points: RichText[] }[];
    }
  | { type: 'process'; title?: string; steps: { title: string; description?: RichText }[] }
  | { type: 'example'; title: string; text?: RichText; items?: RichText[] }
  | {
      type: 'callout';
      /**
       * note: emphasis from the notes. tip: exam advice.
       * caution: inconsistencies or common mistakes.
       * supplemental: material NOT in the lecture notes (must be clearly labeled).
       */
      tone: 'note' | 'tip' | 'caution' | 'supplemental';
      title?: string;
      text: RichText;
    }
  | { type: 'tree'; root: TreeNode };

export type TreeNode = { label: string; tag?: string; children?: TreeNode[] };

export type ReviewSection = {
  /** Stable, URL-safe id, unique within the chapter. Used as the page anchor. */
  id: string;
  title: string;
  blocks: ContentBlock[];
  source?: SourceReference;
};

export type QuizOption = {
  /** Stable id unique within the question, e.g. "a". */
  id: string;
  text: string;
};

export type Difficulty = 'easy' | 'medium' | 'hard';

export type QuizQuestion = {
  /** Unique within the chapter, e.g. "ch01-q07". */
  id: string;
  question: string;
  options: QuizOption[];
  /** Must match the id of exactly one option. Never an index. */
  correctOptionId: string;
  explanation: string;
  difficulty: Difficulty;
  sourceReference?: SourceReference;
};

export type Chapter = {
  /** Format "chapter-XX". Stable: used in URLs. */
  id: string;
  number: number;
  title: string;
  description: string;
  /** Source documents, by readable title. Each needs a matching entry in src/data/source-manifest.ts. */
  sources: ChapterSource[];
  learningObjectives: string[];
  reviewSections: ReviewSection[];
  keyTakeaways: string[];
  questions: QuizQuestion[];
};
