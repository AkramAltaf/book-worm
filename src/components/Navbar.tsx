import { ShoppingCart, Heart, BookOpen, Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import UserMenu from './UserMenu';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { label: 'My Orders', to: '/orders' },
  { label: 'My Wishlist', to: '/wishlist' },
  { label: 'My Writers', to: '/writers' },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleWishlistClick = () => {
    if (isAuthenticated) {
      navigate('/wishlist');
    } else {
      navigate('/login', { state: { from: '/wishlist' } });
    }
  };

  return (
    <nav
      className="h-14 flex items-center px-4 md:px-6 gap-3 sticky top-0 z-50 bg-nav theme-transition"
      style={{ borderBottom: '1px solid var(--bw-nav-border)', boxShadow: 'var(--bw-shadow-sm)' }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 font-bold text-lg shrink-0 mr-2 text-primary">
        <BookOpen className="w-5 h-5" style={{ color: 'var(--bw-cta)' }} />
        <span className="hidden sm:inline" style={{ color: 'var(--bw-text-primary)' }}>Book Worm</span>
      </Link>

      <div className="hidden md:block w-px h-6" style={{ background: 'var(--bw-border)' }} />

      {/* Nav links — desktop */}
      <div className="hidden md:flex items-center gap-1">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="px-3 py-1.5 text-sm transition-colors"
            style={{
              color: location.pathname === link.to ? 'var(--bw-text-primary)' : 'var(--bw-text-secondary)',
              background: location.pathname === link.to ? 'var(--bw-bg-active)' : 'transparent',
              fontWeight: location.pathname === link.to ? 600 : 400,
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex-1" />

      {/* Right side */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleWishlistClick}
          className="relative p-1.5 transition-colors hidden sm:flex items-center"
          style={{ color: wishlistCount > 0 ? 'var(--bw-danger)' : 'var(--bw-text-secondary)' }}
          title={isAuthenticated ? 'My Wishlist' : 'Sign in to use Wishlist'}
          aria-label="My Wishlist"
        >
          <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'fill-current' : ''}`} />
          {wishlistCount > 0 && (
            <span
              className="absolute -top-0.5 -right-0.5 text-[10px] min-w-[16px] h-4 flex items-center justify-center font-bold px-0.5"
              style={{ background: 'var(--bw-danger)', color: '#fff' }}
            >
              {wishlistCount > 99 ? '99+' : wishlistCount}
            </span>
          )}
        </button>
        <button
          onClick={() => navigate('/cart')}
          className="relative p-1.5 transition-colors flex items-center"
          style={{ color: 'var(--bw-text-secondary)' }}
          aria-label="Shopping cart"
        >
          <ShoppingCart className="w-5 h-5" />
          {totalItems > 0 && (
            <span
              className="absolute -top-0.5 -right-0.5 text-[10px] min-w-[16px] h-4 flex items-center justify-center font-bold px-0.5"
              style={{ background: 'var(--bw-danger)', color: '#fff' }}
            >
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          )}
        </button>

        {/* Theme toggle */}
        <ThemeToggle compact />

        {/* User account menu */}
        <UserMenu />

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-1.5 transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
          style={{ color: 'var(--bw-text-secondary)' }}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          className="absolute top-14 left-0 right-0 z-50 md:hidden"
          style={{ background: 'var(--bw-nav-bg)', borderBottom: '1px solid var(--bw-border)', boxShadow: 'var(--bw-shadow-md)' }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block px-5 py-3 text-sm transition-colors"
              style={{
                color: location.pathname === link.to ? 'var(--bw-text-primary)' : 'var(--bw-text-secondary)',
                borderBottom: '1px solid var(--bw-border-subtle)',
                background: location.pathname === link.to ? 'var(--bw-bg-active)' : 'transparent',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
