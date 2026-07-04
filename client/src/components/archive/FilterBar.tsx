import { useState } from "react";
import { Search, Filter } from "lucide-react";

interface FilterBarProps {
  onFilterChange: (filters: any) => void;
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const [filters, setFilters] = useState({
    destination: 'all',
    category: 'all',
    mood: 'all',
    priceRange: [0, 500],
    search: ''
  });

  const destinations = [
    { value: 'all', label: 'All Destinations' },
    { value: 'north-coast', label: 'North Coast' },
    { value: 'siwa-oasis', label: 'Siwa Oasis' }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Water Sports', label: 'Water Sports' },
    { value: 'Wellness', label: 'Wellness' },
    { value: 'Desert & Dunes', label: 'Desert & Dunes' },
    { value: 'Culture & History', label: 'Culture & History' },
    { value: 'Dining', label: 'Dining' },
    { value: 'Nightlife', label: 'Nightlife' },
    { value: 'Nature', label: 'Nature' }
  ];

  const moods = [
    { value: 'all', label: 'All Moods' },
    { value: 'Luxury', label: 'Luxury' },
    { value: 'Eco', label: 'Eco' },
    { value: 'Relaxation', label: 'Relaxation' },
    { value: 'Adventure', label: 'Adventure' },
    { value: 'Cultural', label: 'Cultural' },
    { value: 'Wellness', label: 'Wellness' }
  ];

  const updateFilter = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="sticky top-20 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search experiences..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-travel-teal focus:border-transparent outline-none"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 items-center">
            
            {/* Destination Filter */}
            <select
              value={filters.destination}
              onChange={(e) => updateFilter('destination', e.target.value)}
              className="px-4 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-travel-teal focus:border-transparent outline-none text-sm"
            >
              {destinations.map(dest => (
                <option key={dest.value} value={dest.value}>{dest.label}</option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) => updateFilter('category', e.target.value)}
              className="px-4 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-travel-teal focus:border-transparent outline-none text-sm"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>

            {/* Mood Filter */}
            <select
              value={filters.mood}
              onChange={(e) => updateFilter('mood', e.target.value)}
              className="px-4 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-travel-teal focus:border-transparent outline-none text-sm"
            >
              {moods.map(mood => (
                <option key={mood.value} value={mood.value}>{mood.label}</option>
              ))}
            </select>

            {/* Clear Filters */}
            <button
              onClick={() => {
                const resetFilters = {
                  destination: 'all',
                  category: 'all', 
                  mood: 'all',
                  priceRange: [0, 500],
                  search: ''
                };
                setFilters(resetFilters);
                onFilterChange(resetFilters);
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-travel-teal transition-colors"
            >
              <Filter className="w-4 h-4" />
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}