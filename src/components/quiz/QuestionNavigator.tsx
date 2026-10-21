import { Send } from 'lucide-react';
import type { QuizQuestion } from '../../types/content';
import type { QuizAnswers } from '../../lib/quiz';
import { cn } from '../../lib/cn';
import { Button } from '../ui/Button';

type QuestionNavigatorProps = {
  questions: readonly QuizQuestion[];
  answers: QuizAnswers;
  currentIndex: number;
  answeredCount: number;
  onGoTo: (index: number) => void;
  onSubmit: () => void;
};

export function QuestionNavigator({ questions, answers, currentIndex, answeredCount, onGoTo, onSubmit }: QuestionNavigatorProps) {
  const remaining = questions.length - answeredCount;

  return (
    <nav aria-label="Question overview" className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-semibold text-fg">Overview</h2>
        <p className="text-sm text-muted">
          {remaining === 0 ? 'All answered' : `${remaining} unanswered`}
        </p>
      </div>

      <ol className="mt-4 grid grid-cols-5 gap-2">
        {questions.map((question, i) => {
          const answered = answers[question.id] !== undefined;
          const current = i === currentIndex;
          return (
            <li key={question.id}>
              <button
                type="button"
                onClick={() => onGoTo(i)}
                aria-current={current ? 'step' : undefined}
                aria-label={`Question ${i + 1}, ${answered ? 'answered' : 'not answered'}`}
                className={cn(
                  'grid h-10 w-full place-items-center rounded-lg border font-mono text-sm transition-colors duration-150',
                  answered ? 'border-transparent bg-accent-soft text-accent-soft-fg' : 'border-border text-muted hover:border-border-strong hover:text-fg',
                  current && 'ring-2 ring-accent ring-offset-2 ring-offset-surface',
                )}
              >
                {i + 1}
              </button>
            </li>
          );
        })}
      </ol>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted" aria-hidden>
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded bg-accent-soft ring-1 ring-accent/30" /> Answered
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded border border-border-strong" /> Unanswered
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded ring-2 ring-accent" /> Current
        </span>
      </div>

      <Button onClick={onSubmit} variant={remaining === 0 ? 'primary' : 'secondary'} className="mt-5 w-full">
        <Send aria-hidden />
        Submit quiz
      </Button>
    </nav>
  );
}
