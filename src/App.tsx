import { Route, Routes } from 'react-router';
import { AppShell } from './components/layout/AppShell';
import { ChapterReviewPage } from './pages/ChapterReviewPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { QuizPage } from './pages/QuizPage';

/** Routes are generic: every registered chapter is served by the same review and quiz pages. */
export function AppRoutes() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chapters/:chapterId" element={<ChapterReviewPage />} />
        <Route path="/chapters/:chapterId/quiz" element={<QuizPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppShell>
  );
}
