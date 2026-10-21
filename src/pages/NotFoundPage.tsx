import { ArrowLeft, SearchX } from 'lucide-react';
import { Link } from 'react-router';
import { chapters } from '../data/chapters';
import { ButtonLink } from '../components/ui/Button';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { chapterLabel, reviewPath } from '../lib/routes';

export function NotFoundPage({ kind = 'page' }: { kind?: 'page' | 'chapter' }) {
  const title = kind === 'chapter' ? 'Chapter not found' : 'Page not found';
  useDocumentTitle(title);

  return (
    <div className="enter mx-auto max-w-xl px-4 py-20 text-center sm:py-28">
      <SearchX aria-hidden className="mx-auto size-10 text-subtle" />
      <h1 className="mt-5 text-3xl font-semibold tracking-tight text-fg">{title}</h1>
      <p className="mt-3 leading-relaxed text-muted">
        {kind === 'chapter'
          ? 'This chapter does not exist or has not been added yet.'
          : 'The page you are looking for does not exist.'}
      </p>

      {chapters.length > 0 && (
        <ul className="mx-auto mt-8 max-w-sm divide-y divide-border rounded-xl border border-border bg-surface text-left">
          {chapters.map((chapter) => (
            <li key={chapter.id}>
              <Link
                to={reviewPath(chapter.id)}
                className="flex items-baseline gap-3 px-4 py-3 transition-colors hover:bg-surface-sunken"
              >
                <span className="font-mono text-sm text-accent">{chapterLabel(chapter.number)}</span>
                <span className="text-fg">{chapter.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <ButtonLink to="/" variant="secondary" className="mt-8">
        <ArrowLeft aria-hidden />
        Back to home
      </ButtonLink>
    </div>
  );
}
