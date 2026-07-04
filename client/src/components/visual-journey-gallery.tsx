import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Eye, Heart, Share2, ExternalLink, Star, MapPin, Clock } from 'lucide-react';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  mood: 'dawn' | 'day' | 'sunset' | 'firelight' | 'stars';
  location: string;
  caption: string;
  experience?: {
    title: string;
    price?: string;
    action: string;
  };
  size: 'large' | 'medium' | 'small';
  aspectRatio?: 'portrait' | 'landscape' | 'square';
}

interface VisualJourneyGalleryProps {
  images: GalleryImage[];
  onBookExperience?: (experienceTitle: string) => void;
  hotelName: string;
  hotelDescription: string;
}

const MOOD_CONFIGS = {
  dawn: {
    label: 'Dawn',
    color: 'from-rose-100 to-orange-100',
    textColor: 'text-rose-800',
    description: 'Pink desert light over earth-brick lodges, salt shimmer',
    cta: 'Book sunrise meditation add-on'
  },
  day: {
    label: 'Day',
    color: 'from-yellow-100 to-amber-100',
    textColor: 'text-amber-800',
    description: 'Interiors, pool, organic garden lunch',
    cta: 'Select room type'
  },
  sunset: {
    label: 'Sunset',
    color: 'from-orange-100 to-red-100',
    textColor: 'text-orange-800',
    description: 'Golden cliff glow, lantern-lit paths, yoga deck',
    cta: 'Reserve peak-season dates'
  },
  firelight: {
    label: 'Firelight',
    color: 'from-amber-100 to-yellow-100',
    textColor: 'text-amber-900',
    description: 'Candlelit dinners, clay walls glowing',
    cta: 'Private desert dinner experience'
  },
  stars: {
    label: 'Stars',
    color: 'from-indigo-100 to-purple-100',
    textColor: 'text-indigo-800',
    description: 'Night sky over salt lake, stargazing circle',
    cta: 'Add stargazing pack'
  }
};

