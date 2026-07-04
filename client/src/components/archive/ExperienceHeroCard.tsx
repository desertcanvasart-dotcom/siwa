import { Experience } from "@/types/experience";
import { Clock, DollarSign, MapPin } from "lucide-react";

interface ExperienceHeroCardProps {
  experience: Experience;
  onClick?: () => void;
}

export function ExperienceHeroCard({ experience, onClick }: ExperienceHeroCardProps) {
  return (
    <div
      className="group relative h-[60vh] overflow-hidden rounded-3xl cursor-pointer transform transition-all duration-700 hover:scale-[1.02] hover:-translate-y-2"
      onClick={onClick}
    >
      {/* Background Media */}
      <div className="absolute inset-0">
        {experience.type === 'video' && experience.video ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={experience.video} type="video/mp4" />
          </video>
        ) : (
          <img
            src={experience.img}
            alt={experience.title}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Destination Badge */}
      <div className="absolute top-6 right-6">
        <div className={`px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md ${
          experience.destination === 'north-coast' 
            ? 'bg-blue-500/30 text-blue-100 shadow-blue-500/20' 
            : 'bg-amber-500/30 text-amber-100 shadow-amber-500/20'
        } shadow-lg`}>
          {experience.destination === 'north-coast' ? 'North Coast' : 'Siwa Oasis'}
        </div>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-8">
        {/* Mood Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {experience.mood.map((tag: string) => (
            <span
              key={tag}
              className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs text-white border border-white/30"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title & Summary */}
        <h2 className="text-4xl font-bold text-white mb-3 font-serif leading-tight">
          {experience.title}
        </h2>
        <p className="text-lg text-white/90 mb-6 max-w-2xl leading-relaxed">
          {experience.summary}
        </p>

        {/* Details Bar */}
        <div className="flex items-center gap-6 text-white/80">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{experience.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm">${experience.price}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{experience.category}</span>
          </div>
        </div>

        {/* CTA Button */}
        <button className="mt-6 px-8 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white font-medium hover:bg-white/30 transition-all duration-300">
          Explore Experience
        </button>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}