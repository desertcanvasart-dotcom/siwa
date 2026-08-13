import { useSiteContent, pickContent } from "@/lib/useSiteContent";

/**
 * Homepage hero — navy + looping salt-lake video.
 * Title, sub, eyebrow animate in on mount (fade-up).
 */
export function HeroSection() {
  const content = useSiteContent();
  const eyebrow = pickContent(content, "home.hero.eyebrow", "From Sea to Sands");
  const titleLine1 = pickContent(content, "home.hero.title", "Feel Egypt.");
  const titleItalic = pickContent(content, "home.hero.italic", "Don't just see it.");
  const subhead = pickContent(
    content,
    "home.hero.subhead",
    "Two destinations. Curated accommodation, experiences, and private transportation. One guiding principle — the moments most travelers never reach.",
  );
  const mediaUrl = pickContent(content, "home.hero.video_url", "/videos/salt-lake.mp4");
  // The hero accepts an image OR a video. Detect by file extension
  // (uploaded media carries its extension; e.g. /media/7.mp4 or .jpg).
  const isVideo = /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(mediaUrl);
  return (
    <section className="relative min-h-[100dvh] bg-navy overflow-hidden flex flex-col justify-end pt-24 sm:pt-28 md:pt-0">
      {/* Background media — video or image */}
      {isVideo ? (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={mediaUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : (
        <img
          className="absolute inset-0 w-full h-full object-cover"
          src={mediaUrl}
          alt=""
        />
      )}

      {/* Overlay gradient — dark at top for nav legibility, darker at bottom for text */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(9,24,32,0.55) 0%, rgba(9,24,32,0.05) 35%, rgba(9,24,32,0.15) 55%, rgba(9,24,32,0.75) 100%)",
        }}
      />

      {/* Arch motif behind the title — shrinks on mobile so it doesn't crowd the brand mark */}
      <div
        className="absolute -top-10 sm:-top-14 md:-top-16 left-1/2 -translate-x-1/2
          w-32 h-32 sm:w-44 sm:h-44 md:w-56 md:h-56
          border border-gold/20 rounded-t-full border-b-0 pointer-events-none"
      >
        <div className="absolute top-[12px] sm:top-[16px] md:top-[18px] left-[12px] sm:left-[16px] md:left-[18px] right-[12px] sm:right-[16px] md:right-[18px] bottom-0
          border border-gold/10 rounded-t-full border-b-0" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-5 sm:px-6 md:px-12 lg:px-20 pb-16 sm:pb-20 md:pb-24 max-w-[1400px] w-full mx-auto">
        <p className="flex items-center gap-3 sm:gap-4 text-[0.55rem] sm:text-[0.6rem] tracking-[0.36em] sm:tracking-[0.42em] uppercase
            text-gold mb-6 sm:mb-8 animate-fade-up animation-delay-400">
          <span className="w-6 sm:w-7 h-px bg-gold/60" />
          {eyebrow}
        </p>

        <h1
          className="font-display font-normal leading-[1.05] text-white mb-6 sm:mb-8 animate-fade-up animation-delay-600"
          style={{
            fontSize: "clamp(2.4rem, 9vw, 7.5rem)",
            textShadow: "0 2px 40px rgba(9,24,32,0.4)",
          }}
        >
          {titleLine1}
          <br />
          <em className="italic text-gold">{titleItalic}</em>
        </h1>

        <p className="text-[0.82rem] sm:text-[0.88rem] text-white/65 max-w-[42ch] sm:max-w-[46ch] leading-[1.85] sm:leading-[1.95]
            animate-fade-up animation-delay-800">
          {subhead}
        </p>
      </div>

      {/* Scroll indicator — hidden below md to avoid colliding with content */}
      <div
        className="hidden md:flex absolute bottom-12 right-20 flex-col items-center gap-2.5 z-10 animate-fade-up"
        style={{ animationDelay: "1.8s" }}
      >
        <div className="w-px h-14 bg-gradient-to-b from-gold/70 to-transparent animate-scroll-pulse" />
        <span className="text-[0.55rem] tracking-[0.3em] uppercase text-white/35 [writing-mode:vertical-rl]">
          Discover
        </span>
      </div>
    </section>
  );
}

export default HeroSection;
