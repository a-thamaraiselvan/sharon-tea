import { useQuery } from '@tanstack/react-query';
import { getPublicMenuItems } from '@/services/menuService';

export function useMenuItems(categoryId?: string) {
  return useQuery({
    queryKey: ['menu-items', categoryId || 'all'],
    queryFn: () => getPublicMenuItems(categoryId),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
