import { useState } from "react";
import { MapPin, X } from "lucide-react";
import { Experience } from "@/types/experience";

interface FloatingMapToggleProps {
  experiences: Experience[];
  onExperienceSelect?: (experience: Experience) => void;
}

export function FloatingMapToggle({ experiences, onExperienceSelect }: FloatingMapToggleProps) {
  const [isOpen, setIsOpen] = useState(false);

  const northCoastExperiences = experiences.filter(exp => exp.destination === 'north-coast');
  const siwaExperiences = experiences.filter(exp => exp.destination === 'siwa-oasis');

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-white/90 backdrop-blur-md text-gray-700 p-4 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 border border-gray-200 hover:bg-white"
      >
        <MapPin className="w-6 h-6" />
      </button>

      {/* Map Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl h-[80vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">Explore by Location</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex h-full">
              {/* Map Area - Simple Visual Representation */}
              <div className="flex-1 bg-gradient-to-br from-blue-100 to-cyan-100 p-8 relative">
                <div className="h-full bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                  {/* North Coast Area */}
                  <div className="absolute top-8 left-8 right-8 h-32 bg-blue-500/20 rounded-lg border-2 border-blue-400/50 flex items-center justify-center">
                    <div className="text-center">
                      <h4 className="font-semibold text-blue-900 mb-1">North Coast</h4>
                      <p className="text-sm text-blue-700">{northCoastExperiences.length} Experiences</p>
                    </div>
                  </div>

                  {/* Siwa Area */}
                  <div className="absolute bottom-8 left-8 right-8 h-32 bg-amber-500/20 rounded-lg border-2 border-amber-400/50 flex items-center justify-center">
                    <div className="text-center">
                      <h4 className="font-semibold text-amber-900 mb-1">Siwa Oasis</h4>
                      <p className="text-sm text-amber-700">{siwaExperiences.length} Experiences</p>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400">
                    <svg width="100" height="60" viewBox="0 0 100 60" fill="currentColor" opacity="0.3">
                      <path d="M10,40 Q30,20 50,40 T90,40" stroke="currentColor" strokeWidth="2" fill="none" />
                      <circle cx="25" cy="35" r="3" />
                      <circle cx="75" cy="35" r="3" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Experience List */}
              <div className="w-80 bg-gray-50 overflow-y-auto">
                {/* North Coast */}
                <div className="p-4 border-b border-gray-200">
                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    North Coast
                  </h4>
                  <div className="space-y-2">
                    {northCoastExperiences.map((exp) => (
                      <button
                        key={exp.id}
                        onClick={() => {
                          onExperienceSelect?.(exp);
                          setIsOpen(false);
                        }}
                        className="w-full text-left p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors border border-gray-200"
                      >
                        <div className="font-medium text-gray-900 text-sm">{exp.title}</div>
                        <div className="text-xs text-gray-500">{exp.category} • ${exp.price}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Siwa Oasis */}
                <div className="p-4">
                  <h4 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    Siwa Oasis
                  </h4>
                  <div className="space-y-2">
                    {siwaExperiences.map((exp) => (
                      <button
                        key={exp.id}
                        onClick={() => {
                          onExperienceSelect?.(exp);
                          setIsOpen(false);
                        }}
                        className="w-full text-left p-3 bg-white rounded-lg hover:bg-amber-50 transition-colors border border-gray-200"
                      >
                        <div className="font-medium text-gray-900 text-sm">{exp.title}</div>
                        <div className="text-xs text-gray-500">{exp.category} • ${exp.price}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}