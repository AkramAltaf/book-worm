import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { allBooks, sampleOrders } from '../data/books';
import type { Book } from '../types';
import StarRating from './StarRating';

export default function RecommendedFromHistory() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // collect all book ids the user already ordered
  const orderedIds = new Set(sampleOrders.flatMap((o) => o.items.map((i) => i.book.id)));
  // find genres they ordered
  const orderedGenres = new Set(
    sampleOrders.flatMap((o) => o.items.flatMap((i) => i.book.genres))
  );

  const recs: Book[] = allBooks
    .filter(
      (b) => !orderedIds.has(b.id) && b.genres.some((g) => orderedGenres.has(g))
    )
    .slice(0, 4);

  if (recs.length === 0) return null;

  return (
    <div className="bg-[#1a2332] rounded-xl p-4 border border-gray-700/50">
      <h3 className="text-white font-semibold text-sm mb-3">Based on Your Orders</h3>
      <div className="flex flex-col gap-3">
        {recs.map((book) => (
          <div key={book.id} className="flex gap-3">
            <div
              className="shrink-0 w-12 h-16 rounded overflow-hidden flex items-center justify-center p-1 text-center cursor-pointer"
              style={{ backgroundColor: book.coverColor, color: book.coverTextColor }}
              onClick={() => navigate(`/book/${book.id}`)}
            >
              <p className="font-bold text-[8px] uppercase leading-tight line-clamp-3">{book.title}</p>
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-gray-200 text-xs font-medium line-clamp-2 leading-tight cursor-pointer hover:text-blue-300"
                onClick={() => navigate(`/book/${book.id}`)}
              >
                {book.title}
              </p>
              <p className="text-gray-500 text-[10px]">by {book.author}</p>
              {book.rating && <StarRating rating={book.rating} size="sm" />}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-white text-xs font-bold">₹{book.price}</span>
                <button
                  onClick={() => addToCart(book)}
                  className="text-[10px] px-2 py-0.5 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold rounded transition-colors"
                >
                  + Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
