import { useQuery } from '@tanstack/react-query';
import { getPublicMenuCategories } from '@/services/menuService';

export function useMenuCategories() {
  return useQuery({
    queryKey: ['menu-categories'],
    queryFn: getPublicMenuCategories,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}
