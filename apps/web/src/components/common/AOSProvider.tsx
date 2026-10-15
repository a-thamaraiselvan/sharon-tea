import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import AOS from 'aos';

interface AOSProviderProps {
  children: React.ReactNode;
}

export const AOSProvider: React.FC<AOSProviderProps> = ({ children }) => {
  const location = useLocation();
  const isInitialized = useRef(false);

  useEffect(() => {
    try {
      if (!isInitialized.current) {
        AOS.init({
          duration: 400,
          easing: 'ease-out-cubic',
          once: true,
          offset: 20,
          delay: 0,
          throttleDelay: 50,
          disableMutationObserver: true,
          disable: () => {
            try {
              return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            } catch {
              return false;
            }
          },
        });
        isInitialized.current = true;
        (window as any).AOS = AOS;
      }

      // Listen to live changes on prefers-reduced-motion media query
      if (typeof window !== 'undefined' && window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const handleMotionChange = () => {
          try {
            AOS.refresh();
          } catch {
            // Ignore
          }
        };

        if (mediaQuery.addEventListener) {
          mediaQuery.addEventListener('change', handleMotionChange);
        } else if (mediaQuery.addListener) {
          mediaQuery.addListener(handleMotionChange);
        }
      }

      // Refresh after initial mount once route commits
      const timer = setTimeout(() => {
        try {
          AOS.refreshHard();
        } catch {
          // Ignore
        }
      }, 120);

      return () => {
        clearTimeout(timer);
      };
    } catch (e) {
      console.warn('[AOSProvider] AOS initialization skipped or failed:', e);
    }
  }, []);

  useEffect(() => {
    // When route changes, refreshHard so newly mounted page elements are indexed
    const timer = setTimeout(() => {
      try {
        AOS.refreshHard();
      } catch {
        // Ignore
      }
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [location.pathname]);

  return <>{children}</>;
};

export default AOSProvider;

