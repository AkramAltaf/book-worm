import { useState } from 'react';
import { Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import FilterBar from '../components/FilterBar';
import BookSection from '../components/BookSection';
import BrandBrowser from '../components/BrandBrowser';
import { recommendedBooks, bestsellerBooks, newLaunchBooks } from '../data/books';
import type { Book } from '../types';

export default function HomePage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSelectCategory = (id: string) => {
    setSelectedCategory(id);
    navigate(`/catalogue/${id}`);
  };

  const filterBooks = (books: Book[]) => {
    if (!searchQuery.trim()) return books;
    const q = searchQuery.toLowerCase();
    return books.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.genres.some((g) => g.toLowerCase().includes(q))
    );
  };

  const recommended = filterBooks(recommendedBooks);
  const bestsellers = filterBooks(bestsellerBooks);
  const newLaunches = filterBooks(newLaunchBooks);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] bg-[#0f172a]">
      {/* Sidebar */}
      <Sidebar
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Filter bar */}
        <div className="flex items-center">
          <button
            className="lg:hidden p-3 text-gray-400 hover:text-white bg-[#111827] border-b border-gray-700/50"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <FilterBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          </div>
        </div>

        {/* Scrollable book listings */}
        <div className="flex-1 overflow-y-auto py-4">
          {/* Brand browser on home */}
          <BrandBrowser />

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
          {recommended.length === 0 && bestsellers.length === 0 && newLaunches.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <p className="text-lg">No books found for "{searchQuery}"</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
