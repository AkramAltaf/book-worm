import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  /** compact = icon-only button; default = icon + label */
  compact?: boolean;
}

export default function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="flex items-center gap-1.5 px-2 py-1.5 transition-colors"
      style={{
        color: 'var(--bw-text-secondary)',
        border: '1px solid var(--bw-border)',
        background: 'var(--bw-bg-subtle)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = 'var(--bw-text-primary)';
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--bw-accent)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = 'var(--bw-text-secondary)';
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--bw-border)';
      }}
    >
      {isDark ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
      {!compact && (
        <span className="text-xs font-medium hidden sm:inline">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
}
