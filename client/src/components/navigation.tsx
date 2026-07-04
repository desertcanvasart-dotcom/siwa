import { useState, useEffect } from "react";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkBackground, setIsDarkBackground] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 100);
      
      // Determine if we're over a dark or light background
      // Hero section (0-800px): dark background
      // Destinations overview (800-1600px): white background  
      // North Coast (1600-3200px): dark background
      // Siwa (3200-4800px): cream background (light)
      // Experiences (4800-5600px): white background
      // Contact (5600+): dark background
      
      const isDark = scrollY < 700 || 
                    (scrollY >= 1500 && scrollY < 3100) || 
                    scrollY >= 5500;
      setIsDarkBackground(isDark);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? isDarkBackground 
          ? 'bg-black/30 backdrop-blur-md border-b border-white/20' 
          : 'bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm'
        : 'bg-white/10 backdrop-blur-md border-b border-white/20'
    }`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <h1 className={`text-2xl font-serif font-bold cursor-pointer transition-colors duration-300 ${
              isDarkBackground ? 'text-white' : 'text-solei-navy'
            }`} 
                onClick={() => scrollToSection('home')}>
              Soléi
            </h1>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button 
                onClick={() => scrollToSection('home')}
                className={`hover:text-solei-gold transition-colors duration-300 font-medium ${
                  isDarkBackground ? 'text-white' : 'text-solei-navy'
                }`}
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('north-coast')}
                className={`hover:text-solei-gold transition-colors duration-300 font-medium ${
                  isDarkBackground ? 'text-white' : 'text-solei-navy'
                }`}
              >
                North Coast
              </button>
              <button 
                onClick={() => scrollToSection('siwa')}
                className={`hover:text-solei-gold transition-colors duration-300 font-medium ${
                  isDarkBackground ? 'text-white' : 'text-solei-navy'
                }`}
              >
                Siwa Oasis
              </button>
              <button 
                onClick={() => scrollToSection('experiences')}
                className={`hover:text-solei-gold transition-colors duration-300 font-medium ${
                  isDarkBackground ? 'text-white' : 'text-solei-navy'
                }`}
              >
                Experiences
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="bg-solei-gold text-solei-navy px-6 py-2 rounded-full font-medium hover:bg-yellow-400 transition-colors duration-300"
              >
                Book Now
              </button>
            </div>
          </div>
          
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`transition-colors duration-300 ${
                isDarkBackground ? 'text-white hover:text-solei-gold' : 'text-solei-navy hover:text-solei-gold'
              }`}
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className={`px-2 pt-2 pb-3 space-y-1 backdrop-blur-md rounded-lg mt-2 ${
              isDarkBackground ? 'bg-black/20' : 'bg-white/90 border border-gray-200'
            }`}>
              <button 
                onClick={() => scrollToSection('home')}
                className={`block hover:text-solei-gold transition-colors duration-300 font-medium px-3 py-2 w-full text-left ${
                  isDarkBackground ? 'text-white' : 'text-solei-navy'
                }`}
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('north-coast')}
                className={`block hover:text-solei-gold transition-colors duration-300 font-medium px-3 py-2 w-full text-left ${
                  isDarkBackground ? 'text-white' : 'text-solei-navy'
                }`}
              >
                North Coast
              </button>
              <button 
                onClick={() => scrollToSection('siwa')}
                className={`block hover:text-solei-gold transition-colors duration-300 font-medium px-3 py-2 w-full text-left ${
                  isDarkBackground ? 'text-white' : 'text-solei-navy'
                }`}
              >
                Siwa Oasis
              </button>
              <button 
                onClick={() => scrollToSection('experiences')}
                className={`block hover:text-solei-gold transition-colors duration-300 font-medium px-3 py-2 w-full text-left ${
                  isDarkBackground ? 'text-white' : 'text-solei-navy'
                }`}
              >
                Experiences
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="block bg-solei-gold text-solei-navy px-3 py-2 rounded-full font-medium hover:bg-yellow-400 transition-colors duration-300 w-full text-left"
              >
                Book Now
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
