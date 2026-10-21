import { useMemo, useReducer } from 'react';
import type { QuizQuestion } from '../types/content';
import { scoreQuiz, type QuizAnswers, type QuizResult } from '../lib/quiz';

type QuizState = {
  answers: QuizAnswers;
  currentIndex: number;
  submitted: boolean;
  /** Increments on every retry so views can reset local UI state. */
  attempt: number;
};

type QuizAction =
  | { type: 'select'; questionId: string; optionId: string }
  | { type: 'goTo'; index: number }
  | { type: 'submit' }
  | { type: 'reset' };

const initialState: QuizState = { answers: {}, currentIndex: 0, submitted: false, attempt: 1 };

export function createQuizReducer(questions: readonly QuizQuestion[]) {
  return function reducer(state: QuizState, action: QuizAction): QuizState {
    switch (action.type) {
      case 'select': {
        if (state.submitted) return state;
        const question = questions.find((q) => q.id === action.questionId);
        if (!question || !question.options.some((o) => o.id === action.optionId)) return state;
        return { ...state, answers: { ...state.answers, [action.questionId]: action.optionId } };
      }
      case 'goTo': {
        if (state.submitted) return state;
        const index = Math.min(Math.max(action.index, 0), questions.length - 1);
        return index === state.currentIndex ? state : { ...state, currentIndex: index };
      }
      case 'submit':
        return state.submitted ? state : { ...state, submitted: true };
      case 'reset':
        return { ...initialState, attempt: state.attempt + 1 };
    }
  };
}

export function useQuiz(questions: readonly QuizQuestion[]) {
  const reducer = useMemo(() => createQuizReducer(questions), [questions]);
  const [state, dispatch] = useReducer(reducer, initialState);

  // Scored from the chapter's answer key only after submission.
  const result: QuizResult | null = useMemo(
    () => (state.submitted ? scoreQuiz(questions, state.answers) : null),
    [questions, state.answers, state.submitted],
  );

  const actions = useMemo(
    () => ({
      select: (questionId: string, optionId: string) => dispatch({ type: 'select', questionId, optionId }),
      goTo: (index: number) => dispatch({ type: 'goTo', index }),
      submit: () => dispatch({ type: 'submit' }),
      reset: () => dispatch({ type: 'reset' }),
    }),
    [],
  );

  return { ...state, result, ...actions };
}
