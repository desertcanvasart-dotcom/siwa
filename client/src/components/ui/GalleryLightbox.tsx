import { useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Full-screen photo viewer (hotel "View all photos", experience
 * galleries): arrows, keyboard, swipe, thumbnail strip.
 */
export function GalleryLightbox({
  images,
  index,
  setIndex,
  onClose,
  title,
}: {
  images: string[];
  index: number;
  setIndex: (i: number) => void;
  onClose: () => void;
  title: string;
}) {
  const count = images.length;
  const go = (dir: number) => setIndex((index + dir + count) % count);
  const touchX = useRef<number | null>(null);

  // Keyboard nav + lock body scroll while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") setIndex((index + 1) % count);
      else if (e.key === "ArrowLeft") setIndex((index - 1 + count) % count);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [index, count, onClose, setIndex]);

  return (
    <div
      className="fixed inset-0 z-[600] flex flex-col bg-navy-deep/95 backdrop-blur-sm animate-fade-up"
      style={{ animationDuration: "0.25s" }}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} photo gallery`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 md:px-12 py-5 text-white/80">
        <p className="text-[0.58rem] tracking-[0.28em] uppercase font-body">
          {title}
          <span className="text-white/35"> · {index + 1} / {count}</span>
        </p>
        <button
          type="button"
          onClick={onClose}
          className="text-white/60 hover:text-gold transition-colors p-1"
          aria-label="Close gallery"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Stage — swipe left/right on touch screens */}
      <div
        className="relative flex-1 flex items-center justify-center px-4 md:px-16 min-h-0"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null || count < 2) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          touchX.current = null;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        }}
      >
        {count > 1 && (
          <button
            type="button"
            onClick={() => go(-1)}
            className="absolute left-3 md:left-8 z-[2] text-white/55 hover:text-gold transition-colors p-2 bg-navy-deep/40 border border-white/10 backdrop-blur-md"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <img
          key={images[index]}
          src={images[index]}
          alt={`${title} — photo ${index + 1}`}
          className="max-h-full max-w-full object-contain animate-fade-up"
          style={{ animationDuration: "0.3s" }}
        />

        {count > 1 && (
          <button
            type="button"
            onClick={() => go(1)}
            className="absolute right-3 md:right-8 z-[2] text-white/55 hover:text-gold transition-colors p-2 bg-navy-deep/40 border border-white/10 backdrop-blur-md"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Thumbnail strip */}
      {count > 1 && (
        <div className="flex gap-[3px] overflow-x-auto px-6 md:px-12 py-4">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              className={`relative flex-shrink-0 w-20 h-14 overflow-hidden border transition-opacity ${
                i === index
                  ? "border-gold opacity-100"
                  : "border-white/10 opacity-45 hover:opacity-80"
              }`}
              aria-label={`Photo ${i + 1}`}
            >
              <img src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
