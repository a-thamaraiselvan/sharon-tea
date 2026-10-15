import { useQuery } from '@tanstack/react-query';
import { getPublicOutlets } from '@/services/outletService';

export function useOutlets() {
  return useQuery({
    queryKey: ['outlets'],
    queryFn: getPublicOutlets,
    staleTime: 1000 * 60 * 30,
  });
}
