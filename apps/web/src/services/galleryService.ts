import apiClient from '@/api/apiClient';
import type { GalleryItem, ApiResponse } from '@/types';

export const FALLBACK_GALLERY: GalleryItem[] = [
  // 1. Indiranagar Head Branch (6 items)
  {
    id: 'g-1',
    title: 'Sharon Indiranagar Head Branch - Morning Brews',
    category: 'indiranagar',
    imageUrl: 'https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/indiranagar_IMG_3241.webp',
    caption: 'Steaming hot chai and signature filter coffee prepared fresh at Sharon Indiranagar.',
    youtubeUrl: 'https://youtube.com/shorts/WfSvL4IWFDQ',
  },
  {
    id: 'g-2',
    title: 'Sharon Indiranagar Head Branch - Busy Morning Counter',
    category: 'indiranagar',
    imageUrl: 'https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/indiranagar_IMG_3243.webp',
    caption: 'The bustling morning counter with patrons enjoying hot brews at Indiranagar.',
    youtubeUrl: 'https://youtube.com/shorts/3GQsvQqf-FU',
  },
  {
    id: 'g-3',
    title: 'Sharon Indiranagar Head Branch - Traditional Brewing Mastery',
    category: 'indiranagar',
    imageUrl: 'https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/indiranagar_IMG_3244.webp',
    caption: 'Traditional brewing mastery and authentic South Indian tea pouring in Indiranagar.',
    youtubeUrl: 'https://youtu.be/e9CNmNKajOA',
  },
  {
    id: 'g-4',
    title: 'Sharon Indiranagar Head Branch - Welcoming Storefront',
    category: 'indiranagar',
    imageUrl: 'https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/indiranagar_IMG_3247.webp',
    caption: 'Warm and welcoming storefront facade of Sharon Tea & Coffee Indiranagar branch.',
    youtubeUrl: 'https://youtu.be/TT4oscwnRBc',
  },
  {
    id: 'g-5',
    title: 'Sharon Indiranagar Head Branch - Fresh Tea Leaves & Snacks',
    category: 'indiranagar',
    imageUrl: 'https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/indiranagar_IMG_3252.webp',
    caption: 'Fresh tea leaves, snacks, and morning hospitality at our Indiranagar outlet.',
    youtubeUrl: 'https://youtu.be/b8GJ_Zassjo',
  },
  {
    id: 'g-6',
    title: 'Sharon Indiranagar Head Branch - Community Conversations',
    category: 'indiranagar',
    imageUrl: 'https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/indiranagar_IMG_3255.webp',
    caption: 'Satisfied patrons and lively community conversations at Sharon Indiranagar.',
    youtubeUrl: 'https://youtube.com/shorts/WfSvL4IWFDQ',
  },

  // 2. New Thippasandra Branch (6 items)
  {
    id: 'g-7',
    title: 'Sharon New Thippasandra Branch - Streetfront Presence',
    category: 'new-thippasandra',
    imageUrl: 'https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/new_thippasandra_IMG_3263.webp',
    caption: 'Vibrant streetfront presence of Sharon Tea Stall New Thippasandra branch.',
    youtubeUrl: 'https://youtube.com/shorts/3GQsvQqf-FU',
  },
  {
    id: 'g-8',
    title: 'Sharon New Thippasandra Branch - Retail Packaged Blends',
    category: 'new-thippasandra',
    imageUrl: 'https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/new_thippasandra_IMG_3265.webp',
    caption: 'Authentic retail packaged tea blends on display at New Thippasandra.',
    youtubeUrl: 'https://youtu.be/TT4oscwnRBc',
  },
  {
    id: 'g-9',
    title: 'Sharon New Thippasandra Branch - Whole Leaf CTC & Spices',
    category: 'new-thippasandra',
    imageUrl: 'https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/new_thippasandra_IMG_3266.webp',
    caption: 'Finest whole-leaf CTC tea with aromatic natural spices at New Thippasandra.',
    youtubeUrl: 'https://youtu.be/e9CNmNKajOA',
  },
  {
    id: 'g-10',
    title: 'Sharon New Thippasandra Branch - Daily Morning Ritual',
    category: 'new-thippasandra',
    imageUrl: 'https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/new_thippasandra_IMG_3270.webp',
    caption: 'Daily morning ritual: professionals and locals gathering at New Thippasandra.',
    youtubeUrl: 'https://youtube.com/shorts/WfSvL4IWFDQ',
  },
  {
    id: 'g-11',
    title: 'Sharon New Thippasandra Branch - Warm Chai Moments',
    category: 'new-thippasandra',
    imageUrl: 'https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/new_thippasandra_IMG_3274.webp',
    caption: 'Shared laughter and warm cutting chai moments at New Thippasandra outlet.',
    youtubeUrl: 'https://youtube.com/shorts/3GQsvQqf-FU',
  },
  {
    id: 'g-12',
    title: 'Sharon New Thippasandra Branch - Golden Aromatic Chai',
    category: 'new-thippasandra',
    imageUrl: 'https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/new_thippasandra_IMG_3286.webp',
    caption: 'Golden aromatic cup of tea served hot at Sharon New Thippasandra.',
    youtubeUrl: 'https://youtu.be/b8GJ_Zassjo',
  },

  // 3. Kaggadasapura Branch (3 items)
  {
    id: 'g-13',
    title: 'Sharon Kaggadasapura Branch - Spacious Cafe Outlet',
    category: 'kaggadasapura',
    imageUrl: 'https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/kaggadasapura_IMG_3288.webp',
    caption: 'Spacious and modern Sharon cafe outlet model at Kaggadasapura.',
    youtubeUrl: 'https://youtu.be/TT4oscwnRBc',
  },
  {
    id: 'g-14',
    title: 'Sharon Kaggadasapura Branch - Cozy Seating & Savouries',
    category: 'kaggadasapura',
    imageUrl: 'https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/kaggadasapura_IMG_3291.webp',
    caption: 'Cozy seating, baked savouries, and premium coffee counter at Kaggadasapura.',
    youtubeUrl: 'https://youtu.be/e9CNmNKajOA',
  },
  {
    id: 'g-15',
    title: 'Sharon Kaggadasapura Branch - Evening Tea & Relaxation',
    category: 'kaggadasapura',
    imageUrl: 'https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/kaggadasapura_IMG_3292.webp',
    caption: 'Relaxing evening moments with comforting brews at Sharon Kaggadasapura.',
    youtubeUrl: 'https://youtube.com/shorts/WfSvL4IWFDQ',
  },
];

export async function getPublicGallery(category?: string): Promise<GalleryItem[]> {
  try {
    const url = category && category !== 'all'
      ? `/Gallery/GetPublicGallery?category=${encodeURIComponent(category)}`
      : '/Gallery/GetPublicGallery';
    const response = await apiClient.get<ApiResponse<GalleryItem[]>>(url);
    if (response.data?.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
      return response.data.data;
    }
  } catch {
    // Return fallback gallery
  }
  return category && category !== 'all'
    ? FALLBACK_GALLERY.filter((item) => item.category === category)
    : FALLBACK_GALLERY;
}
