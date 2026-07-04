import { Quote } from 'lucide-react';

interface TestimonialCardProps {
  quote: string;
  author: string;
  location: string;
  rating: number;
}

export function TestimonialCard({ quote, author, location, rating }: TestimonialCardProps) {
  return (
    <div className="col-span-full bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-8 border border-amber-200 shadow-lg my-8">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <Quote className="w-8 h-8 text-amber-500" />
        </div>
        <div className="flex-1">
          <blockquote className="text-lg text-gray-700 font-medium italic mb-4 leading-relaxed">
            "{quote}"
          </blockquote>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">{author}</p>
              <p className="text-sm text-gray-600">{location}</p>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(rating)].map((_, i) => (
                <span key={i} className="text-amber-400 text-lg">★</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}