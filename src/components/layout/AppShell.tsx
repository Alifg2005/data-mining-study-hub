import { useEffect, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router';
import { siteConfig } from '../../config/site';
import { ThemeToggle } from './ThemeToggle';

function ScrollToTopOnNavigate() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);
  return null;
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <ScrollToTopOnNavigate />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-contrast"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-30 border-b border-border bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="group flex items-center gap-3 rounded-lg" aria-label={`${siteConfig.projectName} home`}>
            <img src="/favicon.svg" alt="" width={32} height={32} className="size-8" />
            <span className="flex flex-col leading-tight">
              <span className="text-[0.9375rem] font-semibold tracking-tight text-fg">{siteConfig.projectName}</span>
              <span className="font-mono text-xs text-subtle">{siteConfig.courseCode}</span>
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            {siteConfig.courseCode} {siteConfig.courseName}. Instructor: {siteConfig.instructorName}
          </p>
          <p>Prepared by {siteConfig.studentName}</p>
        </div>
      </footer>
    </div>
  );
}
