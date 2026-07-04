import { useRef, useState, useEffect } from "react";

interface SimpleVideoProps {
  src: string;
  fallbackImage: string;
  className?: string;
  children?: React.ReactNode;
}

export function SimpleVideo({ src, fallbackImage, className = "", children }: SimpleVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`} style={{ zIndex: 1 }}>
      {/* Fallback image shown while video loads */}
      <img
        src={fallbackImage}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 1 }}
      />

      {/* Video element - only load when visible in viewport */}
      {isVisible && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          controls={false}
          poster={fallbackImage}
          src={src}
          style={{
            backgroundColor: '#0d4a4f',
            zIndex: 2
          }}
          onLoadedMetadata={(e) => {
            const playPromise = e.currentTarget.play();
            if (playPromise !== undefined) {
              playPromise.catch(() => {});
            }
          }}
        />
      )}

      <div style={{ position: 'relative', zIndex: 10 }}>
        {children}
      </div>
    </div>
  );
}
