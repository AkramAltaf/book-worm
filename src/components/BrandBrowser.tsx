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
    <div className="px-4 mb-4">
      <h2 className="text-white font-semibold text-base mb-3">Browse by Publisher</h2>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {publishers.map((pub) => {
          const active = selectedPublisherId === pub.id;
          return (
            <button
              key={pub.id}
              onClick={() => handleClick(pub.id)}
              className={`shrink-0 flex flex-col items-center justify-center w-24 h-20 rounded-lg border transition-all ${
                active
                  ? 'border-blue-500 bg-blue-500/10 scale-105'
                  : 'border-gray-700 bg-[#1f2937] hover:border-gray-500 hover:bg-[#263244]'
              }`}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs mb-1.5"
                style={{ backgroundColor: pub.logoColor }}
              >
                {pub.logoText}
              </div>
              <span className="text-gray-300 text-[10px] text-center leading-tight line-clamp-2 px-1">
                {pub.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
