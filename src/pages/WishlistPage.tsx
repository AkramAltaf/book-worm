import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, BookOpen } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="flex-1 bg-base flex flex-col items-center justify-center gap-4 py-20 theme-transition">
        <Heart className="w-14 h-14" style={{ color: 'var(--bw-border)' }} />
        <p className="text-primary font-semibold text-lg">Your wishlist is empty</p>
        <p className="text-secondary text-sm">Save books you love and come back to them anytime.</p>
        <button onClick={() => navigate('/')} className="mt-2 bw-btn-primary px-6 py-2.5 text-sm">
          Browse Books
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-base overflow-y-auto theme-transition">
      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <Heart className="w-5 h-5" style={{ color: 'var(--bw-accent)' }} />
            <h1 className="text-xl font-bold text-primary">
              My Wishlist
              <span className="ml-2 text-sm font-normal text-secondary">
                ({items.length} {items.length === 1 ? 'book' : 'books'})
              </span>
            </h1>
          </div>
          <button
            onClick={clearWishlist}
            className="flex items-center gap-1.5 text-xs text-secondary hover:text-danger transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear all
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((book) => (
            <div
              key={book.id}
              className="bw-card flex gap-3 p-3 theme-transition"
            >
              {/* Cover */}
              <div
                className="shrink-0 w-20 h-28 overflow-hidden flex items-center justify-center p-2 text-center cursor-pointer"
                style={{ backgroundColor: book.coverColor, color: book.coverTextColor }}
                onClick={() => navigate(`/book/${book.id}`)}
              >
                <div>
                  <p className="font-bold text-[10px] uppercase leading-tight tracking-wide line-clamp-4">
                    {book.title}
                  </p>
                  <div className="w-6 h-px mx-auto my-1.5 opacity-40" style={{ backgroundColor: book.coverTextColor }} />
                  <p className="text-[8px] opacity-70">{book.author}</p>
                </div>
              </div>

              {/* Details */}
              <div className="flex flex-col flex-1 min-w-0 py-0.5">
                <h3
                  className="text-primary text-sm font-semibold leading-tight line-clamp-2 cursor-pointer hover:text-accent transition-colors"
                  onClick={() => navigate(`/book/${book.id}`)}
                >
                  {book.title}
                </h3>
                <p className="text-accent text-xs mt-0.5 hover:underline cursor-pointer">
                  by {book.author}
                </p>
                <p className="text-muted text-xs mt-0.5">{book.format}</p>
                <div className="flex flex-wrap gap-x-1.5 mt-0.5">
                  {book.genres.slice(0, 2).map((g) => (
                    <span key={g} className="text-accent text-[10px]">{g}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-auto pt-2" style={{ borderTop: '1px solid var(--bw-border-subtle)' }}>
                  <span className="text-primary font-bold text-sm">₹{book.price}</span>
                  <div className="flex items-center gap-1.5">
                    {/* Add to cart */}
                    <button
                      onClick={() => { addToCart(book); navigate('/cart'); }}
                      title="Add to cart"
                      className="flex items-center gap-1 text-xs bw-btn-primary px-2.5 py-1.5"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      Add
                    </button>
                    {/* Remove from wishlist */}
                    <button
                      onClick={() => removeFromWishlist(book.id)}
                      title="Remove from wishlist"
                      className="flex items-center justify-center w-7 h-7 transition-colors"
                      style={{
                        border: '1px solid var(--bw-border)',
                        color: 'var(--bw-text-muted)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--bw-danger)';
                        e.currentTarget.style.color = 'var(--bw-danger)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--bw-border)';
                        e.currentTarget.style.color = 'var(--bw-text-muted)';
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Continue shopping */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bw-btn-outline px-6 py-2.5 text-sm"
          >
            <BookOpen className="w-4 h-4" />
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
}
