import { useQuery } from '@tanstack/react-query';
import { getPublicDeliveryPartners } from '@/services/deliveryPartnerService';

export function useDeliveryPartners() {
  return useQuery({
    queryKey: ['deliveryPartners'],
    queryFn: getPublicDeliveryPartners,
    staleTime: 1000 * 5,
    refetchOnMount: true,
  });
}
