import type { Ref } from 'react';
import type { QuizQuestion } from '../../types/content';
import { cn } from '../../lib/cn';

export const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'] as const;
export const optionLetter = (index: number) => OPTION_LETTERS[index] ?? String(index + 1);

type QuestionCardProps = {
  question: QuizQuestion;
  index: number;
  total: number;
  selectedOptionId: string | undefined;
  onSelect: (optionId: string) => void;
  headingRef?: Ref<HTMLHeadingElement>;
};

/** One question as a native radio group: arrow keys move between options, Space selects. */
export function QuestionCard({ question, index, total, selectedOptionId, onSelect, headingRef }: QuestionCardProps) {
  const groupName = `answer-${question.id}`;

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-8">
      <h2 ref={headingRef} tabIndex={-1} className="font-mono text-sm text-accent outline-none">
        Question {index + 1} of {total}
      </h2>

      <fieldset className="mt-3">
        <legend className="text-xl leading-snug font-semibold tracking-tight text-balance text-fg sm:text-[1.375rem]">
          {question.question}
        </legend>

        <div className="mt-6 space-y-3">
          {question.options.map((option, i) => {
            const selected = option.id === selectedOptionId;
            return (
              <label
                key={option.id}
                className={cn(
                  'flex cursor-pointer items-start gap-4 rounded-xl border px-4 py-3.5 transition-[background-color,border-color,transform] duration-150 active:scale-[0.995]',
                  'has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-[var(--focus)]',
                  selected
                    ? 'border-accent bg-accent-soft'
                    : 'border-border bg-surface hover:border-border-strong hover:bg-surface-sunken',
                )}
              >
                <input
                  type="radio"
                  name={groupName}
                  value={option.id}
                  checked={selected}
                  onChange={() => onSelect(option.id)}
                  className="sr-only"
                />
                <span
                  aria-hidden
                  className={cn(
                    'grid size-7 shrink-0 place-items-center rounded-full border font-mono text-sm font-medium transition-colors duration-150',
                    selected ? 'border-accent bg-accent text-accent-contrast' : 'border-border-strong text-muted',
                  )}
                >
                  {optionLetter(i)}
                </span>
                <span className={cn('pt-0.5 leading-relaxed text-pretty', selected ? 'text-fg' : 'text-fg/90')}>
                  {option.text}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
