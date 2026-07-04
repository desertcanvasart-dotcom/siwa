import { useState } from "react";
import { Link } from "wouter";
import { MapPin, Clock, DollarSign, Play } from "lucide-react";

interface Experience {
  id: string;
  title: string;
  destination: string;
  category: string;
  mood: string[];
  price: number;
  img: string;
  video?: string;
  type: string;
  summary: string;
  description: string;
  duration: string;
  bestMonths: string[];
  coords: [number, number];
  slug: string;
}

interface ExperienceCardProps {
  experience: Experience;
  onClick?: (experience: Experience) => void;
  onAddToCart?: (experience: Experience) => void;
  onMapView?: (coords: [number, number]) => void;
}

export default function ExperienceCard({ experience, onClick, onAddToCart, onMapView }: ExperienceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const destinationColor = experience.destination === 'north-coast' 
    ? 'border-t-blue-500' 
    : 'border-t-amber-500';

  const destinationLabel = experience.destination === 'north-coast' 
    ? 'North Coast' 
    : 'Siwa Oasis';

  return (
    <div 
      className={`group relative bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border-t-4 ${destinationColor} h-full flex flex-col cursor-pointer hover:scale-[1.02]`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsVideoLoaded(false);
      }}
      onClick={() => onClick?.(experience)}
    >
      {/* Media Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
        {experience.type === 'video' && experience.video ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onLoadedData={() => setIsVideoLoaded(true)}
          >
            <source src={experience.video} type="video/mp4" />
          </video>
        ) : (
          <img
            src={experience.img}
            alt={experience.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            decoding="async"
          />
        )}

        {/* Destination Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            experience.destination === 'north-coast' 
              ? 'bg-blue-500 text-white' 
              : 'bg-amber-500 text-white'
          }`}>
            {destinationLabel}
          </span>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 text-xs font-medium bg-white/90 text-gray-800 rounded-full">
            {experience.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <h3 className="text-xl font-serif font-bold text-gray-900 mb-2 group-hover:text-travel-teal transition-colors">
          {experience.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {experience.summary}
        </p>

        {/* Mood Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {(experience.mood || []).slice(0, 3).map((mood, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
            >
              {mood}
            </span>
          ))}
        </div>

        {/* Details */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{experience.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            <span>${experience.price}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {experience.destination === 'north-coast' ? (
            <button
              onClick={() => onClick?.(experience)}
              className="flex-1 bg-travel-teal hover:bg-travel-navy text-white text-center py-2 px-4 rounded-lg transition-colors font-medium"
            >
              View Details
            </button>
          ) : (
            <Link 
              href={`/experience/${experience.slug}`}
              className="flex-1 bg-travel-teal hover:bg-travel-navy text-white text-center py-2 px-4 rounded-lg transition-colors font-medium"
            >
              View Details
            </Link>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMapView?.(experience.coords);
            }}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title="View on Map"
          >
            <MapPin className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}