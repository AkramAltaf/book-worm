import { BrowserRouter, Routes, Route, useParams, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import CataloguePage from './pages/CataloguePage';
import BookDetailPage from './pages/BookDetailPage';
import CartPage from './pages/CartPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import WishlistPage from './pages/WishlistPage';
import PlaceholderPage from './pages/PlaceholderPage';

function CatalogueRoute() {
  const { categoryId } = useParams<{ categoryId: string }>();
  return <CataloguePage categoryId={categoryId ?? 'all'} />;
}

function BookDetailRoute() {
  const { bookId } = useParams<{ bookId: string }>();
  return <BookDetailPage bookId={Number(bookId)} />;
}

function AppShell() {
  return (
    <div className="min-h-screen flex flex-col bg-base theme-transition">
      <Navbar />
      <div className="flex flex-col flex-1">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogue/:categoryId" element={<CatalogueRoute />} />
          <Route path="/book/:bookId" element={<BookDetailRoute />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
          <Route path="/writers" element={<ProtectedRoute><PlaceholderPage title="My Writers" /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <AppShell />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
