import { useNavigate } from 'react-router-dom';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import type { CartItem } from '../types';

interface OrderConfirmationModalProps {
  items: CartItem[];
  orderId: string;
  onClose: () => void;
}

export default function OrderConfirmationModal({ items, orderId, onClose }: OrderConfirmationModalProps) {
  const navigate = useNavigate();

  const handleContinue = () => { onClose(); navigate('/'); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
      <div
        className="w-full max-w-2xl overflow-hidden theme-transition"
        style={{ background: 'var(--bw-bg-elevated)', border: '1px solid var(--bw-border)', boxShadow: 'var(--bw-shadow-lg)' }}
      >
        {/* Success header */}
        <div className="flex flex-col items-center pt-8 pb-5 px-6">
          <div
            className="w-14 h-14 flex items-center justify-center mb-4"
            style={{ background: 'var(--bw-success)', boxShadow: '0 0 20px rgba(63,185,80,0.4)' }}
          >
            <CheckCircle className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
          <h2 className="text-xl font-bold text-center leading-snug" style={{ color: 'var(--bw-text-primary)' }}>
            Your purchase of the<br />following reads is successful
          </h2>
          <p className="text-xs mt-2" style={{ color: 'var(--bw-text-muted)' }}>Order ID: {orderId}</p>
        </div>

        {/* Books */}
        <div className="px-6 pb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map(({ book, quantity }) => (
              <div key={book.id} className="flex gap-3">
                <div
                  className="shrink-0 w-24 h-32 overflow-hidden flex items-center justify-center p-2 text-center"
                  style={{ backgroundColor: book.coverColor, color: book.coverTextColor, boxShadow: 'var(--bw-shadow-md)' }}
                >
                  <div>
                    <p className="font-bold text-[11px] uppercase leading-tight tracking-wide line-clamp-3">{book.title}</p>
                    <p className="text-[9px] mt-1 opacity-70">{book.author}</p>
                  </div>
                </div>
                <div className="flex-1 min-w-0 py-1">
                  <h3 className="font-semibold text-sm leading-tight" style={{ color: 'var(--bw-text-primary)' }}>{book.title}</h3>
                  <p className="text-xs mt-0.5 hover:underline cursor-pointer" style={{ color: 'var(--bw-accent)' }}>by {book.author}</p>
                  <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--bw-text-secondary)' }}>{book.description}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--bw-text-muted)' }}>{book.format}</p>
                  <div className="flex flex-wrap gap-x-1.5 mt-0.5">
                    {book.genres.slice(0, 2).map((g) => (
                      <span key={g} className="text-[11px]" style={{ color: 'var(--bw-accent)' }}>{g}</span>
                    ))}
                  </div>
                  <p className="font-bold text-sm mt-1.5" style={{ color: 'var(--bw-text-primary)' }}>
                    ₹{book.price}{quantity > 1 && ` × ${quantity}`}
                  </p>
                  <p className="text-[11px]" style={{ color: 'var(--bw-text-muted)' }}>Delivery by {book.deliveryDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="px-6 pb-7 flex justify-center">
          <button
            onClick={handleContinue}
            className="flex items-center gap-2 font-bold px-8 py-2.5 transition-colors bw-btn-primary"
          >
            Continue your Shopping
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
