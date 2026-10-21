import type { QuizQuestion } from '../types/content';

/** Selected option id per question id. Missing key means unanswered. */
export type QuizAnswers = Readonly<Record<string, string>>;

export type QuestionOutcome = 'correct' | 'incorrect' | 'unanswered';

export type QuestionResult = {
  question: QuizQuestion;
  selectedOptionId: string | null;
  outcome: QuestionOutcome;
};

export type QuizResult = {
  total: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  /** Whole-number percentage of correct answers, 0-100. */
  percentage: number;
  items: QuestionResult[];
};

/**
 * Scores a quiz against the chapter's answer key.
 * Unanswered questions count as not correct; they are reported separately
 * from incorrect answers so the results screen can show both.
 */
export function scoreQuiz(questions: readonly QuizQuestion[], answers: QuizAnswers): QuizResult {
  const items = questions.map<QuestionResult>((question) => {
    const selected = answers[question.id];
    const isValidSelection = selected !== undefined && question.options.some((o) => o.id === selected);
    if (!isValidSelection) return { question, selectedOptionId: null, outcome: 'unanswered' };
    return {
      question,
      selectedOptionId: selected,
      outcome: selected === question.correctOptionId ? 'correct' : 'incorrect',
    };
  });

  const correct = items.filter((i) => i.outcome === 'correct').length;
  const incorrect = items.filter((i) => i.outcome === 'incorrect').length;
  const total = questions.length;

  return {
    total,
    correct,
    incorrect,
    unanswered: total - correct - incorrect,
    percentage: total === 0 ? 0 : Math.round((correct / total) * 100),
    items,
  };
}

export function countAnswered(questions: readonly QuizQuestion[], answers: QuizAnswers): number {
  return questions.filter((q) => answers[q.id] !== undefined).length;
}

export function firstUnansweredIndex(questions: readonly QuizQuestion[], answers: QuizAnswers): number {
  return questions.findIndex((q) => answers[q.id] === undefined);
}

export type ResultBand = { label: string; message: string };

export function resultBand(percentage: number): ResultBand {
  if (percentage >= 90) return { label: 'Excellent', message: 'You have a strong command of this chapter.' };
  if (percentage >= 75) return { label: 'Good work', message: 'Solid understanding. Review the questions you missed.' };
  if (percentage >= 50)
    return { label: 'Keep practicing', message: 'Revisit the review notes for the topics below, then try again.' };
  return { label: 'Review needed', message: 'Work through the chapter review before your next attempt.' };
}
