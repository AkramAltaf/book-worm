import { useNavigate } from 'react-router-dom';
import type { Book } from '../types';
import StarRating from './StarRating';

interface RelatedBooksProps {
  currentBook: Book;
  allBooks: Book[];
}

export default function RelatedBooks({ currentBook, allBooks }: RelatedBooksProps) {
  const navigate = useNavigate();

  const related = allBooks
    .filter(
      (b) =>
        b.id !== currentBook.id &&
        (b.categoryId === currentBook.categoryId ||
          b.genres.some((g) => currentBook.genres.includes(g)))
    )
    .slice(0, 6);

  if (related.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="text-white font-semibold text-base mb-4">Related Books</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {related.map((book) => (
          <button
            key={book.id}
            onClick={() => navigate(`/book/${book.id}`)}
            className="group flex flex-col text-left"
          >
            {/* Mini cover */}
            <div
              className="w-full aspect-[2/3] rounded-md overflow-hidden shadow group-hover:shadow-lg transition-shadow mb-2 flex items-center justify-center p-2 text-center"
              style={{ backgroundColor: book.coverColor, color: book.coverTextColor }}
            >
              <div>
                <p className="font-bold text-[10px] leading-tight uppercase tracking-wide line-clamp-3">
                  {book.title}
                </p>
                <p className="text-[9px] mt-1 opacity-70">{book.author}</p>
              </div>
            </div>
            <p className="text-gray-200 text-xs font-medium line-clamp-2 group-hover:text-blue-300 transition-colors leading-tight">
              {book.title}
            </p>
            {book.rating && (
              <StarRating rating={book.rating} size="sm" />
            )}
            <p className="text-white font-bold text-xs mt-0.5">₹{book.price}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
