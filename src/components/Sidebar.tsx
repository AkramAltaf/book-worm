import { categories } from '../data/books';

interface SidebarProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  selectedCategory,
  onSelectCategory,
  isOpen = true,
  onClose,
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-48 bg-[#111827] z-40 overflow-y-auto
          transition-transform duration-300 lg:static lg:translate-x-0 lg:h-auto lg:z-auto lg:shrink-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <ul className="py-2">
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => {
                  onSelectCategory(cat.id);
                  onClose?.();
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-[#2d3748] text-white font-medium'
                    : 'text-gray-400 hover:bg-[#1f2937] hover:text-gray-200'
                }`}
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
