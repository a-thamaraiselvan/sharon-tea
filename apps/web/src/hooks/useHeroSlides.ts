import { useQuery } from '@tanstack/react-query';
import { getPublicHeroSlides } from '@/services/heroSlideService';

export function useHeroSlides() {
  return useQuery({
    queryKey: ['hero-slides'],
    queryFn: getPublicHeroSlides,
    staleTime: 1000 * 60 * 30,
  });
}
