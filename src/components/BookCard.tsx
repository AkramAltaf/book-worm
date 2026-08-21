import type { Book } from '../types';

interface BookCardProps {
  book: Book;
  onClick?: (book: Book) => void;
}

function CoverPlaceholder({ book }: { book: Book }) {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center p-2 text-center"
      style={{ backgroundColor: book.coverColor, color: book.coverTextColor }}
    >
      <p className="font-bold text-xs leading-tight line-clamp-3 uppercase tracking-wide">{book.title}</p>
      <p className="text-[10px] mt-1 opacity-80">{book.author}</p>
    </div>
  );
}

export default function BookCard({ book, onClick }: BookCardProps) {
  return (
    <div
      className="flex gap-3 cursor-pointer group p-3 transition-colors theme-transition"
      onClick={() => onClick?.(book)}
      style={{ background: 'var(--bw-bg-surface)', border: '1px solid var(--bw-border)' }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bw-bg-hover)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--bw-bg-surface)')}
    >
      {/* Cover */}
      <div
        className="shrink-0 w-20 h-28 overflow-hidden shadow-md group-hover:shadow-lg transition-shadow"
        style={{ boxShadow: 'var(--bw-shadow-sm)' }}
      >
        <CoverPlaceholder book={book} />
      </div>

      {/* Details */}
      <div className="flex flex-col justify-between min-w-0 py-0.5">
        <div>
          <h3
            className="text-sm font-semibold leading-tight line-clamp-2 transition-colors"
            style={{ color: 'var(--bw-text-primary)' }}
          >
            {book.title}
          </h3>
          <p className="text-xs mt-0.5 hover:underline cursor-pointer" style={{ color: 'var(--bw-accent)' }}>
            by {book.author}
          </p>
          <p className="text-xs mt-1 leading-snug line-clamp-2 hidden sm:block" style={{ color: 'var(--bw-text-secondary)' }}>
            {book.description ??
              (book.format === 'Paperback'
                ? 'A must-read title that will expand your mind.'
                : book.format === 'Hard Cover'
                ? 'A beautifully crafted hardcover edition.'
                : 'Available as digital download.')}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--bw-text-muted)' }}>{book.format}</p>
          <div className="flex flex-wrap gap-x-1.5 mt-0.5">
            {book.genres.slice(0, 2).map((g) => (
              <span key={g} className="text-[11px] hover:underline cursor-pointer" style={{ color: 'var(--bw-accent)' }}>
                {g}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-1.5">
          <p className="font-bold text-sm" style={{ color: 'var(--bw-text-primary)' }}>₹{book.price}</p>
          <p className="text-[11px]" style={{ color: 'var(--bw-text-muted)' }}>Delivery by {book.deliveryDate}</p>
        </div>
      </div>
    </div>
  );
}
