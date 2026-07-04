import { Link } from "wouter";

export function ExperiencesSection() {
  return (
    <section id="experiences" className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-solei-navy mb-4 sm:mb-6">
            The Soléi Signature
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto px-4">
            Four ecolodges. One philosophy of timeless luxury, sustainability, and place-rooted beauty.
          </p>
        </div>

        {/* 2x2 Grid layout for 4 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Card 1 - Sunset Oasis Retreat */}
          <Link 
            href="/hotel/solei-desert-retreat"
            className="group relative overflow-hidden rounded-xl aspect-[4/3] cursor-pointer shadow-lg hover:shadow-2xl focus-visible:ring-4 focus-visible:ring-solei-gold focus:outline-none transition-all duration-300 w-full block" 
            data-testid="card-sunset-oasis"
          >
            <div className="absolute inset-0 transition-transform duration-700 ease-in-out group-hover:-translate-x-full group-focus:-translate-x-full">
              <img 
                src="/attached_assets/Card_1_(Left_-_Small_1764754993303.png" 
                alt="Sunset Oasis Retreat by the Desert Pool" 
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white drop-shadow-lg">Soléi Desert Retreat</h3>
              </div>
            </div>
            <div className="absolute inset-0 bg-white translate-x-full transition-transform duration-700 ease-in-out group-hover:translate-x-0 group-focus:translate-x-0 flex flex-col justify-center items-center p-6 text-center">
              <h3 className="text-2xl font-serif font-bold text-solei-navy mb-4">Soléi Desert Retreat</h3>
              <p className="text-gray-700 leading-relaxed">A peaceful desert oasis at sunset, featuring a reflective pool, cozy lantern-lit seating, and a traditional domed retreat surrounded by palm trees.</p>
            </div>
          </Link>

          {/* Card 2 - Soléi Royal */}
          <Link 
            href="/hotel/solei-royal"
            className="group relative overflow-hidden rounded-xl aspect-[4/3] cursor-pointer shadow-lg hover:shadow-2xl focus-visible:ring-4 focus-visible:ring-solei-gold focus:outline-none transition-all duration-300 w-full block" 
            data-testid="card-solei-royal"
          >
            <div className="absolute inset-0 transition-transform duration-700 ease-in-out group-hover:-translate-x-full group-focus:-translate-x-full">
              <img 
                src="/attached_assets/Card_2_(Center_-_Double-wide)_1764795277085.PNG" 
                alt="Soléi Royal - Premier luxury ecolodge with traditional architecture" 
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white drop-shadow-lg">Soléi Royal</h3>
              </div>
            </div>
            <div className="absolute inset-0 bg-white translate-x-full transition-transform duration-700 ease-in-out group-hover:translate-x-0 group-focus:translate-x-0 flex flex-col justify-center items-center p-6 text-center">
              <h3 className="text-2xl font-serif font-bold text-solei-navy mb-4">Soléi Royal</h3>
              <p className="text-gray-700 leading-relaxed">The crown jewel of our collection. Where timeless elegance meets modern consciousness in an oasis of tranquility.</p>
            </div>
          </Link>

          {/* Card 3 - Solei Old Town */}
          <Link 
            href="/hotel/solei-old-town"
            className="group relative overflow-hidden rounded-xl aspect-[4/3] cursor-pointer shadow-lg hover:shadow-2xl focus-visible:ring-4 focus-visible:ring-solei-gold focus:outline-none transition-all duration-300 w-full block" 
            data-testid="card-old-town"
          >
            <div className="absolute inset-0 transition-transform duration-700 ease-in-out group-hover:-translate-x-full group-focus:-translate-x-full">
              <img 
                src="/attached_assets/Card_3_(Right_-_Small)_1764795297403.PNG" 
                alt="Solei Old Town - Boutique ecolodge in historic setting" 
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white drop-shadow-lg">Soléi Old Town</h3>
              </div>
            </div>
            <div className="absolute inset-0 bg-white translate-x-full transition-transform duration-700 ease-in-out group-hover:translate-x-0 group-focus:translate-x-0 flex flex-col justify-center items-center p-6 text-center">
              <h3 className="text-2xl font-serif font-bold text-solei-navy mb-4">Soléi Old Town</h3>
              <p className="text-gray-700 leading-relaxed">Intimate luxury woven into the fabric of history, where past and present dance together.</p>
            </div>
          </Link>

          {/* Card 4 - Desert Candlelit Retreat */}
          <Link 
            href="/hotel/solei-salt-caves"
            className="group relative overflow-hidden rounded-xl aspect-[4/3] cursor-pointer shadow-lg hover:shadow-2xl focus-visible:ring-4 focus-visible:ring-solei-gold focus:outline-none transition-all duration-300 w-full block" 
            data-testid="card-desert-candlelit"
          >
            <div className="absolute inset-0 transition-transform duration-700 ease-in-out group-hover:-translate-x-full group-focus:-translate-x-full">
              <img 
                src="/attached_assets/card_4_Image_1764794603934.PNG" 
                alt="Desert Candlelit Retreat" 
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white drop-shadow-lg">Soléi Salt Caves</h3>
              </div>
            </div>
            <div className="absolute inset-0 bg-white translate-x-full transition-transform duration-700 ease-in-out group-hover:translate-x-0 group-focus:translate-x-0 flex flex-col justify-center items-center p-6 text-center">
              <h3 className="text-2xl font-serif font-bold text-solei-navy mb-4">Soléi Salt Caves</h3>
              <p className="text-gray-700 leading-relaxed">A serene traditional Siwan space illuminated by warm candlelight, offering a peaceful and authentic desert ambiance.</p>
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
}
