import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { allBooks, sampleOrders } from '../data/books';
import type { Book } from '../types';
import StarRating from './StarRating';

interface RecommendedFromHistoryProps {
  /** 'col' = sidebar stack (default), 'row' = horizontal scrollable strip */
  layout?: 'col' | 'row';
}

export default function RecommendedFromHistory({ layout = 'col' }: RecommendedFromHistoryProps) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const orderedIds = new Set(sampleOrders.flatMap((o) => o.items.map((i) => i.book.id)));
  const orderedGenres = new Set(
    sampleOrders.flatMap((o) => o.items.flatMap((i) => i.book.genres))
  );

  const recs: Book[] = allBooks
    .filter((b) => !orderedIds.has(b.id) && b.genres.some((g) => orderedGenres.has(g)))
    .slice(0, layout === 'row' ? 8 : 4);

  if (recs.length === 0) return null;

  // ── Row layout: horizontal strip on home page ──────────────────────────────
  if (layout === 'row') {
    return (
      <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'thin' }}>
        {recs.map((book) => (
          <div
            key={book.id}
            className="shrink-0 w-40 flex flex-col theme-transition"
            style={{
              background: 'var(--bw-bg-surface)',
              border: '1px solid var(--bw-border)',
            }}
          >
            {/* Cover */}
            <div
              className="w-full h-52 overflow-hidden flex items-center justify-center p-3 text-center cursor-pointer"
              style={{ backgroundColor: book.coverColor, color: book.coverTextColor }}
              onClick={() => navigate(`/book/${book.id}`)}
            >
              <div>
                <p className="font-bold text-[11px] uppercase leading-tight tracking-wide line-clamp-4">
                  {book.title}
                </p>
                <div
                  className="w-8 h-px mx-auto my-2 opacity-40"
                  style={{ backgroundColor: book.coverTextColor }}
                />
                <p className="text-[9px] opacity-70">{book.author}</p>
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col flex-1 px-2.5 pt-2 pb-2.5 gap-0.5">
              <p
                className="text-primary text-[11px] font-semibold leading-tight line-clamp-2 cursor-pointer hover:text-accent transition-colors"
                onClick={() => navigate(`/book/${book.id}`)}
              >
                {book.title}
              </p>
              <p className="text-muted text-[10px] truncate">by {book.author}</p>
              {book.rating && (
                <div className="mt-0.5">
                  <StarRating rating={book.rating} size="sm" />
                </div>
              )}
              <p className="text-muted text-[10px] mt-0.5">{book.format}</p>

              {/* Price + Cart */}
              <div className="flex items-center justify-between mt-auto pt-2" style={{ borderTop: '1px solid var(--bw-border-subtle)' }}>
                <span className="text-primary text-xs font-bold">₹{book.price}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); addToCart(book); }}
                  title="Add to cart"
                  className="flex items-center justify-center transition-colors"
                  style={{
                    width: 26,
                    height: 26,
                    background: 'var(--bw-accent-subtle)',
                    border: '1px solid var(--bw-accent-border)',
                    color: 'var(--bw-accent)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--bw-accent)';
                    e.currentTarget.style.color = 'var(--bw-text-inverse)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--bw-accent-subtle)';
                    e.currentTarget.style.color = 'var(--bw-accent)';
                  }}
                >
                  <ShoppingCart className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── Column layout: sidebar card (cart page) ────────────────────────────────
  return (
    <div className="bw-card p-4">
      <h3 className="text-primary font-semibold text-sm mb-3">Based on Your Orders</h3>
      <div className="flex flex-col gap-3">
        {recs.map((book) => (
          <div key={book.id} className="flex gap-3">
            {/* Mini cover */}
            <div
              className="shrink-0 w-12 h-16 overflow-hidden flex items-center justify-center p-1 text-center cursor-pointer"
              style={{ backgroundColor: book.coverColor, color: book.coverTextColor }}
              onClick={() => navigate(`/book/${book.id}`)}
            >
              <p className="font-bold text-[8px] uppercase leading-tight line-clamp-3">{book.title}</p>
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <p
                className="text-primary text-xs font-medium line-clamp-2 leading-tight cursor-pointer hover:text-accent transition-colors"
                onClick={() => navigate(`/book/${book.id}`)}
              >
                {book.title}
              </p>
              <p className="text-muted text-[10px]">by {book.author}</p>
              {book.rating && <StarRating rating={book.rating} size="sm" />}

              <div className="flex items-center justify-between mt-1.5">
                <span className="text-primary text-xs font-bold">₹{book.price}</span>
                <button
                  onClick={() => addToCart(book)}
                  title="Add to cart"
                  className="flex items-center justify-center transition-colors"
                  style={{
                    width: 24,
                    height: 24,
                    background: 'var(--bw-accent-subtle)',
                    border: '1px solid var(--bw-accent-border)',
                    color: 'var(--bw-accent)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--bw-accent)';
                    e.currentTarget.style.color = 'var(--bw-text-inverse)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--bw-accent-subtle)';
                    e.currentTarget.style.color = 'var(--bw-accent)';
                  }}
                >
                  <ShoppingCart className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
