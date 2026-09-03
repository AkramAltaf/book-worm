import { ShoppingCart } from 'lucide-react';
import type { Book } from '../types';
import StarRating from './StarRating';
import { useCart } from '../context/CartContext';

interface BookCardProps {
  book: Book;
  onClick?: (book: Book) => void;
}

export default function BookCard({ book, onClick }: BookCardProps) {
  const { addToCart } = useCart();

  return (
    <div
      className="group flex flex-col cursor-pointer overflow-hidden transition-colors theme-transition"
      onClick={() => onClick?.(book)}
      style={{
        background: 'var(--bw-bg-surface)',
        border: '1px solid var(--bw-border)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--bw-accent)';
        e.currentTarget.style.background = 'var(--bw-bg-hover)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--bw-border)';
        e.currentTarget.style.background = 'var(--bw-bg-surface)';
      }}
    >
      {/* Cover — fixed height, compact */}
      <div
        className="w-full h-44 flex flex-col items-center justify-center p-3 text-center"
        style={{ backgroundColor: book.coverColor, color: book.coverTextColor }}
      >
        <p className="font-bold text-xs leading-tight uppercase tracking-wide line-clamp-3">
          {book.title}
        </p>
        <div
          className="w-8 h-px my-2 opacity-40"
          style={{ backgroundColor: book.coverTextColor }}
        />
        <p className="text-[10px] opacity-75">{book.author}</p>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-3 gap-1">
        <h3
          className="text-sm font-semibold leading-tight line-clamp-2 group-hover:text-accent transition-colors"
          style={{ color: 'var(--bw-text-primary)' }}
        >
          {book.title}
        </h3>
        <p className="text-xs" style={{ color: 'var(--bw-accent)' }}>
          by {book.author}
        </p>

        {book.rating && (
          <StarRating rating={book.rating} count={book.ratingCount} size="sm" />
        )}

        <div className="flex flex-wrap gap-1 mt-0.5">
          {book.genres.slice(0, 2).map((g) => (
            <span
              key={g}
              className="text-[10px] px-1.5 py-0.5"
              style={{
                background: 'var(--bw-bg-subtle)',
                color: 'var(--bw-text-secondary)',
              }}
            >
              {g}
            </span>
          ))}
        </div>

        {/* Price row — pinned to bottom */}
        <div
          className="flex items-center justify-between mt-auto pt-2.5"
          style={{ borderTop: '1px solid var(--bw-border-subtle)' }}
        >
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-sm" style={{ color: 'var(--bw-text-primary)' }}>
              ₹{book.price}
            </span>
            {book.originalPrice && (
              <>
                <span className="text-xs line-through" style={{ color: 'var(--bw-text-muted)' }}>
                  ₹{book.originalPrice}
                </span>
                <span className="text-[10px] font-semibold" style={{ color: 'var(--bw-success)' }}>
                  {Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)}% off
                </span>
              </>
            )}
          </div>

          {/* Quick add-to-cart */}
          <button
            onClick={(e) => { e.stopPropagation(); addToCart(book); }}
            title="Add to cart"
            className="flex items-center justify-center transition-colors shrink-0"
            style={{
              width: 28,
              height: 28,
              background: 'var(--bw-accent-subtle)',
              border: '1px solid var(--bw-accent-border)',
              color: 'var(--bw-accent)',
            }}
            onMouseEnter={(e) => {
              e.stopPropagation();
              e.currentTarget.style.background = 'var(--bw-accent)';
              e.currentTarget.style.color = 'var(--bw-text-inverse)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--bw-accent-subtle)';
              e.currentTarget.style.color = 'var(--bw-accent)';
            }}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-[10px]" style={{ color: 'var(--bw-text-muted)' }}>
          Delivery by {book.deliveryDate}
        </p>
      </div>
    </div>
  );
}
