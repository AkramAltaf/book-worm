import { Search, ChevronDown } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const filterOptions = [
  { label: 'Language', options: ['All', 'English', 'Hindi', 'Tamil', 'Telugu'] },
  { label: 'Format', options: ['All', 'Paperback', 'Hard Cover', 'eBook'] },
  { label: 'Price Range', options: ['All', 'Under ₹100', '₹100–₹300', '₹300–₹500', 'Above ₹500'] },
  { label: 'Sort by', options: ['Relevance', 'Price: Low to High', 'Price: High to Low', 'Newest'] },
];

export default function FilterBar({ searchQuery, onSearchChange }: FilterBarProps) {
  return (
    <div
      className="flex flex-wrap items-center gap-3 px-4 py-3 theme-transition bg-surface"
      style={{ borderBottom: '1px solid var(--bw-border)' }}
    >
      {/* Search */}
      <div className="relative flex-1 min-w-[180px] max-w-xs">
        <input
          type="text"
          placeholder="Search books, authors…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bw-input pr-8"
        />
        <Search
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
          style={{ color: 'var(--bw-text-muted)' }}
        />
      </div>

      {/* Filter dropdowns */}
      {filterOptions.map((filter) => (
        <div key={filter.label} className="relative">
          <select
            className="appearance-none bw-input pr-7 w-auto"
            defaultValue={filter.options[0]}
            style={{ paddingTop: '0.375rem', paddingBottom: '0.375rem' }}
          >
            {filter.options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
            style={{ color: 'var(--bw-text-muted)' }}
          />
          <span
            className="absolute left-3 -top-1.5 text-[10px] px-0.5 bg-surface"
            style={{ color: 'var(--bw-text-muted)' }}
          >
            {filter.label}
          </span>
        </div>
      ))}
    </div>
  );
}
