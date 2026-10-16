import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { BrandButton } from '@/components/ui/BrandButton';
import { useHeroSlides } from '@/hooks/useHeroSlides';
import type { HeroSlide } from '@/types';
import {
  Sparkles,
  MapPin,
  Coffee,
  Package,
  Award,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Pause,
  Play,
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface SlideConfig extends HeroSlide {
  badgeText: string;
  badgeIcon: React.ReactNode;
  primaryIcon: React.ReactNode;
  secondaryIcon?: React.ReactNode;
  highlightWord?: string;
}

const DEFAULT_SLIDES: SlideConfig[] = [
  {
    id: 'slide-1',
    title: 'Every Cup, A Moment to Savour.',
    subtitle:
      'Discover the comforting taste of tea, refreshing beverages, and signature flavours crafted for every moment. Served fresh daily across Sharon outlets.',
    ctaText: 'Explore Our Menu',
    ctaLink: '/menu',
    secondaryCtaText: 'Find a Sharon Outlet',
    secondaryCtaLink: '/visit-us',
    imageUrl:
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=2000&q=85',
    displayOrder: 1,
    isActive: true,
    badgeText: 'Crafted with Authentic Spices & Fresh Estate Leaf Blends',
    badgeIcon: <Sparkles className="w-4 h-4 text-brand-amber" />,
    primaryIcon: <Coffee className="w-5 h-5" />,
    secondaryIcon: <MapPin className="w-5 h-5" />,
    highlightWord: 'A Moment',
  },
  {
    id: 'slide-2',
    title: 'Pure Tea. Better Living.',
    subtitle:
      '100% natural, aromatic tea powders & fresh spice infusions packed straight from tea gardens to your cup. Elevate your everyday tea ritual.',
    ctaText: 'Shop Tea Packs',
    ctaLink: '/products',
    secondaryCtaText: 'Become a Franchise Partner',
    secondaryCtaLink: '/franchise',
    imageUrl:
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=2000&q=85',
    displayOrder: 2,
    isActive: true,
    badgeText: 'Handpicked Assam Leaves & Fresh Cardamom Pods',
    badgeIcon: <Leaf className="w-4 h-4 text-brand-amber" />,
    primaryIcon: <Package className="w-5 h-5" />,
    secondaryIcon: <Sparkles className="w-5 h-5" />,
    highlightWord: 'Better Living',
  },
  {
    id: 'slide-3',
    title: 'Warm Gatherings, Timeless Memories.',
    subtitle:
      'Experience bubbling brass kettles, genuine camaraderie, and piping hot cutting chai at your local Sharon stall. Where community thrives.',
    ctaText: 'Find Your Nearest Stall',
    ctaLink: '/visit-us',
    secondaryCtaText: 'Read Our Story',
    secondaryCtaLink: '/about-us',
    imageUrl:
      'https://images.unsplash.com/photo-1596719139451-9b7e30d55653?auto=format&fit=crop&w=2000&q=85',
    displayOrder: 3,
    isActive: true,
    badgeText: 'Over 8,000+ Daily Cups Poured Across Neighborhoods',
    badgeIcon: <Award className="w-4 h-4 text-brand-amber" />,
    primaryIcon: <MapPin className="w-5 h-5" />,
    secondaryIcon: <Award className="w-5 h-5" />,
    highlightWord: 'Timeless Memories',
  },
];

const AUTOPLAY_INTERVAL = 5500;

export const HeroSection: React.FC = () => {
  const { data: remoteSlides } = useHeroSlides();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Reduced motion preference detection & live listener
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMotionChange);
      return () => mediaQuery.removeEventListener('change', handleMotionChange);
    } else {
      mediaQuery.addListener(handleMotionChange);
      return () => mediaQuery.removeListener(handleMotionChange);
    }
  }, []);

  // Pause autoplay when document tab is hidden
  const [isDocumentHidden, setIsDocumentHidden] = useState(() => {
    if (typeof document !== 'undefined') {
      return document.visibilityState === 'hidden';
    }
    return false;
  });

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsDocumentHidden(document.visibilityState === 'hidden');
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Merge remote slides with our rich fallback configurations to guarantee 3 complete slides
  const slides: SlideConfig[] = useMemo(() => {
    if (!Array.isArray(remoteSlides) || remoteSlides.length === 0) {
      return DEFAULT_SLIDES;
    }

    const merged = DEFAULT_SLIDES.map((defaultSlide, idx) => {
      const match = remoteSlides[idx];
      if (!match) return defaultSlide;

      const validImageUrl =
        typeof match.imageUrl === 'string' &&
        match.imageUrl.trim().length > 0 &&
        !match.imageUrl.startsWith('/uploads/')
          ? match.imageUrl
          : defaultSlide.imageUrl;

      return {
        ...defaultSlide,
        ...match,
        id: match.id || defaultSlide.id,
        imageUrl: validImageUrl || defaultSlide.imageUrl,
        title: typeof match.title === 'string' && match.title.trim().length > 0 ? match.title : defaultSlide.title,
        subtitle: typeof match.subtitle === 'string' && match.subtitle.trim().length > 0 ? match.subtitle : defaultSlide.subtitle,
        ctaText: match.ctaText || defaultSlide.ctaText,
        ctaLink: match.ctaLink || defaultSlide.ctaLink,
        secondaryCtaText: match.secondaryCtaText || defaultSlide.secondaryCtaText,
        secondaryCtaLink: match.secondaryCtaLink || defaultSlide.secondaryCtaLink,
        badgeText: defaultSlide.badgeText,
        badgeIcon: defaultSlide.badgeIcon,
        primaryIcon: defaultSlide.primaryIcon,
        secondaryIcon: defaultSlide.secondaryIcon,
        highlightWord: defaultSlide.highlightWord,
      };
    });

    return merged.length > 0 ? merged : DEFAULT_SLIDES;
  }, [remoteSlides]);

  const safeSlides = Array.isArray(slides) && slides.length > 0 ? slides : DEFAULT_SLIDES;

  const goToNext = useCallback(() => {
    if (safeSlides.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % safeSlides.length);
  }, [safeSlides.length]);

  const goToPrev = useCallback(() => {
    if (safeSlides.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + safeSlides.length) % safeSlides.length);
  }, [safeSlides.length]);

  const goToSlide = (idx: number) => {
    if (idx >= 0 && idx < safeSlides.length) {
      setCurrentIndex(idx);
    }
  };

  // Keyboard navigation support (ArrowLeft / ArrowRight)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goToNext();
    }
  };

  // Effective paused state: manual pause, hover pause, hidden tab pause, or reduced motion
  const isEffectivelyPaused =
    isPaused || isHovered || isDocumentHidden || prefersReducedMotion;

  // Single managed autoplay timer
  useEffect(() => {
    if (isEffectivelyPaused) return;

    const timer = setInterval(() => {
      goToNext();
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [isEffectivelyPaused, goToNext]);

  // Preload next slide image
  useEffect(() => {
    if (!safeSlides || safeSlides.length <= 1) return;
    const nextIndex = (currentIndex + 1) % safeSlides.length;
    const nextSlide = safeSlides[nextIndex];
    if (nextSlide?.imageUrl) {
      const img = new Image();
      img.src = nextSlide.imageUrl;
    }
  }, [currentIndex, safeSlides]);

  // Touch Swipe Handling
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setIsHovered(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
    setIsHovered(false);
  };

  const safeIndex = currentIndex >= 0 && currentIndex < safeSlides.length ? currentIndex : 0;
  const currentSlide = safeSlides[safeIndex] || DEFAULT_SLIDES[0];

  const renderHeadline = (slide?: SlideConfig) => {
    if (!slide || typeof slide.title !== 'string') {
      return DEFAULT_SLIDES[0].title;
    }
    const title = slide.title;
    const highlight = slide.highlightWord;
    if (highlight && typeof highlight === 'string' && title.includes(highlight)) {
      const parts = title.split(highlight);
      return (
        <>
          {parts[0]}
          <span className="italic font-normal text-brand-amber">{highlight}</span>
          {parts.slice(1).join(highlight)}
        </>
      );
    }
    return title;
  };

  return (
    <section
      className="relative min-h-[90vh] lg:min-h-[92vh] flex flex-col justify-between overflow-hidden bg-brand-black text-white select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-amber"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-roledescription="carousel"
      aria-label="Sharon Tea and Coffee Featured Highlights"
    >
      {/* Countdown Progress Timer Bar (hidden on prefers-reduced-motion) */}
      {!prefersReducedMotion && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-30 overflow-hidden" aria-hidden="true">
          <div
            key={`${currentIndex}-${isEffectivelyPaused}`}
            className="h-full bg-brand-amber origin-left"
            style={{
              animation: isEffectivelyPaused
                ? 'none'
                : `heroProgressBar ${AUTOPLAY_INTERVAL}ms linear forwards`,
            }}
          />
        </div>
      )}

      {/* Crossfading Background Slides with Ken Burns Zoom */}
      <div className="absolute inset-0 z-0">
        {safeSlides.map((slide, index) => {
          const isActive = index === safeIndex;
          const imageUrl = slide.imageUrl || DEFAULT_SLIDES[0].imageUrl;
          return (
            <div
              key={slide.id || index}
              className={cn(
                'absolute inset-0 transition-opacity duration-1000 ease-in-out',
                isActive ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'
              )}
            >
              <img
                src={imageUrl}
                alt={slide.title || 'Sharon Tea and Coffee'}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=2000&q=85';
                }}
                className={cn(
                  'w-full h-full object-cover object-center',
                  isActive && !prefersReducedMotion ? 'animate-ken-burns' : 'scale-100'
                )}
              />
              {/* Rich dark overlay ensuring WCAG AA contrast against any tea image */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/75 to-black/70" />
            </div>
          );
        })}
      </div>

      {/* Main Hero Entrance Content with fixed/reserved layout dimensions preventing CLS */}
      <div className="relative z-10 flex-1 flex items-center justify-center pt-24 pb-12 sm:pt-28 sm:pb-16 min-h-[580px] sm:min-h-[640px]">
        <div
          key={currentSlide.id}
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center w-full"
        >
          {/* Top Badge */}
          <div className={cn(
            "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium text-brand-amber mb-6 shadow-warm min-h-[34px]",
            !prefersReducedMotion && "animate-hero-badge"
          )}>
            {currentSlide.badgeIcon}
            <span>{currentSlide.badgeText}</span>
          </div>

          {/* Hero Headline in Playfair Display with reserved height */}
          <h1 className={cn(
            "font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.15] mb-6 max-w-4xl drop-shadow-md min-h-[96px] sm:min-h-[140px] md:min-h-[160px] flex items-center justify-center",
            !prefersReducedMotion && "animate-hero-headline"
          )}>
            {renderHeadline(currentSlide)}
          </h1>

          {/* Narrative Subtitle with reserved height */}
          <p className={cn(
            "max-w-2xl text-base sm:text-xl text-brand-cream/90 leading-relaxed font-normal mb-10 drop-shadow min-h-[56px] sm:min-h-[64px] flex items-center justify-center",
            !prefersReducedMotion && "animate-hero-paragraph"
          )}>
            {currentSlide.subtitle}
          </p>

          {/* CTA Buttons with reserved height */}
          <div className={cn(
            "flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto min-h-[52px]",
            !prefersReducedMotion && "animate-hero-cta"
          )}>
            {currentSlide.ctaText && currentSlide.ctaLink && (
              <BrandButton
                to={currentSlide.ctaLink}
                variant="primary"
                size="lg"
                className="w-full sm:w-auto px-8 py-3.5 shadow-warm-lg"
                icon={currentSlide.primaryIcon}
              >
                {currentSlide.ctaText}
              </BrandButton>
            )}

            {currentSlide.secondaryCtaText && currentSlide.secondaryCtaLink && (
              <BrandButton
                to={currentSlide.secondaryCtaLink}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-8 py-3.5 border-brand-cream/80 text-brand-cream hover:bg-white hover:text-brand-green"
                icon={currentSlide.secondaryIcon}
              >
                {currentSlide.secondaryCtaText}
              </BrandButton>
            )}
          </div>

          {/* Trust Badges / Social Proof */}
          <div className="grid grid-cols-3 gap-6 sm:gap-12 mt-12 sm:mt-16 pt-8 border-t border-white/15 w-full max-w-3xl">
            <div className="flex flex-col items-center">
              <span className="font-display text-2xl sm:text-3xl font-bold text-brand-amber">
                8,000+
              </span>
              <span className="text-xs sm:text-sm text-white/80 mt-1">Daily Cups Served</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="font-display text-2xl sm:text-3xl font-bold text-brand-amber">
                100%
              </span>
              <span className="text-xs sm:text-sm text-white/80 mt-1">Natural Ingredients</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="font-display text-2xl sm:text-3xl font-bold text-brand-amber">
                15+
              </span>
              <span className="text-xs sm:text-sm text-white/80 mt-1">Signature Blends</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Prev / Next Navigation Arrows */}
      <button
        type="button"
        onClick={goToPrev}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/30 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-amber"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-white group-hover:-translate-x-0.5 transition-transform" />
      </button>

      <button
        type="button"
        onClick={goToNext}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/30 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-amber"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-white group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Animated Pagination Dots and Accessible Controls */}
      <div className="relative z-20 flex items-center justify-center gap-3 pb-6 sm:pb-8">
        <button
          type="button"
          onClick={() => setIsPaused((prev) => !prev)}
          className="p-1.5 rounded-full bg-black/40 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-amber cursor-pointer"
          aria-label={isPaused ? 'Play slide carousel' : 'Pause slide carousel'}
          aria-pressed={isPaused}
        >
          {isPaused ? (
            <Play className="w-3.5 h-3.5 fill-current text-white" />
          ) : (
            <Pause className="w-3.5 h-3.5 fill-current text-white" />
          )}
        </button>

        <div className="flex items-center gap-2">
          {safeSlides.map((slide, idx) => {
            const isActive = idx === safeIndex;
            return (
              <button
                key={slide.id || idx}
                type="button"
                onClick={() => goToSlide(idx)}
                className={cn(
                  'h-2.5 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-amber',
                  isActive
                    ? 'w-8 bg-brand-amber shadow-warm'
                    : 'w-2.5 bg-white/40 hover:bg-white/70'
                )}
                aria-label={`Go to slide ${idx + 1}`}
                aria-current={isActive ? 'true' : 'false'}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
