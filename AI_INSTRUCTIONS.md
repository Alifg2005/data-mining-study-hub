# AI Instructions

This is the permanent operating guide for AI coding agents working in this repository. Read all of it before making changes. Read [CONTENT_GUIDELINES.md](CONTENT_GUIDELINES.md) before writing any chapter content.

---

## 1. Project overview

**Data Mining Study Hub** is a static study website for the university course **CIS 517 Data Mining**. Students use it to:

- read a concise review of each chapter, generated from the instructor's lecture notes, and
- take a 20-question multiple-choice quiz per chapter, with scoring and explained answers after submission.

**Audience:** university students preparing for exams, on phones and laptops.

**Stack:** React 19, TypeScript (strict), Vite, Tailwind CSS v4, React Router, Lucide icons, Vitest and Testing Library. There is no backend, no database, no authentication, and no runtime AI or external API. All content is bundled at build time. Deployment target: Vercel (static).

**Current features:**

- Home page listing every registered chapter, with student, instructor, and course details from config.
- Reusable chapter review page with a section table of contents (sticky on desktop, collapsible on mobile).
- Reusable quiz: one question at a time, progress bar, previous/next, a question overview grid, the ability to change answers, and confirmation before submitting with unanswered questions.
- Results: score ring, score out of 20, percentage, correct/incorrect/unanswered counts, a per-question review with the student's answer, the correct answer, the explanation, and a readable source citation (e.g., "Lecture slides, slide 18"), a "To review" filter, and retry.
- Chapters with several source documents, cited by page, slide, or section heading.

### Chapter numbering

The site numbers chapters by the **lecture order** of the instructor's course outline:

| Site chapter | Title | Course lecture |
| --- | --- | --- |
| 1 | Introduction to Data Mining | Lecture 1 |
| 2 | Getting to Know Your Data | (data types and statistics; site chapter kept from the first release) |
| 3 | Data Preprocessing | Lecture 3 |
| 4 | Data Warehousing and OLAP | Lecture 4 |
| 5 | Frequent Pattern Mining | Lecture 5 |

The same outline also uses a **different, textbook-style numbering** (for example, its "Chapter 2" includes data preprocessing and its "Chapter 3" is Data Warehousing). The two schemes are not the same; do not renumber source documents or site chapters to match the textbook scheme. Lecture 2 (similarity and dissimilarity), Lecture 6 (classification algorithms), Lecture 7 (clustering algorithms) and outlier detection have **no usable source material yet**: do not create those chapters until the instructor's notes are supplied.
- Light and dark themes: system preference on first visit, saved choice afterwards, no flash on load.
- Graceful not-found states for unknown chapters and routes.
- Development-time and build-time validation of all chapter data.

### Architecture

```text
src/
├── config/site.ts              # Student, instructor, course, project name. The ONLY place for these values.
├── types/content.ts            # Content schema: Chapter, ReviewSection, ContentBlock, QuizQuestion
├── data/
│   ├── source-manifest.ts      # TEST-ONLY: private source file paths and page/slide counts. Never import in app code.
│   └── chapters/
│       ├── chapter-01.ts … chapter-05.ts   # Chapter content (data only, no JSX)
│       ├── index.ts            # Chapter REGISTRY. Append new chapters here.
│       ├── chapters.test.ts    # Validates every chapter and its sources (runs during `npm run build`)
│       └── sources.local.test.ts  # LOCAL-ONLY: source files exist (`npm run verify:sources`)
├── lib/
│   ├── quiz.ts                 # Pure scoring engine
│   ├── validate-chapter.ts     # Content rules (20 questions, 4 options, source references, ...)
│   ├── validate-sources.ts     # TEST-ONLY: checks references against the source manifest
│   ├── sources.ts              # Resolves and formats readable source citations
│   ├── theme.ts, routes.ts, cn.ts
├── hooks/                      # useQuiz (reducer), useTheme, useActiveSection, useDocumentTitle
├── components/
│   ├── layout/                 # AppShell (header/footer), ThemeToggle
│   ├── chapters/ChapterCard.tsx
│   ├── review/                 # ContentBlockView (renders every block type), TreeView
│   ├── quiz/                   # QuestionCard, QuestionNavigator, SubmitDialog, QuizResults, ScoreRing
│   └── ui/                     # Button, ButtonLink, InlineText
├── pages/                      # HomePage, ChapterReviewPage, QuizPage, NotFoundPage
├── styles/index.css            # Design tokens (CSS variables) for both themes
├── App.tsx                     # Routes
└── main.tsx
scripts/check-bundle-privacy.mjs  # Runs after `vite build`; fails if dist/ contains source paths or documents
source_materials/               # Original lecture notes and private analysis reports. PRIVATE: gitignored, never committed or shipped.
```

