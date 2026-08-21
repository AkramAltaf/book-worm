/**
 * WishlistContext
 * ─────────────────────────────────────────────────────────────────────────────
 * Wishlist is a members-only feature (like real e-commerce — Amazon, Flipkart).
 * - Authenticated users: items persisted to localStorage keyed by user ID.
 * - Guest / unauthenticated: items are always empty; every mutating call
 *   returns `false` so the caller can redirect to login.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Book } from '../types';
import { useAuth } from './AuthContext';

interface WishlistContextValue {
  /** Books saved to the wishlist. Always empty for non-members. */
  items: Book[];
  /** Returns true if the book is in the wishlist. */
  isWishlisted: (bookId: number) => boolean;
  /**
   * Toggle the book in/out of wishlist.
   * Returns `true` if the action was performed.
   * Returns `false` if the user is not authenticated — caller should redirect to login.
   */
  toggleWishlist: (book: Book) => boolean;
  /** Remove a specific book. No-op for non-members. */
  removeFromWishlist: (bookId: number) => void;
  /** Clear all wishlist items. */
  clearWishlist: () => void;
  /** Total number of wishlisted books. 0 for non-members. */
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

const STORAGE_PREFIX = 'bw_wishlist_';

function storageKey(userId: string) {
  return `${STORAGE_PREFIX}${userId}`;
}

function loadForUser(userId: string): Book[] {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    return raw ? (JSON.parse(raw) as Book[]) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const [items, setItems] = useState<Book[]>([]);

  // Load/clear wishlist whenever the authenticated user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      setItems(loadForUser(user.id));
    } else {
      // Not a member — always show empty, never expose another user's list
      setItems([]);
    }
  }, [isAuthenticated, user]);

  // Persist to localStorage whenever items change (members only)
  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem(storageKey(user.id), JSON.stringify(items));
    }
  }, [items, isAuthenticated, user]);

  const isWishlisted = useCallback(
    (bookId: number) => {
      if (!isAuthenticated) return false;
      return items.some((b) => b.id === bookId);
    },
    [items, isAuthenticated]
  );

  /**
   * Toggle wishlist membership.
   * Returns false (and does nothing) when the user is not authenticated,
   * so the caller knows to redirect to the login page.
   */
  const toggleWishlist = useCallback(
    (book: Book): boolean => {
      if (!isAuthenticated) return false;
      setItems((prev) =>
        prev.some((b) => b.id === book.id)
          ? prev.filter((b) => b.id !== book.id)
          : [...prev, book]
      );
      return true;
    },
    [isAuthenticated]
  );

  const removeFromWishlist = useCallback(
    (bookId: number) => {
      if (!isAuthenticated) return;
      setItems((prev) => prev.filter((b) => b.id !== bookId));
    },
    [isAuthenticated]
  );

  const clearWishlist = useCallback(() => {
    if (!isAuthenticated) return;
    setItems([]);
  }, [isAuthenticated]);

  return (
    <WishlistContext.Provider
      value={{
        items,
        isWishlisted,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        totalItems: items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider');
  return ctx;
}
