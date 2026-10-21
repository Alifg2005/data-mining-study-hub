# Data Mining Study Hub

Review notes and practice quizzes for **CIS 517 Data Mining** (instructor: Dr. Tareq Alkhaldi), prepared by Ali Feras Alghanim.

Each chapter has:

- a concise **review** built from the lecture notes, and
- a **20-question multiple-choice quiz** with a score, explanations, and source page references shown after submission.

The site is fully static. It needs no backend, no database, no environment variables, and no runtime AI or API.

## Tech stack

React 19 · TypeScript (strict) · Vite · Tailwind CSS v4 · React Router · Lucide icons · Vitest + Testing Library · ESLint

## Getting started

Requires Node.js 20.19+ (or 22.12+).

```bash
npm install
npm run dev        # http://localhost:5173
```

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Typecheck, validate chapter content, and build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run all tests |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript checks |
| `npm run check` | Lint, typecheck, test, and build |
| `npm run verify:sources` | Local only: confirm the private source notes exist in `source_materials/` |

## Project structure

```text
src/config/site.ts          Student, instructor, course details (edit here only)
src/data/chapters/          Chapter content files + the chapter registry (index.ts)
src/types/content.ts        Content schema
src/lib/                    Quiz scoring engine, content validation, theme helpers
src/components/, src/pages/ Reusable UI; one review page and one quiz page serve all chapters
source_materials/           Original lecture notes (local only: gitignored, never deployed)
AI_INSTRUCTIONS.md          Operating guide for AI agents, including adding chapters
CONTENT_GUIDELINES.md       Rules for review content and quiz questions
```

## Quiz behavior

- One question at a time, with previous/next navigation and an overview grid for jumping to any question. Answers can be changed at any time before submitting.
- Submitting with unanswered questions asks for confirmation. **Unanswered questions are scored as not correct** and are listed separately in the results.
- Correct answers are revealed only after submission. Scores are calculated from the answer key in the chapter data.
- Answers are kept in memory for the current visit only. Scores are not saved. The only thing stored in the browser is the theme preference (`localStorage`).

## Adding a chapter

Chapters are added by an AI coding agent that reads the new lecture notes and edits the repository directly. Put the notes in the repository (for example `source_materials/chapter-03/`), then give the agent this instruction:

> Read and follow AI_INSTRUCTIONS.md completely. Process the new lecture notes located at `source_materials/chapter-03/`. Analyze the notes, generate the chapter review and exactly 20 validated multiple-choice questions, create the required chapter data file, register the chapter in the application, preserve all existing chapters and functionality, validate the content, run the available checks and production build, fix any issues caused by your changes, and report the final results. Do not stop for intermediate approval.

Manually, adding a chapter means creating `src/data/chapters/chapter-XX.ts` and appending it to `src/data/chapters/index.ts`. No other files change. See [AI_INSTRUCTIONS.md](AI_INSTRUCTIONS.md).

Content is validated automatically: exactly 20 questions, 4 unique options, exactly one valid correct answer, unique ids, valid page references, and no answer-position bias. A malformed chapter fails `npm test` and `npm run build`, so it cannot be deployed.

## Deployment

### 1. Publish to GitHub

```bash
git add .
git commit -m "Initial commit: Data Mining Study Hub"
git branch -M main
git remote add origin https://github.com/<your-username>/data-mining-study-hub.git
git push -u origin main
```

(Create an empty repository on GitHub first, without a README, so the push does not conflict.)

### 2. Deploy on Vercel

1. Sign in at [vercel.com](https://vercel.com) with GitHub.
2. Click **Add New → Project** and import the `data-mining-study-hub` repository.
3. Vercel detects **Vite** automatically. Keep the defaults:
   - Build command: `npm run build`
   - Output directory: `dist`
   - No environment variables are needed.
4. Click **Deploy**.

`vercel.json` rewrites every path to `index.html`, so links like `/chapters/chapter-01/quiz` work on reload. Each push to `main` redeploys automatically. Adding a chapter is therefore commit, push, done.

## About `source_materials/`

The original lecture notes belong to the instructor, so they are kept **locally only**. `source_materials/` is listed in `.gitignore`, so the files are not pushed to GitHub, not in `public/`, and not part of the deployed site.

- `npm test`, `npm run build`, and `npm run check` do **not** need the source files. They validate each chapter's `source` metadata instead: the path format (`source_materials/chapter-XX/<file>.<pdf|pptx|docx|...>`), the page count, and that every page reference falls within it. This is what runs on Vercel.
- `npm run verify:sources` is an optional **local-only** check that the referenced files actually exist on your machine. Run it after adding a chapter. It fails if the private files are missing, so it is not part of the build.

## Accessibility and theming

- Semantic landmarks, a skip link, labeled controls, and visible focus styles.
- The quiz uses native radio groups (arrow keys move between options), and the confirmation uses a native modal dialog.
- Results never rely on color alone: icons and text labels mark correct and incorrect answers.
- Light and dark themes come from design tokens in `src/styles/index.css`. The first visit follows the OS setting, and a manual choice is remembered.
- Animations respect `prefers-reduced-motion`.
