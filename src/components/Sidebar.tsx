import { categories } from '../data/books';

interface SidebarProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ selectedCategory, onSelectCategory, isOpen = true, onClose }: SidebarProps) {
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
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => {
                  onSelectCategory(cat.id);
                  onClose?.();           // close drawer on mobile only
                }}
                className="w-full text-left px-4 py-2 text-sm transition-colors"
                style={{
                  color: selectedCategory === cat.id ? 'var(--bw-text-primary)' : 'var(--bw-text-secondary)',
                  background: selectedCategory === cat.id ? 'var(--bw-bg-active)' : 'transparent',
                  fontWeight: selectedCategory === cat.id ? 600 : 400,
                  borderLeft: selectedCategory === cat.id
                    ? '2px solid var(--bw-accent)'
                    : '2px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== cat.id)
                    e.currentTarget.style.background = 'var(--bw-bg-hover)';
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== cat.id)
                    e.currentTarget.style.background = 'transparent';
                }}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
