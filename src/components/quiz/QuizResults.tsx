import { BookOpen, Check, CircleDashed, Home, RotateCcw, X } from 'lucide-react';
import { useState, type Ref } from 'react';
import type { Chapter } from '../../types/content';
import { resultBand, type QuestionOutcome, type QuestionResult, type QuizResult } from '../../lib/quiz';
import { cn } from '../../lib/cn';
import { reviewPath } from '../../lib/routes';
import { Button, ButtonLink } from '../ui/Button';
import { optionLetter } from './QuestionCard';
import { ScoreRing } from './ScoreRing';

type Filter = 'all' | 'review';

const outcomeStyles: Record<QuestionOutcome, { label: string; icon: typeof Check; className: string }> = {
  correct: { label: 'Correct', icon: Check, className: 'bg-success-soft text-success' },
  incorrect: { label: 'Incorrect', icon: X, className: 'bg-danger-soft text-danger' },
  unanswered: { label: 'Not answered', icon: CircleDashed, className: 'bg-warning-soft text-warning' },
};

function ResultItem({ item, index }: { item: QuestionResult; index: number }) {
  const { question, selectedOptionId, outcome } = item;
  const style = outcomeStyles[outcome];
  const Icon = style.icon;

  return (
    <li className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-sm text-subtle">Question {index + 1}</p>
        <span className={cn('inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold', style.className)}>
          <Icon aria-hidden className="size-3.5" />
          {style.label}
        </span>
      </div>
      <h3 className="mt-2 text-lg leading-snug font-semibold text-balance text-fg">{question.question}</h3>

      <ul className="mt-4 space-y-2" aria-label="Answer options">
        {question.options.map((option, i) => {
          const isCorrect = option.id === question.correctOptionId;
          const isSelected = option.id === selectedOptionId;
          return (
            <li
              key={option.id}
              className={cn(
                'flex items-start gap-3 rounded-lg border px-3 py-2.5 text-[0.9375rem]',
                isCorrect && 'border-success/40 bg-success-soft',
                isSelected && !isCorrect && 'border-danger/40 bg-danger-soft',
                !isCorrect && !isSelected && 'border-transparent',
              )}
            >
              <span
                aria-hidden
                className={cn(
                  'grid size-6 shrink-0 place-items-center rounded-full font-mono text-xs font-medium',
                  isCorrect ? 'bg-success text-surface' : isSelected ? 'bg-danger text-surface' : 'border border-border-strong text-subtle',
                )}
              >
                {isCorrect ? <Check className="size-3.5" /> : isSelected ? <X className="size-3.5" /> : optionLetter(i)}
              </span>
              <span className={cn('flex-1 leading-relaxed', isCorrect || isSelected ? 'text-fg' : 'text-muted')}>{option.text}</span>
              <span className="flex shrink-0 flex-col items-end gap-1 pt-0.5 text-xs font-semibold">
                {isCorrect && <span className="text-success">Correct answer</span>}
                {isSelected && <span className={isCorrect ? 'text-success' : 'text-danger'}>Your answer</span>}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 rounded-lg bg-surface-sunken px-4 py-3">
        <p className="text-sm leading-relaxed text-pretty text-muted">
          <span className="font-semibold text-fg">Explanation. </span>
          {question.explanation}
        </p>
        {question.sourceReference && (
          <p className="mt-2 font-mono text-xs text-subtle">
            Notes, p. {question.sourceReference.page}: {question.sourceReference.section}
          </p>
        )}
      </div>
    </li>
  );
}

type QuizResultsProps = {
  chapter: Chapter;
  result: QuizResult;
  onRetry: () => void;
  headingRef?: Ref<HTMLHeadingElement>;
};

export function QuizResults({ chapter, result, onRetry, headingRef }: QuizResultsProps) {
  const [filter, setFilter] = useState<Filter>('all');
  const band = resultBand(result.percentage);
  const toReview = result.items.filter((i) => i.outcome !== 'correct').length;
  const visible = result.items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => filter === 'all' || item.outcome !== 'correct');

  const stats = [
    { label: 'Correct', value: result.correct, className: 'text-success' },
    { label: 'Incorrect', value: result.incorrect, className: 'text-danger' },
    ...(result.unanswered > 0 ? [{ label: 'Not answered', value: result.unanswered, className: 'text-warning' }] : []),
  ];

  return (
    <div className="enter">
      <section
        aria-labelledby="results-heading"
        className="rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8"
      >
        <div className="flex flex-col items-center gap-8 text-center sm:flex-row sm:text-left">
          <ScoreRing percentage={result.percentage} />
          <div className="flex-1">
            <h2 ref={headingRef} tabIndex={-1} id="results-heading" className="text-sm font-medium text-muted outline-none">
              Your result
            </h2>
            <p className="mt-1 text-4xl font-semibold tracking-tight text-fg">
              {result.correct} <span className="text-2xl font-normal text-subtle">/ {result.total}</span>
            </p>
            <p className="mt-2 font-semibold text-accent">{band.label}</p>
            <p className="mt-1 text-pretty text-muted">{band.message}</p>
            <dl className="mt-5 flex flex-wrap justify-center gap-x-8 gap-y-3 sm:justify-start">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-xs text-subtle">{stat.label}</dt>
                  <dd className={cn('font-mono text-xl font-medium', stat.className)}>{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row">
          <Button onClick={onRetry}>
            <RotateCcw aria-hidden />
            Retry quiz
          </Button>
          <ButtonLink to={reviewPath(chapter.id)} variant="secondary">
            <BookOpen aria-hidden />
            Review chapter
          </ButtonLink>
          <ButtonLink to="/" variant="ghost">
            <Home aria-hidden />
            Home
          </ButtonLink>
        </div>
        <p className="mt-4 text-xs text-subtle">Scores are not saved. Retrying starts a fresh attempt.</p>
      </section>

      <section aria-labelledby="answer-review-heading" className="mt-12">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <h2 id="answer-review-heading" className="text-2xl font-semibold tracking-tight text-fg">
            Answer review
          </h2>
          <div className="inline-flex rounded-lg border border-border bg-surface p-1" role="group" aria-label="Filter questions">
            {(
              [
                ['all', `All (${result.total})`],
                ['review', `To review (${toReview})`],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={filter === value}
                onClick={() => setFilter(value)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150',
                  filter === value ? 'bg-accent-soft text-accent-soft-fg' : 'text-muted hover:text-fg',
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {visible.length === 0 ? (
          <div role="status" className="rounded-2xl border border-dashed border-border-strong px-6 py-12 text-center">
            <Check aria-hidden className="mx-auto size-8 text-success" />
            <p className="mt-3 font-medium text-fg">Nothing to review</p>
            <p className="mt-1 text-sm text-muted">You answered every question correctly.</p>
          </div>
        ) : (
          <ol className="space-y-4">
            {visible.map(({ item, index }) => (
              <ResultItem key={item.question.id} item={item} index={index} />
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
