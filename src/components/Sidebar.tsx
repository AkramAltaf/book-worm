import { useMemo } from 'react';
import { categories, allBooks } from '../data/books';

interface SidebarProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ selectedCategory, onSelectCategory, isOpen = true, onClose }: SidebarProps) {
  // Book counts per category (memoised — categories are static)
  const counts = useMemo(() => {
    const map: Record<string, number> = { all: allBooks.length };
    for (const book of allBooks) {
      map[book.categoryId] = (map[book.categoryId] ?? 0) + 1;
    }
    return map;
  }, []);

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`
          w-48 shrink-0 overflow-y-auto bg-sidebar theme-transition
          lg:block lg:sticky lg:top-0 lg:h-[calc(100vh-3.5rem)] lg:translate-x-0
          fixed top-14 left-0 h-[calc(100vh-3.5rem)] z-40
          transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{ borderRight: '1px solid var(--bw-border)' }}
      >
        <ul className="py-2">
          {categories.map((cat) => {
            const active = selectedCategory === cat.id;
            const count = counts[cat.id];
            return (
              <li key={cat.id}>
                <button
                  onClick={() => {
                    onSelectCategory(cat.id);
                    onClose?.();           // close drawer on mobile only
                  }}
                  className="w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between gap-2"
                  style={{
                    color: active ? 'var(--bw-text-primary)' : 'var(--bw-text-secondary)',
                    background: active ? 'var(--bw-bg-active)' : 'transparent',
                    fontWeight: active ? 600 : 400,
                    borderLeft: active
                      ? '2px solid var(--bw-accent)'
                      : '2px solid transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!active)
                      e.currentTarget.style.background = 'var(--bw-bg-hover)';
                  }}
                  onMouseLeave={(e) => {
                    if (!active)
                      e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span className="truncate">{cat.name}</span>
                  {count != null && count > 0 && cat.id !== 'all' && (
                    <span
                      className="text-[10px] min-w-[18px] h-4 flex items-center justify-center font-medium shrink-0 px-1"
                      style={{
                        background: active ? 'var(--bw-accent)' : 'var(--bw-bg-subtle)',
                        color: active ? '#fff' : 'var(--bw-text-muted)',
                      }}
                    >
                      {count}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </aside>
    </>
  );
}
