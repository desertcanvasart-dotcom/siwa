import { useEffect, useRef, useState } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: options.threshold || 0.5,
        rootMargin: options.rootMargin || '0px 0px -50px 0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [hasIntersected, options.threshold, options.rootMargin]);

  return { ref, isIntersecting, hasIntersected };
}
