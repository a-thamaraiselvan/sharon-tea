import React, { useState, useEffect, useCallback } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useGallery } from '@/hooks/useGallery';
import { FALLBACK_GALLERY } from '@/services/galleryService';
import { cn } from '@/utils/cn';

const TABS = [
  { id: 'all', label: 'All Photos' },
  { id: 'store', label: 'Outlets' },
  { id: 'brewing', label: 'The Brew Art' },
  { id: 'products', label: 'Tea Blends' },
  { id: 'moments', label: 'Sharon Moments' },
];

const CATEGORY_LABELS: Record<string, string> = {
  all: 'All',
  store: 'Outlets',
  brewing: 'The Brew Art',
  products: 'Tea Blends',
  moments: 'Sharon Moments',
};

const getCategoryLabel = (category: string) => CATEGORY_LABELS[category] || category;

/**
 * Asymmetric Bento Grid Spans for responsive layout across screen sizes:
 * - Mobile: Strict 2-column Bento Grid (col-span-1 or col-span-2)
 * - Tablet: 3-column Bento Grid (md:grid-cols-3)
 * - Desktop: 4-column Bento Grid (lg:grid-cols-4)
 */
const getBentoSpanClass = (index: number, total: number) => {
  // If only 1 item exists
  if (total === 1) {
    return 'col-span-2 md:col-span-3 lg:col-span-4 row-span-2';
  }

  // If only 2 items exist (e.g. filtered tab), display as balanced side-by-side hero duo
  if (total === 2) {
    return 'col-span-2 sm:col-span-1 md:col-span-1 lg:col-span-2 row-span-2';
  }

  const slot = index % 8;
  switch (slot) {
    case 0:
      // Item 0 (Hero Showcase): 2 cols wide x 2 rows tall across all screens
      return 'col-span-2 row-span-2 md:col-span-2 md:row-span-2 lg:col-span-2 lg:row-span-2';
    case 1:
      // Item 1: 1 col x 1 row (compact square companion)
      return 'col-span-1 row-span-1 md:col-span-1 md:row-span-1 lg:col-span-1 lg:row-span-1';
    case 2:
      // Item 2: 1 col x 1 row (compact square companion)
      return 'col-span-1 row-span-1 md:col-span-1 md:row-span-1 lg:col-span-1 lg:row-span-1';
    case 3:
      // Item 3: 2 cols wide x 1 row tall (panoramic banner on mobile & desktop)
      return 'col-span-2 row-span-1 md:col-span-2 md:row-span-1 lg:col-span-2 lg:row-span-1';
    case 4:
      // Item 4: 1 col wide x 2 rows tall (tall vertical portrait card)
      return 'col-span-1 row-span-2 md:col-span-1 md:row-span-2 lg:col-span-1 lg:row-span-2';
    case 5:
      // Item 5: 1 col x 1 row (stacks next to tall card on right)
      return 'col-span-1 row-span-1 md:col-span-1 md:row-span-1 lg:col-span-1 lg:row-span-1';
    case 6:
      // Item 6: 1 col x 1 row on mobile (stacks below item 5 next to tall card); 2 cols on desktop
      return 'col-span-1 row-span-1 md:col-span-1 md:row-span-1 lg:col-span-2 lg:row-span-1';
    case 7:
    default:
      // Item 7: 2 cols on mobile (wide closer); 1 col on tablet/desktop
      return 'col-span-2 row-span-1 md:col-span-1 md:row-span-1 lg:col-span-1 lg:row-span-1';
  }
};

