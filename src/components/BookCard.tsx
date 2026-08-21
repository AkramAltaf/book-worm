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
      <p className="font-bold text-xs leading-tight line-clamp-3 uppercase tracking-wide">
        {book.title}
      </p>
      <p className="text-[10px] mt-1 opacity-80">{book.author}</p>
    </div>
  );
}

export default function BookCard({ book, onClick }: BookCardProps) {
  return (
    <div
      className="flex gap-3 cursor-pointer group"
      onClick={() => onClick?.(book)}
    >
      {/* Cover */}
      <div className="shrink-0 w-20 h-28 rounded overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
        <CoverPlaceholder book={book} />
      </div>

      {/* Details */}
      <div className="flex flex-col justify-between min-w-0 py-0.5">
        <div>
          <h3 className="text-white text-sm font-semibold leading-tight line-clamp-2 group-hover:text-blue-300 transition-colors">
            {book.title}
          </h3>
          <p className="text-blue-400 text-xs mt-0.5 hover:underline cursor-pointer">
            by {book.author}
          </p>
          <p className="text-gray-400 text-xs mt-1 leading-snug line-clamp-2 hidden sm:block">
            {book.format === 'Paperback'
              ? 'A must-read title that will expand your mind.'
              : book.format === 'Hard Cover'
              ? 'A beautifully crafted hardcover edition.'
              : 'Available as digital download.'}
          </p>
          <p className="text-gray-500 text-xs mt-1">{book.format}</p>
          <div className="flex flex-wrap gap-x-1.5 mt-0.5">
            {book.genres.map((g) => (
              <span key={g} className="text-blue-400 text-[11px] hover:underline cursor-pointer">
                {g}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-1">
          <p className="text-white font-bold text-sm">
            ₹{book.price}
          </p>
          <p className="text-gray-500 text-[11px]">
            Delivery by {book.deliveryDate}
          </p>
        </div>
      </div>
    </div>
  );
}
