export default function SplitHero() {
  return (
    <section className="relative h-72 md:h-96 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-teal-500 to-amber-400" />
      
      {/* Overlay pattern */}
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-serif text-white text-4xl md:text-6xl font-bold drop-shadow-lg mb-4">
          Curated Experiences of Egypt
        </h1>
        <p className="text-white/90 text-lg md:text-xl max-w-2xl leading-relaxed">
          Browse every activity, ritual, and adventure across our coastal and desert sanctuaries.
        </p>
      </div>
    </section>
  );
}