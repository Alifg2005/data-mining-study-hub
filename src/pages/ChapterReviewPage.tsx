import { ArrowLeft, CheckCircle2, PlayCircle, Target } from 'lucide-react';
import { useMemo } from 'react';
import { Link, useParams } from 'react-router';
import { getChapter } from '../data/chapters';
import type { Chapter } from '../types/content';
import { ContentBlockView } from '../components/review/ContentBlockView';
import { ButtonLink } from '../components/ui/Button';
import { useActiveSection } from '../hooks/useActiveSection';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { cn } from '../lib/cn';
import { chapterLabel, quizPath } from '../lib/routes';
import { NotFoundPage } from './NotFoundPage';

export function ChapterReviewPage() {
  const { chapterId } = useParams();
  const chapter = getChapter(chapterId);
  if (!chapter) return <NotFoundPage kind="chapter" />;
  return <ChapterReview key={chapter.id} chapter={chapter} />;
}

function TableOfContents({ chapter, activeId }: { chapter: Chapter; activeId: string | undefined }) {
  return (
    <ol className="space-y-0.5 text-sm">
      {chapter.reviewSections.map((section) => (
        <li key={section.id}>
          <a
            href={`#${section.id}`}
            aria-current={activeId === section.id ? 'location' : undefined}
            className={cn(
              'block rounded-md border-l-2 py-1.5 pr-2 pl-3 transition-colors duration-150',
              activeId === section.id
                ? 'border-accent font-medium text-fg'
                : 'border-transparent text-muted hover:border-border-strong hover:text-fg',
            )}
          >
            {section.title}
          </a>
        </li>
      ))}
    </ol>
  );
}

function ChapterReview({ chapter }: { chapter: Chapter }) {
  useDocumentTitle(`${chapterLabel(chapter.number)}: ${chapter.title}`);
  const sectionIds = useMemo(() => chapter.reviewSections.map((s) => s.id), [chapter]);
  const activeId = useActiveSection(sectionIds);

  return (
    <div className="enter mx-auto max-w-6xl px-4 pt-8 pb-20 sm:px-6 sm:pt-10">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 rounded-md text-sm text-muted transition-colors hover:text-fg"
      >
        <ArrowLeft aria-hidden className="size-4" />
        All chapters
      </Link>

      <header className="mt-6 border-b border-border pb-8">
        <p className="font-mono text-sm text-accent">{chapterLabel(chapter.number)} · Review</p>
        <h1 className="mt-3 max-w-[22ch] text-4xl leading-[1.1] font-semibold tracking-tight text-balance text-fg sm:text-5xl">
          {chapter.title}
        </h1>
        <p className="mt-4 max-w-[62ch] text-lg leading-relaxed text-pretty text-muted">{chapter.description}</p>
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
          <ButtonLink to={quizPath(chapter.id)}>
            <PlayCircle aria-hidden />
            Start the quiz
          </ButtonLink>
          <span className="text-sm text-subtle">{chapter.questions.length} questions · answers shown after you submit</span>
        </div>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14">
        <nav aria-label="Chapter sections" className="hidden lg:block">
          <div className="sticky top-24">
            <p className="mb-3 pl-3 text-sm font-semibold text-fg">On this page</p>
            <TableOfContents chapter={chapter} activeId={activeId} />
          </div>
        </nav>

        <div className="min-w-0 max-w-3xl">
          <details className="mb-8 rounded-xl border border-border bg-surface lg:hidden">
            <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-fg">On this page</summary>
            <nav aria-label="Chapter sections" className="border-t border-border px-1 py-2">
              <TableOfContents chapter={chapter} activeId={activeId} />
            </nav>
          </details>

          <section aria-labelledby="objectives-heading" className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <h2 id="objectives-heading" className="flex items-center gap-2 font-semibold text-fg">
              <Target aria-hidden className="size-[18px] text-accent" />
              Learning objectives
            </h2>
            <ul className="mt-4 space-y-2.5">
              {chapter.learningObjectives.map((objective) => (
                <li key={objective} className="flex gap-3 leading-relaxed text-muted">
                  <CheckCircle2 aria-hidden className="mt-1 size-4 shrink-0 text-subtle" />
                  <span className="text-pretty">{objective}</span>
                </li>
              ))}
            </ul>
          </section>

          {chapter.reviewSections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-heading`}
              className="scroll-mt-24 pt-12"
            >
              <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h2 id={`${section.id}-heading`} className="text-2xl font-semibold tracking-tight text-balance text-fg">
                  <span aria-hidden className="mr-3 font-mono text-base font-normal text-subtle">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {section.title}
                </h2>
                {section.source && <p className="font-mono text-xs text-subtle">Notes, p. {section.source.page}</p>}
              </div>
              <div className="space-y-5">
                {section.blocks.map((block, i) => (
                  <ContentBlockView key={i} block={block} />
                ))}
              </div>
            </section>
          ))}

          <section aria-labelledby="takeaways-heading" className="mt-14 rounded-2xl bg-accent-soft p-6 sm:p-8">
            <h2 id="takeaways-heading" className="text-xl font-semibold tracking-tight text-fg">
              Key takeaways
            </h2>
            <ol className="mt-4 space-y-3">
              {chapter.keyTakeaways.map((takeaway, i) => (
                <li key={takeaway} className="flex gap-3 leading-relaxed text-fg/85">
                  <span aria-hidden className="font-mono text-sm leading-relaxed text-accent-soft-fg">
                    {i + 1}.
                  </span>
                  <span className="text-pretty">{takeaway}</span>
                </li>
              ))}
            </ol>
            <div className="mt-6 flex flex-wrap gap-3 border-t border-accent/20 pt-6">
              <ButtonLink to={quizPath(chapter.id)}>
                <PlayCircle aria-hidden />
                Start the quiz
              </ButtonLink>
              <ButtonLink to="/" variant="ghost">
                Back to chapters
              </ButtonLink>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
