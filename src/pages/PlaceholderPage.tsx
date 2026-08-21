import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PlaceholderPageProps {
  title: string;
}

export default function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] bg-[#0f172a] text-white gap-4">
      <BookOpen className="w-12 h-12 text-orange-400" />
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-gray-400 text-sm">This page is coming soon.</p>
      <Link
        to="/"
        className="mt-4 px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium transition-colors"
      >
        ← Back to Browse
      </Link>
    </div>
  );
}
