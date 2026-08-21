import type { Book } from '../types';
import BookCard from './BookCard';

interface BookSectionProps {
  title: string;
  books: Book[];
  onBookClick?: (book: Book) => void;
}

export default function BookSection({ title, books, onBookClick }: BookSectionProps) {
  return (
    <section className="mb-6">
      <h2 className="text-white font-semibold text-base mb-3 px-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 px-4">
        {books.map((book) => (
          <BookCard key={book.id} book={book} onClick={onBookClick} />
        ))}
      </div>
    </section>
  );
}
