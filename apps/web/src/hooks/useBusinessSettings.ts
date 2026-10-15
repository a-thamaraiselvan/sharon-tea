import { useQuery } from '@tanstack/react-query';
import { getPublicBusinessSettings } from '@/services/businessSettingsService';

export function useBusinessSettings() {
  return useQuery({
    queryKey: ['business-settings'],
    queryFn: getPublicBusinessSettings,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
