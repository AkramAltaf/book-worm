import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { allBooks, publishers, categories } from '../data/books';
import BrandBrowser from '../components/BrandBrowser';
import BookCard from '../components/BookCard';

type SortKey = 'relevance' | 'price-asc' | 'price-desc' | 'rating';
type FormatFilter = 'All' | 'Paperback' | 'Hard Cover' | 'eBook';

export default function CataloguePage({ categoryId }: { categoryId: string }) {
  const navigate = useNavigate();
  const [selectedPublisher, setSelectedPublisher] = useState<string | undefined>();
  const [format, setFormat] = useState<FormatFilter>('All');
  const [sort, setSort] = useState<SortKey>('relevance');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const categoryName = categories.find((c) => c.id === categoryId)?.name ?? 'All Books';

  const filtered = useMemo(() => {
    let books = categoryId === 'all' ? allBooks : allBooks.filter((b) => b.categoryId === categoryId);
    if (selectedPublisher) books = books.filter((b) => b.publisherId === selectedPublisher);
    if (format !== 'All') books = books.filter((b) => b.format === format);
    switch (sort) {
      case 'price-asc': return [...books].sort((a, b) => a.price - b.price);
      case 'price-desc': return [...books].sort((a, b) => b.price - a.price);
      case 'rating': return [...books].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      default: return books;
    }
  }, [categoryId, selectedPublisher, format, sort]);

  return (
    <div className="flex-1 overflow-y-auto bg-base theme-transition">
      {/* Header */}
      <div className="px-4 pt-5 pb-3" style={{ borderBottom: '1px solid var(--bw-border)' }}>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--bw-text-primary)' }}>{categoryName}</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--bw-text-secondary)' }}>{filtered.length} books found</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="appearance-none bw-input pr-7 w-auto text-sm"
              >
                <option value="relevance">Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: 'var(--bw-text-muted)' }} />
            </div>
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm transition-colors bw-btn-outline"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
              {(selectedPublisher || format !== 'All') && (
                <span
                  className="text-[10px] w-4 h-4 flex items-center justify-center font-bold text-white"
                  style={{ background: 'var(--bw-accent)' }}
                >
                  {(selectedPublisher ? 1 : 0) + (format !== 'All' ? 1 : 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {filtersOpen && (
          <div
            className="mt-3 p-3 flex flex-wrap gap-4 items-start"
            style={{ background: 'var(--bw-bg-subtle)', border: '1px solid var(--bw-border)' }}
          >
            <div>
              <p className="text-xs mb-2 font-semibold" style={{ color: 'var(--bw-text-secondary)' }}>Format</p>
              <div className="flex gap-2 flex-wrap">
                {(['All', 'Paperback', 'Hard Cover', 'eBook'] as FormatFilter[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className="px-3 py-1 text-xs transition-colors"
                    style={{
                      background: format === f ? 'var(--bw-accent)' : 'var(--bw-bg-surface)',
                      color: format === f ? '#fff' : 'var(--bw-text-secondary)',
                      border: '1px solid ' + (format === f ? 'var(--bw-accent)' : 'var(--bw-border)'),
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs mb-2 font-semibold" style={{ color: 'var(--bw-text-secondary)' }}>Publisher</p>
              <div className="flex gap-2 flex-wrap">
                {publishers.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPublisher(selectedPublisher === p.id ? undefined : p.id)}
                    className="px-3 py-1 text-xs transition-colors"
                    style={{
                      background: selectedPublisher === p.id ? 'var(--bw-accent)' : 'var(--bw-bg-surface)',
                      color: selectedPublisher === p.id ? '#fff' : 'var(--bw-text-secondary)',
                      border: '1px solid ' + (selectedPublisher === p.id ? 'var(--bw-accent)' : 'var(--bw-border)'),
                    }}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
            {(selectedPublisher || format !== 'All') && (
              <button
                onClick={() => { setSelectedPublisher(undefined); setFormat('All'); }}
                className="flex items-center gap-1 text-xs transition-colors"
                style={{ color: 'var(--bw-danger)' }}
              >
                <X className="w-3 h-3" /> Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      <div className="pt-4">
        <BrandBrowser selectedPublisherId={selectedPublisher} onSelect={setSelectedPublisher} />
      </div>

      <div className="px-4 pb-8">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64" style={{ color: 'var(--bw-text-muted)' }}>
            <p className="text-lg">No books match your filters</p>
            <button onClick={() => { setSelectedPublisher(undefined); setFormat('All'); }} className="mt-3 text-sm hover:underline" style={{ color: 'var(--bw-accent)' }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '12px',
            }}
          >
            {filtered.map((book) => (
              <BookCard key={book.id} book={book} onClick={() => navigate(`/book/${book.id}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
