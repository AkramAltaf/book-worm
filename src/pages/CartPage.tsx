import { useState } from 'react';
import { Minus, Plus, Trash2, Tag, ChevronRight, ShoppingCart, LogIn, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { categories } from '../data/books';
import PaymentModal from '../components/PaymentModal';
import OrderConfirmationModal from '../components/OrderConfirmationModal';
import RecommendedFromHistory from '../components/RecommendedFromHistory';
import type { Address, CartItem } from '../types';

const TAX_RATE = 0.12;
const DELIVERY_THRESHOLD = 500;
const GIFT_POINTS_BALANCE = 250; // user's available gift points (₹1 = 1 point)

const SAVED_ADDRESS: Address = {
  firstName: 'Raj', lastName: 'Kumar',
  addressLine1: '14, MG Road', addressLine2: 'Near City Mall',
  city: 'Bengaluru', state: 'Karnataka', country: 'India',
  pin: '560001', email: 'raj.kumar@email.com', phone: '9876543210',
};

function CartItemRow({ item }: { item: CartItem }) {
  const { updateQty, removeFromCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="flex gap-4 py-5 border-b border-base last:border-0">
      {/* Cover */}
      <div
        className="shrink-0 w-24 h-32 overflow-hidden flex items-center justify-center p-2 text-center cursor-pointer shadow-md"
        style={{ backgroundColor: item.book.coverColor, color: item.book.coverTextColor }}
        onClick={() => navigate(`/book/${item.book.id}`)}
      >
        <div>
          <p className="font-bold text-[10px] uppercase leading-tight tracking-wide line-clamp-4">
            {item.book.title}
          </p>
          <p className="text-[8px] mt-1 opacity-75">{item.book.author}</p>
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3
          className="text-primary font-semibold text-base leading-tight cursor-pointer hover:text-accent transition-colors"
          onClick={() => navigate(`/book/${item.book.id}`)}
        >
          {item.book.title}
        </h3>
        <p className="text-accent text-xs mt-0.5 hover:underline cursor-pointer">
          by {item.book.author}
        </p>
        <p className="text-secondary text-xs mt-1 line-clamp-2">{item.book.description}</p>
        <p className="text-muted text-xs mt-1">{item.book.format}</p>
        <div className="flex flex-wrap gap-x-1.5 mt-0.5">
          {item.book.genres.slice(0, 2).map((g) => (
            <span key={g} className="text-accent text-[11px] hover:underline cursor-pointer">{g}</span>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-3 flex-wrap">
          <p className="text-primary font-bold text-lg">₹{item.book.price}</p>
          <p className="text-muted text-xs">Delivery by {item.book.deliveryDate}</p>
        </div>

        {/* Qty controls */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => updateQty(item.book.id, item.quantity - 1)}
            className="w-7 h-7 flex items-center justify-center border border-base text-secondary hover:text-primary transition-colors"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="text-primary font-medium text-sm w-6 text-center">{item.quantity}</span>
          <button
            onClick={() => updateQty(item.book.id, item.quantity + 1)}
            className="w-7 h-7 flex items-center justify-center border border-base text-secondary hover:text-primary transition-colors"
          >
            <Plus className="w-3 h-3" />
          </button>
          <button
            onClick={() => removeFromCart(item.book.id)}
            className="ml-2 flex items-center gap-1 text-danger hover:opacity-80 text-xs transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

function AddressForm({
  useSaved, setUseSaved, addr, setAddr,
}: {
  useSaved: boolean;
  setUseSaved: (v: boolean) => void;
  addr: Address;
  setAddr: (a: Address) => void;
}) {
  const field = (
    label: string,
    key: keyof Address,
    placeholder: string,
    className = '',
    type = 'text'
  ) => (
    <div className={className}>
      <label className="text-secondary text-xs mb-1 block">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        disabled={useSaved}
        value={addr[key]}
        onChange={(e) => setAddr({ ...addr, [key]: e.target.value })}
        className="bw-input"
      />
    </div>
  );

  return (
    <div className="bw-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-primary font-bold text-base">Address</h2>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={useSaved}
            onChange={(e) => setUseSaved(e.target.checked)}
            className="w-4 h-4 accent-blue-500"
          />
          <span className="text-secondary text-sm">Use Saved Address</span>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {field('First Name', 'firstName', 'First Name', '')}
        {field('Last Name', 'lastName', 'Last Name', '')}
        {field('Address', 'addressLine1', 'Address Line 1', '')}
        {field('', 'addressLine2', 'Address Line 2', '')}
        {field('e-mail', 'email', 'e-mail', '', 'email')}
        {field('City', 'city', 'City', '')}
        {field('Pin', 'pin', '000000', '')}
        <div>
          <label className="text-secondary text-xs mb-1 block">Phone Number</label>
          <div className="flex gap-2">
            <div className="bg-subtle border border-base px-2.5 py-2.5 text-secondary text-sm shrink-0">+91</div>
            <input
              type="tel"
              placeholder="12345567890"
              disabled={useSaved}
              value={addr.phone}
              onChange={(e) => setAddr({ ...addr, phone: e.target.value })}
              className="bw-input"
            />
          </div>
        </div>
        {field('State', 'state', 'State', '')}
        <div>
          <label className="text-secondary text-xs mb-1 block">Country</label>
          <select
            disabled={useSaved}
            value={addr.country}
            onChange={(e) => setAddr({ ...addr, country: e.target.value })}
            className="bw-input"
          >
            <option>India</option>
            <option>United States</option>
            <option>United Kingdom</option>
            <option>Canada</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function OrderSummaryPanel({
  subtotal, itemCount, giftPoints, giftApplied, coupon, setCoupon,
  onApplyCoupon, couponDiscount, onToggleGiftPoints, onPayNow, isAuthenticated,
}: {
  subtotal: number;
  itemCount: number;
  giftPoints: number;
  giftApplied: boolean;
  coupon: string;
  setCoupon: (v: string) => void;
  onApplyCoupon: () => void;
  couponDiscount: number;
  onToggleGiftPoints: () => void;
  onPayNow: () => void;
  isAuthenticated: boolean;
}) {
  const tax = Math.round(subtotal * TAX_RATE);
  const delivery = subtotal >= DELIVERY_THRESHOLD ? 0 : 40;
  const giftDiscount = giftApplied ? Math.min(giftPoints, subtotal) : 0;
  const total = subtotal + tax + delivery - couponDiscount - giftDiscount;

  return (
    <div className="bw-card overflow-hidden sticky top-4">
      {/* Decorative illustration strip */}
      <div className="h-28 bg-accent-subtle flex items-center justify-center">
        <div className="flex gap-3 opacity-60">
          {['#e05c3a', '#1a5fa8', '#2d1b4e'].map((c, i) => (
            <div
              key={i}
              className="shadow-lg"
              style={{ backgroundColor: c, width: 32 + i * 6, height: 44 + i * 6 }}
            />
          ))}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-primary font-bold text-base mb-3">Grand Total</h3>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-secondary">
            <span>Price ({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-secondary">
            <span>Tax</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-secondary">
            <span>Delivery Charges</span>
            <span className={delivery === 0 ? 'text-success font-medium' : ''}>
              {delivery === 0 ? 'Free' : `₹${delivery}`}
            </span>
          </div>
        </div>

        {/* Coupon */}
        <div className="flex gap-2 mt-4">
          <input
            type="text"
            placeholder="Apply Coupon"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value.toUpperCase())}
            className="bw-input"
          />
          <button
            onClick={onApplyCoupon}
            className="bw-btn-primary shrink-0"
          >
            Apply
          </button>
        </div>

        {/* Gift Points */}
        <button
          onClick={onToggleGiftPoints}
          className={`mt-3 w-full flex items-center justify-between px-3 py-2.5 border text-sm transition-colors ${
            giftApplied
              ? 'border-success bg-success-subtle text-success'
              : 'border-base text-secondary hover:text-primary'
          }`}
        >
          <span className="flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Redeem Gift Points ({giftPoints} pts = ₹{giftPoints})
          </span>
          <span className="font-bold">{giftApplied ? '−₹' + giftDiscount : 'Apply'}</span>
        </button>

        {/* Discounts */}
        {(couponDiscount > 0 || giftDiscount > 0) && (
          <div className="space-y-1 mt-3">
            {couponDiscount > 0 && (
              <div className="flex justify-between text-success text-sm">
                <span>Coupon Discount</span>
                <span>−₹{couponDiscount}</span>
              </div>
            )}
            {giftDiscount > 0 && (
              <div className="flex justify-between text-success text-sm">
                <span>Gift Points</span>
                <span>−₹{giftDiscount}</span>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between text-primary font-bold text-base mt-3 pt-3 border-t border-base">
          <span>Total Amount</span>
          <span>₹{total}</span>
        </div>

        <button
          onClick={onPayNow}
          className="mt-4 w-full bw-btn-primary justify-center py-3 text-sm"
        >
          {isAuthenticated ? (
            <>Pay Now <ChevronRight className="w-4 h-4" /></>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              Sign In to Checkout
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function CartPage() {
  const { items, subtotal, totalItems, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [useSaved, setUseSaved] = useState(false);
  const [addr, setAddr] = useState<Address>({
    firstName: '', lastName: '', addressLine1: '', addressLine2: '',
    city: '', state: '', country: 'India', pin: '', email: '', phone: '',
  });
  const [coupon, setCoupon] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [giftApplied, setGiftApplied] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [purchasedItems, setPurchasedItems] = useState<CartItem[]>([]);
  const [orderId] = useState(() => `ORD-${Date.now().toString().slice(-5)}`);

  const effectiveAddr = useSaved ? SAVED_ADDRESS : addr;

  const applyCoupon = () => {
    const valid: Record<string, number> = { BOOK10: 100, SAVE50: 50, READ20: 200 };
    setCouponDiscount(valid[coupon] ?? 0);
  };

  const tax = Math.round(subtotal * TAX_RATE);
  const delivery = subtotal >= DELIVERY_THRESHOLD ? 0 : 40;
  const giftDiscount = giftApplied ? Math.min(GIFT_POINTS_BALANCE, subtotal) : 0;
  const payableAmount = subtotal + tax + delivery - couponDiscount - giftDiscount;

  // Only members can check out — redirect unauthenticated users to login
  const handlePayNow = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart', reason: 'checkout' } });
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentComplete = () => {
    setPurchasedItems([...items]);
    clearCart();
    setShowPayment(false);
    setShowConfirmation(true);
  };

  // Breadcrumb
  const firstBook = items[0]?.book;
  const catName = firstBook
    ? categories.find((c) => c.id === firstBook.categoryId)?.name ?? 'Books'
    : 'Books';

  if (items.length === 0 && !showConfirmation) {
    return (
      <div className="flex-1 bg-base flex flex-col items-center justify-center gap-4 py-20">
        <ShoppingCart className="w-16 h-16 text-muted" />
        <p className="text-secondary text-lg font-medium">Your cart is empty</p>
        <p className="text-muted text-sm">Add some books to get started!</p>
        <button
          onClick={() => navigate('/')}
          className="mt-2 bw-btn-primary px-6 py-2.5 text-sm"
        >
          Browse Books
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 bg-base overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 py-5">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-muted mb-4 flex-wrap">
            <Link to="/" className="text-accent hover:underline">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to={`/catalogue/${firstBook?.categoryId ?? 'all'}`} className="text-accent hover:underline">
              {catName}
            </Link>
            {firstBook && (
              <>
                <ChevronRight className="w-3 h-3" />
                <Link to={`/book/${firstBook.id}`} className="text-accent hover:underline">{firstBook.title}</Link>
              </>
            )}
            <ChevronRight className="w-3 h-3" />
            <span className="text-secondary">Checkout</span>
          </nav>

          <h1 className="text-2xl font-bold text-primary mb-5">Shopping Cart</h1>

          {/* ── Auth required banner (guests & anonymous visitors) ── */}
          {!isAuthenticated && (
            <div
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 mb-6"
              style={{
                background: 'var(--bw-warning-subtle)',
                border: '1px solid var(--bw-warning)',
              }}
            >
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--bw-text-primary)' }}>
                  Sign in to complete your purchase
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--bw-text-secondary)' }}>
                  You can browse and add books to your cart freely, but a Book Worm account is required to check out.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => navigate('/login', { state: { from: '/cart', reason: 'checkout' } })}
                  className="bw-btn-primary px-4 py-2 text-sm flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/login', { state: { from: '/cart', reason: 'checkout', tab: 'register' } })}
                  className="bw-btn-outline px-4 py-2 text-sm flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Register
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left: items + address */}
            <div className="flex-1 min-w-0 space-y-5">
              {/* Cart items */}
              <div className="bw-card px-5">
                {items.map((item) => (
                  <CartItemRow key={item.book.id} item={item} />
                ))}
              </div>

              {/* Address — only shown to authenticated members */}
              {isAuthenticated && (
                <AddressForm
                  useSaved={useSaved}
                  setUseSaved={(v) => {
                    setUseSaved(v);
                    if (v) setAddr(SAVED_ADDRESS);
                  }}
                  addr={effectiveAddr}
                  setAddr={setAddr}
                />
              )}
            </div>

            {/* Right: summary + recommendations */}
            <div className="w-full lg:w-80 xl:w-96 flex flex-col gap-4 shrink-0">
              <OrderSummaryPanel
                subtotal={subtotal}
                itemCount={totalItems}
                giftPoints={GIFT_POINTS_BALANCE}
                giftApplied={giftApplied}
                coupon={coupon}
                setCoupon={setCoupon}
                onApplyCoupon={applyCoupon}
                couponDiscount={couponDiscount}
                onToggleGiftPoints={() => setGiftApplied((v) => !v)}
                onPayNow={handlePayNow}
                isAuthenticated={isAuthenticated}
              />
              <RecommendedFromHistory />
            </div>
          </div>
        </div>
      </div>

      {/* Payment modal */}
      {showPayment && (
        <PaymentModal
          payableAmount={payableAmount}
          giftPointsApplied={giftDiscount}
          onPay={handlePaymentComplete}
          onClose={() => setShowPayment(false)}
        />
      )}

      {/* Confirmation modal */}
      {showConfirmation && (
        <OrderConfirmationModal
          items={purchasedItems}
          orderId={orderId}
          onClose={() => setShowConfirmation(false)}
        />
      )}
    </>
  );
}