Routes: `/`, `/chapters/:chapterId` (review), `/chapters/:chapterId/quiz`. All chapters share the same pages; the data decides what is shown.

Quiz scoring: results are computed by `scoreQuiz()` from `correctOptionId` in the chapter data, only after submission. Unanswered questions count as not correct and are reported separately. Answers live in memory only, and scores are not persisted.

---

## 2. Non-negotiable engineering rules

1. Preserve the established architecture. Chapter content lives only in `src/data/chapters/chapter-XX.ts`. Never put chapter text in components or pages.
2. Reuse the existing pages and components. Adding a chapter must not require a new page, route, or component.
3. If content truly needs a new kind of block, add it once to the `ContentBlock` union in `src/types/content.ts`, render it in `ContentBlockView.tsx`, validate it in `validate-chapter.ts`, and document it in CONTENT_GUIDELINES.md. Prefer the existing blocks.
4. Keep strict TypeScript. Do not use `any`, `@ts-ignore`, `@ts-expect-error`, or `eslint-disable` to make errors go away.
5. Follow the existing naming and formatting: kebab-case slugs, `chapter-XX` ids, `chXX-qNN` question ids, and the 2-space, single-quote style already in the code.
6. Do not add dependencies unless they are clearly necessary. Do not add a backend, database, authentication, analytics, CMS, or runtime API.
7. Use the semantic color tokens (`bg-surface`, `text-muted`, `border-border`, `text-accent`, ...). Never hardcode colors in components. Every UI change must work in both themes.
8. Keep accessibility intact: semantic HTML, labels, keyboard operation, visible focus, and no information conveyed by color alone.
9. Do not make unrelated changes while adding a chapter. Never overwrite or rewrite an existing chapter's content without a clear, stated reason.
10. Existing chapter ids, question ids, and section ids are stable. Do not rename them.
11. Do not delete features, tests, or validation rules. Do not weaken thresholds (for example, the 20-question rule) to make a check pass.
12. Keep this file, CONTENT_GUIDELINES.md, and README.md in sync with any meaningful architectural change.
13. Student, instructor, and course details change only in `src/config/site.ts`.

---

## 3. Content generation rules

Read [CONTENT_GUIDELINES.md](CONTENT_GUIDELINES.md) in full. In summary:

1. **Locate** the new notes (inside `source_materials/`, usually a topic folder such as `source_materials/pattern-mining/`). If they were supplied elsewhere, copy them into `source_materials/` and keep the original filename. Read `source_materials/SOURCE_ANALYSIS_ALL_COURSE.md` (private) for known source errors and conflicts.
2. **Read** the entire document, including diagrams, tables, colored or highlighted text, and images. For PDFs, extract the text (for example with `pdftotext -layout`) and also view the pages, because text extraction scrambles tables and loses diagrams.
3. **Verify** that the content was read successfully. If any part is unreadable, do not invent it. Report it.
4. **Transform** the notes into structured review sections using the existing block types, and write exactly 20 questions that follow the quality rules.
5. **Fidelity:** the notes are the authority. No invented facts, quotes, or page numbers. Supplemental material must be labeled. Contradictions in the notes get a `caution` callout and stay out of the quiz.
6. **Check** every review statement and every answer key against the notes before saving.

---

## 4. Chapter registration procedure

For chapter number N (zero-padded to two digits as XX):

| Step | File | Action |
| --- | --- | --- |
| 1 | `source_materials/<folder>/<original filename>` | Place the source notes here (private, gitignored). |
| 2 | `src/data/chapters/chapter-XX.ts` | **Create.** Export `const chapterXX: Chapter`. Copy the structure of `chapter-05.ts` (several sources) or `chapter-03.ts` (one slide deck). |
| 3 | `src/data/chapters/index.ts` | **Update.** Import `chapterXX` and append it to the `chapters` array. |
| 4 | `src/data/source-manifest.ts` | **Update.** Add `'chapter-XX': { <sourceId>: { path, count } }` (or `sections` for Word documents). |

