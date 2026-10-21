import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { AppRoutes } from '../App';
import { chapters } from '../data/chapters';

const chapter = chapters[0]!;

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

const optionRadio = (text: string) => screen.getByRole('radio', { name: text });
const next = () => fireEvent.click(screen.getByRole('button', { name: /^Next/ }));

function answerAll(pick: (index: number) => string) {
  chapter.questions.forEach((q, i) => {
    const option = q.options.find((o) => o.id === pick(i))!;
    fireEvent.click(optionRadio(option.text));
    if (i < chapter.questions.length - 1) next();
  });
}

describe('home page', () => {
  it('lists every registered chapter with review and quiz actions', () => {
    renderAt('/');
    for (const c of chapters) {
      const card = screen.getByRole('article', { name: c.title });
      expect(within(card).getByRole('link', { name: `Review notes, Chapter ${c.number}` })).toHaveProperty(
        'pathname',
        `/chapters/${c.id}`,
      );
      expect(within(card).getByRole('link', { name: `Start quiz, Chapter ${c.number}` })).toHaveProperty(
        'pathname',
        `/chapters/${c.id}/quiz`,
      );
    }
  });
});

describe('review page', () => {
  it('renders every review section of a chapter', () => {
    renderAt(`/chapters/${chapter.id}`);
    expect(screen.getByRole('heading', { level: 1, name: chapter.title })).toBeTruthy();
    for (const section of chapter.reviewSections) {
      expect(screen.getByRole('heading', { level: 2, name: new RegExp(section.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) })).toBeTruthy();
    }
  });

  it('shows a not-found state for unknown chapters', () => {
    renderAt('/chapters/chapter-99');
    expect(screen.getByRole('heading', { name: 'Chapter not found' })).toBeTruthy();
    renderAt('/chapters/nope/quiz');
    expect(screen.getAllByRole('heading', { name: 'Chapter not found' }).length).toBeGreaterThan(0);
  });
});

describe('quiz flow', () => {
  it('preserves answers when navigating back and forth', () => {
    renderAt(`/chapters/${chapter.id}/quiz`);
    const [q1, q2] = chapter.questions;
    fireEvent.click(optionRadio(q1!.options[2]!.text));
    next();
    expect(screen.getByRole('heading', { name: `Question 2 of ${chapter.questions.length}` })).toBeTruthy();
    fireEvent.click(optionRadio(q2!.options[1]!.text));
    fireEvent.click(screen.getByRole('button', { name: /Previous/ }));
    expect((optionRadio(q1!.options[2]!.text) as HTMLInputElement).checked).toBe(true);
    // Change the answer, then jump via the overview.
    fireEvent.click(optionRadio(q1!.options[0]!.text));
    fireEvent.click(screen.getByRole('button', { name: 'Question 2, answered' }));
    expect((optionRadio(q2!.options[1]!.text) as HTMLInputElement).checked).toBe(true);
    expect(screen.getByText(`2 of ${chapter.questions.length} answered`)).toBeTruthy();
  });

  it('scores a perfect attempt from the answer key, then resets on retry', () => {
    renderAt(`/chapters/${chapter.id}/quiz`);
    answerAll((i) => chapter.questions[i]!.correctOptionId);
    fireEvent.click(screen.getAllByRole('button', { name: /Submit quiz/ })[0]!);

    expect(screen.getByRole('img', { name: 'Score: 100 percent' })).toBeTruthy();
    expect(screen.getAllByText('Correct answer')).toHaveLength(chapter.questions.length);

    fireEvent.click(screen.getByRole('button', { name: /Retry quiz/ }));
    expect(screen.getByRole('heading', { name: `Question 1 of ${chapter.questions.length}` })).toBeTruthy();
    expect(screen.getByText(`0 of ${chapter.questions.length} answered`)).toBeTruthy();
    for (const option of chapter.questions[0]!.options) {
      expect((optionRadio(option.text) as HTMLInputElement).checked).toBe(false);
    }
  });

  it('scores wrong answers as incorrect and shows the correct answer', () => {
    renderAt(`/chapters/${chapter.id}/quiz`);
    // Answer the first 15 correctly and the last 5 with a wrong option.
    answerAll((i) => {
      const q = chapter.questions[i]!;
      return i < 15 ? q.correctOptionId : q.options.find((o) => o.id !== q.correctOptionId)!.id;
    });
    fireEvent.click(screen.getAllByRole('button', { name: /Submit quiz/ })[0]!);

    expect(screen.getByRole('img', { name: 'Score: 75 percent' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'To review (5)' }));
    expect(screen.getAllByText('Incorrect', { selector: 'span' })).toHaveLength(5);
    expect(screen.getAllByText('Your answer')).toHaveLength(5);
  });

  it('asks for confirmation before submitting with unanswered questions', () => {
    renderAt(`/chapters/${chapter.id}/quiz`);
    fireEvent.click(optionRadio(chapter.questions[0]!.options.find((o) => o.id === chapter.questions[0]!.correctOptionId)!.text));
    fireEvent.click(screen.getByRole('button', { name: /Submit quiz/ }));

    const dialog = screen.getByRole('dialog', { name: 'Submit with unanswered questions?' });
    expect(within(dialog).getByText(/19 questions are still unanswered/)).toBeTruthy();

    // Keep answering jumps to the first unanswered question.
    fireEvent.click(within(dialog).getByRole('button', { name: 'Keep answering' }));
    expect(screen.getByRole('heading', { name: `Question 2 of ${chapter.questions.length}` })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /Submit quiz/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Submit anyway' }));
    expect(screen.getByRole('img', { name: 'Score: 5 percent' })).toBeTruthy();
    expect(screen.getAllByText('Not answered').length).toBeGreaterThan(0);
  });
});
