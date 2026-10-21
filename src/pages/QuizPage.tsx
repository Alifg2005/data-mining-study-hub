import { ArrowLeft, ArrowRight, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router';
import { getChapter } from '../data/chapters';
import type { Chapter } from '../types/content';
import { QuestionCard } from '../components/quiz/QuestionCard';
import { QuestionNavigator } from '../components/quiz/QuestionNavigator';
import { QuizResults } from '../components/quiz/QuizResults';
import { SubmitDialog } from '../components/quiz/SubmitDialog';
import { Button } from '../components/ui/Button';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useQuiz } from '../hooks/useQuiz';
import { countAnswered, firstUnansweredIndex } from '../lib/quiz';
import { chapterLabel, reviewPath } from '../lib/routes';
import { NotFoundPage } from './NotFoundPage';

export function QuizPage() {
  const { chapterId } = useParams();
  const chapter = getChapter(chapterId);
  if (!chapter) return <NotFoundPage kind="chapter" />;
  return <Quiz key={chapter.id} chapter={chapter} />;
}

function Quiz({ chapter }: { chapter: Chapter }) {
  const { questions } = chapter;
  const quiz = useQuiz(questions);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const questionHeadingRef = useRef<HTMLHeadingElement>(null);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);
  const focusQuestionOnChange = useRef(false);

  useDocumentTitle(`${chapterLabel(chapter.number)} quiz${quiz.submitted ? ' results' : ''}`);

  const answeredCount = countAnswered(questions, quiz.answers);
  const unansweredCount = questions.length - answeredCount;
  const question = questions[quiz.currentIndex];
  const isLast = quiz.currentIndex === questions.length - 1;

  // After the student navigates, move focus (and scroll) to the new question so keyboard
  // and screen-reader users land in the right place.
  useEffect(() => {
    if (!focusQuestionOnChange.current) return;
    focusQuestionOnChange.current = false;
    questionHeadingRef.current?.focus();
  }, [quiz.currentIndex]);

  const goTo = (index: number) => {
    focusQuestionOnChange.current = true;
    quiz.goTo(index);
  };

  // Results: start at the top with focus on the score.
  useEffect(() => {
    if (!quiz.submitted) return;
    window.scrollTo({ top: 0, behavior: 'instant' });
    resultsHeadingRef.current?.focus({ preventScroll: true });
  }, [quiz.submitted, quiz.attempt]);

  // Warn before leaving the page with an unfinished attempt (answers are kept in memory only).
  useEffect(() => {
    if (quiz.submitted || answeredCount === 0) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [quiz.submitted, answeredCount]);

  const requestSubmit = () => {
    if (unansweredCount > 0) setConfirmOpen(true);
    else quiz.submit();
  };

  const retry = () => {
    quiz.reset();
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const progress = Math.round((answeredCount / questions.length) * 100);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 pb-20 sm:px-6 sm:pt-10">
      <Link
        to={reviewPath(chapter.id)}
        className="inline-flex items-center gap-1.5 rounded-md text-sm text-muted transition-colors hover:text-fg"
      >
        <ArrowLeft aria-hidden className="size-4" />
        Back to review
      </Link>

      <header className="mt-6">
        <p className="font-mono text-sm text-accent">{chapterLabel(chapter.number)} · Quiz</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance text-fg sm:text-4xl">{chapter.title}</h1>
      </header>

      {quiz.submitted && quiz.result ? (
        <div className="mt-8 max-w-3xl">
          <QuizResults key={quiz.attempt} chapter={chapter} result={quiz.result} onRetry={retry} headingRef={resultsHeadingRef} />
        </div>
      ) : (
        question && (
          <div key={quiz.attempt} className="enter mt-6">
            <div className="mb-6">
              <div className="mb-2 flex justify-between text-sm text-muted">
                <span>
                  {answeredCount} of {questions.length} answered
                </span>
                <span className="font-mono">{progress}%</span>
              </div>
              <div
                role="progressbar"
                aria-label="Answered questions"
                aria-valuemin={0}
                aria-valuemax={questions.length}
                aria-valuenow={answeredCount}
                aria-valuetext={`${answeredCount} of ${questions.length} answered`}
                className="h-2 overflow-hidden rounded-full bg-surface-sunken"
              >
                <div
                  className="h-full origin-left rounded-full bg-accent transition-transform duration-300 ease-out motion-reduce:transition-none"
                  style={{ transform: `scaleX(${answeredCount / questions.length})` }}
                />
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
              <div>
                <QuestionCard
                  key={question.id}
                  headingRef={questionHeadingRef}
                  question={question}
                  index={quiz.currentIndex}
                  total={questions.length}
                  selectedOptionId={quiz.answers[question.id]}
                  onSelect={(optionId) => quiz.select(question.id, optionId)}
                />

                <div className="mt-5 flex items-center justify-between gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => goTo(quiz.currentIndex - 1)}
                    disabled={quiz.currentIndex === 0}
                  >
                    <ArrowLeft aria-hidden />
                    Previous
                  </Button>
                  {isLast ? (
                    <Button onClick={requestSubmit}>
                      Submit quiz
                      <Send aria-hidden />
                    </Button>
                  ) : (
                    <Button onClick={() => goTo(quiz.currentIndex + 1)}>
                      Next
                      <ArrowRight aria-hidden />
                    </Button>
                  )}
                </div>
              </div>

              <aside className="lg:sticky lg:top-24">
                <QuestionNavigator
                  questions={questions}
                  answers={quiz.answers}
                  currentIndex={quiz.currentIndex}
                  answeredCount={answeredCount}
                  onGoTo={goTo}
                  onSubmit={requestSubmit}
                />
              </aside>
            </div>
          </div>
        )
      )}

      <SubmitDialog
        open={confirmOpen}
        unansweredCount={unansweredCount}
        onCancel={() => {
          setConfirmOpen(false);
          const next = firstUnansweredIndex(questions, quiz.answers);
          if (next >= 0) goTo(next);
        }}
        onConfirm={() => {
          setConfirmOpen(false);
          quiz.submit();
        }}
      />
    </div>
  );
}
