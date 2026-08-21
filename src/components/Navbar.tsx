import { ShoppingCart, Heart, BookOpen, Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';

const navLinks = [
  { label: 'My Orders', to: '/orders' },
  { label: 'My Wishlist', to: '/wishlist' },
  { label: 'My Writers', to: '/writers' },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-[#1a1a2e] text-white h-14 flex items-center px-4 md:px-6 gap-4 sticky top-0 z-50 shadow-lg">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 font-bold text-white text-lg shrink-0 mr-2">
        <BookOpen className="w-5 h-5 text-orange-400" />
        <span className="hidden sm:inline">Book Worm</span>
      </Link>

      {/* Divider */}
      <div className="hidden md:block w-px h-6 bg-white/20" />

      {/* Nav links — desktop */}
      <div className="hidden md:flex items-center gap-1">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`px-3 py-1.5 rounded text-sm transition-colors ${
              location.pathname === link.to
                ? 'text-white font-medium bg-white/10'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right side icons */}
      <div className="flex items-center gap-2">
        <button className="p-1.5 text-gray-300 hover:text-white transition-colors">
          <Heart className="w-5 h-5" />
        </button>
        <button
          onClick={() => navigate('/cart')}
          className="relative p-1.5 text-gray-300 hover:text-white transition-colors"
          aria-label="Shopping cart"
        >
          <ShoppingCart className="w-5 h-5" />
          {totalItems > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] rounded-full min-w-[16px] h-4 flex items-center justify-center font-bold px-0.5">
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          )}
        </button>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-1.5 text-gray-300 hover:text-white transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="absolute top-14 left-0 right-0 bg-[#1a1a2e] border-t border-gray-700/50 shadow-xl z-50 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block px-5 py-3 text-sm border-b border-gray-700/30 transition-colors ${
                location.pathname === link.to
                  ? 'text-white font-medium bg-white/10'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
