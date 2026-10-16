import { query } from '../../database/connection.js';
import { BusinessSettingRecord } from '../../types/index.js';

export class BusinessSettingRepository {
  async getSettings(): Promise<BusinessSettingRecord | null> {
    const res = await query<BusinessSettingRecord>(
      'SELECT * FROM business_settings ORDER BY created_at ASC LIMIT 1'
    );
    return res.rows[0] || null;
  }

  async updateSettings(data: {
    brand_name?: string;
    tagline?: string | null;
    description?: string | null;
    phone?: string | null;
    email?: string | null;
    whatsapp_number?: string | null;
    address?: string | null;
    operating_hours?: string | null;
    fssai_license?: string | null;
    social_links?: Record<string, string>;
    announcement_text?: string | null;
    announcement_active?: boolean;
  }): Promise<BusinessSettingRecord> {
    const current = await this.getSettings();

    if (!current) {
      // Create if none exists
      const insertSql = `
        INSERT INTO business_settings (
          brand_name, tagline, description, phone, email, whatsapp_number,
          address, operating_hours, fssai_license, social_links, announcement_text, announcement_active
        ) VALUES (
          COALESCE($1, 'Sharon Tea and Coffee'), $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, COALESCE($12, false)
        )
        RETURNING *
      `;
      const res = await query<BusinessSettingRecord>(insertSql, [
        data.brand_name,
        data.tagline || null,
        data.description || null,
        data.phone || null,
        data.email || null,
        data.whatsapp_number || null,
        data.address || null,
        data.operating_hours || null,
        data.fssai_license || null,
        data.social_links ? JSON.stringify(data.social_links) : '{}',
        data.announcement_text || null,
        data.announcement_active,
      ]);
      return res.rows[0];
    }

    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.brand_name !== undefined) {
      fields.push(`brand_name = $${idx++}`);
      values.push(data.brand_name);
    }
    if (data.tagline !== undefined) {
      fields.push(`tagline = $${idx++}`);
      values.push(data.tagline);
    }
    if (data.description !== undefined) {
      fields.push(`description = $${idx++}`);
      values.push(data.description);
    }
    if (data.phone !== undefined) {
      fields.push(`phone = $${idx++}`);
      values.push(data.phone);
    }
    if (data.email !== undefined) {
      fields.push(`email = $${idx++}`);
      values.push(data.email);
    }
    if (data.whatsapp_number !== undefined) {
      fields.push(`whatsapp_number = $${idx++}`);
      values.push(data.whatsapp_number);
    }
    if (data.address !== undefined) {
      fields.push(`address = $${idx++}`);
      values.push(data.address);
    }
    if (data.operating_hours !== undefined) {
      fields.push(`operating_hours = $${idx++}`);
      values.push(data.operating_hours);
    }
    if (data.fssai_license !== undefined) {
      fields.push(`fssai_license = $${idx++}`);
      values.push(data.fssai_license);
    }
    if (data.social_links !== undefined) {
      fields.push(`social_links = $${idx++}`);
      values.push(JSON.stringify(data.social_links));
    }
    if (data.announcement_text !== undefined) {
      fields.push(`announcement_text = $${idx++}`);
      values.push(data.announcement_text);
    }
    if (data.announcement_active !== undefined) {
      fields.push(`announcement_active = $${idx++}`);
      values.push(data.announcement_active);
    }

    if (fields.length === 0) {
      return current;
    }

    values.push(current.id);
    const sql = `
      UPDATE business_settings
      SET ${fields.join(', ')}
      WHERE id = $${idx}
      RETURNING *
    `;

    const res = await query<BusinessSettingRecord>(sql, values);
    return res.rows[0];
  }
}

export const businessSettingRepository = new BusinessSettingRepository();
