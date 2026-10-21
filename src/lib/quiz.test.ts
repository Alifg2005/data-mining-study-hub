import { describe, expect, it } from 'vitest';
import type { QuizQuestion } from '../types/content';
import { countAnswered, firstUnansweredIndex, resultBand, scoreQuiz } from './quiz';
import { createQuizReducer } from '../hooks/useQuiz';

const makeQuestion = (n: number, correct: string): QuizQuestion => ({
  id: `q${n}`,
  question: `Question ${n}?`,
  options: ['a', 'b', 'c', 'd'].map((id) => ({ id, text: `Option ${id}` })),
  correctOptionId: correct,
  explanation: 'Because.',
  difficulty: 'easy',
});

const questions = [makeQuestion(1, 'a'), makeQuestion(2, 'b'), makeQuestion(3, 'c'), makeQuestion(4, 'd')];

describe('scoreQuiz', () => {
  it('scores all-correct answers as 100%', () => {
    const result = scoreQuiz(questions, { q1: 'a', q2: 'b', q3: 'c', q4: 'd' });
    expect(result).toMatchObject({ total: 4, correct: 4, incorrect: 0, unanswered: 0, percentage: 100 });
  });

  it('separates correct, incorrect, and unanswered', () => {
    const result = scoreQuiz(questions, { q1: 'a', q2: 'c' });
    expect(result).toMatchObject({ correct: 1, incorrect: 1, unanswered: 2, percentage: 25 });
    expect(result.items.map((i) => i.outcome)).toEqual(['correct', 'incorrect', 'unanswered', 'unanswered']);
    expect(result.items[1]?.selectedOptionId).toBe('c');
  });

  it('treats an option id that does not belong to the question as unanswered', () => {
    const result = scoreQuiz(questions, { q1: 'z' });
    expect(result.items[0]?.outcome).toBe('unanswered');
    expect(result.correct).toBe(0);
  });

  it('ignores answers for unknown questions', () => {
    const result = scoreQuiz(questions, { unknown: 'a' });
    expect(result.unanswered).toBe(4);
  });

  it('rounds percentages to whole numbers', () => {
    const three = questions.slice(0, 3);
    expect(scoreQuiz(three, { q1: 'a' }).percentage).toBe(33);
    expect(scoreQuiz(three, { q1: 'a', q2: 'b' }).percentage).toBe(67);
  });

  it('handles an empty quiz', () => {
    expect(scoreQuiz([], {}).percentage).toBe(0);
  });
});

describe('progress helpers', () => {
  it('counts answered questions and finds the first unanswered one', () => {
    expect(countAnswered(questions, { q1: 'a', q3: 'b' })).toBe(2);
    expect(firstUnansweredIndex(questions, { q1: 'a', q3: 'b' })).toBe(1);
    expect(firstUnansweredIndex(questions, { q1: 'a', q2: 'a', q3: 'a', q4: 'a' })).toBe(-1);
  });

  it('maps percentages to result bands', () => {
    expect(resultBand(95).label).toBe('Excellent');
    expect(resultBand(80).label).toBe('Good work');
    expect(resultBand(50).label).toBe('Keep practicing');
    expect(resultBand(10).label).toBe('Review needed');
  });
});

describe('quiz reducer', () => {
  const reducer = createQuizReducer(questions);
  const start = { answers: {}, currentIndex: 0, submitted: false, attempt: 1 };

  it('records and changes answers', () => {
    let state = reducer(start, { type: 'select', questionId: 'q1', optionId: 'b' });
    state = reducer(state, { type: 'select', questionId: 'q1', optionId: 'a' });
    expect(state.answers).toEqual({ q1: 'a' });
  });

  it('rejects invalid selections', () => {
    expect(reducer(start, { type: 'select', questionId: 'q1', optionId: 'z' })).toBe(start);
    expect(reducer(start, { type: 'select', questionId: 'nope', optionId: 'a' })).toBe(start);
  });

  it('keeps answers while navigating and clamps the index', () => {
    let state = reducer(start, { type: 'select', questionId: 'q1', optionId: 'a' });
    state = reducer(state, { type: 'goTo', index: 3 });
    state = reducer(state, { type: 'goTo', index: 99 });
    expect(state.currentIndex).toBe(3);
    state = reducer(state, { type: 'goTo', index: -5 });
    expect(state.currentIndex).toBe(0);
    expect(state.answers).toEqual({ q1: 'a' });
  });

  it('locks answers after submission and resets on retry', () => {
    let state = reducer(start, { type: 'select', questionId: 'q1', optionId: 'a' });
    state = reducer(state, { type: 'submit' });
    expect(reducer(state, { type: 'select', questionId: 'q2', optionId: 'b' })).toBe(state);
    state = reducer(state, { type: 'reset' });
    expect(state).toEqual({ answers: {}, currentIndex: 0, submitted: false, attempt: 2 });
  });
});
