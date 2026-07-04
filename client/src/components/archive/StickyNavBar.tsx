import { useState, useEffect } from 'react';
import { Search, ArrowUp } from 'lucide-react';

interface StickyNavBarProps {
  selectedMoods: string[];
  onMoodToggle: (mood: string) => void;
  popularMoods: string[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export function StickyNavBar({ 
  selectedMoods, 
  onMoodToggle, 
  popularMoods, 
  searchTerm, 
  onSearchChange 
}: StickyNavBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky nav after scrolling past the hero section (roughly 100vh)
      setIsVisible(window.scrollY > window.innerHeight * 0.8);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (destination: string) => {
    const element = document.getElementById(destination);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200 transition-all duration-300">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Quick navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => scrollToSection('north-coast')}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
            >
              North Coast
            </button>
            <button
              onClick={() => scrollToSection('siwa-oasis')}
              className="px-3 py-1 text-sm bg-amber-100 text-amber-700 rounded-full hover:bg-amber-200 transition-colors"
            >
              Siwa Oasis
            </button>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search experiences..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-travel-teal focus:border-transparent"
            />
          </div>

          {/* Mood filters */}
          <div className="hidden lg:flex items-center gap-2">
            {popularMoods.slice(0, 4).map((mood) => (
              <button
                key={mood}
                onClick={() => onMoodToggle(mood)}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  selectedMoods.includes(mood)
                    ? 'bg-travel-teal text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {mood}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={scrollToTop}
              className="p-2 bg-travel-teal text-white rounded-full hover:bg-travel-navy transition-colors"
              title="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-travel-teal to-travel-navy text-white text-sm rounded-full hover:from-travel-navy hover:to-travel-teal transition-all duration-300 font-medium">
              Build My Journey
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}