import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ChevronDown, ChevronUp, Package, CheckCircle, Truck, Clock, XCircle } from 'lucide-react';
import { sampleOrders } from '../data/books';
import type { Order, OrderItem } from '../types';
import { useCart } from '../context/CartContext';

const statusConfig: Record<Order['status'], { icon: React.ReactNode; color: string; subtleVar: string; borderVar: string }> = {
  Delivered:  { icon: <CheckCircle className="w-4 h-4" />, color: 'var(--bw-success)',  subtleVar: 'var(--bw-success-subtle)',  borderVar: 'var(--bw-success-border)' },
  Shipped:    { icon: <Truck className="w-4 h-4" />,       color: 'var(--bw-accent)',   subtleVar: 'var(--bw-accent-subtle)',   borderVar: 'var(--bw-accent-border)'  },
  Processing: { icon: <Clock className="w-4 h-4" />,       color: 'var(--bw-warning)',  subtleVar: 'var(--bw-warning-subtle)', borderVar: 'rgba(245,197,24,0.35)'    },
  Cancelled:  { icon: <XCircle className="w-4 h-4" />,     color: 'var(--bw-danger)',   subtleVar: 'var(--bw-danger-subtle)',  borderVar: 'var(--bw-danger-border)'  },
};

function OrderItemRow({ item, onBuyAgain }: { item: OrderItem; onBuyAgain: () => void }) {
  return (
    <div className="flex items-center gap-3 py-3" style={{ borderBottom: '1px solid var(--bw-border-subtle)' }}>
      <div
        className="shrink-0 w-12 h-16 overflow-hidden flex items-center justify-center p-1 text-center text-[9px] font-bold uppercase leading-tight"
        style={{ backgroundColor: item.book.coverColor, color: item.book.coverTextColor }}
      >
        {item.book.title}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium line-clamp-2 leading-tight" style={{ color: 'var(--bw-text-primary)' }}>{item.book.title}</p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--bw-text-secondary)' }}>by {item.book.author}</p>
        <p className="text-xs" style={{ color: 'var(--bw-text-muted)' }}>{item.book.format} · Qty: {item.quantity}</p>
      </div>
      <div className="flex flex-col items-end gap-2 shrink-0">
        <span className="text-sm font-semibold" style={{ color: 'var(--bw-text-primary)' }}>₹{item.priceAtPurchase}</span>
        <button
          onClick={onBuyAgain}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 transition-colors bw-btn-outline"
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

  return (
    <div className="overflow-hidden bw-card">
      <div className="px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Package className="w-5 h-5 shrink-0" style={{ color: 'var(--bw-text-muted)' }} />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm" style={{ color: 'var(--bw-text-primary)' }}>{order.id}</span>
              <span
                className="flex items-center gap-1 text-xs font-medium px-2 py-0.5"
                style={{ color: cfg.color, background: cfg.subtleVar, border: `1px solid ${cfg.borderVar}` }}
              >
                {cfg.icon}{order.status}
              </span>
            </div>
            <p className="text-xs mt-0.5" style={{ color: 'var(--bw-text-muted)' }}>
              Ordered on {order.date}{order.deliveredOn && ` · Delivered ${order.deliveredOn}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs" style={{ color: 'var(--bw-text-muted)' }}>{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
            <p className="font-bold text-sm" style={{ color: 'var(--bw-text-primary)' }}>₹{order.total}</p>
          </div>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="p-1.5 transition-colors"
            style={{ color: 'var(--bw-text-secondary)' }}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pt-1 pb-3" style={{ borderTop: '1px solid var(--bw-border)' }}>
          {order.items.map((item) => (
            <OrderItemRow
              key={item.book.id}
              item={item}
              onBuyAgain={() => { addToCart(item.book, item.quantity); navigate('/cart'); }}
            />
          ))}
          <div className="flex justify-between items-center pt-3 mt-1">
            <span className="text-sm" style={{ color: 'var(--bw-text-secondary)' }}>Order Total</span>
            <span className="font-bold text-base" style={{ color: 'var(--bw-text-primary)' }}>₹{order.total}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderHistoryPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-base px-4 py-6 theme-transition">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--bw-text-primary)' }}>My Orders</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--bw-text-secondary)' }}>{sampleOrders.length} orders in your history</p>
      </div>
      <div className="flex flex-col gap-4 max-w-3xl">
        {sampleOrders.map((order) => <OrderCard key={order.id} order={order} />)}
      </div>
    </div>
  );
}
