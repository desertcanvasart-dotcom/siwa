import { useEffect, useRef } from "react";
import ExperienceCard from "./ExperienceCard";

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

interface MasonryGridProps {
  experiences: Experience[];
  onAddToCart: (experience: Experience) => void;
  onMapView: (coords: [number, number]) => void;
  onExperienceClick?: (experience: Experience) => void;
}

export default function MasonryGrid({ experiences, onAddToCart, onMapView, onExperienceClick }: MasonryGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Robust animation with fallback visibility
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll('.experience-card');
      cards.forEach((card, index) => {
        const element = card as HTMLElement;
        // Ensure card is visible first, then add animation
        element.style.opacity = '1';
        element.style.animationDelay = `${index * 0.1}s`;
        element.classList.add('animate-fade-in');
      });
    }
  }, [experiences]);

  // Group experiences by destination
  const northCoastExperiences = experiences.filter(exp => exp.destination === 'north-coast');
  const siwaExperiences = experiences.filter(exp => exp.destination === 'siwa');

  const SectionHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
        {title}
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        {subtitle}
      </p>
    </div>
  );

  const ExperienceGrid = ({ experiences: gridExperiences, startIndex }: { experiences: Experience[]; startIndex: number }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {gridExperiences.map((experience, index) => (
        <div 
          key={experience.id} 
          className="experience-card"
          style={{ opacity: 1, animationFillMode: 'forwards' }}
        >
          <ExperienceCard
            experience={experience}
            onAddToCart={onAddToCart}
            onMapView={onMapView}
            onClick={onExperienceClick}
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-6 py-12">
      <div ref={gridRef}>
        {/* North Coast Section */}
        {northCoastExperiences.length > 0 && (
          <div className="mb-16">
            <SectionHeader 
              title="Egypt's Coastal Escape: The North Coast"
              subtitle="Sandy beaches, sparkling waters, and bespoke adventures by the Mediterranean."
            />
            <ExperienceGrid experiences={northCoastExperiences} startIndex={0} />
          </div>
        )}

        {/* Siwa Section */}
        {siwaExperiences.length > 0 && (
          <div className={northCoastExperiences.length > 0 ? "pt-16 mt-16 border-t border-gray-200" : ""}>
            <SectionHeader 
              title="The Timeless Oasis: Siwa Adventures"
              subtitle="Discover the serenity, culture, and hidden gems of Egypt's western sanctuary."
            />
            <ExperienceGrid experiences={siwaExperiences} startIndex={northCoastExperiences.length} />
          </div>
        )}
      </div>
      
      {experiences.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No experiences match your current filters.</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your search criteria or clearing filters.</p>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fade-in {
            animation: fadeInUp 0.6s ease-out forwards;
          }
        `
      }} />
    </div>
  );
}