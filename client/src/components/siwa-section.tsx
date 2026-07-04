import { SimpleVideo } from './simple-video';

export function SiwaSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="siwa" className="relative min-h-screen" style={{ background: 'none' }}>
      {/* Siwa Hero */}
      <div className="relative h-screen overflow-hidden" style={{ background: '#0d4a4f' }}>
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          controls={false}
          src="/attached_assets/siwa_1751042722081.mp4"
          style={{ 
            backgroundColor: '#0d4a4f',
            zIndex: 1
          }}
          onError={() => console.log('Direct video error: siwa')}
          onPlay={() => console.log('Direct video playing: siwa')}
        />
        <div className="absolute inset-0 bg-black/30" style={{ zIndex: 2 }}></div>
        
        <div className="relative h-full flex items-center" style={{ zIndex: 10 }}>
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="max-w-3xl">
              <h2 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6">
                Siwa Oasis
              </h2>
              <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
                Step into a world untouched by time. Discover ancient traditions, healing springs, 
                and the mystical beauty of Egypt's most remote oasis.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                  <i className="fas fa-leaf mr-2"></i>Natural Springs
                </span>
                <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                  <i className="fas fa-mosque mr-2"></i>Ancient Temples
                </span>
                <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                  <i className="fas fa-mountain mr-2"></i>Desert Adventures
                </span>
              </div>
              <button 
                onClick={() => scrollToSection('contact')}
                className="bg-solei-gold text-solei-navy px-8 py-4 rounded-full font-semibold text-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105"
              >
                Uncover Egypt's Best-Kept Secret
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Siwa Gallery */}
      <div className="py-20 bg-solei-cream">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-serif font-bold text-solei-navy mb-6">Siwa Oasis: Egypt's Hidden Sanctuary</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A desert paradise where tradition, healing, and adventure meet under endless skies.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-8 mb-16">
            {/* Card 1 - Mountain of the Dead */}
            <div className="group relative overflow-hidden rounded-xl aspect-[4/3] cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300" data-testid="card-mountain-dead">
              <div className="absolute inset-0 transition-transform duration-700 ease-in-out group-hover:-translate-x-full">
                <img 
                  src="/attached_assets/Mountain_of_the_Dead_1764706599726.JPG" 
                  alt="Ancient tombs carved into rocky hillside - Mountain of the Dead" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute bottom-4 left-4 bg-black/30 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium">
                  Where Silence Glows
                </div>
              </div>
              <div className="absolute inset-0 bg-white translate-x-full transition-transform duration-700 ease-in-out group-hover:translate-x-0 flex flex-col justify-center items-center p-6 text-center">
                <h4 className="text-2xl font-serif font-bold text-solei-navy mb-4">Sunset Dune Walk</h4>
                <p className="text-gray-700 leading-relaxed">Wander across golden sands as the sun melts into the horizon, bathing the desert in warm, ethereal light.</p>
              </div>
            </div>

            {/* Card 2 - Ancient Shali Fortress */}
            <div className="group relative overflow-hidden rounded-xl aspect-[4/3] cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300" data-testid="card-sand-sea-adventures">
              <div className="absolute inset-0 transition-transform duration-700 ease-in-out group-hover:-translate-x-full">
                <img 
                  src="/attached_assets/Great_Sand_Sea_Adventures_1764706599725.PNG" 
                  alt="Golden sand dunes and desert adventures with oryx" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute bottom-4 left-4 bg-black/30 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium">
                  Echoes of Siwa
                </div>
              </div>
              <div className="absolute inset-0 bg-white translate-x-full transition-transform duration-700 ease-in-out group-hover:translate-x-0 flex flex-col justify-center items-center p-6 text-center">
                <h4 className="text-2xl font-serif font-bold text-solei-navy mb-4">Ancient Shali Fortress</h4>
                <p className="text-gray-700 leading-relaxed">Step inside a centuries-old mud-brick citadel where crumbling towers, narrow alleys, and golden walls preserve the timeless spirit of Siwa's desert heritage.</p>
              </div>
            </div>

            {/* Card 3 - Crystal Salt Pools */}
            <div className="group relative overflow-hidden rounded-xl aspect-[4/3] cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300" data-testid="card-traditional-homes">
              <div className="absolute inset-0 transition-transform duration-700 ease-in-out group-hover:-translate-x-full">
                <img 
                  src="/attached_assets/Traditional_Siwan_Homes_1764706599729.jpg" 
                  alt="Traditional mud-brick Siwan architecture and village life" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute bottom-4 left-4 bg-black/30 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium">
                  Float in Serenity
                </div>
              </div>
              <div className="absolute inset-0 bg-white translate-x-full transition-transform duration-700 ease-in-out group-hover:translate-x-0 flex flex-col justify-center items-center p-6 text-center">
                <h4 className="text-2xl font-serif font-bold text-solei-navy mb-4">Crystal Salt Pools</h4>
                <p className="text-gray-700 leading-relaxed">Relax effortlessly in natural saltwater basins where buoyancy comes naturally and the world feels weightless.</p>
              </div>
            </div>

            {/* Card 4 - Fortress Over the Oasis */}
            <div className="group relative overflow-hidden rounded-xl aspect-[4/3] cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300" data-testid="card-crafts-markets">
              <div className="absolute inset-0 transition-transform duration-700 ease-in-out group-hover:-translate-x-full">
                <img 
                  src="/attached_assets/Local_Crafts_&_Markets_1764706599726.JPG" 
                  alt="Local crafts and markets with handwoven textiles and silver jewelry" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute bottom-4 left-4 bg-black/30 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium">
                  Guardians of the Palm Sea
                </div>
              </div>
              <div className="absolute inset-0 bg-white translate-x-full transition-transform duration-700 ease-in-out group-hover:translate-x-0 flex flex-col justify-center items-center p-6 text-center">
                <h4 className="text-2xl font-serif font-bold text-solei-navy mb-4">Fortress Over the Oasis</h4>
                <p className="text-gray-700 leading-relaxed">Take in sweeping views from ancient desert walls, where towering ruins overlook a vast oasis wrapped in golden mountains.</p>
              </div>
            </div>

            {/* Card 5 - Milky Way Desert Nights */}
            <div className="group relative overflow-hidden rounded-xl aspect-[4/3] cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300" data-testid="card-palm-groves">
              <div className="absolute inset-0 transition-transform duration-700 ease-in-out group-hover:-translate-x-full">
                <img 
                  src="/attached_assets/Palm_Groves_&_Olive_Fields_1764706599727.JPG" 
                  alt="Lush palm groves and olive fields in Siwa oasis" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute bottom-4 left-4 bg-black/30 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium">
                  Under Infinite Skies
                </div>
              </div>
              <div className="absolute inset-0 bg-white translate-x-full transition-transform duration-700 ease-in-out group-hover:translate-x-0 flex flex-col justify-center items-center p-6 text-center">
                <h4 className="text-2xl font-serif font-bold text-solei-navy mb-4">Milky Way Desert Nights</h4>
                <p className="text-gray-700 leading-relaxed">Unwind beneath a star-studded horizon where the Milky Way stretches overhead and the desert glows softly in the candlelight.</p>
              </div>
            </div>

            {/* Card 6 - Hidden Desert Oasis */}
            <div className="group relative overflow-hidden rounded-xl aspect-[4/3] cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300" data-testid="card-festivals-siwa">
              <div className="absolute inset-0 transition-transform duration-700 ease-in-out group-hover:-translate-x-full">
                <img 
                  src="/attached_assets/Festivals_of_Siwa_1764706599724.JPG" 
                  alt="Traditional Siwan festivals with music and dance celebrations" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute bottom-4 left-4 bg-black/30 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium">
                  Retreat to Stillness
                </div>
              </div>
              <div className="absolute inset-0 bg-white translate-x-full transition-transform duration-700 ease-in-out group-hover:translate-x-0 flex flex-col justify-center items-center p-6 text-center">
                <h4 className="text-2xl font-serif font-bold text-solei-navy mb-4">Hidden Desert Oasis</h4>
                <p className="text-gray-700 leading-relaxed">Float beneath swaying palms in a secluded spring cherished for its calm waters and timeless desert charm.</p>
              </div>
            </div>
          </div>

          {/* Siwa Features */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-solei-teal/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-hot-tub text-solei-teal text-2xl"></i>
              </div>
              <h4 className="text-xl font-semibold text-solei-navy mb-3">Healing Springs</h4>
              <p className="text-gray-600">Therapeutic natural springs with mineral-rich waters known for their healing properties.</p>
            </div>
            <div className="text-center">
              <div className="bg-solei-gold/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-landmark text-solei-gold text-2xl"></i>
              </div>
              <h4 className="text-xl font-semibold text-solei-navy mb-3">Ancient History</h4>
              <p className="text-gray-600">Explore the Oracle Temple where Alexander the Great sought divine guidance.</p>
            </div>
            <div className="text-center">
              <div className="bg-solei-coral/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-campground text-solei-coral text-2xl"></i>
              </div>
              <h4 className="text-xl font-semibold text-solei-navy mb-3">Desert Camping</h4>
              <p className="text-gray-600">Unforgettable nights under the stars in the heart of the Western Desert.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
