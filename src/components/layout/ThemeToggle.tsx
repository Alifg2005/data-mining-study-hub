import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const label = isDark ? 'Switch to light theme' : 'Switch to dark theme';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="relative grid size-10 place-items-center rounded-lg border border-border bg-surface text-muted transition-colors duration-150 hover:border-border-strong hover:text-fg active:scale-[0.96]"
    >
      <Sun
        aria-hidden
        className={`size-[18px] transition-[opacity,transform] duration-200 ${isDark ? 'scale-75 rotate-45 opacity-0' : 'opacity-100'}`}
      />
      <Moon
        aria-hidden
        className={`absolute size-[18px] transition-[opacity,transform] duration-200 ${isDark ? 'opacity-100' : 'scale-75 -rotate-45 opacity-0'}`}
      />
    </button>
  );
}
