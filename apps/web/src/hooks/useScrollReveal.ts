import { useEffect, useRef, useState, type RefObject } from 'react';

export interface ScrollRevealOptions {
  threshold?: number | number[];
  rootMargin?: string;
  once?: boolean;
  selector?: string;
}

export interface ScrollRevealReturn<T extends HTMLElement> {
  ref: RefObject<T>;
  isVisible: boolean;
}

const DEFAULT_SELECTOR =
  '.reveal-up, .reveal-down, .reveal-left, .reveal-right, .reveal-fade, .reveal-scale, .text-reveal, [class*="reveal-"]';

/**
 * useScrollReveal
 * High-performance, lightweight scroll reveal hook powered by native IntersectionObserver.
 * Zero third-party runtime dependencies. Respects prefers-reduced-motion.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {}
): ScrollRevealReturn<T> {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -40px 0px',
    once = true,
    selector = DEFAULT_SELECTOR,
  } = options;

  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check prefers-reduced-motion
    const isReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isReducedMotion) {
      el.classList.add('is-visible');
      el.querySelectorAll(selector).forEach((child) => child.classList.add('is-visible'));
      setIsVisible(true);
      return;
    }

    // Fallback if IntersectionObserver is unsupported in current environment
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible');
      el.querySelectorAll(selector).forEach((child) => child.classList.add('is-visible'));
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            if (entry.target === el) {
              setIsVisible(true);
            }
            if (once) {
              obs.unobserve(entry.target);
            }
          } else if (!once) {
            entry.target.classList.remove('is-visible');
            if (entry.target === el) {
              setIsVisible(false);
            }
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    // Observe container
    observer.observe(el);

    // Also observe individual reveal children for staggered / natural viewport entries
    const revealChildren = el.querySelectorAll(selector);
    revealChildren.forEach((child) => observer.observe(child));

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, once, selector]);

  return { ref, isVisible };
}

/**
 * useScrollRevealRef
 * Convenience hook that directly returns the React RefObject for cleaner JSX binding.
 */
export function useScrollRevealRef<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {}
): RefObject<T> {
  const { ref } = useScrollReveal<T>(options);
  return ref;
}

/**
 * Global Document Observer Helper
 * Automatically reveals elements with .reveal-* and .text-reveal anywhere on the page
 * even if a ref was not explicitly bound to that container.
 */
export function initGlobalScrollReveal(): () => void {
  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
    return () => {};
  }

  const isReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isReducedMotion) {
    document
      .querySelectorAll(DEFAULT_SELECTOR)
      .forEach((node) => node.classList.add('is-visible'));
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  const observeAll = () => {
    document.querySelectorAll(DEFAULT_SELECTOR).forEach((node) => {
      if (!node.classList.contains('is-visible')) {
        observer.observe(node);
      }
    });
  };

  observeAll();

  // Watch for newly rendered DOM nodes (debounced with requestAnimationFrame)
  let rafId: number | null = null;
  const mutationObserver = new MutationObserver(() => {
    if (rafId !== null) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      observeAll();
    });
  });

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }
    observer.disconnect();
    mutationObserver.disconnect();
  };
}
