/**
 * authService.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Frontend-only authentication service backed by localStorage.
 *
 * MIGRATION GUIDE — to wire up a real backend:
 *   1. Replace each method body with an `axios` / `fetch` call to your API.
 *   2. The method signatures, return shapes (AuthToken, User), and error
 *      messages stay identical — no changes needed in contexts or components.
 *   3. Move STORAGE_KEYS.TOKEN handling to an HTTP interceptor (attach as
 *      Authorization header); remove manual reads from here.
 *
 * The service is intentionally stateless — all state lives in AuthContext.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { AuthCredentials, AuthToken, RegisterPayload, User } from '../types';

// ── Storage keys ─────────────────────────────────────────────────────────────

const STORAGE_KEYS = {
  USERS: 'bw_users',
  TOKEN: 'bw_token',
  CURRENT_USER: 'bw_current_user',
} as const;

// ── Internal helpers ─────────────────────────────────────────────────────────

function getUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) ?? '[]');
  } catch {
    return [];
  }
}

function saveUsers(users: User[]): void {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

function generateId(): string {
  return `usr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Simulates the server issuing a signed JWT. Replace with real token. */
function issueToken(userId: string): AuthToken {
  return {
    // In a real app this would be a JWT returned from the server.
    accessToken: btoa(`${userId}:${Date.now()}`),
    expiresIn: 3600,
  };
}

/** Very basic hash — replace with bcrypt on the backend. */
function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    hash = (Math.imul(31, hash) + password.charCodeAt(i)) | 0;
  }
  return hash.toString(16);
}

// ── Public service API ────────────────────────────────────────────────────────

export interface LoginResult {
  user: User;
  token: AuthToken;
}

/**
 * POST /auth/login
 * Authenticates a user with email + password.
 */
export async function login(credentials: AuthCredentials): Promise<LoginResult> {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 600));

  const users = getUsers();
  const user = users.find((u) => u.email.toLowerCase() === credentials.email.toLowerCase());

  if (!user) {
    throw new Error('No account found with that email address.');
  }

  if (hashPassword(credentials.password) !== (user as User & { _pwHash: string })['_pwHash' as keyof User]) {
    throw new Error('Incorrect password. Please try again.');
  }

  const token = issueToken(user.id);
  persistSession(user, token);
  return { user, token };
}

/**
 * POST /auth/register
 * Creates a new member account.
 */
export async function register(payload: RegisterPayload): Promise<LoginResult> {
  await new Promise((r) => setTimeout(r, 700));

  const users = getUsers();

  if (users.some((u) => u.email.toLowerCase() === payload.email.toLowerCase())) {
    throw new Error('An account with this email already exists. Please log in.');
  }

  if (payload.password.length < 6) {
    throw new Error('Password must be at least 6 characters.');
  }

  const newUser: User & { _pwHash: string } = {
    id: generateId(),
    email: payload.email.toLowerCase(),
    firstName: payload.firstName,
    lastName: payload.lastName,
    role: 'member',
    avatarInitials: `${payload.firstName[0]}${payload.lastName[0]}`.toUpperCase(),
    createdAt: new Date().toISOString(),
    giftPoints: 100, // welcome bonus
    _pwHash: hashPassword(payload.password),
  };

  saveUsers([...users, newUser]);

  // Strip internal fields before returning
  const { _pwHash: _discarded, ...user } = newUser;
  const token = issueToken(user.id);
  persistSession(user, token);
  return { user, token };
}

/**
 * POST /auth/logout
 * Invalidates the session.
 */
export async function logout(): Promise<void> {
  clearSession();
}

/**
 * GET /auth/me
 * Restores a persisted session from storage (called on app boot).
 * Returns null if no valid session exists.
 */
export async function restoreSession(): Promise<LoginResult | null> {
  try {
    const rawToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const rawUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!rawToken || !rawUser) return null;

    const token: AuthToken = JSON.parse(rawToken);
    const user: User = JSON.parse(rawUser);

    // Validate that the user still exists in the registry
    const users = getUsers();
    const found = users.find((u) => u.id === user.id);
    if (!found) { clearSession(); return null; }

    return { user, token };
  } catch {
    clearSession();
    return null;
  }
}

// ── Session helpers ───────────────────────────────────────────────────────────

export function persistSession(user: User, token: AuthToken): void {
  localStorage.setItem(STORAGE_KEYS.TOKEN, JSON.stringify(token));
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

export function getStoredToken(): AuthToken | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TOKEN);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
