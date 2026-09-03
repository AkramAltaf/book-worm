import { useState, useMemo } from 'react';
import { Menu, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import FilterBar, { DEFAULT_FILTERS } from '../components/FilterBar';
import type { FilterState } from '../components/FilterBar';
import BookSection from '../components/BookSection';
import BrandBrowser from '../components/BrandBrowser';
import RecommendedFromHistory from '../components/RecommendedFromHistory';
import { allBooks, recommendedBooks, bestsellerBooks, newLaunchBooks } from '../data/books';
import { useAuth } from '../context/AuthContext';
import type { Book } from '../types';

function applyFilters(books: Book[], filters: FilterState): Book[] {
  let result = books;

  // Search query
  if (filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase();
    result = result.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.genres.some((g) => g.toLowerCase().includes(q))
    );
  }

  // Language
  if (filters.language !== 'All') {
    result = result.filter((b) => b.language === filters.language);
  }

  // Format
  if (filters.format !== 'All') {
    result = result.filter((b) => b.format === filters.format);
  }

  // Price range
  if (filters.priceRange !== 'All') {
    result = result.filter((b) => {
      const p = b.price;
      switch (filters.priceRange) {
        case 'Under ₹100':   return p < 100;
        case '₹100–₹300':   return p >= 100 && p <= 300;
        case '₹300–₹500':   return p > 300 && p <= 500;
        case 'Above ₹500':  return p > 500;
        default: return true;
      }
    });
  }

  // Sort
  switch (filters.sortBy) {
    case 'Price: Low to High':  result = [...result].sort((a, b) => a.price - b.price); break;
    case 'Price: High to Low':  result = [...result].sort((a, b) => b.price - a.price); break;
    case 'Newest':              result = [...result].sort((a, b) => b.id - a.id); break;
    case 'Top Rated':           result = [...result].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)); break;
    default: break;
  }

  return result;
}

export default function HomePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPublisher, setSelectedPublisher] = useState<string | undefined>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // Category and publisher filters stay on this page — no navigation
  const handleSelectCategory = (id: string) => {
    setSelectedCategory(id);
    setSelectedPublisher(undefined); // reset publisher when category changes
  };

  const handleSelectPublisher = (id: string | undefined) => {
    setSelectedPublisher(id);
  };

  const isFiltered = selectedCategory !== 'all';
  const hasSearch = filters.searchQuery.trim().length > 0;

  // Shared filter function (excludes publisher — applied separately below)
  const filterBooks = (books: Book[]) => {
    let result = selectedPublisher
      ? books.filter((b) => b.publisherId === selectedPublisher)
      : books;
    return applyFilters(result, filters);
  };

  const categoryBooks = useMemo(
    () => isFiltered ? filterBooks(allBooks.filter((b) => b.categoryId === selectedCategory)) : [],
    [selectedCategory, isFiltered, selectedPublisher, filters]
  );

  const allFiltered  = useMemo(() => filterBooks(allBooks), [selectedPublisher, filters]);
  const recommended  = useMemo(() => filterBooks(recommendedBooks), [selectedPublisher, filters]);
  const bestsellers  = useMemo(() => filterBooks(bestsellerBooks), [selectedPublisher, filters]);
  const newLaunches  = useMemo(() => filterBooks(newLaunchBooks), [selectedPublisher, filters]);

  const categoryName = isFiltered
    ? selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1).replace(/-/g, ' ')
    : '';

  return (
    <div className="flex h-[calc(100vh-3.5rem)] bg-base theme-transition">
      <Sidebar
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Filter / search bar */}
        <div className="flex items-stretch">
          <button
            className="lg:hidden px-3 transition-colors shrink-0"
            style={{
              color: 'var(--bw-text-secondary)',
              background: 'var(--bw-bg-surface)',
              borderBottom: '1px solid var(--bw-border)',
            }}
            onClick={() => setSidebarOpen(true)}
            aria-label="Open categories"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <FilterBar filters={filters} onFiltersChange={setFilters} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-5">
          {/* Personalised greeting — only on home (all) view */}
          {isAuthenticated && user && !hasSearch && !isFiltered && (
            <div className="px-4 mb-5">
              <div
                className="p-4"
                style={{
                  background: 'var(--bw-accent-subtle)',
                  border: '1px solid var(--bw-accent-border)',
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4" style={{ color: 'var(--bw-warning)' }} />
                  <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--bw-warning)' }}>
                    Welcome back
                  </span>
                </div>
                <p className="font-bold text-base" style={{ color: 'var(--bw-text-primary)' }}>
                  Hello, {user.firstName}! 👋
                </p>
                <p className="text-sm mt-0.5" style={{ color: 'var(--bw-text-secondary)' }}>
                  You have{' '}
                  <span className="font-semibold" style={{ color: 'var(--bw-success)' }}>
                    {user.giftPoints} gift points
                  </span>{' '}
                  to redeem.
                </p>
              </div>
            </div>
          )}

          {/* ── Category-filtered view ── */}
          {isFiltered && (
            <>
              {categoryBooks.length > 0 ? (
                <BookSection
                  title={categoryName}
                  books={categoryBooks}
                  onBookClick={(b) => navigate(`/book/${b.id}`)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-64" style={{ color: 'var(--bw-text-muted)' }}>
                  <p className="text-lg">No books found in this category</p>
                  <button
                    className="mt-3 text-sm bw-btn-outline px-4 py-1.5"
                    onClick={() => setSelectedCategory('all')}
                  >
                    Show all books
                  </button>
                </div>
              )}
            </>
          )}

          {/* ── Default "All" view ── */}
          {!isFiltered && (
            <>
              {/* 1 — Publisher browser (hidden during search) */}
              {!hasSearch && (
                <BrandBrowser
                  selectedPublisherId={selectedPublisher}
                  onSelect={handleSelectPublisher}
                />
              )}

              {/* 2 — Full catalogue grid (all books, filtered/sorted) */}
              {allFiltered.length > 0 ? (
                <BookSection
                  title="Our Collection"
                  books={allFiltered}
                  onBookClick={(b) => navigate(`/book/${b.id}`)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-64" style={{ color: 'var(--bw-text-muted)' }}>
                  <p className="text-lg">No books found</p>
                  <p className="text-sm mt-1">Try a different search term or clear filters</p>
                </div>
              )}

              {/* 3 — Curated editorial sections */}
              {!hasSearch && (
                <>
                  {recommended.length > 0 && (
                    <BookSection
                      title="Recommended for You"
                      books={recommended}
                      onBookClick={(b) => navigate(`/book/${b.id}`)}
                    />
                  )}
                  {bestsellers.length > 0 && (
                    <BookSection
                      title="Bestsellers this Month"
                      books={bestsellers}
                      onBookClick={(b) => navigate(`/book/${b.id}`)}
                    />
                  )}
                  {newLaunches.length > 0 && (
                    <BookSection
                      title="New Launches"
                      books={newLaunches}
                      onBookClick={(b) => navigate(`/book/${b.id}`)}
                    />
                  )}
                </>
              )}

              {/* 4 — Order-based recommendations (authenticated users only) */}
              {isAuthenticated && !hasSearch && (
                <div className="px-4 mt-2 mb-6" style={{ borderTop: '1px solid var(--bw-border)' }}>
                  <div className="flex items-center gap-2 mt-5 mb-3">
                    <Sparkles className="w-4 h-4" style={{ color: 'var(--bw-accent)' }} />
                    <h2 className="font-bold text-base" style={{ color: 'var(--bw-text-primary)' }}>
                      Recommended Based on Your Orders
                    </h2>
                  </div>
                  <RecommendedFromHistory layout="row" />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