export function VisualJourneyGallery({ images, onBookExperience, hotelName, hotelDescription }: VisualJourneyGalleryProps) {
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);
  const [savedImages, setSavedImages] = useState<string[]>([]);
  const [showFullGallery, setShowFullGallery] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);

  const filteredImages = selectedMood === 'all' 
    ? images 
    : images.filter(img => img.mood === selectedMood);

  const handleSaveImage = (imageId: string) => {
    setSavedImages(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const handleShare = (image: GalleryImage) => {
    if (navigator.share) {
      navigator.share({
        title: image.alt,
        text: image.caption,
        url: window.location.href
      });
    }
  };

  const availableMoods = (Object.keys(MOOD_CONFIGS) as (keyof typeof MOOD_CONFIGS)[]).filter(mood => 
    images.some(img => img.mood === mood)
  );





  const ImageCard = ({ image, className = "" }: { image: GalleryImage; className?: string }) => {
    if (!image || !image.src) {
      return null;
    }
    
    return (
      <div 
        className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${className}`}
        onClick={() => setLightboxImage(image)}
      >
        <img
          src={image.src}
          alt={image.alt}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
      
      {/* Mood indicator */}
      <div className="absolute top-3 left-3">
        <span className={`text-xs px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/20`}>
          {image.location}
        </span>
      </div>

      {/* Save button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleSaveImage(image.id);
        }}
        className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 text-white hover:bg-white/30 transition-colors"
      >
        <Heart className={`w-4 h-4 ${savedImages.includes(image.id) ? 'fill-red-500 text-red-500' : ''}`} />
      </button>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <p className="text-sm font-medium mb-1">{image.caption}</p>
          {image.experience && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBookExperience?.(image.experience!.title);
              }}
              className="text-xs bg-travel-teal hover:bg-travel-navy px-3 py-1 rounded-full transition-colors"
            >
              {image.experience.action}
            </button>
          )}
        </div>
      </div>

      {/* Candlelight glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-200/20 via-transparent to-amber-200/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
    );
  };

  const Lightbox = () => {
    if (!lightboxImage) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
        <div className="relative max-w-4xl w-full">
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
          >
            <span className="text-2xl">×</span>
          </button>
          
          <img
            src={lightboxImage.src}
            alt={lightboxImage.alt}
            className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            loading="lazy"
            decoding="async"
          />
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
            <div className="flex items-start justify-between">
              <div className="text-white">
                <h3 className="text-xl font-semibold mb-2">{lightboxImage.alt}</h3>
                <p className="text-gray-300 mb-3">{lightboxImage.caption}</p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {lightboxImage.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {MOOD_CONFIGS[lightboxImage.mood].label}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSaveImage(lightboxImage.id)}
                  className="p-2 text-white hover:text-red-400 transition-colors"
                >
                  <Heart className={`w-5 h-5 ${savedImages.includes(lightboxImage.id) ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
                <button
                  onClick={() => handleShare(lightboxImage)}
                  className="p-2 text-white hover:text-blue-400 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                {lightboxImage.experience && (
                  <button
                    onClick={() => onBookExperience?.(lightboxImage.experience!.title)}
                    className="bg-travel-teal hover:bg-travel-navy px-4 py-2 rounded-lg text-white font-medium transition-colors"
                  >
                    {lightboxImage.experience.action}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-4 md:mx-8 mt-12 mb-8">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-travel-navy mb-4">
          Visual Journey: Life at {hotelName}
        </h2>
        <p className="text-lg text-travel-navy/80 max-w-3xl mx-auto leading-relaxed">
          {hotelDescription}
        </p>
      </div>

      {/* Mood Navigation */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button
          onClick={() => setSelectedMood('all')}
          className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
            selectedMood === 'all' 
              ? 'bg-travel-navy text-white shadow-lg' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {availableMoods.map((mood) => (
          <button
            key={mood}
            onClick={() => setSelectedMood(mood)}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
              selectedMood === mood 
                ? `bg-gradient-to-r ${MOOD_CONFIGS[mood].color} ${MOOD_CONFIGS[mood].textColor} shadow-lg border border-white` 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {MOOD_CONFIGS[mood].label}
          </button>
        ))}
      </div>



      {/* Main Gallery Layout - Following Wireframe */}
      <div ref={galleryRef} className="space-y-6">
        {/* Hero Layout: 2/3 Salt Lake Sunset + 2 Vertical Images */}
        <div className="grid grid-cols-3 gap-4 h-80 md:h-96">
          {/* Hero Image: Salt Lake Sunset (2/3) */}
          <div className="col-span-2 h-full">
            <ImageCard 
              image={filteredImages.find(img => img.mood === 'sunset') || filteredImages[0]} 
              className="w-full h-full" 
            />
          </div>
          
          {/* 2 Vertical Images (1/3) */}
          <div className="col-span-1 h-full flex flex-col gap-4">
            {filteredImages.filter(img => img.size === 'medium').slice(0, 2).map((image, index) => (
              <div key={image.id} className="flex-1 h-full">
                <ImageCard image={image} className="w-full h-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Row of 4 Small Images */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredImages.filter(img => img.size === 'small').slice(0, 4).map((image) => (
            <div key={image.id} className="aspect-square">
              <ImageCard image={image} className="w-full h-full" />
            </div>
          ))}
        </div>

        {/* Wide Scroll Panorama: Candlelit Village at Night */}
        {(() => {
          const candlelitImage = images.find(img => 
            img.mood === 'firelight' && 
            (img.id.includes('candlelight') || img.id.includes('candlelit') || img.caption?.includes('Candlelit'))
          );
          return (
            <div className="relative w-full overflow-hidden rounded-2xl h-48 md:h-64">
              <div className="absolute inset-0">
                <img
                  src={candlelitImage?.src || "/attached_assets/adrerre-amelal_1751755031600.jpg"}
                  alt={candlelitImage?.alt || "Candlelit Village at Night"}
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h3 className="text-2xl md:text-3xl font-bold mb-2">{candlelitImage?.alt || "Candlelit Village at Night"}</h3>
                    <p className="text-lg">{candlelitImage?.caption || "Experience the magic of the desert under starlight"}</p>
                  </div>
                </div>
              </div>
              
              {/* Subtle scroll indicator */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                  <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
                  <span className="text-white text-xs">Scroll to explore</span>
                  <div className="w-1 h-1 bg-white rounded-full animate-pulse delay-500"></div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Saved Images Summary */}
      {savedImages.length > 0 && (
        <div className="mt-8 p-4 bg-travel-sand/20 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-travel-navy">
                {savedImages.length} Favourite{savedImages.length !== 1 ? 's' : ''} Saved
              </h3>
              <p className="text-sm text-travel-navy/70">
                These will be attached to your enquiry form
              </p>
            </div>
            <button
              onClick={() => {
                // Handle sending saved images to enquiry form
                console.log('Saved images:', savedImages);
              }}
              className="bg-travel-teal text-white px-4 py-2 rounded-lg hover:bg-travel-navy transition-colors"
            >
              Add to Enquiry
            </button>
          </div>
        </div>
      )}

      {/* Open Full Gallery Button */}
      <div className="text-center mt-8">
        <button
          onClick={() => setShowFullGallery(true)}
          className="bg-travel-navy text-white px-8 py-3 rounded-full font-semibold hover:bg-travel-teal transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
        >
          Open Full Gallery
        </button>
      </div>

      {/* Lightbox */}
      <Lightbox />

      {/* Full Gallery Modal */}
      {showFullGallery && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 bg-black/50 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white">Full Gallery - {hotelName}</h2>
            <button
              onClick={() => setShowFullGallery(false)}
              className="text-white hover:text-gray-300 transition-colors text-3xl"
            >
              ×
            </button>
          </div>
          
          {/* Gallery Grid */}
          <div className="flex-1 overflow-auto p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
              {images.map((image) => (
                <div 
                  key={image.id} 
                  className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer"
                  onClick={() => {
                    setLightboxImage(image);
                    setShowFullGallery(false);
                  }}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center justify-between text-white text-sm">
                        <span className="bg-black/50 px-2 py-1 rounded-full text-xs">
                          {MOOD_CONFIGS[image.mood].label}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveImage(image.id);
                          }}
                          className="p-1"
                        >
                          <Heart className={`w-4 h-4 ${savedImages.includes(image.id) ? 'fill-red-500 text-red-500' : ''}`} />
                        </button>
                      </div>
                      <p className="text-white text-xs mt-1 line-clamp-2">{image.caption}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Footer */}
          <div className="p-6 bg-black/50 backdrop-blur-sm">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <div className="text-white">
                <p className="text-sm">{images.length} images total</p>
                {savedImages.length > 0 && (
                  <p className="text-xs text-gray-300">{savedImages.length} saved to favourites</p>
                )}
              </div>
              <button
                onClick={() => setShowFullGallery(false)}
                className="bg-travel-teal hover:bg-travel-navy px-6 py-2 rounded-lg text-white font-medium transition-colors"
              >
                Close Gallery
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}