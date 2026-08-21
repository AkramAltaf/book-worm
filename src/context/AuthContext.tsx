/**
 * AuthContext.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Global authentication state.
 * All components read/mutate auth through `useAuth()`.
 *
 * To wire a backend: replace `authService.*` calls — the context interface
 * and hook API are unchanged.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { AuthCredentials, AuthState, RegisterPayload, User } from '../types';
import * as authService from '../services/authService';

// ── State & actions ──────────────────────────────────────────────────────────

type AuthAction =
  | { type: 'RESTORE_SESSION'; user: User; token: string }
  | { type: 'LOGIN_SUCCESS'; user: User; token: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_GUEST' }
  | { type: 'SET_LOADING'; loading: boolean };

interface InternalAuthState extends AuthState {
  loading: boolean;
}

const GUEST_KEY = 'bw_guest';

const initialState: InternalAuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isGuest: false,
  loading: true,
};

function authReducer(state: InternalAuthState, action: AuthAction): InternalAuthState {
  switch (action.type) {
    case 'RESTORE_SESSION':
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.user,
        token: { accessToken: action.token, expiresIn: 3600 },
        isAuthenticated: true,
        isGuest: false,
        loading: false,
      };
    case 'LOGOUT':
      return { ...initialState, loading: false };
    case 'SET_GUEST':
      return { ...initialState, isGuest: true, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.loading };
    default:
      return state;
  }
}

// ── Context interface ─────────────────────────────────────────────────────────

interface AuthContextValue extends InternalAuthState {
  /** Sign in with email + password */
  login: (credentials: AuthCredentials) => Promise<void>;
  /** Register a new member account */
  register: (payload: RegisterPayload) => Promise<void>;
  /** Sign out the current user */
  logout: () => Promise<void>;
  /** Continue as unauthenticated guest (bypasses login) */
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore session from localStorage (member) or sessionStorage (guest) on mount
  useEffect(() => {
    authService.restoreSession().then((result) => {
      if (result) {
        dispatch({ type: 'RESTORE_SESSION', user: result.user, token: result.token.accessToken });
      } else if (sessionStorage.getItem(GUEST_KEY) === 'true') {
        dispatch({ type: 'SET_GUEST' });
      } else {
        dispatch({ type: 'SET_LOADING', loading: false });
      }
    });
  }, []);

  const login = useCallback(async (credentials: AuthCredentials) => {
    const result = await authService.login(credentials);
    dispatch({ type: 'LOGIN_SUCCESS', user: result.user, token: result.token.accessToken });
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const result = await authService.register(payload);
    dispatch({ type: 'LOGIN_SUCCESS', user: result.user, token: result.token.accessToken });
  }, []);

  const logoutFn = useCallback(async () => {
    await authService.logout();
    sessionStorage.removeItem(GUEST_KEY);
    dispatch({ type: 'LOGOUT' });
  }, []);

  const continueAsGuest = useCallback(() => {
    sessionStorage.setItem(GUEST_KEY, 'true');
    dispatch({ type: 'SET_GUEST' });
  }, []);

  return (
    <AuthContext.Provider
      value={{ ...state, login, register, logout: logoutFn, continueAsGuest }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
