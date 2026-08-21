import { useNavigate } from 'react-router-dom';
import { publishers } from '../data/books';

interface BrandBrowserProps {
  selectedPublisherId?: string;
  onSelect?: (id: string | undefined) => void;
}

export default function BrandBrowser({ selectedPublisherId, onSelect }: BrandBrowserProps) {
  const navigate = useNavigate();

  const handleClick = (id: string) => {
    if (onSelect) {
      onSelect(selectedPublisherId === id ? undefined : id);
    } else {
      navigate(`/?publisher=${id}`);
    }
  };

  return (
    <div className="px-4 mb-5">
      <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--bw-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Browse by Publisher
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {publishers.map((pub) => {
          const active = selectedPublisherId === pub.id;
          return (
            <button
              key={pub.id}
              onClick={() => handleClick(pub.id)}
              className="shrink-0 flex flex-col items-center justify-center w-24 h-20 border transition-all"
              style={{
                background: active ? 'var(--bw-accent-subtle)' : 'var(--bw-bg-surface)',
                borderColor: active ? 'var(--bw-accent)' : 'var(--bw-border)',
                transform: active ? 'scale(1.05)' : 'scale(1)',
                boxShadow: active ? 'var(--bw-shadow-sm)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.borderColor = 'var(--bw-accent)';
                  e.currentTarget.style.background = 'var(--bw-bg-hover)';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.borderColor = 'var(--bw-border)';
                  e.currentTarget.style.background = 'var(--bw-bg-surface)';
                }
              }}
            >
              <div
                className="w-10 h-10 flex items-center justify-center text-white font-bold text-xs mb-1.5 shadow-sm"
                style={{ backgroundColor: pub.logoColor }}
              >
                {pub.logoText}
              </div>
              <span
                className="text-[10px] text-center leading-tight line-clamp-2 px-1"
                style={{ color: 'var(--bw-text-secondary)' }}
              >
                {pub.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
