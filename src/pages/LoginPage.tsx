import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { BookOpen, Eye, EyeOff, Loader2, User, Mail, Lock, ArrowRight, Gift, ShoppingCart as ShoppingCartIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type Tab = 'login' | 'register';

interface FieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ReactNode;
  error?: string;
  autoComplete?: string;
}

function Field({ id, label, type, placeholder, value, onChange, icon, error, autoComplete }: FieldProps) {
  const [showPw, setShowPw] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPw ? 'text' : 'password') : type;

  return (
    <div>
      <label htmlFor={id} className="block text-secondary text-sm mb-1.5 font-medium">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">{icon}</span>
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          className={`bw-input pl-9 ${isPassword ? 'pr-10' : 'pr-3'} ${
            error ? 'border-danger focus:border-danger' : ''
          }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-secondary transition-colors"
            tabIndex={-1}
          >
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-danger text-xs mt-1">{error}</p>}
    </div>
  );
}

// ── Login form ────────────────────────────────────────────────────────────────

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email.';
    if (!password) e.password = 'Password is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setServerError('');
    setLoading(true);
    try {
      await login({ email, password });
      onSuccess();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {serverError && (
        <div className="bg-danger-subtle border border-danger text-danger text-sm px-3 py-2.5">
          {serverError}
        </div>
      )}
      <Field
        id="login-email" label="Email Address" type="email"
        placeholder="you@example.com" value={email}
        onChange={setEmail} icon={<Mail className="w-4 h-4" />}
        error={errors.email} autoComplete="email"
      />
      <Field
        id="login-password" label="Password" type="password"
        placeholder="••••••••" value={password}
        onChange={setPassword} icon={<Lock className="w-4 h-4" />}
        error={errors.password} autoComplete="current-password"
      />
      <div className="flex justify-end">
        <button type="button" className="text-accent text-xs hover:underline">
          Forgot password?
        </button>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bw-btn-primary justify-center py-2.5"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
        {loading ? 'Signing in…' : 'Sign In'}
      </button>
    </form>
  );
}

// ── Register form ─────────────────────────────────────────────────────────────

function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const { register } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = 'First name is required.';
    if (!lastName.trim()) e.lastName = 'Last name is required.';
    if (!email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email.';
    if (!password) e.password = 'Password is required.';
    else if (password.length < 6) e.password = 'Must be at least 6 characters.';
    if (confirmPw !== password) e.confirmPw = 'Passwords do not match.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setServerError('');
    setLoading(true);
    try {
      await register({ firstName, lastName, email, password });
      onSuccess();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {serverError && (
        <div className="bg-danger-subtle border border-danger text-danger text-sm px-3 py-2.5">
          {serverError}
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <Field
          id="reg-first" label="First Name" type="text"
          placeholder="First" value={firstName}
          onChange={setFirstName} icon={<User className="w-4 h-4" />}
          error={errors.firstName} autoComplete="given-name"
        />
        <Field
          id="reg-last" label="Last Name" type="text"
          placeholder="Last" value={lastName}
          onChange={setLastName} icon={<User className="w-4 h-4" />}
          error={errors.lastName} autoComplete="family-name"
        />
      </div>
      <Field
        id="reg-email" label="Email Address" type="email"
        placeholder="you@example.com" value={email}
        onChange={setEmail} icon={<Mail className="w-4 h-4" />}
        error={errors.email} autoComplete="email"
      />
      <Field
        id="reg-pw" label="Password" type="password"
        placeholder="Min 6 characters" value={password}
        onChange={setPassword} icon={<Lock className="w-4 h-4" />}
        error={errors.password} autoComplete="new-password"
      />
      <Field
        id="reg-cpw" label="Confirm Password" type="password"
        placeholder="Re-enter password" value={confirmPw}
        onChange={setConfirmPw} icon={<Lock className="w-4 h-4" />}
        error={errors.confirmPw} autoComplete="new-password"
      />

      {/* Welcome bonus callout */}
      <div className="flex items-center gap-2 bg-success-subtle border border-success px-3 py-2">
        <Gift className="w-4 h-4 text-success shrink-0" />
        <p className="text-success text-xs">
          New members receive <strong>₹100 gift points</strong> on sign-up!
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bw-btn-primary justify-center py-2.5"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
        {loading ? 'Creating account…' : 'Create Account'}
      </button>
    </form>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { continueAsGuest, isAuthenticated } = useAuth();

  const locationState = location.state as { from?: string; reason?: string; tab?: Tab } | null;
  const from: string   = locationState?.from ?? '/';
  // When redirected from checkout, guests cannot proceed — hide the guest option
  const isCheckout     = locationState?.reason === 'checkout';
  // Support pre-selecting register tab (e.g. from the cart banner "Register" button)
  const [tab, setTab]  = useState<Tab>(locationState?.tab ?? 'login');

  // Already authenticated — redirect away immediately
  if (isAuthenticated) {
    navigate(from, { replace: true });
    return null;
  }

  const handleSuccess = () => navigate(from, { replace: true });

  const handleGuest = () => {
    continueAsGuest();
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-base flex items-center justify-center px-4 py-10">
      {/* Decorative background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-accent-subtle blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-accent-subtle blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center gap-2.5 mb-2">
            <div className="w-10 h-10 flex items-center justify-center shadow-lg" style={{ backgroundColor: 'var(--bw-action)' }}>
              <BookOpen className="w-5 h-5" style={{ color: 'var(--bw-text-inverse)' }} />
            </div>
            <span className="text-primary text-2xl font-bold tracking-tight">Book Worm</span>
          </Link>
          <p className="text-secondary text-sm">Your personal reading companion</p>
        </div>

        {/* Checkout context notice */}
        {isCheckout && (
          <div
            className="flex items-start gap-3 px-4 py-3 mb-4"
            style={{ background: 'var(--bw-warning-subtle)', border: '1px solid var(--bw-warning)' }}
          >
            <ShoppingCartIcon className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--bw-warning)' }} />
            <p className="text-xs leading-relaxed" style={{ color: 'var(--bw-text-secondary)' }}>
              Your cart is saved. Sign in or create a free account to complete your purchase.
            </p>
          </div>
        )}

        {/* Card */}
        <div className="bw-card overflow-hidden shadow-2xl">
          {/* Tabs */}
          <div className="flex border-b border-base">
            {(['login', 'register'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${
                  tab === t
                    ? 'text-primary border-b-2 border-accent bg-accent-subtle'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                {t === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* Form body */}
          <div className="p-6">
            {tab === 'login' ? (
              <LoginForm onSuccess={handleSuccess} />
            ) : (
              <RegisterForm onSuccess={handleSuccess} />
            )}

            {/* Guest option — hidden when arriving from checkout */}
            {!isCheckout && (
              <>
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-subtle" />
                  <span className="text-muted text-xs">or</span>
                  <div className="flex-1 h-px bg-subtle" />
                </div>
                <button
                  onClick={handleGuest}
                  className="w-full bw-btn-outline justify-center py-2.5"
                >
                  <User className="w-4 h-4" />
                  Continue as Guest
                </button>
              </>
            )}

            {/* Terms note */}
            <p className="text-muted text-xs text-center mt-4 leading-relaxed">
              By continuing, you agree to Book Worm's{' '}
              <span className="text-secondary hover:underline cursor-pointer">Terms of Service</span>{' '}
              and{' '}
              <span className="text-secondary hover:underline cursor-pointer">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
