import apiClient from '@/api/apiClient';
import type { Outlet, ApiResponse } from '@/types';

export const FALLBACK_OUTLETS: Outlet[] = [
  {
    id: 'outlet-1',
    name: 'Sharon Tea and Coffee - Indiranagar (Head Branch)',
    address: '#34, 2nd Main Road, 1st Stage, Indiranagar, Bangalore - 560038',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560038',
    phone: '+91 98765 43210',
    hours: 'Mon – Sat: 5:30 AM – 11:00 PM (Sunday Holiday)',
    googleMapsUrl: 'https://maps.google.com/?q=%2334,+2nd+Main+Road,+1st+Stage,+Indiranagar,+Bangalore+-+560038',
    embedUrl: 'https://maps.google.com/maps?q=%2334,+2nd+Main+Road,+1st+Stage,+Indiranagar,+Bangalore+-+560038&t=&z=15&ie=UTF8&iwloc=&output=embed',
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    isMainBranch: true,
  },
  {
    id: 'outlet-2',
    name: 'Sharon Tea and Coffee - New Thippasandra',
    address: 'No. 111, New Thippasandra Main Road, Sree Veerajaneya Swamy Seva Samathi, Bangalore - 560075',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560075',
    phone: '+91 98765 43211',
    hours: 'Mon – Sat: 4:30 AM – 10:00 PM (Sunday Holiday)',
    googleMapsUrl: 'https://maps.google.com/?q=No.+111,+New+Thippasandra+Main+Road,+Bangalore+-+560075',
    embedUrl: 'https://maps.google.com/maps?q=No.+111,+New+Thippasandra+Main+Road,+Bangalore+-+560075&t=&z=15&ie=UTF8&iwloc=&output=embed',
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    isMainBranch: false,
  },
  {
    id: 'outlet-3',
    name: 'Sharon Tea and Coffee - Kaggadasapura',
    address: '2nd Floor, Railway Crossing, 40, near MRP, Nagappareddy Layout, Kaggadasapura, Bengaluru, Karnataka - 560093',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560093',
    phone: '+91 98765 43212',
    hours: 'Mon – Sat: 6:00 AM – 11:00 PM (Sunday Holiday)',
    googleMapsUrl: 'https://maps.google.com/?q=40,+Railway+Crossing,+Nagappareddy+Layout,+Kaggadasapura,+Bengaluru+-+560093',
    embedUrl: 'https://maps.google.com/maps?q=40,+Railway+Crossing,+Nagappareddy+Layout,+Kaggadasapura,+Bengaluru+-+560093&t=&z=15&ie=UTF8&iwloc=&output=embed',
    imageUrl: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80',
    isMainBranch: false,
  },
];

export async function getPublicOutlets(): Promise<Outlet[]> {
  try {
    const response = await apiClient.get<ApiResponse<Outlet[]>>('/Outlet/GetPublicOutlets');
    if (response.data?.data && response.data.data.length > 0) {
      return response.data.data;
    }
  } catch {
    // Return fallback outlets
  }
  return FALLBACK_OUTLETS;
}
