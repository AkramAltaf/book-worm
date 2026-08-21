import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] bg-base gap-4 theme-transition">
      <BookOpen className="w-12 h-12" style={{ color: 'var(--bw-cta)' }} />
      <h1 className="text-2xl font-bold" style={{ color: 'var(--bw-text-primary)' }}>{title}</h1>
      <p className="text-sm" style={{ color: 'var(--bw-text-secondary)' }}>This page is coming soon.</p>
      <Link
        to="/"
        className="mt-4 px-5 py-2 text-sm font-semibold transition-colors bw-btn-primary"
      >
        ← Back to Browse
      </Link>
    </div>
  );
}
