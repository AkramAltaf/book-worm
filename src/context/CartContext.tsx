import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Book, CartItem } from '../types';

interface CartContextValue {
  items: CartItem[];
  addToCart: (book: Book, qty?: number) => void;
  removeFromCart: (bookId: number) => void;
  updateQty: (bookId: number, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((book: Book, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.book.id === book.id);
      if (existing) {
        return prev.map((i) =>
          i.book.id === book.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { book, quantity: qty }];
    });
  }, []);

  const removeFromCart = useCallback((bookId: number) => {
    setItems((prev) => prev.filter((i) => i.book.id !== bookId));
  }, []);

  const updateQty = useCallback((bookId: number, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.book.id !== bookId));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.book.id === bookId ? { ...i, quantity: qty } : i))
      );
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.book.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
