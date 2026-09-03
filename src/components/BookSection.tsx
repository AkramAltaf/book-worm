import type { Book } from '../types';
import BookCard from './BookCard';

interface BookSectionProps {
  title: string;
  books: Book[];
  onBookClick?: (book: Book) => void;
}

export default function BookSection({ title, books, onBookClick }: BookSectionProps) {
  return (
    <section className="mb-8">
      <h2
        className="font-bold text-base mb-3 px-4"
        style={{ color: 'var(--bw-text-primary)' }}
      >
        {title}
      </h2>

      <div
        className="px-4"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '12px',
        }}
      >
        {books.map((book) => (
          <BookCard key={book.id} book={book} onClick={onBookClick} />
        ))}
      </div>
    </section>
  );
}
