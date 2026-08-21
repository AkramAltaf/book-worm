import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Package, BookOpen, Globe, Hash, ChevronRight, Star, Send } from 'lucide-react';
import { allBooks, publishers, categories } from '../data/books';
import type { Book } from '../types';
import StarRating from '../components/StarRating';
import { useCart } from '../context/CartContext';

const AUTHOR_BIOS: Record<string, { bio: string; avatar: string }> = {
  'Arjun Patel': {
    bio: 'Arjun Patel is a productivity coach and bestselling author based in Mumbai. With over a decade of experience helping professionals cut through distraction, his work has helped thousands achieve more in less time.',
    avatar: 'AP',
  },
  'Daniel Reed': {
    bio: 'Daniel Reed is a writer, minimalist, and productivity coach based in San Francisco. With a passion for intentional living, he has dedicated his career to helping individuals simplify their lives — one habit, one space, and one thought at a time.',
    avatar: 'DR',
  },
  'James Wright': {
    bio: 'James Wright is an executive coach and author known for his pragmatic approach to goal-setting. He has coached Fortune 500 leaders and first-generation entrepreneurs alike.',
    avatar: 'JW',
  },
};

const SAMPLE_REVIEWS = [
  { id: 'r1', author: 'John Smith', rating: 5, text: 'Absolutely loved this book! The insights changed my perspective on how I approach work every day. Highly recommended for anyone looking to improve their focus.', date: '12 Jul 2025' },
  { id: 'r2', author: 'Priya M.', rating: 4, text: 'A refreshing and practical read. The exercises at the end of each chapter are particularly useful. Would have loved more real-world case studies.', date: '5 Jul 2025' },
];

function CoverLarge({ book }: { book: Book }) {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center p-4 text-center"
      style={{ backgroundColor: book.coverColor, color: book.coverTextColor }}
    >
      <p className="font-bold text-base leading-tight uppercase tracking-wide">{book.title}</p>
      <div className="w-12 h-px my-3 opacity-40" style={{ backgroundColor: book.coverTextColor }} />
      <p className="text-sm opacity-80">{book.author}</p>
    </div>
  );
}

function ReviewCard({ author, rating, text, date }: { author: string; rating: number; text: string; date: string }) {
  return (
    <div className="py-4 border-b border-gray-700/40 last:border-0">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-200 font-medium text-sm">{author}</span>
        <span className="text-gray-500 text-xs">{date}</span>
      </div>
      <p className="text-gray-400 text-sm leading-relaxed">{text}</p>
      <div className="flex mt-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
          />
        ))}
      </div>
    </div>
  );
}

interface BookDetailPageProps {
  bookId: number;
}

