import apiClient from '@/api/apiClient';
import type { HeroSlide, ApiResponse } from '@/types';

export const FALLBACK_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    title: 'Every Cup, A Moment to Savour.',
    subtitle: 'Discover the comforting taste of tea, refreshing beverages, and signature flavours crafted for every moment.',
    ctaText: 'Explore Our Menu',
    ctaLink: '/menu',
    secondaryCtaText: 'Find a Sharon Outlet',
    secondaryCtaLink: '/visit-us',
    imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1920&q=85',
    displayOrder: 1,
    isActive: true,
  },
  {
    id: 'slide-2',
    title: 'Pure Tea. Better Living.',
    subtitle: '100% natural, aromatic tea powders & fresh spice infusions packed straight from tea gardens to your cup.',
    ctaText: 'Shop Tea Packs',
    ctaLink: '/products',
    secondaryCtaText: 'Become a Franchise Partner',
    secondaryCtaLink: '/franchise',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1920&q=85',
    displayOrder: 2,
    isActive: true,
  },
  {
    id: 'slide-3',
    title: 'Warm Gatherings, Timeless Memories.',
    subtitle: 'Experience bubbling brass kettles, genuine camaraderie, and piping hot cutting chai at your local Sharon stall.',
    ctaText: 'Find Your Nearest Stall',
    ctaLink: '/visit-us',
    secondaryCtaText: 'Read Our Story',
    secondaryCtaLink: '/about-us',
    imageUrl: 'https://images.unsplash.com/photo-1596719139451-9b7e30d55653?auto=format&fit=crop&w=1920&q=85',
    displayOrder: 3,
    isActive: true,
  },
];

export async function getPublicHeroSlides(): Promise<HeroSlide[]> {
  try {
    const response = await apiClient.get<ApiResponse<HeroSlide[]>>('/HeroSlide/GetPublicHeroSlides');
    if (response.data?.data && response.data.data.length > 0) {
      return response.data.data;
    }
  } catch {
    // Return fallback slides
  }
  return FALLBACK_HERO_SLIDES;
}
