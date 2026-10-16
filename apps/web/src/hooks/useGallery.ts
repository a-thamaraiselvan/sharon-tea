import { useQuery } from '@tanstack/react-query';
import { getPublicGallery } from '@/services/galleryService';

export function useGallery(category?: string) {
  return useQuery({
    queryKey: ['gallery', category || 'all'],
    queryFn: () => getPublicGallery(category),
    staleTime: 1000 * 5,
    refetchOnMount: true,
  });
}
