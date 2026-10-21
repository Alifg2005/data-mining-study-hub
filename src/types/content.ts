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

/** A location in the chapter's original source document. Only add one when the page is known. */
export type SourceReference = {
  /** 1-based page number in the source PDF. */
  page: number;
  /** Section heading as it appears in the notes. */
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

export type SourceDocument = {
  /** Path relative to the repository root. Not shipped with the site. */
  path: string;
  pageCount: number;
};

export type Chapter = {
  /** Format "chapter-XX". Stable: used in URLs. */
  id: string;
  number: number;
  title: string;
  description: string;
  source: SourceDocument;
  learningObjectives: string[];
  reviewSections: ReviewSection[];
  keyTakeaways: string[];
  questions: QuizQuestion[];
};
