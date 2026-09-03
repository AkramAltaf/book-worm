import { Search, X } from 'lucide-react';

export interface FilterState {
  searchQuery: string;
  language: string;
  format: string;
  priceRange: string;
  sortBy: string;
}

interface FilterBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const LANGUAGE_OPTS = ['All', 'English', 'Hindi', 'Tamil', 'Telugu'];
const FORMAT_OPTS   = ['All', 'Paperback', 'Hard Cover', 'eBook'];
const PRICE_OPTS    = ['All', 'Under ₹100', '₹100–₹300', '₹300–₹500', 'Above ₹500'];
const SORT_OPTS     = ['Relevance', 'Price: Low to High', 'Price: High to Low', 'Newest', 'Top Rated'];

function SelectField({
  label, value, options, onChange,
}: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div className="relative flex items-center">
      <label
        className="absolute left-2.5 -top-2 text-[10px] px-0.5 z-10 pointer-events-none"
        style={{ color: 'var(--bw-text-muted)', backgroundColor: 'var(--bw-bg-surface)' }}
      >
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bw-input text-xs pr-6 pl-2 py-1.5 min-w-[100px] appearance-none cursor-pointer"
        style={{ paddingTop: '0.4rem', paddingBottom: '0.4rem' }}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <svg
        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none"
        style={{ color: 'var(--bw-text-muted)' }}
        viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"
      >
        <path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  language: 'All',
  format: 'All',
  priceRange: 'All',
  sortBy: 'Relevance',
};

export default function FilterBar({ filters, onFiltersChange }: FilterBarProps) {
  const set = (key: keyof FilterState) => (value: string) =>
    onFiltersChange({ ...filters, [key]: value });

  const hasFilters =
    filters.language !== 'All' ||
    filters.format !== 'All' ||
    filters.priceRange !== 'All' ||
    filters.sortBy !== 'Relevance';

  return (
    <div
      className="flex flex-wrap items-center gap-2 px-4 py-2.5 theme-transition bg-surface"
      style={{ borderBottom: '1px solid var(--bw-border)' }}
    >
      {/* Search */}
      <div className="relative flex-1 min-w-[160px] max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: 'var(--bw-text-muted)' }} />
        <input
          type="text"
          placeholder="Search you want to read here"
          value={filters.searchQuery}
          onChange={(e) => set('searchQuery')(e.target.value)}
          className="bw-input pl-8 text-sm py-1.5"
        />
        {filters.searchQuery && (
          <button
            onClick={() => set('searchQuery')('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--bw-text-muted)' }}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dropdowns */}
      <SelectField label="Language"    value={filters.language}   options={LANGUAGE_OPTS} onChange={set('language')} />
      <SelectField label="Format"      value={filters.format}     options={FORMAT_OPTS}   onChange={set('format')} />
      <SelectField label="Price Range" value={filters.priceRange} options={PRICE_OPTS}    onChange={set('priceRange')} />
      <SelectField label="Sort by"     value={filters.sortBy}     options={SORT_OPTS}     onChange={set('sortBy')} />

      {/* Clear all filters */}
      {hasFilters && (
        <button
          onClick={() => onFiltersChange({ ...DEFAULT_FILTERS, searchQuery: filters.searchQuery })}
          className="flex items-center gap-1 text-xs transition-colors"
          style={{ color: 'var(--bw-danger)' }}
          title="Clear filters"
        >
          <X className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear</span>
        </button>
      )}
    </div>
  );
}
