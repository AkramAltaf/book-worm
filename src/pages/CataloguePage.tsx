import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { allBooks, publishers, categories } from '../data/books';
import type { Book } from '../types';
import StarRating from '../components/StarRating';
import BrandBrowser from '../components/BrandBrowser';

interface CataloguePageProps {
  categoryId: string;
}

type SortKey = 'relevance' | 'price-asc' | 'price-desc' | 'rating';
type FormatFilter = 'All' | 'Paperback' | 'Hard Cover' | 'eBook';

function BookGridCard({ book, onClick }: { book: Book; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col text-left bg-[#1f2937] rounded-lg overflow-hidden hover:bg-[#263244] transition-colors border border-gray-700/50 hover:border-gray-600"
    >
      <div
        className="w-full h-44 flex items-center justify-center p-4 text-center"
        style={{ backgroundColor: book.coverColor, color: book.coverTextColor }}
      >
        <div>
          <p className="font-bold text-sm leading-tight uppercase tracking-wide line-clamp-3">
            {book.title}
          </p>
          <p className="text-[11px] mt-1.5 opacity-75">{book.author}</p>
        </div>
      </div>
      <div className="p-3 flex flex-col gap-1 flex-1">
        <h3 className="text-white text-sm font-semibold leading-tight line-clamp-2 group-hover:text-blue-300 transition-colors">
          {book.title}
        </h3>
        <p className="text-blue-400 text-xs">by {book.author}</p>
        {book.rating && <StarRating rating={book.rating} count={book.ratingCount} />}
        <div className="flex flex-wrap gap-1 mt-0.5">
          {book.genres.slice(0, 2).map((g) => (
            <span key={g} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-700/60 text-gray-300">
              {g}
            </span>
          ))}
        </div>
        <div className="flex items-baseline gap-2 mt-auto pt-2">
          <span className="text-white font-bold text-sm">₹{book.price}</span>
          {book.originalPrice && (
            <span className="text-gray-500 text-xs line-through">₹{book.originalPrice}</span>
          )}
          {book.originalPrice && (
            <span className="text-green-400 text-xs font-medium">
              {Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)}% off
            </span>
          )}
        </div>
        <p className="text-gray-500 text-[11px]">{book.format}</p>
      </div>
    </button>
  );
}

export default function CataloguePage({ categoryId }: CataloguePageProps) {
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
    <div className="flex-1 overflow-y-auto bg-[#0f172a]">
      {/* Header */}
      <div className="px-4 pt-5 pb-3 border-b border-gray-700/50">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-white text-xl font-bold">{categoryName}</h1>
            <p className="text-gray-400 text-sm mt-0.5">{filtered.length} books found</p>
          </div>
          {/* Sort & mobile filter toggle */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="appearance-none bg-[#1f2937] text-gray-300 text-sm rounded px-3 py-2 pr-7 border border-gray-700 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="relevance">Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
            </div>
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#1f2937] border border-gray-700 rounded text-gray-300 text-sm hover:border-gray-500 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
              {(selectedPublisher || format !== 'All') && (
                <span className="bg-blue-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {(selectedPublisher ? 1 : 0) + (format !== 'All' ? 1 : 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Inline filter panel */}
        {filtersOpen && (
          <div className="mt-3 p-3 bg-[#1f2937] rounded-lg border border-gray-700 flex flex-wrap gap-4 items-start">
            {/* Format */}
            <div>
              <p className="text-gray-400 text-xs mb-2 font-medium">Format</p>
              <div className="flex gap-2 flex-wrap">
                {(['All', 'Paperback', 'Hard Cover', 'eBook'] as FormatFilter[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`px-3 py-1 rounded text-xs transition-colors ${
                      format === f
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            {/* Publisher quick filter */}
            <div>
              <p className="text-gray-400 text-xs mb-2 font-medium">Publisher</p>
              <div className="flex gap-2 flex-wrap">
                {publishers.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPublisher(selectedPublisher === p.id ? undefined : p.id)}
                    className={`px-3 py-1 rounded text-xs transition-colors ${
                      selectedPublisher === p.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
            {/* Clear */}
            {(selectedPublisher || format !== 'All') && (
              <button
                onClick={() => { setSelectedPublisher(undefined); setFormat('All'); }}
                className="flex items-center gap-1 text-red-400 text-xs hover:text-red-300 transition-colors mt-auto"
              >
                <X className="w-3 h-3" /> Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Brand browser */}
      <div className="pt-4">
        <BrandBrowser
          selectedPublisherId={selectedPublisher}
          onSelect={setSelectedPublisher}
        />
      </div>

      {/* Book grid */}
      <div className="px-4 pb-8">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <p className="text-lg">No books match your filters</p>
            <button
              onClick={() => { setSelectedPublisher(undefined); setFormat('All'); }}
              className="mt-3 text-blue-400 text-sm hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filtered.map((book) => (
              <BookGridCard
                key={book.id}
                book={book}
                onClick={() => navigate(`/book/${book.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
