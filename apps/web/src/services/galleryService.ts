import apiClient from '@/api/apiClient';
import type { GalleryItem, ApiResponse } from '@/types';

export const FALLBACK_GALLERY: GalleryItem[] = [
  {
    id: 'g-1',
    title: 'Sharon Flagship Storefront',
    category: 'store',
    imageUrl: '/gallery/IMG_3264.webp',
    caption: 'Iconic Sharon Tea Stall outlet with heritage branding since 2007.',
    youtubeUrl: 'https://youtube.com/shorts/WfSvL4IWFDQ',
  },
  {
    id: 'g-2',
    title: 'Artisan Packaged Tea Range',
    category: 'products',
    imageUrl: '/gallery/IMG_3265.webp',
    caption: 'Sharon Masala Tea and Regular Tea retail packs sealed for freshness.',
    youtubeUrl: 'https://youtu.be/TT4oscwnRBc',
  },
  {
    id: 'g-3',
    title: 'Signature Chai Blends Shelf',
    category: 'products',
    imageUrl: '/gallery/IMG_3266.webp',
    caption: 'Finest whole-leaf CTC tea crafted with traditional South Indian spices.',
    youtubeUrl: 'https://youtu.be/e9CNmNKajOA',
  },
  {
    id: 'g-4',
    title: 'Heritage Brand Crest',
    category: 'store',
    imageUrl: '/gallery/IMG_3267.webp',
    caption: 'The proud Sharon Tea Stall seal representing quality brewing since 2007.',
    youtubeUrl: 'https://youtube.com/shorts/3GQsvQqf-FU',
  },
  {
    id: 'g-5',
    title: 'Bustling Service Counter',
    category: 'store',
    imageUrl: '/gallery/IMG_3268.webp',
    caption: 'Fast-paced, friendly service serving hundreds of warm cups every morning.',
    youtubeUrl: 'https://youtube.com/shorts/WfSvL4IWFDQ',
  },
  {
    id: 'g-6',
    title: 'Illuminated Outlet Signage',
    category: 'store',
    imageUrl: '/gallery/IMG_3269.webp',
    caption: 'Welcoming glowing facade guiding tea lovers across Bengaluru.',
    youtubeUrl: 'https://youtube.com/shorts/3GQsvQqf-FU',
  },
  {
    id: 'g-7',
    title: 'Morning Rush & Friendly Gatherings',
    category: 'moments',
    imageUrl: '/gallery/IMG_3270.webp',
    caption: 'Locals and professionals gathering for their daily energizing tea ritual.',
    youtubeUrl: 'https://youtu.be/TT4oscwnRBc',
  },
  {
    id: 'g-8',
    title: 'Vibrant Bengaluru Street Life',
    category: 'moments',
    imageUrl: '/gallery/IMG_3271.webp',
    caption: 'The heartbeat of Bengaluru: catching up over steaming cutting chai.',
    youtubeUrl: 'https://youtu.be/TT4oscwnRBc',
  },
  {
    id: 'g-9',
    title: 'Everyday Tea Stories',
    category: 'moments',
    imageUrl: '/gallery/IMG_3274.webp',
    caption: 'Shared laughter, daily news discussions, and fresh chai moments.',
    youtubeUrl: 'https://youtube.com/shorts/WfSvL4IWFDQ',
  },
  {
    id: 'g-10',
    title: 'Bilingual Heritage Signboard',
    category: 'store',
    imageUrl: '/gallery/IMG_3275.webp',
    caption: 'Deeply rooted in Karnataka with authentic regional hospitality.',
    youtubeUrl: 'https://youtube.com/shorts/3GQsvQqf-FU',
  },
  {
    id: 'g-11',
    title: 'Garden City Atmosphere',
    category: 'store',
    imageUrl: '/gallery/IMG_3276.webp',
    caption: 'A cup of tea under Bengaluru tree canopy shade.',
    youtubeUrl: 'https://youtu.be/e9CNmNKajOA',
  },
  {
    id: 'g-12',
    title: 'Hot Cutting Chai Ready to Serve',
    category: 'brewing',
    imageUrl: '/gallery/IMG_3278.webp',
    caption: 'Freshly strained, piping hot tea in classic transparent cutting glasses.',
    youtubeUrl: 'https://youtube.com/shorts/WfSvL4IWFDQ',
  },
  {
    id: 'g-13',
    title: 'Master Tea Brewing Craft',
    category: 'brewing',
    imageUrl: '/gallery/IMG_3279.webp',
    caption: 'Handcrafted decoction, fresh milk, and aromatic spices blended to perfection.',
    youtubeUrl: 'https://youtu.be/b8GJ_Zassjo',
  },
  {
    id: 'g-14',
    title: 'Savoring the Perfect Sip',
    category: 'moments',
    imageUrl: '/gallery/IMG_3285.webp',
    caption: 'Real moments of refreshment that keep Bengaluru moving forward.',
    youtubeUrl: 'https://youtu.be/TT4oscwnRBc',
  },
  {
    id: 'g-15',
    title: 'Warmth in Every Glass',
    category: 'moments',
    imageUrl: '/gallery/IMG_3286.webp',
    caption: 'Rich golden chai held with care on a breezy Bangalore morning.',
    youtubeUrl: 'https://youtube.com/shorts/WfSvL4IWFDQ',
  },
  {
    id: 'g-16',
    title: 'Steaming Tea Boilers',
    category: 'brewing',
    imageUrl: '/gallery/IMG_3287.webp',
    caption: 'Continuous steaming boilers maintaining pure water and decoction temperature.',
    youtubeUrl: 'https://youtu.be/b8GJ_Zassjo',
  },
  {
    id: 'g-17',
    title: 'Modern Cafe Outlet Experience',
    category: 'store',
    imageUrl: '/gallery/IMG_3288.webp',
    caption: 'Expanded Sharon cafe model with complete beverage and snack counters.',
    youtubeUrl: 'https://youtube.com/shorts/3GQsvQqf-FU',
  },
  {
    id: 'g-18',
    title: 'Handcrafted Menu Board',
    category: 'products',
    imageUrl: '/gallery/IMG_3289.webp',
    caption: 'Wide variety of teas, coffees, herbal blends, and malt specials.',
    youtubeUrl: 'https://youtu.be/e9CNmNKajOA',
  },
  {
    id: 'g-19',
    title: 'Snack Counter & Seating',
    category: 'store',
    imageUrl: '/gallery/IMG_3291.webp',
    caption: 'Crisp snacks, baked goods, and cozy seating to enjoy your brew.',
    youtubeUrl: 'https://youtube.com/shorts/3GQsvQqf-FU',
  },
  {
    id: 'g-20',
    title: 'Evening Conversations',
    category: 'moments',
    imageUrl: '/gallery/IMG_3292.webp',
    caption: 'Unwinding after a busy day with a comforting cup of Sharon tea.',
    youtubeUrl: 'https://youtu.be/TT4oscwnRBc',
  },
];

export async function getPublicGallery(category?: string): Promise<GalleryItem[]> {
  try {
    const url = category && category !== 'all' ? `/Gallery/GetPublicGallery?category=${category}` : '/Gallery/GetPublicGallery';
    const response = await apiClient.get<ApiResponse<GalleryItem[]>>(url);
    if (response.data?.data && response.data.data.length > 0) {
      return response.data.data;
    }
  } catch {
    // Return fallback gallery
  }

  if (category && category !== 'all') {
    return FALLBACK_GALLERY.filter((item) => item.category === category);
  }
  return FALLBACK_GALLERY;
}
