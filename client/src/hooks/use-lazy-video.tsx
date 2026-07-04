import { useEffect, useRef, useState } from "react";

interface UseLazyVideoOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useLazyVideo(options: UseLazyVideoOptions = {}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '200px 0px 200px 0px',
      }
    );

    observer.observe(video);

    const handleCanPlayThrough = () => {
      setIsVideoReady(true);
      setHasError(false);
    };

    const handleLoadedMetadata = () => {
      // Video metadata is loaded, start playing
      if (isIntersecting) {
        video.play().catch(() => setHasError(true));
      }
    };

    const handleLoadedData = () => {
      setIsVideoReady(true);
      setHasError(false);
    };

    const handleError = (e: any) => {
      console.error('Video loading error:', e);
      setHasError(true);
      setIsVideoReady(false);
    };

    video.addEventListener('canplaythrough', handleCanPlayThrough);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);

    // Start loading immediately
    if (video.src) {
      video.load();
    }

    return () => {
      observer.unobserve(video);
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
    };
  }, [options.threshold, options.rootMargin, isIntersecting]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isIntersecting && isVideoReady && !hasError) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error('Video play failed:', error);
          setHasError(true);
        });
      }
    } else if (!isIntersecting) {
      video.pause();
    }
  }, [isIntersecting, isVideoReady, hasError]);

  return { 
    ref: videoRef, 
    isIntersecting, 
    isVideoReady,
    hasError 
  };
}
