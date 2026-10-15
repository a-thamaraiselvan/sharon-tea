import { query } from '../../database/connection.js';
import { WhatsappOrderClickRecord } from '../../types/index.js';

export interface WhatsappAnalytics {
  totalClicks: number;
  totalQuantity: number;
  byProduct: Array<{
    product_name: string;
    click_count: number;
    total_quantity: number;
  }>;
  recentClicks: WhatsappOrderClickRecord[];
  dailyTrends: Array<{
    date: string;
    count: number;
  }>;
}

export class WhatsappOrderRepository {
  async logClick(data: {
    business_id?: string | null;
    product_id?: string | null;
    product_name: string;
    quantity: number;
    customer_phone?: string | null;
  }): Promise<WhatsappOrderClickRecord> {
    const res = await query<WhatsappOrderClickRecord>(
      `INSERT INTO whatsapp_order_clicks (business_id, product_id, product_name, quantity, customer_phone)
       VALUES ($1, $2, $3, COALESCE($4, 1), $5)
       RETURNING *`,
      [
        data.business_id || null,
        data.product_id || null,
        data.product_name,
        data.quantity,
        data.customer_phone || null,
      ]
    );
    return res.rows[0];
  }

  async getAnalytics(): Promise<WhatsappAnalytics> {
    // 1. Total counts
    const totalRes = await query<{ total_clicks: string; total_quantity: string }>(
      `SELECT
        COUNT(*) as total_clicks,
        COALESCE(SUM(quantity), 0) as total_quantity
       FROM whatsapp_order_clicks`
    );

    // 2. By Product
    const byProductRes = await query<{
      product_name: string;
      click_count: string;
      total_quantity: string;
    }>(
      `SELECT
        product_name,
        COUNT(*) as click_count,
        COALESCE(SUM(quantity), 0) as total_quantity
       FROM whatsapp_order_clicks
       GROUP BY product_name
       ORDER BY click_count DESC
       LIMIT 10`
    );

    // 3. Daily trends (last 30 days)
    const trendsRes = await query<{ date: string; count: string }>(
      `SELECT
        TO_CHAR(created_at, 'YYYY-MM-DD') as date,
        COUNT(*) as count
       FROM whatsapp_order_clicks
       WHERE created_at >= NOW() - INTERVAL '30 days'
       GROUP BY TO_CHAR(created_at, 'YYYY-MM-DD')
       ORDER BY date ASC`
    );

    // 4. Recent clicks
    const recentRes = await query<WhatsappOrderClickRecord>(
      `SELECT * FROM whatsapp_order_clicks
       ORDER BY created_at DESC
       LIMIT 20`
    );

    return {
      totalClicks: parseInt(totalRes.rows[0]?.total_clicks || '0', 10),
      totalQuantity: parseInt(totalRes.rows[0]?.total_quantity || '0', 10),
      byProduct: byProductRes.rows.map((r) => ({
        product_name: r.product_name,
        click_count: parseInt(r.click_count, 10),
        total_quantity: parseInt(r.total_quantity, 10),
      })),
      recentClicks: recentRes.rows,
      dailyTrends: trendsRes.rows.map((r) => ({
        date: r.date,
        count: parseInt(r.count, 10),
      })),
    };
  }
}

export const whatsappOrderRepository = new WhatsappOrderRepository();
