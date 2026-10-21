import { BookOpen, ListChecks, PlayCircle } from 'lucide-react';
import type { Chapter } from '../../types/content';
import { ButtonLink } from '../ui/Button';
import { chapterLabel, quizPath, reviewPath } from '../../lib/routes';

const MAX_TOPICS = 4;

export function ChapterCard({ chapter }: { chapter: Chapter }) {
  const topics = chapter.reviewSections.filter((s) => s.id !== 'commonly-confused' && s.id !== 'chapter-summary');
  const shown = topics.slice(0, MAX_TOPICS);
  const hidden = topics.length - shown.length;
  const headingId = `${chapter.id}-title`;

  return (
    <article
      aria-labelledby={headingId}
      className="group flex flex-col rounded-2xl border border-border bg-surface p-6 shadow-card transition-colors duration-200 hover:border-border-strong sm:p-7"
    >
      <div className="flex items-start justify-between gap-4">
        <p className="font-mono text-sm text-accent">{chapterLabel(chapter.number)}</p>
        <span
          aria-hidden
          className="font-mono text-5xl leading-none font-medium tracking-tighter text-border-strong transition-colors duration-200 group-hover:text-accent/40"
        >
          {String(chapter.number).padStart(2, '0')}
        </span>
      </div>

      <h3 id={headingId} className="mt-2 text-xl font-semibold tracking-tight text-balance text-fg sm:text-2xl">
        {chapter.title}
      </h3>
      <p className="mt-3 leading-relaxed text-pretty text-muted">{chapter.description}</p>

      <ul className="mt-5 flex flex-wrap gap-2" aria-label="Topics covered">
        {shown.map((section) => (
          <li key={section.id} className="rounded-md bg-surface-sunken px-2.5 py-1 text-[0.8125rem] text-muted">
            {section.title}
          </li>
        ))}
        {hidden > 0 && <li className="px-1 py-1 text-[0.8125rem] text-subtle">+{hidden} more</li>}
      </ul>

      <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-5 text-sm text-muted">
        <div className="flex items-center gap-2">
          <BookOpen aria-hidden className="size-4 text-subtle" />
          <dt className="sr-only">Review sections</dt>
          <dd>{chapter.reviewSections.length} review sections</dd>
        </div>
        <div className="flex items-center gap-2">
          <ListChecks aria-hidden className="size-4 text-subtle" />
          <dt className="sr-only">Quiz</dt>
          <dd>{chapter.questions.length}-question quiz</dd>
        </div>
      </dl>

      <div className="mt-6 flex flex-col gap-3 sm:mt-auto sm:flex-row sm:pt-6">
        <ButtonLink to={reviewPath(chapter.id)} className="sm:flex-1" aria-label={`Review notes, ${chapterLabel(chapter.number)}`}>
          <BookOpen aria-hidden />
          Review notes
        </ButtonLink>
        <ButtonLink
          to={quizPath(chapter.id)}
          variant="secondary"
          className="sm:flex-1"
          aria-label={`Start quiz, ${chapterLabel(chapter.number)}`}
        >
          <PlayCircle aria-hidden />
          Start quiz
        </ButtonLink>
      </div>
    </article>
  );
}
