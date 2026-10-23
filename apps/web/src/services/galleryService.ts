import apiClient from '@/api/apiClient';
import type { GalleryItem, ApiResponse } from '@/types';

export const FALLBACK_GALLERY: GalleryItem[] = [
  {
    id: 'g-1',
    title: 'The Sharon Signature Chai Pour',
    category: 'brewing',
    imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
    caption: 'Long meter tea pour creating the iconic Sharon velvety froth.',
    youtubeUrl: 'https://youtube.com/shorts/WfSvL4IWFDQ',
  },
  {
    id: 'g-2',
    title: 'Flagship Tea Stall Experience',
    category: 'store',
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    caption: 'Modern, hygienic, and warm aesthetic at our Cathedral Road hub.',
    youtubeUrl: 'https://youtube.com/shorts/3GQsvQqf-FU',
  },
  {
    id: 'g-3',
    title: 'Whole Spices & Fresh Cardamom',
    category: 'products',
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    caption: 'Pure natural green cardamom and Ceylon cinnamon quills.',
    youtubeUrl: 'https://youtu.be/e9CNmNKajOA',
  },
  {
    id: 'g-4',
    title: 'Morning Rush & Smiling Faces',
    category: 'moments',
    imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
    caption: 'Over 8,000 daily customers start their day with Sharon chai.',
    youtubeUrl: 'https://youtu.be/TT4oscwnRBc',
  },
  {
    id: 'g-5',
    title: 'Sharon Packaged Blends',
    category: 'products',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    caption: 'Artisan tea packets sealed with aroma-lock foil technology.',
    youtubeUrl: 'https://youtu.be/TT4oscwnRBc',
  },
  {
    id: 'g-6',
    title: 'Traditional Brass Filter Coffee',
    category: 'brewing',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    caption: 'Steaming hot decoction and chicory harmony.',
    youtubeUrl: 'https://youtu.be/b8GJ_Zassjo',
  },
  {
    id: 'g-7',
    title: 'Evenings at Sharon Stall',
    category: 'moments',
    imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80',
    caption: 'Connecting friends, coworkers, and families over hot tea.',
    youtubeUrl: 'https://youtube.com/shorts/WfSvL4IWFDQ',
  },
  {
    id: 'g-8',
    title: 'Clean Stainless Counters',
    category: 'store',
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    caption: 'Strict hygiene and standard operating procedures across all outlets.',
    youtubeUrl: 'https://youtube.com/shorts/3GQsvQqf-FU',
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
