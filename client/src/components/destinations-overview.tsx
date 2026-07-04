import { Link } from "wouter";

export function DestinationsOverview() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-solei-navy mb-4 sm:mb-6">
            Two Worlds, One Journey
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Experience the contrasts that make Egypt extraordinary – from Mediterranean luxury to desert mystique
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
          {/* North Coast Preview */}
          <Link href="/north-coast" className="group block">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl h-64 sm:h-80 lg:h-96 mb-4 sm:mb-6">
              {/* Use authentic beach image from attachments */}
              <img
                src="/attached_assets/North_Coast_1765652053006.JPG"
                alt="North Coast luxury beach resort with pool cabanas"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-solei-navy/70 to-transparent"></div>
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-white">
                <h3 className="text-xl sm:text-2xl font-serif font-bold mb-1 sm:mb-2">North Coast</h3>
                <p className="text-white/90 text-sm sm:text-base">Mediterranean Luxury</p>
              </div>
            </div>
            <h4 className="text-lg sm:text-xl font-semibold text-solei-navy mb-2 sm:mb-3">Coastal Paradise</h4>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              Pristine beaches, crystal-clear waters, and world-class resorts await you on Egypt's Mediterranean coastline.
            </p>
          </Link>
          
          {/* Siwa Preview */}
          <Link href="/siwa-sanctuary" className="group cursor-pointer block">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl h-64 sm:h-80 lg:h-96 mb-4 sm:mb-6">
              {/* Using your actual Siwa video */}
              <video 
                src="/attached_assets/siwa_1751042722081.mp4"
                autoPlay 
                muted 
                loop 
                playsInline
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-palmgreen/70 to-transparent"></div>
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-white">
                <h3 className="text-xl sm:text-2xl font-serif font-bold mb-1 sm:mb-2">Siwa Oasis</h3>
                <p className="text-white/90 text-sm sm:text-base">Desert Sanctuary</p>
              </div>
            </div>
            <h4 className="text-lg sm:text-xl font-semibold text-solei-navy mb-2 sm:mb-3">Ancient Wonder</h4>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              Journey into the heart of the Western Desert to discover ancient traditions, healing springs, and timeless beauty.
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}
