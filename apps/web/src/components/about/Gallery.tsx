import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Play, ExternalLink } from 'lucide-react';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useGallery } from '@/hooks/useGallery';
import { FALLBACK_GALLERY } from '@/services/galleryService';
import { cn } from '@/utils/cn';
import { resolveImageUrl } from '@/utils/imageUrl';

const TABS = [
  { id: 'all', label: 'All Outlets' },
  { id: 'indiranagar', label: 'Indiranagar (Head Branch)' },
  { id: 'new-thippasandra', label: 'New Thippasandra' },
  { id: 'kaggadasapura', label: 'Kaggadasapura' },
];

const CATEGORY_LABELS: Record<string, string> = {
  all: 'All Outlets',
  indiranagar: 'Indiranagar (Head Branch)',
  'new-thippasandra': 'New Thippasandra',
  kaggadasapura: 'Kaggadasapura',
  store: 'Outlets',
  brewing: 'The Brew Art',
  products: 'Tea Blends',
  moments: 'Sharon Moments',
};

const GALLERY_YOUTUBE_URLS = [
  'https://youtube.com/shorts/WfSvL4IWFDQ',
  'https://youtube.com/shorts/3GQsvQqf-FU',
  'https://youtu.be/e9CNmNKajOA',
  'https://youtu.be/TT4oscwnRBc',
  'https://youtu.be/TT4oscwnRBc',
  'https://youtu.be/b8GJ_Zassjo',
];

const getCategoryLabel = (category: string) => CATEGORY_LABELS[category] || category;

const getVideoUrl = (item: { youtubeUrl?: string }, index: number) => {
  return item.youtubeUrl || GALLERY_YOUTUBE_URLS[index % GALLERY_YOUTUBE_URLS.length];
};

/**
 * Asymmetric Bento Grid Spans for responsive layout across screen sizes:
 * - Mobile: Strict 2-column Bento Grid (col-span-1 or col-span-2)
 * - Tablet: 3-column Bento Grid (md:grid-cols-3)
 * - Desktop: 4-column Bento Grid (lg:grid-cols-4)
 */
