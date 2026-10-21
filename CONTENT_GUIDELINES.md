# Content Guidelines

Rules for writing chapter review content and quiz questions. They apply to every chapter, written by a person or an AI agent. The schema lives in [src/types/content.ts](src/types/content.ts). Automated checks live in [src/lib/validate-chapter.ts](src/lib/validate-chapter.ts).

## 1. Source fidelity

- The instructor's lecture notes are the primary authority. Read the whole source document, including diagrams, tables, and highlighted text, before writing anything.
- Do not invent facts and present them as lecture content. Do not fabricate quotations, page numbers, or slide numbers.
- Keep the instructor's terminology. Technical terms stay in English, exactly as written in the notes. Silently fix obvious typos (for example "biformatics" → "bioinformatics"), but never change a meaning.
- Material that is not in the notes (textbook context, a calculation the notes leave unfinished) may be added only when it genuinely helps. It must go in a `callout` with `tone: 'supplemental'` and a title containing "Supplemental".
- If the notes contradict themselves, do not pick a side silently. Add a `callout` with `tone: 'caution'` that describes both versions, and keep that point out of the quiz.
- If something is unclear or unreadable, leave it out or flag it. Never guess.

## 2. Review content

- Organize sections around the notes' own structure. Use the sections that fit the material. Not every chapter needs every kind of block.
- Typical sections: overview, definitions and terminology, explanations, comparisons, examples, processes and classifications, a summary, and "Commonly confused concepts" when the material supports it.
- Choose the block type that matches the content:

| Block | Use for |
| --- | --- |
| `paragraph` | Short explanations. Support `**bold**` for key terms only. |
| `list` | Enumerations from the notes. |
| `definitions` | Term → meaning pairs. |
| `table` | Tabular data from the notes. Use `✓` / `✗` cells for yes/no; they render as accessible icons. |
| `comparison` | Two or more side-by-side concepts (e.g. descriptive vs. predictive). |
| `process` | Ordered steps (e.g. the KDD process). |
| `example` | Worked or applied examples from the notes. |
| `callout` | `note` (emphasis from the notes), `tip` (exam advice), `caution` (inconsistencies, pitfalls), `supplemental` (not in the notes). |
| `tree` | Taxonomy diagrams. |

- Add a `source` reference to a section only when the location is certain: `{ sourceId, page, section }` for PDFs (1-based pages), `{ sourceId, slide, section }` for slide decks, or `{ sourceId, section }` for Word documents (the section must be a verified heading listed in `src/data/source-manifest.ts`). `sourceId` may be omitted when the chapter has a single source.
- Source titles in `sources` are shown to students: use readable names ("Lecture slides", "FP-growth notes"), never filenames or paths.
- If a source contains an error (for example, a count that does not match its own data), do not silently correct it in student-facing content. Show only verified values, add a neutral `caution` callout when the discrepancy matters for understanding, keep it out of the quiz, and record it in the private `source_materials/SOURCE_ANALYSIS_ALL_COURSE.md`.
- Be concise: exam-focused, no repetition, no padding.
- `learningObjectives` should start with a verb ("Define…", "Distinguish…"). `keyTakeaways` should hold 4 to 7 one-sentence points.
- Writing style: plain sentences, no em-dashes, no marketing tone.

## 3. Quiz questions

Every chapter has **exactly 20** questions. Each question has:

- **4 options** with ids `a`, `b`, `c`, `d`, unique text, and **exactly one** correct answer referenced by `correctOptionId` (an id, never an index).
- An `explanation` that teaches **why** the answer is right and, where useful, why a tempting distractor is wrong. Do not just repeat the answer.
- A `difficulty` (`easy`, `medium`, or `hard`).
- A `sourceReference` when the page, slide, or section is certain.
- An id of the form `chXX-qNN` (e.g. `ch03-q07`).

Quality rules:

- **Coverage:** spread questions across all major sections of the chapter.
- **Mix of question types:** definitions and terminology, conceptual understanding, comparisons, applying a concept to a scenario, reading a table or process, and important classifications.
- **Difficulty mix (target):** about 5 easy, 11 medium, 4 hard.
- **Distractors** must be plausible and educational. Use related concepts from the same chapter (for example, using an input attribute as a distractor for "class label"). Avoid absurd options, "all of the above", "none of the above", and trick wording.
- **Answer positions:** vary them naturally. Aim for roughly 5 per position. The validator fails a chapter if one position holds more than 8 correct answers.
- **No duplicates:** each question tests something distinct.
- **Fidelity:** every correct answer must be supported by the notes. Do not test supplemental material, and do not test points the notes contradict.
- Options should be similar in length and grammar so that the longest option is not a giveaway.

## 4. Self-check before saving

1. Every fact in the review appears in the notes, or is inside a labeled supplemental callout.
2. Every correct answer is verifiably right according to the notes, and every distractor is verifiably wrong.
3. Page references were checked against the PDF.
4. `npm test` passes; the chapter validation tests run automatically.
