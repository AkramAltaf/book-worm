import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  allowGuest?: boolean;
}

export default function ProtectedRoute({ children, allowGuest = false }: ProtectedRouteProps) {
  const { isAuthenticated, isGuest, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-base">
        <div
          className="w-8 h-8 animate-spin border-2"
          style={{ borderColor: 'var(--bw-accent-subtle)', borderTopColor: 'var(--bw-accent)' }}
        />
      </div>
    );
  }

  if (isAuthenticated) return <>{children}</>;
  if (allowGuest && isGuest) return <>{children}</>;
  return <Navigate to="/login" state={{ from: location.pathname }} replace />;
}
