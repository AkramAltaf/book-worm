import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, PenLine, ExternalLink, Search } from 'lucide-react';
import { allBooks } from '../data/books';

// Derive unique authors + their stats from book data
function buildAuthors() {
  const map: Record<string, { name: string; books: typeof allBooks; genres: Set<string> }> = {};
  for (const book of allBooks) {
    if (!map[book.author]) {
      map[book.author] = { name: book.author, books: [], genres: new Set() };
    }
    map[book.author].books.push(book);
    book.genres.forEach((g) => map[book.author].genres.add(g));
  }
  return Object.values(map).sort((a, b) => b.books.length - a.books.length);
}

const AUTHORS = buildAuthors();

const INITIALS_COLORS = [
  '#e05c3a', '#1a5fa8', '#2d6a4f', '#6a2d8a', '#7d4e1e',
  '#0077b6', '#c77dff', '#4cc9f0', '#d62828', '#219ebc',
];

function getColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffffff;
  return INITIALS_COLORS[Math.abs(h) % INITIALS_COLORS.length];
}

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

export default function WritersPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const filtered = AUTHORS.filter((a) =>
    a.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto bg-base theme-transition px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <PenLine className="w-5 h-5" style={{ color: 'var(--bw-accent)' }} />
        <h1 className="text-2xl font-bold" style={{ color: 'var(--bw-text-primary)' }}>
          My Writers
        </h1>
      </div>
      <p className="text-sm mb-5" style={{ color: 'var(--bw-text-secondary)' }}>
        {AUTHORS.length} authors available in our catalogue
      </p>

      {/* Search */}
      <div className="relative max-w-sm mb-6">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--bw-text-muted)' }} />
        <input
          type="text"
          placeholder="Search authors…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bw-input pl-8 text-sm"
        />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48" style={{ color: 'var(--bw-text-muted)' }}>
          <p>No authors found for "{query}"</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '14px',
          }}
        >
          {filtered.map((author) => {
            const color = getColor(author.name);
            const avgRating = author.books.reduce((s, b) => s + (b.rating ?? 0), 0) / author.books.length;
            const lowestPrice = Math.min(...author.books.map((b) => b.price));

            return (
              <div
                key={author.name}
                className="bw-card flex flex-col overflow-hidden group cursor-pointer theme-transition"
                onClick={() => navigate(`/catalogue/all?author=${encodeURIComponent(author.name)}`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--bw-accent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--bw-border)';
                }}
              >
                {/* Avatar banner */}
                <div
                  className="h-16 flex items-center justify-center gap-4"
                  style={{ backgroundColor: color + '22', borderBottom: '1px solid var(--bw-border)' }}
                >
                  <div
                    className="w-12 h-12 flex items-center justify-center text-white font-bold text-base shadow"
                    style={{ backgroundColor: color }}
                  >
                    {initials(author.name)}
                  </div>
                </div>

                {/* Details */}
                <div className="p-3 flex flex-col gap-1.5 flex-1">
                  <h3 className="text-sm font-bold leading-tight" style={{ color: 'var(--bw-text-primary)' }}>
                    {author.name}
                  </h3>

                  <div className="flex flex-wrap gap-1">
                    {[...author.genres].slice(0, 3).map((g) => (
                      <span
                        key={g}
                        className="text-[10px] px-1.5 py-0.5"
                        style={{ background: 'var(--bw-bg-subtle)', color: 'var(--bw-text-secondary)' }}
                      >
                        {g}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-2" style={{ borderTop: '1px solid var(--bw-border-subtle)' }}>
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" style={{ color: 'var(--bw-text-muted)' }} />
                      <span className="text-xs" style={{ color: 'var(--bw-text-secondary)' }}>
                        {author.books.length} {author.books.length === 1 ? 'book' : 'books'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {avgRating > 0 && (
                        <span className="text-[11px] font-medium" style={{ color: 'var(--bw-warning)' }}>
                          ★ {avgRating.toFixed(1)}
                        </span>
                      )}
                      <span className="text-[11px]" style={{ color: 'var(--bw-text-muted)' }}>
                        from ₹{lowestPrice}
                      </span>
                    </div>
                  </div>

                  {/* Browse books link */}
                  <button
                    className="flex items-center gap-1 text-[11px] font-medium transition-colors mt-1"
                    style={{ color: 'var(--bw-accent)' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/catalogue/all?author=${encodeURIComponent(author.name)}`);
                    }}
                  >
                    <ExternalLink className="w-3 h-3" />
                    Browse books
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
