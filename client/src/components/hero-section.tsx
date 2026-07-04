import { SimpleVideo } from "./simple-video";

export function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };



  return (
    <section id="home" className="relative h-screen overflow-hidden">
      {/* Hero video background - authentic North Coast footage */}
      <SimpleVideo
        src="/attached_assets/northcoast_1751038997736.mp4"
        fallbackImage="https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080"
        className="absolute inset-0 w-full h-full"
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </SimpleVideo>
      
      <div className="relative z-10 h-full flex items-center justify-center text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-white mb-4 sm:mb-6 leading-tight">
            Discover Egypt's
            <span className="text-solei-gold"> Hidden Treasures</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
            From the pristine beaches of the North Coast to the mystical oasis of Siwa, 
            embark on an unforgettable journey through Egypt's most enchanting destinations.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <button 
              onClick={() => scrollToSection('north-coast')}
              className="w-full sm:w-auto bg-solei-gold text-solei-navy px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 min-h-[48px] touch-manipulation"
            >
              Start Your Journey
            </button>
            <button className="w-full sm:w-auto border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:bg-white hover:text-solei-navy transition-all duration-300 min-h-[48px] touch-manipulation">
              Watch Our Story
            </button>
          </div>
        </div>
      </div>
      

    </section>
  );
}
