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
    <div className="flex flex-wrap items-center gap-3 px-4 py-3 bg-[#111827] border-b border-gray-700/50">
      {/* Search */}
      <div className="relative flex-1 min-w-[180px] max-w-xs">
        <input
          type="text"
          placeholder="Search you want to read here"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-[#1f2937] text-gray-200 placeholder-gray-500 text-sm rounded px-3 py-2 pr-8 border border-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
        />
        <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
      </div>

      {/* Filter dropdowns */}
      {filterOptions.map((filter) => (
        <div key={filter.label} className="relative">
          <select
            className="appearance-none bg-[#1f2937] text-gray-300 text-sm rounded px-3 py-2 pr-7 border border-gray-700 focus:outline-none focus:border-blue-500 cursor-pointer transition-colors"
            defaultValue={filter.options[0]}
          >
            {filter.options.map((opt) => (
              <option key={opt} value={opt} className="bg-[#1f2937]">
                {opt}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
          <span className="absolute left-3 -top-1.5 text-[10px] text-gray-500 bg-[#111827] px-0.5">
            {filter.label}
          </span>
        </div>
      ))}
    </div>
  );
}
