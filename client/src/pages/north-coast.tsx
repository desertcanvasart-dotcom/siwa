import { useEffect, useState } from 'react';
import { Building2, MapPin, Plane, Hotel, Waves, Mountain, Star, Users, Car, Utensils, ChevronLeft, ChevronRight, Anchor, Umbrella, Zap, UtensilsCrossed, Sparkles, Music, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Link } from 'wouter';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { SimpleVideo } from '@/components/simple-video';
import Layout from "@/components/layout/layout";
import { SEO } from "@/components/seo";
import { breadcrumbSchema } from "@/lib/seo-data";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";

// Helper function to get hotel route from name
function getHotelRoute(hotelName: string): string {
  const routeMap: Record<string, string> = {
    "The G Hotel Seashell": "/hotel/the-g-hotel-seashell",
    "Vida Marina Marassi": "/hotel/vida-marina-resort-marassi",
    "Al Alamein Hotel": "/hotel/al-alamein-hotel", 
    "Rixos Premium Alamein": "/hotel/rixos-premium-alamein",
    "Address Beach Resort": "/hotel/address-beach-resort-marassi",
    "Casa Cook North Coast": "/hotel/casa-cook-north-coast",
    "JAZ Almaza Beach Resort": "/hotel/jaz-almaza-beach-resort",
    "Address Golf Resort": "/hotel/address-marassi-golf-resort"
  };
  
  return routeMap[hotelName] || "#";
}

