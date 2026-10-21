import { useCallback, useEffect, useState } from 'react';
import { applyTheme, readStoredTheme, storeTheme, systemTheme, type Theme } from '../lib/theme';

/**
 * Current theme with a toggle. On first visit the system preference is used and
 * followed live; once the student picks a theme, that choice is saved and wins.
 */
export function useTheme() {
  const [hasExplicitChoice, setHasExplicitChoice] = useState(() => readStoredTheme() !== null);
  const [theme, setTheme] = useState<Theme>(() => readStoredTheme() ?? systemTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (hasExplicitChoice || typeof window.matchMedia !== 'function') return;
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (event: MediaQueryListEvent) => setTheme(event.matches ? 'dark' : 'light');
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, [hasExplicitChoice]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === 'dark' ? 'light' : 'dark';
      storeTheme(next);
      return next;
    });
    setHasExplicitChoice(true);
  }, []);

  return { theme, toggleTheme };
}
