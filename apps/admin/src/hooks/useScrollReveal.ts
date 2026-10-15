import { useEffect, useRef } from 'react';

export interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Lightweight, resilient React hook using native IntersectionObserver.
 * Automatically adds the 'is-visible' class when the element enters viewport,
 * then unobserves immediately to conserve resources.
 * Respects 'prefers-reduced-motion: reduce' by immediately applying 'is-visible'.
 */
export function useScrollRevealRef<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {}
) {
  const elementRef = useRef<T | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      element.classList.add('is-visible');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            if (options.triggerOnce !== false) {
              observer.unobserve(entry.target);
            }
          }
        });
      },
      {
        threshold: options.threshold ?? 0.1,
        rootMargin: options.rootMargin ?? '0px 0px -10px 0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options.threshold, options.rootMargin, options.triggerOnce]);

  return elementRef;
}

export const useScrollReveal = useScrollRevealRef;
export default useScrollRevealRef;
