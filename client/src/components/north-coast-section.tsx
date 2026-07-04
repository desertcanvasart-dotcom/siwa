export function NorthCoastSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 150; // Positive offset scrolls down to show the full form
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition + offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="north-coast" className="relative min-h-screen bg-solei-navy">
      {/* North Coast Hero */}
      <div className="relative h-screen overflow-hidden">
        {/* Aerial view of North Coast beaches with crystal blue waters */}
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{
            backgroundImage: `url('/attached_assets/Hotel-Beach.jpeg (1)_1751327157755.webp')`
          }}
        />
        <div className="absolute inset-0 bg-solei-navy/40"></div>
        
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="max-w-3xl">
              <h2 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                North Coast
              </h2>
              <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.4)' }}>
                Where the Mediterranean meets Egyptian hospitality. Discover pristine beaches, 
                luxury resorts, and the perfect blend of relaxation and adventure.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                  <i className="fas fa-umbrella-beach mr-2"></i>Luxury Resorts
                </span>
                <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                  <i className="fas fa-water mr-2"></i>Crystal Waters
                </span>
                <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                  <i className="fas fa-cocktail mr-2"></i>Beach Clubs
                </span>
              </div>
              <button 
                onClick={() => scrollToSection('contact')}
                className="bg-solei-coral text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-red-500 transition-all duration-300 transform hover:scale-105"
              >
                Plan Your Escape to the Sea
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* North Coast Gallery */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-serif font-bold text-solei-navy mb-6">Where Egypt's Sea Meets Serenity</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the North Coast — pristine beaches, world-class resorts, vibrant culture, and Mediterranean elegance redefined.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-8 mb-16">
            {/* Card 1 - Beachside Campfire Moments */}
            <div className="group relative overflow-hidden rounded-xl aspect-[4/3] cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300" data-testid="card-beachside-campfire">
              <div className="absolute inset-0 transition-transform duration-700 ease-in-out group-hover:-translate-x-full">
                <img 
                  src="/attached_assets/Pristine Beaches_1764585387661.jpg" 
                  alt="Beachside campfire moments with waves" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute bottom-4 left-4 bg-black/30 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium">
                  Warmth by the Waves
                </div>
              </div>
              <div className="absolute inset-0 bg-white translate-x-full transition-transform duration-700 ease-in-out group-hover:translate-x-0 flex flex-col justify-center items-center p-6 text-center">
                <h4 className="text-2xl font-serif font-bold text-solei-navy mb-4">Beachside Campfire Moments</h4>
                <p className="text-gray-700 leading-relaxed">Share sweet treats and laughter beside a crackling fire, with the gentle sound of the sea setting the perfect nighttime mood.</p>
              </div>
            </div>

            {/* Card 2 - Nightlife at the Shore */}
            <div className="group relative overflow-hidden rounded-xl aspect-[4/3] cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300" data-testid="card-nightlife-shore">
              <div className="absolute inset-0 transition-transform duration-700 ease-in-out group-hover:-translate-x-full">
                <img 
                  src="/attached_assets/Golf & Leisure_1764585477736.jpg" 
                  alt="Nightlife at the shore with live DJs" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute bottom-4 left-4 bg-black/30 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium">
                  Rhythms After Dark
                </div>
              </div>
              <div className="absolute inset-0 bg-white translate-x-full transition-transform duration-700 ease-in-out group-hover:translate-x-0 flex flex-col justify-center items-center p-6 text-center">
                <h4 className="text-2xl font-serif font-bold text-solei-navy mb-4">Nightlife at the Shore</h4>
                <p className="text-gray-700 leading-relaxed">Immerse yourself in a vibrant beachside party where live DJs, warm lights, and palm-framed stages create unforgettable nights under the open sky.</p>
              </div>
            </div>

            {/* Card 3 - Spa Tranquility Session */}
            <div className="group relative overflow-hidden rounded-xl aspect-[4/3] cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300" data-testid="card-spa-tranquility">
              <div className="absolute inset-0 transition-transform duration-700 ease-in-out group-hover:-translate-x-full">
                <img 
                  src="/attached_assets/Family-Friendly Escapes_1764585566821.jpg" 
                  alt="Spa tranquility session with massage therapy" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute bottom-4 left-4 bg-black/30 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium">
                  Unwind Your Senses
                </div>
              </div>
              <div className="absolute inset-0 bg-white translate-x-full transition-transform duration-700 ease-in-out group-hover:translate-x-0 flex flex-col justify-center items-center p-6 text-center">
                <h4 className="text-2xl font-serif font-bold text-solei-navy mb-4">Spa Tranquility Session</h4>
                <p className="text-gray-700 leading-relaxed">Experience deep relaxation with expert massage therapy, soothing aromas, and a calming ambiance designed to restore balance and well-being.</p>
              </div>
            </div>

            {/* Card 4 - Marassi Marina Yacht Experience */}
            <div className="group relative overflow-hidden rounded-xl aspect-[4/3] cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300" data-testid="card-marina-yacht">
              <div className="absolute inset-0 transition-transform duration-700 ease-in-out group-hover:-translate-x-full">
                <img 
                  src="/attached_assets/Shopping & Boutiques_1764585666709.jpg" 
                  alt="Marassi Marina yacht experience" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute bottom-4 left-4 bg-black/30 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium">
                  Sail in Style
                </div>
              </div>
              <div className="absolute inset-0 bg-white translate-x-full transition-transform duration-700 ease-in-out group-hover:translate-x-0 flex flex-col justify-center items-center p-6 text-center">
                <h4 className="text-2xl font-serif font-bold text-solei-navy mb-4">Marassi Marina Yacht Experience</h4>
                <p className="text-gray-700 leading-relaxed">Set off from the chic marina aboard a luxury yacht, where crystal-blue waters, modern architecture, and refined seaside elegance define the perfect coastal escape.</p>
              </div>
            </div>

            {/* Card 5 - Seaside Suite Indulgence */}
            <div className="group relative overflow-hidden rounded-xl aspect-[4/3] cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300" data-testid="card-seaside-suite">
              <div className="absolute inset-0 transition-transform duration-700 ease-in-out group-hover:-translate-x-full">
                <img 
                  src="/attached_assets/Cultural Heritage_1764585740366.jpg" 
                  alt="Seaside suite with ocean view" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute bottom-4 left-4 bg-black/30 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium">
                  Luxury with a View
                </div>
              </div>
              <div className="absolute inset-0 bg-white translate-x-full transition-transform duration-700 ease-in-out group-hover:translate-x-0 flex flex-col justify-center items-center p-6 text-center">
                <h4 className="text-2xl font-serif font-bold text-solei-navy mb-4">Seaside Suite Indulgence</h4>
                <p className="text-gray-700 leading-relaxed">Savor handcrafted treats from the comfort of your plush suite, framed by sweeping vistas of turquoise waters and sun-kissed shores.</p>
              </div>
            </div>

            {/* Card 6 - Poolside Leisure Escape */}
            <div className="group relative overflow-hidden rounded-xl aspect-[4/3] cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300" data-testid="card-poolside-leisure">
              <div className="absolute inset-0 transition-transform duration-700 ease-in-out group-hover:-translate-x-full">
                <img 
                  src="/attached_assets/Water Sports_1764585780831.jpg" 
                  alt="Poolside leisure with floating relaxation" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute bottom-4 left-4 bg-black/30 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium">
                  Float Into Bliss
                </div>
              </div>
              <div className="absolute inset-0 bg-white translate-x-full transition-transform duration-700 ease-in-out group-hover:translate-x-0 flex flex-col justify-center items-center p-6 text-center">
                <h4 className="text-2xl font-serif font-bold text-solei-navy mb-4">Poolside Leisure Escape</h4>
                <p className="text-gray-700 leading-relaxed">Unwind on a playful float as serene pool waters mirror the lush greenery beyond, creating the perfect setting for carefree relaxation.</p>
              </div>
            </div>
          </div>

          {/* North Coast Features */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-solei-turquoise/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-star text-solei-turquoise text-2xl"></i>
              </div>
              <h4 className="text-xl font-semibold text-solei-navy mb-3">5-Star Resorts</h4>
              <p className="text-gray-600">Wake Up in a Suite Steps from the Shoreline</p>
            </div>
            <div className="text-center">
              <div className="bg-solei-coral/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-swimmer text-solei-coral text-2xl"></i>
              </div>
              <h4 className="text-xl font-semibold text-solei-navy mb-3">Water Activities</h4>
              <p className="text-gray-600">Dive, snorkel, and sail the Mediterranean.</p>
            </div>
            <div className="text-center">
              <div className="bg-solei-gold/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-utensils text-solei-gold text-2xl"></i>
              </div>
              <h4 className="text-xl font-semibold text-solei-navy mb-3">Gourmet Dining</h4>
              <p className="text-gray-600">Flavours as Memorable as the Sunsets</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
