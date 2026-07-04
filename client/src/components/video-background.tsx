import { useLazyVideo } from "@/hooks/use-lazy-video";

interface VideoBackgroundProps {
  webmSrc: string;
  mp4Src: string;
  posterSrc: string;
  className?: string;
  children?: React.ReactNode;
}

export function VideoBackground({ 
  webmSrc, 
  mp4Src, 
  posterSrc, 
  className = "", 
  children 
}: VideoBackgroundProps) {
  const { ref, isVideoReady, hasError } = useLazyVideo();

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Static background that shows until video is ready */}
      <div 
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
          isVideoReady && !hasError ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ backgroundImage: `url(${posterSrc})` }}
      />
      
      {/* Video element */}
      <video
        ref={ref}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          isVideoReady && !hasError ? 'opacity-100' : 'opacity-0'
        }`}
        preload="metadata"
        muted
        loop
        playsInline
        autoPlay
        controls={false}
        src={mp4Src}
      >
        <source src={mp4Src} type="video/mp4" />
        <source src={webmSrc} type="video/webm" />
      </video>

      {children}
    </div>
  );
}