export default function BookDetailPage({ bookId }: BookDetailPageProps) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const book = allBooks.find((b) => b.id === bookId);

  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviews, setReviews] = useState(SAMPLE_REVIEWS);
  const [addedToCart, setAddedToCart] = useState(false);

  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500 gap-3">
        <p className="text-lg">Book not found.</p>
        <button onClick={() => navigate(-1)} className="text-blue-400 text-sm hover:underline">← Go back</button>
      </div>
    );
  }

  const publisher = publishers.find((p) => p.id === book.publisherId);
  const catName = categories.find((c) => c.id === book.categoryId)?.name ?? 'Books';
  const discount = book.originalPrice
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : null;
  const authorInfo = AUTHOR_BIOS[book.author];

  const handleAddToCart = () => {
    addToCart(book);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(book);
    navigate('/cart');
  };

  const submitReview = () => {
    if (!reviewText.trim() || reviewRating === 0) return;
    setReviews((prev) => [
      { id: `r${Date.now()}`, author: 'You', rating: reviewRating, text: reviewText, date: 'Just now' },
      ...prev,
    ]);
    setReviewText('');
    setReviewRating(0);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#0f172a]">
      <div className="max-w-7xl mx-auto px-4 pt-4 pb-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4 flex-wrap">
          <Link to="/" className="text-blue-400 hover:underline">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to={`/catalogue/${book.categoryId}`} className="text-blue-400 hover:underline">{catName}</Link>
          {book.genres[0] && (
            <>
              <ChevronRight className="w-3 h-3" />
              <span className="text-blue-400 cursor-pointer hover:underline">{book.genres[0]}</span>
            </>
          )}
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-300 truncate max-w-[180px]">{book.title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Left column: cover + meta + author + reviews ── */}
          <div className="flex-1 min-w-0">
            {/* Top: cover + details side by side */}
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Cover */}
              <div className="shrink-0 w-full sm:w-52 lg:w-64">
                <div className="w-full sm:w-52 lg:w-64 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl">
                  <CoverLarge book={book} />
                </div>
                {/* CTA buttons */}
                <div className="flex flex-col gap-2 mt-4">
                  <button
                    onClick={handleAddToCart}
                    className={`w-full flex items-center justify-center gap-2 font-bold py-2.5 rounded-lg transition-all text-sm ${
                      addedToCart
                        ? 'bg-green-500 text-white'
                        : 'bg-yellow-400 hover:bg-yellow-300 text-gray-900'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {addedToCart ? 'Added!' : 'Add to Cart'}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold py-2.5 rounded-lg transition-colors text-sm"
                  >
                    Add to Wishlist
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Detail panel */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2 mb-3">
                  {book.badge && (
                    <span className="bg-orange-500 text-white text-[11px] font-bold px-2 py-0.5 rounded">{book.badge}</span>
                  )}
                  <span className="bg-gray-700 text-gray-300 text-[11px] px-2 py-0.5 rounded">{book.format}</span>
                </div>

                <h1 className="text-white text-2xl md:text-3xl font-bold leading-tight">{book.title}</h1>
                <p className="text-blue-400 text-sm mt-1 hover:underline cursor-pointer">by {book.author}</p>

                {book.description && (
                  <p className="text-gray-400 text-sm mt-3 leading-relaxed">{book.description}</p>
                )}

                {publisher && (
                  <p className="text-gray-400 text-sm mt-2">
                    Published by:{' '}
                    <span className="text-blue-400 hover:underline cursor-pointer">{publisher.name}</span>
                  </p>
                )}

                <p className="text-gray-500 text-xs mt-1">{book.format}</p>
                <div className="flex flex-wrap gap-x-1.5 mt-0.5">
                  {book.genres.map((g) => (
                    <span key={g} className="text-blue-400 text-xs hover:underline cursor-pointer">{g}</span>
                  ))}
                </div>

                <div className="flex items-baseline gap-3 mt-4">
                  <span className="text-white text-3xl font-bold">₹{book.price}</span>
                  {book.originalPrice && (
                    <>
                      <span className="text-gray-500 text-lg line-through">₹{book.originalPrice}</span>
                      <span className="text-green-400 font-semibold text-sm">{discount}% off</span>
                    </>
                  )}
                </div>
                <p className="text-gray-400 text-sm mt-1">
                  Delivery by <span className="text-white font-medium">{book.deliveryDate}</span>
                </p>

                {/* Quick stats row */}
                <div className="flex flex-wrap gap-6 mt-5 text-sm text-gray-400">
                  {book.language && (
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-blue-400" />
                      <span>Language</span>
                      <span className="text-blue-400 hover:underline cursor-pointer">{book.language}</span>
                    </div>
                  )}
                  {book.rating && (
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span>Rating</span>
                      <StarRating rating={book.rating} size="sm" />
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-blue-400" />
                    <span>{book.ratingCount ? `${book.ratingCount.toLocaleString()} copies sold` : `${book.pages ?? 0} pages`}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Author bio */}
            {authorInfo && (
              <div className="mt-8">
                <h2 className="text-gray-200 font-bold text-base mb-3">About the writer</h2>
                <div className="flex gap-4">
                  <div className="shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {authorInfo.avatar}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{book.author}</p>
                    <p className="text-gray-400 text-sm mt-1 leading-relaxed">{authorInfo.bio}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Metadata grid */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {book.pages && (
                <div className="flex items-center gap-2 bg-[#1f2937] rounded-lg p-3">
                  <BookOpen className="w-4 h-4 text-blue-400 shrink-0" />
                  <div>
                    <p className="text-gray-500 text-[10px] uppercase tracking-wide">Pages</p>
                    <p className="text-gray-200 text-sm font-medium">{book.pages}</p>
                  </div>
                </div>
              )}
              {book.language && (
                <div className="flex items-center gap-2 bg-[#1f2937] rounded-lg p-3">
                  <Globe className="w-4 h-4 text-blue-400 shrink-0" />
                  <div>
                    <p className="text-gray-500 text-[10px] uppercase tracking-wide">Language</p>
                    <p className="text-gray-200 text-sm font-medium">{book.language}</p>
                  </div>
                </div>
              )}
              {publisher && (
                <div className="flex items-center gap-2 bg-[#1f2937] rounded-lg p-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0"
                    style={{ backgroundColor: publisher.logoColor }}
                  >
                    {publisher.logoText.charAt(0)}
                  </div>
                  <div>
                    <p className="text-gray-500 text-[10px] uppercase tracking-wide">Publisher</p>
                    <p className="text-gray-200 text-sm font-medium leading-tight">{publisher.name}</p>
                  </div>
                </div>
              )}
              {book.isbn && (
                <div className="flex items-center gap-2 bg-[#1f2937] rounded-lg p-3">
                  <Hash className="w-4 h-4 text-blue-400 shrink-0" />
                  <div>
                    <p className="text-gray-500 text-[10px] uppercase tracking-wide">ISBN</p>
                    <p className="text-gray-200 text-xs font-mono leading-tight">{book.isbn}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 bg-[#1f2937] rounded-lg p-3">
                <Package className="w-4 h-4 text-blue-400 shrink-0" />
                <div>
                  <p className="text-gray-500 text-[10px] uppercase tracking-wide">Format</p>
                  <p className="text-gray-200 text-sm font-medium">{book.format}</p>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="mt-8">
              <h2 className="text-gray-200 font-bold text-base mb-4">Reviews</h2>

              {/* Write review */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-gray-400 text-xs">Leave Your Review</label>
                  <span className="text-gray-600 text-xs">{reviewText.length}/100</span>
                </div>
                <textarea
                  placeholder="Placeholder text"
                  maxLength={100}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={4}
                  className="w-full bg-[#1f2937] text-gray-200 placeholder-gray-600 text-sm rounded-lg px-3 py-2.5 border border-gray-700 focus:outline-none focus:border-blue-500 resize-none transition-colors"
                />
                {/* Star picker */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <button
                        key={i}
                        onMouseEnter={() => setHoverRating(i)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setReviewRating(i)}
                      >
                        <Star
                          className={`w-5 h-5 transition-colors ${
                            i <= (hoverRating || reviewRating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={submitReview}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2 rounded-lg transition-colors text-sm"
                  >
                    Submit
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Review list */}
              <div>
                {reviews.map((r) => (
                  <ReviewCard key={r.id} {...r} />
                ))}
              </div>
            </div>
          </div>

          {/* ── Right column: related reads ── */}
          <div className="w-full lg:w-64 xl:w-72 shrink-0">
            <div className="sticky top-4">
              <h2 className="text-white font-bold text-base mb-3">Related Reads</h2>
              <div className="flex flex-col gap-3">
                {allBooks
                  .filter(
                    (b) =>
                      b.id !== book.id &&
                      (b.categoryId === book.categoryId || b.genres.some((g) => book.genres.includes(g)))
                  )
                  .slice(0, 5)
                  .map((related) => (
                    <div
                      key={related.id}
                      className="flex gap-3 cursor-pointer group"
                      onClick={() => navigate(`/book/${related.id}`)}
                    >
                      <div
                        className="shrink-0 w-16 h-20 rounded-md overflow-hidden flex items-center justify-center p-1 text-center shadow"
                        style={{ backgroundColor: related.coverColor, color: related.coverTextColor }}
                      >
                        <p className="font-bold text-[8px] uppercase leading-tight line-clamp-4">{related.title}</p>
                      </div>
                      <div className="flex-1 min-w-0 py-0.5">
                        <p className="text-gray-200 text-xs font-semibold leading-tight line-clamp-2 group-hover:text-blue-300 transition-colors">
                          {related.title}
                        </p>
                        <p className="text-blue-400 text-[11px] mt-0.5 hover:underline">by {related.author}</p>
                        <p className="text-gray-500 text-[10px] mt-0.5 line-clamp-2">{related.description}</p>
                        <p className="text-gray-500 text-[10px]">{related.format}</p>
                        <div className="flex flex-wrap gap-x-1.5">
                          {related.genres.slice(0, 2).map((g) => (
                            <span key={g} className="text-blue-400 text-[10px]">{g}</span>
                          ))}
                        </div>
                        <p className="text-white font-bold text-xs mt-1">₹{related.price}</p>
                        <p className="text-gray-600 text-[10px]">Delivery by {related.deliveryDate}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
