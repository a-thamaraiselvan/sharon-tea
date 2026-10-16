import { apiClient } from '../lib/apiClient';
import {
  Outlet,
  CreateOutletInput,
  UpdateOutletInput,
  ApiResponse,
} from '../types';

const normalizeOutlet = (o: any): Outlet => ({
  id: o.id,
  name: o.name,
  slug: o.slug || o.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  address: o.address,
  phone: o.phone,
  operatingHours: o.operatingHours || o.operating_hours || o.hours || '6:00 AM - 11:00 PM Daily',
  latitude: o.latitude ? Number(o.latitude) : undefined,
  longitude: o.longitude ? Number(o.longitude) : undefined,
  googleMapsUrl: o.googleMapsUrl || o.google_maps_url || o.maps_url || o.mapsUrl || '',
  imageUrl: o.imageUrl || o.image_url || undefined,
  isActive: Boolean(o.isActive ?? o.is_active ?? true),
  sortOrder: Number(o.sortOrder ?? o.sort_order ?? 0),
  createdAt: o.createdAt || o.created_at || '',
  updatedAt: o.updatedAt || o.updated_at || '',
});

export const outletService = {
  async getAll(): Promise<Outlet[]> {
    const response = await apiClient.get<ApiResponse<Outlet[]>>('/Outlet/GetOutlets');
    const items = response.data.data || [];
    return items.map(normalizeOutlet);
  },

  async getById(id: string): Promise<Outlet> {
    const response = await apiClient.get<ApiResponse<Outlet>>(`/Outlet/GetOutletById/${id}`);
    return normalizeOutlet(response.data.data);
  },

  async create(data: CreateOutletInput): Promise<Outlet> {
    const payload = {
      ...data,
      operatingHours: data.operatingHours,
      operating_hours: data.operatingHours,
      googleMapsUrl: data.googleMapsUrl,
      google_maps_url: data.googleMapsUrl,
      maps_url: data.googleMapsUrl,
      imageUrl: data.imageUrl,
      image_url: data.imageUrl,
      isActive: data.isActive,
      is_active: data.isActive,
      sortOrder: data.sortOrder,
      sort_order: data.sortOrder,
    };
    const response = await apiClient.post<ApiResponse<Outlet>>('/Outlet/CreateOutlet', payload);
    return normalizeOutlet(response.data.data);
  },

  async update(id: string, data: UpdateOutletInput): Promise<Outlet> {
    const payload: any = { ...data };
    if (data.operatingHours !== undefined) {
      payload.operatingHours = data.operatingHours;
      payload.operating_hours = data.operatingHours;
    }
    if (data.googleMapsUrl !== undefined) {
      payload.googleMapsUrl = data.googleMapsUrl;
      payload.google_maps_url = data.googleMapsUrl;
      payload.maps_url = data.googleMapsUrl;
    }
    if (data.imageUrl !== undefined) {
      payload.imageUrl = data.imageUrl;
      payload.image_url = data.imageUrl;
    }
    if (data.isActive !== undefined) {
      payload.isActive = data.isActive;
      payload.is_active = data.isActive;
    }
    if (data.sortOrder !== undefined) {
      payload.sortOrder = data.sortOrder;
      payload.sort_order = data.sortOrder;
    }
    const response = await apiClient.put<ApiResponse<Outlet>>(`/Outlet/UpdateOutlet/${id}`, payload);
    return normalizeOutlet(response.data.data);
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/Outlet/DeleteOutlet/${id}`);
  },

  async toggleActive(id: string, isActive: boolean): Promise<Outlet> {
    const response = await apiClient.put<ApiResponse<Outlet>>(`/Outlet/UpdateOutlet/${id}`, {
      isActive,
    });
    return response.data.data;
  },
};
