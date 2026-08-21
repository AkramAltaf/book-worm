import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CataloguePage from './pages/CataloguePage';
import BookDetailPage from './pages/BookDetailPage';
import CartPage from './pages/CartPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import PlaceholderPage from './pages/PlaceholderPage';

function CatalogueRoute() {
  const { categoryId } = useParams<{ categoryId: string }>();
  return <CataloguePage categoryId={categoryId ?? 'all'} />;
}

function BookDetailRoute() {
  const { bookId } = useParams<{ bookId: string }>();
  return <BookDetailPage bookId={Number(bookId)} />;
}

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="min-h-screen bg-[#0f172a] flex flex-col">
          <Navbar />
          <div className="flex flex-col flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalogue/:categoryId" element={<CatalogueRoute />} />
              <Route path="/book/:bookId" element={<BookDetailRoute />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/orders" element={<OrderHistoryPage />} />
              <Route path="/wishlist" element={<PlaceholderPage title="My Wishlist" />} />
              <Route path="/writers" element={<PlaceholderPage title="My Writers" />} />
            </Routes>
          </div>
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
