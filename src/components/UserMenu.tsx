import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Package, Gift, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function UserMenu() {
  const { user, isAuthenticated, isGuest, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    navigate('/login');
  };

  // ── Not authenticated ──
  if (!isAuthenticated && !isGuest) {
    return (
      <button
        onClick={() => navigate('/login')}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold transition-colors bw-btn-primary"
      >
        <User className="w-4 h-4" />
        Sign In
      </button>
    );
  }

  // ── Guest ──
  if (isGuest) {
    return (
      <button
        onClick={() => navigate('/login')}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors bw-btn-outline"
      >
        <User className="w-4 h-4" />
        <span className="hidden sm:inline">Guest</span>
      </button>
    );
  }

  // ── Member ──
  const initials = user?.avatarInitials ?? '?';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-2 py-1 transition-colors"
        style={{ color: 'var(--bw-text-primary)' }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bw-bg-hover)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <div
          className="w-8 h-8 flex items-center justify-center text-white text-xs font-bold shrink-0"
          style={{ background: 'linear-gradient(135deg, var(--bw-accent), #7c3aed)' }}
        >
          {initials}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-xs font-semibold leading-tight" style={{ color: 'var(--bw-text-primary)' }}>
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-[10px] leading-tight" style={{ color: 'var(--bw-text-muted)' }}>{user?.email}</p>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} style={{ color: 'var(--bw-text-muted)' }} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-56 z-50 overflow-hidden"
          style={{ background: 'var(--bw-bg-elevated)', border: '1px solid var(--bw-border)', boxShadow: 'var(--bw-shadow-lg)' }}
        >
          {/* Header */}
          <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--bw-border)' }}>
            <p className="text-sm font-semibold" style={{ color: 'var(--bw-text-primary)' }}>{user?.firstName} {user?.lastName}</p>
            <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--bw-text-secondary)' }}>{user?.email}</p>
            <div
              className="flex items-center gap-1.5 mt-2 px-2 py-1"
              style={{ background: 'var(--bw-success-subtle)', border: '1px solid var(--bw-success-border)' }}
            >
              <Gift className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--bw-success)' }} />
              <span className="text-xs font-medium" style={{ color: 'var(--bw-success)' }}>
                {user?.giftPoints ?? 0} Gift Points
              </span>
            </div>
          </div>

          {/* Items */}
          <div className="py-1">
            {[
              { label: 'My Orders', icon: <Package className="w-4 h-4" />, to: '/orders' },
              { label: 'My Profile', icon: <User className="w-4 h-4" />, to: '/wishlist' },
            ].map((item) => (
              <button
                key={item.to}
                onClick={() => { setOpen(false); navigate(item.to); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
                style={{ color: 'var(--bw-text-secondary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bw-bg-hover)';
                  e.currentTarget.style.color = 'var(--bw-text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--bw-text-secondary)';
                }}
              >
                <span style={{ color: 'var(--bw-text-muted)' }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          {/* Logout */}
          <div style={{ borderTop: '1px solid var(--bw-border)' }} className="py-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
              style={{ color: 'var(--bw-danger)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bw-danger-subtle)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
