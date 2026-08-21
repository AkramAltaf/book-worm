import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ChevronDown, ChevronUp, Package, CheckCircle, Truck, Clock, XCircle } from 'lucide-react';
import { sampleOrders } from '../data/books';
import type { Order, OrderItem } from '../types';
import { useCart } from '../context/CartContext';

const statusConfig: Record<Order['status'], { icon: React.ReactNode; color: string; bg: string }> = {
  Delivered: {
    icon: <CheckCircle className="w-4 h-4" />,
    color: 'text-green-400',
    bg: 'bg-green-400/10 border-green-400/30',
  },
  Shipped: {
    icon: <Truck className="w-4 h-4" />,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10 border-blue-400/30',
  },
  Processing: {
    icon: <Clock className="w-4 h-4" />,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10 border-yellow-400/30',
  },
  Cancelled: {
    icon: <XCircle className="w-4 h-4" />,
    color: 'text-red-400',
    bg: 'bg-red-400/10 border-red-400/30',
  },
};

function OrderItemRow({ item, onBuyAgain }: { item: OrderItem; onBuyAgain: () => void }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-700/40 last:border-0">
      {/* Mini cover */}
      <div
        className="shrink-0 w-12 h-16 rounded overflow-hidden flex items-center justify-center p-1 text-center text-[9px] font-bold uppercase leading-tight"
        style={{ backgroundColor: item.book.coverColor, color: item.book.coverTextColor }}
      >
        {item.book.title}
      </div>
      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-gray-100 text-sm font-medium line-clamp-2 leading-tight">{item.book.title}</p>
        <p className="text-gray-400 text-xs mt-0.5">by {item.book.author}</p>
        <p className="text-gray-500 text-xs">{item.book.format} · Qty: {item.quantity}</p>
      </div>
      {/* Price + Buy again */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <span className="text-gray-200 text-sm font-semibold">₹{item.priceAtPurchase}</span>
        <button
          onClick={onBuyAgain}
          className="flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-xs px-3 py-1.5 rounded transition-colors"
        >
          <ShoppingCart className="w-3 h-3" />
          Buy Again
        </button>
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const cfg = statusConfig[order.status];

  const handleBuyAgain = (item: OrderItem) => {
    addToCart(item.book, item.quantity);
    navigate('/cart');
  };

  return (
    <div className="bg-[#1a2332] border border-gray-700/50 rounded-xl overflow-hidden">
      {/* Order header */}
      <div className="px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Package className="w-5 h-5 text-gray-400 shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-white font-bold text-sm">{order.id}</span>
              <span
                className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded border ${cfg.color} ${cfg.bg}`}
              >
                {cfg.icon}
                {order.status}
              </span>
            </div>
            <p className="text-gray-500 text-xs mt-0.5">
              Ordered on {order.date}
              {order.deliveredOn && ` · Delivered ${order.deliveredOn}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-gray-500 text-xs">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
            <p className="text-white font-bold text-sm">₹{order.total}</p>
          </div>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="p-1.5 text-gray-400 hover:text-white transition-colors"
            aria-label={expanded ? 'Collapse order' : 'Expand order'}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded items */}
      {expanded && (
        <div className="border-t border-gray-700/50 px-4 pt-1 pb-2">
          {order.items.map((item) => (
            <OrderItemRow
              key={item.book.id}
              item={item}
              onBuyAgain={() => handleBuyAgain(item)}
            />
          ))}
          {/* Order total row */}
          <div className="flex justify-between items-center pt-3 mt-1">
            <span className="text-gray-400 text-sm">Order Total</span>
            <span className="text-white font-bold text-base">₹{order.total}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderHistoryPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-[#0f172a] px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-white text-2xl font-bold">My Orders</h1>
        <p className="text-gray-400 text-sm mt-1">{sampleOrders.length} orders in your history</p>
      </div>

      {/* Orders list */}
      <div className="flex flex-col gap-4 max-w-3xl">
        {sampleOrders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