const getBentoSpanClass = (index: number, total: number) => {
  if (total === 1) {
    return 'col-span-2 md:col-span-3 lg:col-span-4 row-span-2';
  }

  if (total === 2) {
    return 'col-span-2 sm:col-span-1 md:col-span-1 lg:col-span-2 row-span-2';
  }

  const slot = index % 8;
  switch (slot) {
    case 0:
      return 'col-span-2 row-span-2 md:col-span-2 md:row-span-2 lg:col-span-2 lg:row-span-2';
    case 1:
      return 'col-span-1 row-span-1 md:col-span-1 md:row-span-1 lg:col-span-1 lg:row-span-1';
    case 2:
      return 'col-span-1 row-span-1 md:col-span-1 md:row-span-1 lg:col-span-1 lg:row-span-1';
    case 3:
      return 'col-span-2 row-span-1 md:col-span-2 md:row-span-1 lg:col-span-2 lg:row-span-1';
    case 4:
      return 'col-span-1 row-span-2 md:col-span-1 md:row-span-2 lg:col-span-1 lg:row-span-2';
    case 5:
      return 'col-span-1 row-span-1 md:col-span-1 md:row-span-1 lg:col-span-1 lg:row-span-1';
    case 6:
      return 'col-span-1 row-span-1 md:col-span-1 md:row-span-1 lg:col-span-2 lg:row-span-1';
    case 7:
    default:
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
      <div className="reveal-up">
        <SectionHeading
          badge="Moments & Memories"
          title="Life at Sharon Tea and Coffee"
          subtitle="A visual glimpse into our daily brewing rituals, happy patrons, and aromatic packaged tea blends."
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 md:gap-3 mb-8 sm:mb-10 md:mb-14 reveal-fade">
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
                'px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 border flex items-center gap-2 cursor-pointer button-interaction',
                isActive
                  ? 'bg-brand-green text-white border-brand-green shadow-md shadow-brand-green/20 scale-[1.02]'
                  : 'bg-white/80 backdrop-blur-sm text-neutral-700 border-neutral-200 hover:border-[#FC9C34] hover:text-[#FC9C34] hover:bg-white shadow-xs'
              )}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bento Grid: 2-col on Mobile, 3-col on Tablet, 4-col on Desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[160px] sm:auto-rows-[190px] md:auto-rows-[220px] lg:auto-rows-[250px] gap-2.5 sm:gap-3.5 md:gap-4 lg:gap-5 reveal-stagger">
        {filtered.map((item, index) => {
          const isHero = (index % 8) === 0;
          const videoUrl = getVideoUrl(item, index);
          return (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              aria-label={`Watch video: ${item.title}`}
              onClick={() => {
                window.open(videoUrl, '_blank', 'noopener,noreferrer');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  window.open(videoUrl, '_blank', 'noopener,noreferrer');
                }
              }}
              style={{ '--reveal-delay': `${(index % 4) * 50}ms` } as React.CSSProperties}
              className={cn(
                'relative rounded-2xl sm:rounded-3xl overflow-hidden border border-neutral-200/80 shadow-xs bg-brand-black group cursor-pointer hover-lift select-none reveal-scale image-zoom-container',
                getBentoSpanClass(index, filtered.length)
              )}
            >
              {/* Image with hover zoom */}
              <img
                src={resolveImageUrl(item.imageUrl)}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover image-zoom group-hover:scale-105 transition-transform duration-500"
              />

              {/* Floating Top-Left Glass Badge */}
              <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 z-10 pointer-events-none">
                <span className="inline-flex items-center gap-1 sm:gap-1.5 bg-black/60 backdrop-blur-md px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-semibold tracking-wider text-brand-amber border border-white/15 uppercase shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-amber" />
                  {getCategoryLabel(item.category)}
                </span>
              </div>

              {/* Top-Right Badge: Sleek YouTube Video indicator */}
              <div className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 z-10 pointer-events-none">
                <span className="inline-flex items-center gap-1 sm:gap-1.5 bg-black/60 group-hover:bg-red-600/90 text-white backdrop-blur-md px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-medium tracking-wide border border-white/20 shadow-xs transition-colors duration-300">
                  <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-white" />
                  <span>YouTube</span>
                </span>
              </div>

              {/* Upper-Half YouTube Play Icon on hover (Never touches bottom text) */}
              <div className="absolute top-[36%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/65 group-hover:bg-red-600 text-white flex items-center justify-center shadow-2xl backdrop-blur-md border border-white/40 transform scale-85 group-hover:scale-100 transition-all duration-300">
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-white ml-0.5 text-white" />
                </div>
              </div>

              {/* Permanent Readable Bottom Gradient & Typography (No colliding text) */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/65 to-transparent p-3 sm:p-4 md:p-5 flex flex-col justify-end text-white pointer-events-none z-10 pt-10 sm:pt-16">
                <h4
                  className={cn(
                    'font-display font-bold text-white group-hover:text-brand-amber transition-colors leading-snug line-clamp-1 sm:line-clamp-2',
                    isHero ? 'text-xs sm:text-base md:text-xl' : 'text-[11px] sm:text-sm md:text-base'
                  )}
                >
                  {item.title}
                </h4>
                {item.caption && (
                  <p
                    className={cn(
                      'text-neutral-200/90 mt-0.5 sm:mt-1 leading-relaxed',
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
      {currentLightboxItem && lightboxIndex !== null && (() => {
        const currentVideoUrl = getVideoUrl(currentLightboxItem, lightboxIndex);
        return (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={currentLightboxItem.title}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-brand-black/95 backdrop-blur-xl drawer-backdrop"
            onClick={closeLightbox}
          >
            {/* Top Bar: Counter & Close Button */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50 flex items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-medium text-brand-amber tracking-wide shadow-md">
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
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white/90 hover:text-white backdrop-blur-md border border-white/15 transition-all hover:scale-105 cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-brand-amber"
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
                  className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-50 p-3 sm:p-3.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/15 transition-all hover:scale-110 cursor-pointer shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-amber"
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
                  className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-50 p-3 sm:p-3.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/15 transition-all hover:scale-110 cursor-pointer shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-amber"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </>
            )}

            {/* Modal Content Card */}
            <div
              className="relative max-w-5xl w-full max-h-[92vh] flex flex-col rounded-3xl overflow-hidden bg-brand-black/95 border border-white/15 shadow-2xl backdrop-blur-2xl modal-enter"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Showcase */}
              <div
                className="relative flex-1 min-h-[280px] max-h-[68vh] overflow-hidden bg-brand-black flex items-center justify-center p-2 sm:p-4 cursor-pointer group/modal-img"
                onClick={() => {
                  if (currentVideoUrl) {
                    window.open(currentVideoUrl, '_blank', 'noopener,noreferrer');
                  }
                }}
                title="Click to Watch on YouTube"
              >
                <img
                  src={resolveImageUrl(currentLightboxItem.imageUrl)}
                  alt={currentLightboxItem.title}
                  className="max-w-full max-h-[64vh] object-contain rounded-xl select-none group-hover/modal-img:opacity-90 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/modal-img:opacity-100 transition-opacity pointer-events-none">
                  <div className="w-14 h-14 rounded-full bg-red-600/95 text-white flex items-center justify-center shadow-2xl border-2 border-white">
                    <Play className="w-6 h-6 fill-white ml-0.5 text-white" />
                  </div>
                </div>
              </div>

              {/* Caption & Metadata Panel */}
              <div className="p-4 sm:p-6 bg-brand-black text-white border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider text-brand-amber border border-white/15 uppercase">
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

                {/* Prominent Watch on YouTube Action */}
                <div className="shrink-0 pt-2 sm:pt-0">
                  <a
                    href={currentVideoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-lg hover:scale-105 active:scale-95"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Watch on YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-80" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </SectionContainer>
  );
};

export default Gallery;
