import { ArrowRight, BookOpenText } from 'lucide-react';
import { siteConfig } from '../config/site';
import { chapters } from '../data/chapters';
import { ChapterCard } from '../components/chapters/ChapterCard';
import { ButtonLink } from '../components/ui/Button';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { reviewPath } from '../lib/routes';
import { QUESTIONS_PER_CHAPTER } from '../lib/validate-chapter';

export function HomePage() {
  useDocumentTitle();
  const first = chapters[0];

  return (
    <div className="enter mx-auto max-w-6xl px-4 sm:px-6">
      <section className="grid gap-10 pt-12 pb-14 sm:pt-16 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-16 lg:pt-20 lg:pb-20">
        <div>
          <p className="font-mono text-sm text-accent">
            {siteConfig.courseCode} · {siteConfig.projectName}
          </p>
          <h1 className="mt-4 text-5xl leading-[1.05] font-semibold tracking-tighter text-fg sm:text-6xl">
            {siteConfig.courseName}
          </h1>
          <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-pretty text-muted">
            Concise review notes built from the lecture notes, plus a {QUESTIONS_PER_CHAPTER}-question quiz for every
            chapter with explained answers.
          </p>
          {first && (
            <div className="mt-8">
              <ButtonLink to={reviewPath(first.id)}>
                Start with Chapter {first.number}
                <ArrowRight aria-hidden />
              </ButtonLink>
            </div>
          )}
        </div>

        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border text-sm">
          {[
            ['Course', `${siteConfig.courseName} (${siteConfig.courseCode})`],
            ['Instructor', siteConfig.instructorName],
            ['Prepared by', siteConfig.studentName],
            ['Chapters', `${chapters.length} available`],
          ].map(([term, value]) => (
            <div key={term} className="bg-surface p-4 sm:p-5">
              <dt className="text-subtle">{term}</dt>
              <dd className="mt-1 font-medium text-pretty text-fg">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="chapters-heading" className="pb-20">
        <div className="mb-6 flex items-baseline justify-between gap-4 border-t border-border pt-10">
          <h2 id="chapters-heading" className="text-2xl font-semibold tracking-tight text-fg">
            Chapters
          </h2>
          <p className="text-sm text-muted">Review first, then test yourself.</p>
        </div>

        {chapters.length === 0 ? (
          <div role="status" className="rounded-2xl border border-dashed border-border-strong px-6 py-16 text-center">
            <BookOpenText aria-hidden className="mx-auto size-8 text-subtle" />
            <p className="mt-3 font-medium text-fg">No chapters yet</p>
            <p className="mt-1 text-sm text-muted">Chapters appear here once they are added to the chapter registry.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {chapters.map((chapter) => (
              <ChapterCard key={chapter.id} chapter={chapter} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
