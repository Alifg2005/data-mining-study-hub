/**
 * TEST-ONLY source manifest: where each chapter's private source files live and how many
 * pages or slides they have. Never import this from application code. It holds repository
 * paths that must not reach the production bundle (enforced by a test and by
 * scripts/check-bundle-privacy.mjs).
 *
 * The files themselves are gitignored (source_materials/). Public tests validate this
 * manifest's format and every source reference against it; `npm run verify:sources`
 * additionally checks that the files exist locally.
 */

export type SourceFileRecord = {
  /** Path relative to the repository root, inside source_materials/. */
  path: string;
  /** Number of pages (unit "page") or slides (unit "slide"). Omit for "section" sources. */
  count?: number;
  /** Verified section headings that references may cite (unit "section" only). */
  sections?: string[];
};

/** chapterId → sourceId → file record. */
export type SourceManifest = Readonly<Record<string, Readonly<Record<string, SourceFileRecord>>>>;

export const sourceManifest: SourceManifest = {
  'chapter-01': {
    notes: { path: 'source_materials/chapter-01/Ch 1_Note.pdf', count: 5 },
  },
  'chapter-02': {
    notes: { path: 'source_materials/chapter-02/Ch 2_Note.pdf', count: 4 },
  },
  'chapter-03': {
    slides: { path: 'source_materials/chapter-03-preprocessing/Ch 1.2 &3.pptx', count: 28 },
  },
  'chapter-04': {
    edw: { path: 'source_materials/data-warehousing/EDW1.pdf', count: 5 },
    'dwh-terms': {
      path: 'source_materials/data-warehousing/DWH _What why_OLAP.docx',
      sections: [
        'Introduction | Data warehouse Definition',
        'What is Business Intelligence',
        'Why we need Data warehouse',
        'Data Warehouse: A Multi-Tiered Architecture',
        'Terminologies | ETL vs ELT',
        'Terminologies | Staging vs ODS',
        'Terminologies | OLTP vs OLAP',
        'Terminologies | Fact vs Dimension',
        'Terminologies | Star Schema vs Snowflake Schema',
      ],
    },
  },
  'chapter-05': {
    'association-rules': { path: 'source_materials/pattern-mining/Association Rule.pdf', count: 4 },
    'hash-tree': { path: 'source_materials/pattern-mining/Pattern Mining- Hash Tree .pdf', count: 5 },
    'fp-growth': { path: 'source_materials/pattern-mining/FP Growth Approach.pdf', count: 7 },
    'fp-examples': {
      path: 'source_materials/pattern-mining/Frequent Pattern.docx',
      sections: ['Frequent Pattern (FP) Growth Algorithm Association Rule Mining', 'Closed And Maximal Frequent Itemsets'],
    },
    eclat: { path: 'source_materials/pattern-mining/ECLAT - Association Rule Mining .pdf', count: 2 },
    'assoc-vs-corr': {
      path: 'source_materials/course/Difference Between Association Rules and Correlation Analysis.pdf',
      count: 2,
    },
  },
};
