import { useQuery } from '@tanstack/react-query';
import { getPublicProducts, getProductById } from '@/services/productService';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: getPublicProducts,
    staleTime: 1000 * 5,
    refetchOnMount: true,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 5,
    refetchOnMount: true,
  });
}
