import { useState } from "react";
import { Calendar } from "lucide-react";

interface SeasonToggleProps {
  onSeasonChange: (month: string | null) => void;
}

export default function SeasonToggle({ onSeasonChange }: SeasonToggleProps) {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const months = [
    { value: 'Jan', label: 'Jan' },
    { value: 'Feb', label: 'Feb' },
    { value: 'Mar', label: 'Mar' },
    { value: 'Apr', label: 'Apr' },
    { value: 'May', label: 'May' },
    { value: 'Jun', label: 'Jun' },
    { value: 'Jul', label: 'Jul' },
    { value: 'Aug', label: 'Aug' },
    { value: 'Sep', label: 'Sep' },
    { value: 'Oct', label: 'Oct' },
    { value: 'Nov', label: 'Nov' },
    { value: 'Dec', label: 'Dec' }
  ];

  const handleMonthSelect = (month: string) => {
    const newMonth = selectedMonth === month ? null : month;
    setSelectedMonth(newMonth);
    onSeasonChange(newMonth);
  };

  return (
    <div className="bg-white border-b border-gray-200 py-4">
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-4 overflow-x-auto">
          <div className="flex items-center gap-2 text-gray-700 whitespace-nowrap">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">Best Time:</span>
          </div>
          
          <button
            onClick={() => {
              setSelectedMonth(null);
              onSeasonChange(null);
            }}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              selectedMonth === null
                ? 'bg-travel-teal text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Anytime
          </button>

          <div className="flex gap-2">
            {months.map((month) => (
              <button
                key={month.value}
                onClick={() => handleMonthSelect(month.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedMonth === month.value
                    ? 'bg-travel-teal text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {month.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}