That is all. The home page, routes, review page, and quiz pick the chapter up automatically.

Required values in the chapter file:

- `id: 'chapter-XX'`, `number: N` (the validator enforces that they match).
- `sources: [{ id, title, unit }]`: one entry per source document. `title` is a **readable name shown to students** (never a filename or path). `unit` is `'page'` (PDF), `'slide'` (PowerPoint) or `'section'` (Word documents without fixed pages).
- Source references: `{ sourceId, page | slide, section }`. `sourceId` may be omitted only when the chapter has one source. Page sources need `page`, slide sources need `slide`, and section sources need neither; `section` must then be one of the verified headings listed in the manifest.
- A header comment listing which topics are on which page/slide, as in the existing chapters.
- Question ids `chXX-q01` … `chXX-q20`.

Required manifest values (`src/data/source-manifest.ts`): `path` inside `source_materials/` with a pdf/ppt/pptx/doc/docx/md/txt extension; `count` = real number of pages or slides; for section sources, `sections` = the exact headings verified in the document. Tests check every reference against these values without needing the files.

**Source privacy:** `source_materials/` is gitignored. Never commit, upload, copy into `public/`, or otherwise expose the lecture notes. Never remove `/source_materials/` from `.gitignore`. Never make the public build depend on those files. Never import `source-manifest.ts` or `validate-sources.ts` from application code: a test fails if you do, and `scripts/check-bundle-privacy.mjs` fails the build if any `source_materials` path or document reaches `dist/`.

---

## 5. Mandatory verification

After adding or changing a chapter, do all of the following and fix any errors your change caused:

1. Confirm the source notes were read successfully (state the page count and any unreadable parts).
2. Re-check the generated review against the notes.
3. Validate all 20 questions: each correct answer is supported by the notes, each distractor is wrong, and the explanations are accurate.
4. Confirm the chapter is registered in `src/data/chapters/index.ts`.
5. `npm run lint`
6. `npm run typecheck`
7. `npm test`
8. `npm run build` (this also runs the content validation tests)
9. Fix every error introduced by your changes. Do not suppress them.
10. Verify that the home page lists all chapters, existing chapters still open, navigation works, the theme toggle works, and quiz submission and results work. `npm test` covers these flows in jsdom. If a browser is available, also check `npm run preview` manually.

`npm run check` runs lint, typecheck, tests, and the build in one command.

Also run `npm run verify:sources` locally. It confirms that every chapter's source file exists in `source_materials/`. It is local-only (excluded from `npm test` and the build via `*.local.test.ts`), because the files are private and missing on Vercel.

---

## 6. Required final report

After any chapter addition, report:

- Which source files were processed (path and page count).
- Which files were created or modified.
- Which chapter was added (number and title).
- The number of questions generated (must be 20).
- The results of lint, typecheck, tests, and build, with actual pass/fail output.
- Any unresolved issues, unreadable parts, contradictions found in the notes, or other source limitations.

Never claim a check passed unless you ran it and it passed.

---

## 7. One-command chapter addition

To add a chapter, the user will give an instruction like the following. Carry it out end to end without stopping for approval:

> Read and follow AI_INSTRUCTIONS.md completely. Process the new lecture notes located at [SOURCE FILE OR DIRECTORY]. Analyze the notes, generate the chapter review and exactly 20 validated multiple-choice questions, create the required chapter data file, register the chapter in the application, preserve all existing chapters and functionality, validate the content, run the available checks and production build, fix any issues caused by your changes, and report the final results. Do not stop for intermediate approval.

How to carry it out:

1. Determine the chapter number from the notes' title or filename. If it is ambiguous, use the next unused number and say so in the report.
2. Follow sections 3 to 6 above.
3. If the source file is missing or unreadable, **stop and report** that limitation. Never generate a fictional chapter.

---

## 8. Commands

```bash
npm install          # install dependencies
npm run dev          # development server (http://localhost:5173)
npm run lint         # ESLint
npm run typecheck    # TypeScript project build (no emit)
npm test             # Vitest: engine, validation, chapter data, UI flows
npm run build        # typecheck + content validation + production build to dist/
npm run preview      # serve dist/ locally
npm run check        # lint + typecheck + tests + build
npm run verify:sources  # local only: private source notes exist in source_materials/
```