export const Gallery: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const { data: galleryItems } = useGallery(activeTab);

  const items = galleryItems && galleryItems.length > 0 ? galleryItems : FALLBACK_GALLERY;
  const filtered = activeTab === 'all' ? items : items.filter((it) => it.category === activeTab);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const goToPrevious = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + filtered.length) % filtered.length : null));
  }, [filtered.length]);

  const goToNext = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % filtered.length : null));
  }, [filtered.length]);

  // Keyboard navigation & body scroll lock for Lightbox modal
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [lightboxIndex, closeLightbox, goToPrevious, goToNext]);

  const currentLightboxItem = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <SectionContainer background="cream" className="py-14 sm:py-20 md:py-28">
      <div data-aos="fade-up">
        <SectionHeading
          badge="Moments & Memories"
          title="Life at Sharon Tea Stall"
          subtitle="A visual glimpse into our daily brewing rituals, happy patrons, and aromatic packaged tea blends."
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 md:gap-3 mb-8 sm:mb-10 md:mb-14" data-aos="fade-down">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setLightboxIndex(null);
              }}
              className={cn(
                'px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 border flex items-center gap-2 cursor-pointer',
                isActive
                  ? 'bg-brand-green text-white border-brand-green shadow-md shadow-brand-green/20 scale-[1.02]'
                  : 'bg-white/80 backdrop-blur-sm text-neutral-700 border-neutral-200 hover:border-brand-green/60 hover:text-brand-green hover:bg-white shadow-xs'
              )}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bento Grid: 2-col on Mobile, 3-col on Tablet, 4-col on Desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[160px] sm:auto-rows-[190px] md:auto-rows-[220px] lg:auto-rows-[250px] gap-2.5 sm:gap-3.5 md:gap-4 lg:gap-5">
        {filtered.map((item, index) => {
          const isHero = (index % 8) === 0;
          return (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              aria-label={`Open photo: ${item.title}`}
              onClick={() => setLightboxIndex(index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setLightboxIndex(index);
                }
              }}
              data-aos="zoom-in"
              data-aos-delay={(index % 4) * 40}
              className={cn(
                'relative rounded-2xl sm:rounded-3xl overflow-hidden border border-amber-950/10 shadow-xs bg-neutral-900 group cursor-pointer hover:shadow-warm-xl transition-all duration-300 select-none',
                getBentoSpanClass(index, filtered.length)
              )}
            >
              {/* Image */}
              <img
                src={item.imageUrl}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Floating Top-Left Glass Badge */}
              <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 z-10">
                <span className="inline-flex items-center gap-1 sm:gap-1.5 bg-black/55 backdrop-blur-md px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-semibold tracking-wider text-[#FCD34D] border border-white/15 uppercase shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  {getCategoryLabel(item.category)}
                </span>
              </div>

              {/* Expand / Zoom Indicator on Hover */}
              <div
                className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-10 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 shadow-lg"
                title="View Fullscreen"
              >
                <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-200" />
              </div>

              {/* Permanent Readable Bottom Gradient & Typography */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 sm:p-5 md:p-6 flex flex-col justify-end text-white pointer-events-none z-10 pt-8 sm:pt-14">
                <h4
                  className={cn(
                    'font-display font-bold text-white group-hover:text-amber-200 transition-colors leading-tight line-clamp-1 sm:line-clamp-2',
                    isHero ? 'text-xs sm:text-base md:text-xl' : 'text-[11px] sm:text-sm md:text-base'
                  )}
                >
                  {item.title}
                </h4>
                {item.caption && (
                  <p
                    className={cn(
                      'text-neutral-200/90 mt-0.5 sm:mt-1.5 leading-relaxed',
                      isHero
                        ? 'text-[10px] sm:text-xs md:text-sm line-clamp-2'
                        : 'hidden sm:block text-[10px] sm:text-xs line-clamp-1'
                    )}
                  >
                    {item.caption}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Lightbox / Fullscreen Modal */}
      {currentLightboxItem && lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={currentLightboxItem.title}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/90 backdrop-blur-xl animate-fade-in"
          onClick={closeLightbox}
        >
          {/* Top Bar: Counter & Close Button */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50 flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-medium text-amber-200 tracking-wide shadow-md">
              {lightboxIndex + 1} of {filtered.length}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            aria-label="Close modal"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white/90 hover:text-white backdrop-blur-md border border-white/15 transition-all hover:scale-105 cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left/Right Navigation Buttons */}
          {filtered.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                aria-label="Previous photo"
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-50 p-3 sm:p-3.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/15 transition-all hover:scale-110 cursor-pointer shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                aria-label="Next photo"
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-50 p-3 sm:p-3.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/15 transition-all hover:scale-110 cursor-pointer shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </>
          )}

          {/* Modal Content Card */}
          <div
            className="relative max-w-5xl w-full max-h-[92vh] flex flex-col rounded-3xl overflow-hidden bg-neutral-950/90 border border-white/15 shadow-2xl backdrop-blur-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Showcase */}
            <div className="relative flex-1 min-h-[280px] max-h-[68vh] overflow-hidden bg-black flex items-center justify-center p-2 sm:p-4">
              <img
                src={currentLightboxItem.imageUrl}
                alt={currentLightboxItem.title}
                className="max-w-full max-h-[64vh] object-contain rounded-xl select-none"
              />
            </div>

            {/* Caption & Metadata Panel */}
            <div className="p-4 sm:p-6 bg-gradient-to-b from-neutral-900/95 to-neutral-950 text-white border-t border-white/10 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider text-[#FCD34D] border border-white/15 uppercase">
                  {getCategoryLabel(currentLightboxItem.category)}
                </span>
              </div>
              <h3 className="font-display text-lg sm:text-2xl font-bold text-white">
                {currentLightboxItem.title}
              </h3>
              {currentLightboxItem.caption && (
                <p className="text-xs sm:text-base text-neutral-300 mt-1 sm:mt-1.5 leading-relaxed max-w-2xl">
                  {currentLightboxItem.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </SectionContainer>
  );
};

export default Gallery;