// Sticky Navigation Component
function StickyNav() {
  const [activeSection, setActiveSection] = useState('hero');

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    const sections = ['hero', 'resorts', 'experiences', 'offers', 'plan'];
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const navItems = [
    { id: 'resorts', label: 'Resorts' },
    { id: 'experiences', label: 'Experiences' },
    { id: 'offers', label: 'Offers' },
    { id: 'plan', label: 'Plan Trip' }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-xl font-serif font-bold text-solei-navy">North Coast</h1>
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-sm font-medium transition-colors duration-200 ${
                  activeSection === item.id
                    ? 'text-coastal border-b-2 border-coastal'
                    : 'text-gray-600 hover:text-coastal'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

// Hero Section Component
function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden">
      <SimpleVideo
        src="/attached_assets/northcoast_1751038997736.mp4"
        fallbackImage="/attached_assets/Hotel-Beach.jpeg (1)_1751327157755.webp"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <h1 className="font-serif text-4xl md:text-6xl mb-4 animate-fadeInUp" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
          North Coast, Egypt — Where Summer Lives
        </h1>
        <p className="text-lg md:text-2xl mb-8 max-w-3xl animate-fadeInUp animation-delay-300" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>
          Sand-soft mornings, marina nights, endless Mediterranean blue.
        </p>
        <button 
          onClick={() => scrollToSection('plan')}
          className="bg-solei-coral text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-red-500 transition-all duration-300 transform hover:scale-105 animate-fadeInUp animation-delay-600"
        >
          Plan Your Escape
        </button>
      </div>
    </section>
  );
}

// Resorts Carousel Component
function ResortsCarousel() {
  const [selectedResort, setSelectedResort] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Fetch hotels from API
  const { data: hotelsData = [] } = useQuery<any[]>({
    queryKey: ['/api/hotels', 'north-coast'],
    queryFn: async () => {
      const res = await fetch('/api/hotels?destination=north-coast');
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    }
  });

  // Map API data to match expected format
  const resortsData = (Array.isArray(hotelsData) ? hotelsData : []).map((hotel: any) => ({
    name: hotel.name,
    img: hotel.imageUrl,
    blurb: hotel.blurb,
    category: hotel.category,
    description: hotel.description,
    amenities: hotel.amenities,
    coords: hotel.latitude && hotel.longitude ? [parseFloat(hotel.latitude), parseFloat(hotel.longitude)] : [0, 0]
  }));

  const categories = [
    { id: 'all', label: 'All Resorts', icon: Building2 },
    { id: 'flagship', label: 'Flagship Escapes', icon: Star },
    { id: 'boutique', label: 'Boutique Hideaways', icon: Mountain },
    { id: 'marassi', label: 'Marassi Lifestyle', icon: Waves },
    { id: 'new-icons', label: 'New Icons', icon: Plane }
  ];

  const filteredResorts = activeCategory === 'all' 
    ? resortsData 
    : resortsData.filter(resort => resort.category === activeCategory);

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === activeCategory) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveCategory(categoryId);
      setIsTransitioning(false);
    }, 200);
  };

  const scrollContainer = (direction: 'left' | 'right') => {
    const container = document.getElementById(`resorts-scroll-${activeCategory}`);
    if (container) {
      const containerWidth = container.clientWidth;
      const cardWidth = 320; // w-80 = 320px
      const gap = 24; // gap-6 = 24px
      
      // Calculate how many complete cards can fit in viewport
      let cardsPerView = Math.floor(containerWidth / (cardWidth + gap));
      
      // Ensure at least 1 card and maximum based on screen size
      if (containerWidth >= 1024) {
        cardsPerView = Math.min(cardsPerView, 3); // Max 3 cards on desktop
      } else if (containerWidth >= 768) {
        cardsPerView = Math.min(cardsPerView, 2); // Max 2 cards on tablet
      } else {
        cardsPerView = 1; // 1 card on mobile
      }
      
      // Calculate scroll amount to show exactly cardsPerView cards
      const scrollAmount = cardsPerView * (cardWidth + gap);
      
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Enhanced touch/swipe handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const container = document.getElementById(`resorts-scroll-${activeCategory}`);
    if (container) {
      setIsDragging(true);
      setStartX(e.pageX - container.offsetLeft);
      setScrollLeft(container.scrollLeft);
      container.style.cursor = 'grabbing';
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const container = document.getElementById(`resorts-scroll-${activeCategory}`);
    if (container) {
      setIsDragging(true);
      setStartX(e.touches[0].pageX - container.offsetLeft);
      setScrollLeft(container.scrollLeft);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const container = document.getElementById(`resorts-scroll-${activeCategory}`);
    if (container) {
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2; // Scroll speed multiplier
      container.scrollLeft = scrollLeft - walk;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const container = document.getElementById(`resorts-scroll-${activeCategory}`);
    if (container) {
      const x = e.touches[0].pageX - container.offsetLeft;
      const walk = (x - startX) * 2; // Scroll speed multiplier
      container.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    const container = document.getElementById(`resorts-scroll-${activeCategory}`);
    if (container) {
      container.style.cursor = 'grab';
    }
    setIsDragging(false);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <section id="resorts" className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <h2 className="text-center font-serif text-3xl md:text-4xl text-solei-navy mb-4">
          Featured Resorts & Retreats
        </h2>
        <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
          Whether you're seeking barefoot elegance, modern indulgence, or bohemian serenity, the North Coast's diverse stays offer something extraordinary for every kind of traveller.
        </p>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 animate-fadeInUp ${
                  activeCategory === category.id
                    ? 'bg-coastal text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-coastal/30'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <IconComponent className="w-4 h-4" />
                {category.label}
              </button>
            );
          })}
        </div>
        
        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={() => scrollContainer('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-solei-navy p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
            style={{ marginLeft: '-20px' }}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={() => scrollContainer('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-solei-navy p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
            style={{ marginRight: '-20px' }}
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Scrollable Resort Cards */}
          <div 
            id={`resorts-scroll-${activeCategory}`}
            className={`flex gap-6 overflow-x-auto scroll-smooth pb-4 cursor-grab active:cursor-grabbing select-none ${isTransitioning ? 'opacity-50' : 'opacity-100'} ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} transition-opacity duration-300`}
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              scrollBehavior: isDragging ? 'auto' : 'smooth',
              scrollSnapType: 'x mandatory',
              scrollPadding: '0 24px'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <style dangerouslySetInnerHTML={{
              __html: `
                #resorts-scroll-${activeCategory}::-webkit-scrollbar {
                  display: none;
                }
              `
            }} />
            
            {filteredResorts.map((resort, index) => (
              <div 
                key={resort.name} 
                className="flex-none w-80 group relative rounded-xl overflow-hidden shadow-lg bg-white transform transition-all duration-500 hover:scale-105 hover:shadow-xl"
                style={{ scrollSnapAlign: 'start' }}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={resort.img}
                    alt={resort.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="flex gap-2">
                      <Link 
                        href={getHotelRoute(resort.name)}
                        className="flex items-center gap-2 bg-solei-coral text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-500 transition-all duration-200 hover:scale-105 flex-1"
                        data-testid={`link-hotel-${resort.name.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <Hotel className="w-4 h-4" />
                        View Hotel →
                      </Link>
                      <button
                        onClick={() => setSelectedResort(resort)}
                        className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-all duration-200"
                        data-testid={`button-details-${resort.name.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        Details
                      </button>
                    </div>
                  </div>
                  
                  {/* Category Badge with Icon */}
                  <div className="absolute top-4 right-4">
                    <span className="flex items-center gap-1 bg-white/90 text-solei-navy px-3 py-1 rounded-full text-xs font-medium capitalize">
                      {resort.category === 'flagship' && <Star className="w-3 h-3" />}
                      {resort.category === 'boutique' && <Mountain className="w-3 h-3" />}
                      {resort.category === 'marassi' && <Waves className="w-3 h-3" />}
                      {resort.category === 'new-icons' && <Plane className="w-3 h-3" />}
                      {resort.category.replace('-', ' ')}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-solei-teal mt-1 flex-shrink-0" />
                    <h3 className="text-lg font-serif font-bold text-solei-navy line-clamp-1">{resort.name}</h3>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm line-clamp-2">{resort.blurb}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {resort.amenities?.slice(0, 2).map((amenity) => (
                      <span key={amenity} className="flex items-center gap-1 bg-solei-teal/10 text-solei-teal px-3 py-1 rounded-full text-xs font-medium">
                        {amenity.includes('Pool') && <Waves className="w-3 h-3" />}
                        {amenity.includes('Dining') && <Utensils className="w-3 h-3" />}
                        {amenity.includes('Family') && <Users className="w-3 h-3" />}
                        {amenity.includes('Golf') && <Car className="w-3 h-3" />}
                        {amenity}
                      </span>
                    ))}
                    {resort.amenities && resort.amenities.length > 2 && (
                      <span className="text-gray-400 text-xs px-2 py-1">
                        +{resort.amenities.length - 2} more
                      </span>
                    )}
                  </div>
                  <Link
                    href={getHotelRoute(resort.name)}
                    className="inline-flex items-center gap-2 text-solei-coral font-medium text-sm hover:text-coastal transition-colors duration-200"
                    data-testid={`link-main-${resort.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    View Details & Book
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resort Count */}
        <div className="text-center mt-8">
          <p className={`text-gray-500 text-sm transition-all duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
            <span className="inline-flex items-center gap-1">
              <Building2 className="w-4 h-4" />
              Showing {filteredResorts.length} {activeCategory === 'all' ? 'resort' + (filteredResorts.length !== 1 ? 's' : '') : categories.find(c => c.id === activeCategory)?.label.toLowerCase()}
            </span>
          </p>
        </div>
      </div>

      {/* Resort Detail Modal */}
      {selectedResort && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50" onClick={() => setSelectedResort(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Mobile-friendly header with close button */}
            <div className="sticky top-0 z-10 bg-white rounded-t-xl border-b border-gray-200 px-4 py-3 flex items-center justify-between sm:hidden">
              <h2 className="text-lg font-serif font-bold text-solei-navy">Resort Details</h2>
              <button 
                onClick={() => setSelectedResort(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 w-8 h-8 rounded-full flex items-center justify-center"
              >
                ×
              </button>
            </div>
            
            <div className="relative">
              <img src={selectedResort.img} alt={selectedResort.name} className="w-full h-48 sm:h-64 object-cover" loading="lazy" decoding="async" />
              
              {/* Desktop close button */}
              <button 
                onClick={() => setSelectedResort(null)}
                className="hidden sm:flex absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-800 w-8 h-8 rounded-full items-center justify-center"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-serif font-bold text-solei-navy mb-2">{selectedResort.name}</h3>
              <p className="text-gray-600 mb-4">{selectedResort.description}</p>
              <div className="mb-6">
                <h4 className="font-semibold text-solei-navy mb-2">Amenities</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedResort.amenities?.map((amenity: string) => (
                    <span key={amenity} className="bg-solei-teal/10 text-solei-teal px-3 py-1 rounded-full text-sm">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
              <button className="w-full bg-solei-teal text-white py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors duration-200">
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// Helper function to get icon for experience category
function getExperienceIcon(category: string) {
  switch (category) {
    case 'water-sports':
      return Anchor;
    case 'relaxation':
      return Umbrella;
    case 'adventure':
      return Zap;
    case 'dining':
      return UtensilsCrossed;
    case 'wellness':
      return Sparkles;
    case 'nightlife':
      return Music;
    default:
      return Star;
  }
}

// Experience Booking Modal Component
function ExperienceBookingModal({ experience, isOpen, onClose }: { experience: any, isOpen: boolean, onClose: () => void }) {
  const [bookingStep, setBookingStep] = useState(1);
  
  // Extract numeric price from string format like "$200 per person"
  const getNumericPrice = (priceString: string) => {
    if (!priceString) return 0;
    const match = priceString.match(/\$(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const basePrice = getNumericPrice(experience?.price || '');

  const [bookingData, setBookingData] = useState({
    date: '',
    guests: '2',
    time: '',
    name: '',
    email: '',
    phone: '',
    specialRequests: '',
    totalPrice: basePrice * 2
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBookingData(prev => {
      const updated = { ...prev, [name]: value };
      
      // Update price based on guests
      if (name === 'guests') {
        const guestCount = parseInt(value);
        updated.totalPrice = basePrice * guestCount;
      }
      
      return updated;
    });
  };

  const handleNextStep = () => {
    if (bookingStep < 3) setBookingStep(bookingStep + 1);
  };

  const handlePrevStep = () => {
    if (bookingStep > 1) setBookingStep(bookingStep - 1);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Booking submitted:', bookingData);
    // Handle booking submission here
    alert('Booking submitted successfully! We will contact you within 24 hours to confirm your experience.');
    onClose();
    setBookingStep(1);
  };

  const resetBooking = () => {
    setBookingStep(1);
    setBookingData({
      date: '',
      guests: '2',
      time: '',
      name: '',
      email: '',
      phone: '',
      specialRequests: '',
      totalPrice: basePrice * 2
    });
  };

  if (!isOpen || !experience) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Mobile-friendly header with close button */}
        <div className="sticky top-0 z-10 bg-white rounded-t-xl border-b border-gray-200 px-4 py-3 flex items-center justify-between sm:hidden">
          <h2 className="text-lg font-serif font-bold text-solei-navy">Book Experience</h2>
          <button 
            onClick={() => { onClose(); resetBooking(); }}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 w-8 h-8 rounded-full flex items-center justify-center"
          >
            ×
          </button>
        </div>
        
        <div className="relative">
          {experience.type === 'video' ? (
            <SimpleVideo
              src={experience.img}
              fallbackImage="/attached_assets/Hotel-Beach.jpeg (1)_1751327157755.webp"
              className="w-full h-32 sm:h-48 object-cover"
            />
          ) : (
            <img src={experience.img} alt={experience.name} className="w-full h-32 sm:h-48 object-cover" loading="lazy" decoding="async" />
          )}
          
          {/* Desktop close button */}
          <button 
            onClick={() => { onClose(); resetBooking(); }}
            className="hidden sm:flex absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-800 w-8 h-8 rounded-full items-center justify-center"
          >
            ×
          </button>
          
          {/* Progress Indicator */}
          <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4">
            <div className="flex items-center gap-2 bg-white/90 rounded-full px-3 sm:px-4 py-2">
              <span className={`w-2 h-2 rounded-full ${bookingStep >= 1 ? 'bg-solei-teal' : 'bg-gray-300'}`} />
              <span className={`w-2 h-2 rounded-full ${bookingStep >= 2 ? 'bg-solei-teal' : 'bg-gray-300'}`} />
              <span className={`w-2 h-2 rounded-full ${bookingStep >= 3 ? 'bg-solei-teal' : 'bg-gray-300'}`} />
              <span className="text-xs sm:text-sm font-medium text-gray-700 ml-2">
                Step {bookingStep} of 3
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Experience Details & Date Selection */}
          {bookingStep === 1 && (
            <div>
              <div className="flex items-start gap-3 mb-6">
                {(() => {
                  const IconComponent = getExperienceIcon(experience.category);
                  return <IconComponent className="w-6 h-6 text-solei-teal mt-1 flex-shrink-0" />;
                })()}
                <div className="flex-1">
                  <h3 className="text-2xl font-serif font-bold text-solei-navy mb-2">{experience.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span>Duration: {experience.duration}</span>
                    <span>•</span>
                    <span className="font-semibold text-solei-coral">${basePrice} per person</span>
                  </div>
                  <p className="text-gray-600 mb-4">{experience.description}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience Date *</label>
                    <input 
                      type="date" 
                      name="date"
                      value={bookingData.date}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-solei-teal focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests *</label>
                    <select 
                      name="guests"
                      value={bookingData.guests}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-solei-teal focus:border-transparent"
                      required
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                      <option value="5">5 Guests</option>
                      <option value="6">6 Guests</option>
                      <option value="7">7 Guests</option>
                      <option value="8">8 Guests</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
                  <select 
                    name="time"
                    value={bookingData.time}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-solei-teal focus:border-transparent"
                  >
                    <option value="">Select preferred time</option>
                    <option value="morning">Morning (8:00 AM - 12:00 PM)</option>
                    <option value="afternoon">Afternoon (12:00 PM - 5:00 PM)</option>
                    <option value="evening">Evening (5:00 PM - 8:00 PM)</option>
                    {experience.category === 'water-sports' && <option value="sunset">Sunset (6:00 PM - 8:00 PM)</option>}
                  </select>
                </div>

                <div className="bg-solei-navy/5 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Total Price:</span>
                    <span className="text-2xl font-bold text-solei-coral">${bookingData.totalPrice}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {bookingData.guests} guest{parseInt(bookingData.guests) > 1 ? 's' : ''} × ${basePrice}
                  </p>
                </div>

                <button 
                  onClick={handleNextStep}
                  disabled={!bookingData.date || !bookingData.guests}
                  className="w-full bg-solei-teal text-white py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Continue to Contact Details
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Contact Information */}
          {bookingStep === 2 && (
            <div>
              <h3 className="text-xl font-serif font-bold text-solei-navy mb-6">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input 
                      type="text" 
                      name="name"
                      value={bookingData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-solei-teal focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input 
                      type="email" 
                      name="email"
                      value={bookingData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-solei-teal focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={bookingData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-solei-teal focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests or Notes</label>
                  <textarea 
                    rows={3} 
                    name="specialRequests"
                    value={bookingData.specialRequests}
                    onChange={handleInputChange}
                    placeholder="Any dietary restrictions, accessibility needs, or special celebrations?"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-solei-teal focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={handlePrevStep}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleNextStep}
                    disabled={!bookingData.name || !bookingData.email || !bookingData.phone}
                    className="flex-1 bg-solei-teal text-white py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Review Booking
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Booking Confirmation */}
          {bookingStep === 3 && (
            <div>
              <h3 className="text-xl font-serif font-bold text-solei-navy mb-6">Confirm Your Booking</h3>
              
              <div className="space-y-6">
                {/* Experience Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Experience Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Experience:</span>
                      <span className="font-medium">{experience.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{new Date(bookingData.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Guests:</span>
                      <span className="font-medium">{bookingData.guests} person{parseInt(bookingData.guests) > 1 ? 's' : ''}</span>
                    </div>
                    {bookingData.time && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium capitalize">{bookingData.time.replace('-', ' ')}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>Total:</span>
                      <span className="text-solei-coral">${bookingData.totalPrice}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Contact Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-600">Name:</span> {bookingData.name}</p>
                    <p><span className="text-gray-600">Email:</span> {bookingData.email}</p>
                    <p><span className="text-gray-600">Phone:</span> {bookingData.phone}</p>
                    {bookingData.specialRequests && (
                      <p><span className="text-gray-600">Special Requests:</span> {bookingData.specialRequests}</p>
                    )}
                  </div>
                </div>

                <div className="bg-solei-navy/5 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    <strong>Please note:</strong> This is a booking request. Our team will contact you within 24 hours to confirm availability and arrange payment. No charges will be made at this time.
                  </p>
                </div>

                <form onSubmit={handleBookingSubmit}>
                  <div className="flex gap-3">
                    <button 
                      type="button"
                      onClick={handlePrevStep}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
                    >
                      Back
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 bg-solei-coral text-white py-3 rounded-lg font-semibold hover:bg-red-500 transition-colors duration-200"
                    >
                      Submit Booking Request
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Experiences Grid Component
function ExperiencesGrid() {
  const [selectedExperience, setSelectedExperience] = useState<any>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingExperience, setBookingExperience] = useState<any>(null);

  // Fetch experiences from API and filter for North Coast
  const { data: experiencesData = [] } = useQuery({
    queryKey: ['/api/experiences'],
    select: (data) => {
      if (!data || !Array.isArray(data)) return [];
      
      return data.filter((exp: any) => {
        const title = (exp.title || '').toLowerCase();
        const summary = (exp.summary || '').toLowerCase();
        const description = (exp.description || '').toLowerCase();
        const category = exp.category || '';
        
        // Exclude Siwa-specific experiences first
        const isSiwaExperience = title.includes('sand-surfing') ||
                                title.includes('sand surfing') ||
                                title.includes('sunset sand') ||
                                category === 'Desert & Dunes' ||
                                category === 'Salt Lakes' ||
                                category === 'Culture & History' ||
                                category === 'Wellbeing' ||
                                title.includes('stargazing') ||
                                title.includes('oracle') ||
                                title.includes('cleopatra') ||
                                summary.includes('dunes') ||
                                summary.includes('desert') ||
                                description.includes('dunes') ||
                                description.includes('sand sea');
        
        if (isSiwaExperience) return false;
        
        // Filter for North Coast experiences
        return category === 'Water Sports' || 
               category === 'Beach Club' ||
               category === 'Nightlife' ||
               title.includes('yacht') ||
               title.includes('beach') ||
               title.includes('coastal') ||
               title.includes('marina') ||
               title.includes('spa') ||
               summary.includes('sea-inspired') ||
               summary.includes('marina') ||
               summary.includes('luxury marina') ||
               description.includes('marina') ||
               description.includes('sea') ||
               description.includes('coastal');
      }).map((exp: any) => ({
        id: exp.id?.toString() || Math.random().toString(),
        name: exp.title || '',
        title: exp.title || '',
        category: exp.category || 'Other',
        price: typeof exp.pricePerPerson === 'string' 
          ? parseInt(exp.pricePerPerson) || 0
          : exp.pricePerPerson || 0,
        img: exp.imageUrl || exp.videoUrl || '',
        video: exp.videoUrl,
        type: exp.mediaType || 'image',
        summary: exp.summary || '',
        description: exp.description || '',
        duration: exp.duration || '',
        slug: exp.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || ''
      }));
    }
  });

  const handleBookNow = (experience: any) => {
    setBookingExperience(experience);
    setShowBookingModal(true);
    setSelectedExperience(null); // Close the details modal
  };

  return (
    <section id="experiences" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <h2 className="text-center font-serif text-3xl md:text-4xl text-solei-navy mb-4">
          Curated Experiences
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          From sunrise yacht charters to sunset beach dining, discover extraordinary moments along the Mediterranean coast.
        </p>

        {/* Experience Cards Grid */}
        {experiencesData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {(Array.isArray(experiencesData) ? experiencesData : []).map((experience: any, index: number) => (
              <div 
                key={experience.id} 
                className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                onClick={() => setSelectedExperience(experience)}
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  opacity: 0,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {experience.type === 'video' && experience.video ? (
                    <SimpleVideo
                      src={experience.video}
                      fallbackImage={experience.img}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <img
                      src={experience.img}
                      alt={experience.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 text-xs font-medium bg-white/90 text-gray-800 rounded-full">
                      {experience.category}
                    </span>
                  </div>

                  {/* Price Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 text-xs font-medium bg-solei-coral text-white rounded-full">
                      ${experience.price}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-serif font-bold text-solei-navy mb-2 group-hover:text-coastal transition-colors">
                    {experience.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {experience.summary}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{experience.duration}</span>
                    </div>
                    <span className="text-solei-coral font-medium">${experience.price} per person</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No experiences available at the moment.</p>
            <p className="text-gray-400 text-sm mt-2">Check back soon for new North Coast adventures.</p>
          </div>
        )}
      </div>

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
          
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `
      }} />

      {/* Experience Detail Modal */}
      {selectedExperience && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50" onClick={() => setSelectedExperience(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Mobile-friendly header with close button */}
            <div className="sticky top-0 z-10 bg-white rounded-t-xl border-b border-gray-200 px-4 py-3 flex items-center justify-between sm:hidden">
              <h2 className="text-lg font-serif font-bold text-solei-navy">Experience Details</h2>
              <button 
                onClick={() => setSelectedExperience(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 w-8 h-8 rounded-full flex items-center justify-center"
              >
                ×
              </button>
            </div>
            
            <div className="relative">
              {selectedExperience.type === 'video' ? (
                <SimpleVideo
                  src={selectedExperience.img}
                  fallbackImage="/attached_assets/Hotel-Beach.jpeg (1)_1751327157755.webp"
                  className="w-full h-48 sm:h-64 object-cover"
                />
              ) : (
                <img src={selectedExperience.img} alt={selectedExperience.name} className="w-full h-48 sm:h-64 object-cover" loading="lazy" decoding="async" />
              )}
              
              {/* Desktop close button */}
              <button 
                onClick={() => setSelectedExperience(null)}
                className="hidden sm:flex absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-800 w-8 h-8 rounded-full items-center justify-center"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-3 mb-4">
                {(() => {
                  const IconComponent = getExperienceIcon(selectedExperience.category);
                  return <IconComponent className="w-6 h-6 text-solei-teal mt-1 flex-shrink-0" />;
                })()}
                <div className="flex-1">
                  <h3 className="text-2xl font-serif font-bold text-solei-navy mb-2">{selectedExperience.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 bg-solei-teal/10 text-solei-teal px-3 py-1 rounded-full text-sm font-medium capitalize">
                      {(() => {
                        const IconComponent = getExperienceIcon(selectedExperience.category);
                        return <IconComponent className="w-3 h-3" />;
                      })()}
                      {selectedExperience.category.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                <span>Duration: {selectedExperience.duration}</span>
                <span>•</span>
                <span className="font-semibold text-solei-coral">${selectedExperience.price} per person</span>
              </div>
              <p className="text-gray-600 mb-6">{selectedExperience.description}</p>
              <button 
                onClick={() => handleBookNow(selectedExperience)}
                className="w-full flex items-center justify-center gap-2 bg-solei-coral text-white py-3 rounded-lg font-semibold hover:bg-red-500 transition-colors duration-200"
              >
                <Star className="w-4 h-4" />
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      <ExperienceBookingModal 
        experience={bookingExperience} 
        isOpen={showBookingModal} 
        onClose={() => {
          setShowBookingModal(false);
          setBookingExperience(null);
        }} 
      />
    </section>
  );
}

// Offers CTA Component
function OffersCTA() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="offers" className="relative bg-solei-navy text-white py-20 px-6 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
          <path d="M0,10 Q25,5 50,10 T100,10 V20 H0 Z" fill="currentColor" className="animate-pulse">
            <animate attributeName="d" dur="10s" repeatCount="indefinite" 
              values="M0,10 Q25,5 50,10 T100,10 V20 H0 Z;M0,10 Q25,15 50,10 T100,10 V20 H0 Z;M0,10 Q25,5 50,10 T100,10 V20 H0 Z"/>
          </path>
        </svg>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className="font-serif text-3xl md:text-4xl mb-6">
          Exclusive North Coast Offers
        </h2>
        <p className="text-xl mb-12 text-white/90">
          Unlock special packages and early bird discounts for your Mediterranean escape.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-3">Early Bird Special</h3>
            <p className="text-white/80 mb-4">Book 60 days in advance and save up to 25% on resort packages</p>
            <span className="text-gold font-bold">Valid until March 2025</span>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-3">Summer Bundle</h3>
            <p className="text-white/80 mb-4">Combine 3+ experiences and get the 4th one free</p>
            <span className="text-gold font-bold">Limited Time</span>
          </div>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-solei-gold text-solei-navy px-8 py-3 rounded-full font-semibold text-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105"
        >
          Get Exclusive Offers
        </button>
      </div>

      {/* Email Capture Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            {/* Mobile-friendly header with close button */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2 sm:hidden">
              <h3 className="text-lg font-serif font-bold text-solei-navy">Stay Updated</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 w-8 h-8 rounded-full flex items-center justify-center"
              >
                ×
              </button>
            </div>
            
            <div className="p-4 sm:p-6">
              {/* Desktop header */}
              <div className="hidden sm:flex items-center justify-between mb-4">
                <h3 className="text-2xl font-serif font-bold text-solei-navy">Stay Updated</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <p className="text-gray-600 mb-6">Get exclusive offers and updates delivered to your inbox.</p>
              <form className="space-y-4">
                <input 
                  type="email" 
                  placeholder="Your email address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-solei-teal focus:border-transparent text-gray-900 placeholder:text-gray-500"
                  data-testid="email-subscription-input"
                />
                <button 
                  type="submit"
                  className="w-full bg-solei-teal text-white py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors duration-200"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// Plan Trip Component
function PlanTrip() {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    guests: '2',
    interests: [],
    budget: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted! Button is working.'); // Debug log
    console.log('Current form data:', formData);
    console.log('Selected date:', date);
    
    // Validate required fields
    if (!formData.name || !formData.email || !date) {
      console.log('Validation failed - missing fields'); // Debug log
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields including travel dates.",
        variant: "destructive"
      });
      return;
    }

    // Prepare submission data
    const submissionData = {
      ...formData,
      travelDate: format(date, 'PPP'),
      submittedAt: new Date().toISOString()
    };

    // Handle form submission - for now we'll show a success message
    console.log('Custom Itinerary Request:', submissionData);
    
    toast({
      title: "Request Submitted Successfully!",
      description: "Our travel experts will contact you within 24 hours with a personalized proposal.",
      variant: "default"
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      guests: '2',
      interests: [],
      budget: '',
      message: ''
    });
    setDate(undefined);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="plan" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl text-solei-navy mb-4">
            Plan Your Perfect Trip
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Let our travel experts create a personalized North Coast experience just for you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-solei-teal focus:border-transparent" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-solei-teal focus:border-transparent" 
                    required
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Travel Dates</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal px-4 py-3 h-auto border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-solei-teal focus:border-transparent hover:bg-gray-50"
                        data-testid="date-picker-trigger"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                        {date ? format(date, "PPP") : <span className="text-gray-500">Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        data-testid="date-picker-calendar"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
                  <select 
                    name="guests"
                    value={formData.guests}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-solei-teal focus:border-transparent"
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5+">5+ Guests</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                <select 
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-solei-teal focus:border-transparent"
                >
                  <option value="">Select budget range</option>
                  <option value="1000-2500">$1,000 - $2,500</option>
                  <option value="2500-5000">$2,500 - $5,000</option>
                  <option value="5000-10000">$5,000 - $10,000</option>
                  <option value="10000+">$10,000+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tell us about your dream trip</label>
                <textarea 
                  rows={4} 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="What experiences are you most excited about? Any special occasions or requirements?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-solei-teal focus:border-transparent" 
                />
              </div>

              <button 
                type="submit" 
                onClick={(e) => {
                  console.log('Button clicked directly!');
                  handleSubmit(e);
                }}
                className="w-full bg-solei-teal text-white py-4 rounded-lg font-semibold text-lg hover:bg-teal-600 transition-colors duration-200"
                data-testid="button-create-itinerary"
              >
                Create My Custom Itinerary
              </button>
            </form>
          </div>

          {/* Summary */}
          <div className="bg-solei-navy text-white rounded-xl p-8 sticky top-24">
            <h3 className="text-2xl font-serif font-bold mb-6">Your North Coast Adventure</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-solei-gold mb-2">What's Included</h4>
                <ul className="space-y-2 text-white/90">
                  <li>• Personalized itinerary planning</li>
                  <li>• Luxury resort recommendations</li>
                  <li>• Curated experience selection</li>
                  <li>• 24/7 concierge support</li>
                  <li>• Exclusive access to partner venues</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-solei-gold mb-2">Why Choose Soléi</h4>
                <ul className="space-y-2 text-white/90">
                  <li>• Local expertise & insider access</li>
                  <li>• Tailored to your preferences</li>
                  <li>• Best price guarantee</li>
                  <li>• Seamless booking process</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/20">
              <p className="text-sm text-white/80">
                Our travel experts will contact you within 24 hours with a personalized proposal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Main North Coast Page Component
export default function NorthCoast() {
  return (
    <>
      <SEO
        title="North Coast Egypt - Luxury Resorts & Beach Experiences"
        description="Experience Egypt's Mediterranean paradise with world-class resorts, pristine beaches, and vibrant beach clubs. Browse luxury accommodations from Al Alamein to Ras El Hekma."
        path="/north-coast"
        jsonLd={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "North Coast", path: "/north-coast" }])}
      />
      <Layout darkHero={true}>
      <div className="min-h-screen bg-white">
        <Hero />
        <StickyNav />
        <ResortsCarousel />
        <ExperiencesGrid />
        <OffersCTA />
        <PlanTrip />
      </div>
    </Layout>
    </>
  );
}