import apiClient from '@/api/apiClient';
import type { OrderTrackPayload } from '@/types';

export async function trackOrderClick(payload: OrderTrackPayload): Promise<void> {
  try {
    await apiClient.post('/WhatsAppOrder/TrackOrderClick', payload);
  } catch (error) {
    // Non-blocking telemetry
    console.debug('WhatsApp order click recorded locally:', payload);
  }
}
