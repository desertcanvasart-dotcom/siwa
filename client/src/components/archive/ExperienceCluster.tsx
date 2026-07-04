import { Experience } from "@/types/experience";
import ExperienceCard from "./ExperienceCard";
import { ExperienceHeroCard } from "./ExperienceHeroCard";

interface ExperienceClusterProps {
  destination: 'north-coast' | 'siwa-oasis';
  experiences: Experience[];
  onExperienceClick?: (experience: Experience) => void;
}

export function ExperienceCluster({ destination, experiences, onExperienceClick }: ExperienceClusterProps) {
  const isNorthCoast = destination === 'north-coast';
  const heroExperience = experiences.find(exp => exp.id === (isNorthCoast ? 'north-sunset-yacht' : 'siwa-sunset-sand-surfing'));
  const regularExperiences = experiences.filter(exp => exp.id !== heroExperience?.id);

  const destinationConfig = {
    'north-coast': {
      title: 'North Coast',
      subtitle: 'Mediterranean Luxury & Water Adventures',
      bgGradient: 'from-blue-50 via-cyan-50 to-blue-100',
      borderAccent: 'border-blue-200/50',
      textAccent: 'text-blue-900',
      subtitleColor: 'text-blue-700',
      pattern: 'wave-pattern',
    },
    'siwa-oasis': {
      title: 'Siwa Oasis',
      subtitle: 'Desert Wellness & Ancient Mysteries',
      bgGradient: 'from-amber-50 via-orange-50 to-yellow-100',
      borderAccent: 'border-amber-200/50',
      textAccent: 'text-amber-900',
      subtitleColor: 'text-amber-700',
      pattern: 'sand-pattern',
    }
  };

  const config = destinationConfig[destination];

  return (
    <section className={`relative py-20 bg-gradient-to-br ${config.bgGradient}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        {isNorthCoast ? (
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,50 Q25,30 50,50 T100,50 V100 H0 V50Z" fill="currentColor" className="text-blue-500" />
          </svg>
        ) : (
          <svg className="w-full h-full text-amber-500" viewBox="0 0 200 200">
            <defs>
              <pattern id="sand-dunes" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="currentColor" opacity="0.3" />
                <circle cx="10" cy="30" r="1" fill="currentColor" opacity="0.2" />
                <circle cx="30" cy="10" r="1.5" fill="currentColor" opacity="0.25" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#sand-dunes)" />
          </svg>
        )}
      </div>

      <div className="container mx-auto px-6 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className={`text-5xl font-bold ${config.textAccent} mb-4 font-serif`}>
            {config.title}
          </h2>
          <p className={`text-xl ${config.subtitleColor} max-w-2xl mx-auto`}>
            {config.subtitle}
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Hero Card - Takes 2 columns */}
          {heroExperience && (
            <div className="lg:col-span-2">
              <ExperienceHeroCard 
                experience={heroExperience}
                onClick={() => onExperienceClick?.(heroExperience)}
              />
            </div>
          )}

          {/* Regular Cards - Takes 1 column, stacked */}
          <div className="space-y-6">
            {regularExperiences.slice(0, 2).map((experience) => (
              <div key={experience.id} className="h-[280px]">
                <ExperienceCard 
                  experience={experience}
                  onClick={() => onExperienceClick?.(experience)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Additional Experiences - Proper Grid */}
        {regularExperiences.length > 2 && (
          <div className="mt-16">
            <h3 className={`text-2xl font-semibold ${config.textAccent} mb-8 font-serif`}>
              More {config.title} Experiences
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {regularExperiences.slice(2).map((experience) => (
                <div key={experience.id} className="min-h-[360px]">
                  <ExperienceCard 
                    experience={experience}
                    onClick={() => onExperienceClick?.(experience)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}