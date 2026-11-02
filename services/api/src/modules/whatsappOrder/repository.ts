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
  // Extended shapes for Admin Panel & Dashboard compatibility
  summary: {
    totalClicks: number;
    uniqueProducts: number;
    mostPopularProduct: {
      name: string;
      clicks: number;
    } | null;
  };
  products: Array<{
    productId: string;
    productName: string;
    totalClicks: number;
    lastClickDate: string;
  }>;
  dailyClicks: Array<{
    date: string;
    clicks: number;
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

    const totalClicksNum = parseInt(totalRes.rows[0]?.total_clicks || '0', 10);
    const totalQuantityNum = parseInt(totalRes.rows[0]?.total_quantity || '0', 10);
    const byProductList = byProductRes.rows.map((r) => ({
      product_name: r.product_name,
      click_count: parseInt(r.click_count, 10),
      total_quantity: parseInt(r.total_quantity, 10),
    }));
    const dailyTrendsList = trendsRes.rows.map((r) => ({
      date: r.date,
      count: parseInt(r.count, 10),
    }));

    // Find latest click date for each product from recentClicks
    const lastClickMap: Record<string, string> = {};
    for (const click of recentRes.rows) {
      if (!lastClickMap[click.product_name]) {
        lastClickMap[click.product_name] = click.created_at ? new Date(click.created_at).toISOString() : new Date().toISOString();
      }
    }

    const mostPopular = byProductList.length > 0
      ? { name: byProductList[0].product_name, clicks: byProductList[0].click_count }
      : null;

    return {
      totalClicks: totalClicksNum,
      totalQuantity: totalQuantityNum,
      byProduct: byProductList,
      recentClicks: recentRes.rows,
      dailyTrends: dailyTrendsList,
      summary: {
        totalClicks: totalClicksNum,
        uniqueProducts: byProductList.length,
        mostPopularProduct: mostPopular,
      },
      products: byProductList.map((p, idx) => ({
        productId: `p-${idx + 1}`,
        productName: p.product_name,
        totalClicks: p.click_count,
        lastClickDate: lastClickMap[p.product_name] || new Date().toISOString(),
      })),
      dailyClicks: dailyTrendsList.map((d) => ({
        date: d.date,
        clicks: d.count,
      })),
    };
  }
}

export const whatsappOrderRepository = new WhatsappOrderRepository();
