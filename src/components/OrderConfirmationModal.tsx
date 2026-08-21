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

  const handleContinue = () => {
    onClose();
    navigate('/');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="bg-[#1e2433] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
        {/* Success header */}
        <div className="flex flex-col items-center pt-8 pb-5 px-6">
          <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 mb-4">
            <CheckCircle className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
          <h2 className="text-white text-xl font-bold text-center leading-snug">
            Your purchase of the<br />following reads is successful
          </h2>
          <p className="text-gray-500 text-xs mt-2">Order ID: {orderId}</p>
        </div>

        {/* Purchased books */}
        <div className="px-6 pb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map(({ book, quantity }) => (
              <div key={book.id} className="flex gap-3">
                {/* Cover */}
                <div
                  className="shrink-0 w-24 h-32 rounded-lg overflow-hidden flex items-center justify-center p-2 text-center shadow-md"
                  style={{ backgroundColor: book.coverColor, color: book.coverTextColor }}
                >
                  <div>
                    <p className="font-bold text-[11px] uppercase leading-tight tracking-wide line-clamp-3">{book.title}</p>
                    <p className="text-[9px] mt-1 opacity-70">{book.author}</p>
                  </div>
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0 py-1">
                  <h3 className="text-white font-semibold text-sm leading-tight">{book.title}</h3>
                  <button className="text-blue-400 text-xs mt-0.5 hover:underline">
                    by {book.author}
                  </button>
                  <p className="text-gray-400 text-xs mt-1 line-clamp-2">{book.description}</p>
                  <p className="text-gray-500 text-xs mt-1">{book.format}</p>
                  <div className="flex flex-wrap gap-x-1.5 mt-0.5">
                    {book.genres.slice(0, 2).map((g) => (
                      <span key={g} className="text-blue-400 text-[11px]">{g}</span>
                    ))}
                  </div>
                  <p className="text-white font-bold text-sm mt-1.5">
                    ₹{book.price}{quantity > 1 && ` × ${quantity}`}
                  </p>
                  <p className="text-gray-500 text-[11px]">Delivery by {book.deliveryDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Continue button */}
        <div className="px-6 pb-7 flex justify-center">
          <button
            onClick={handleContinue}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-2.5 rounded-lg transition-colors text-sm"
          >
            Continue your Shopping
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
