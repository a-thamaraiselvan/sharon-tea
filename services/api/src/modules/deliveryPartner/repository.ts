import { query } from '../../database/connection.js';
import { DeliveryPartnerRecord } from '../../types/index.js';

export class DeliveryPartnerRepository {
  async findPublic(): Promise<DeliveryPartnerRecord[]> {
    const res = await query<DeliveryPartnerRecord>(
      `SELECT * FROM delivery_partners
       WHERE is_active = true
       ORDER BY sort_order ASC, created_at ASC`
    );
    return res.rows;
  }

  async findAll(): Promise<DeliveryPartnerRecord[]> {
    const res = await query<DeliveryPartnerRecord>(
      `SELECT * FROM delivery_partners
       ORDER BY sort_order ASC, created_at ASC`
    );
    return res.rows;
  }

  async findById(id: string): Promise<DeliveryPartnerRecord | null> {
    const res = await query<DeliveryPartnerRecord>(
      'SELECT * FROM delivery_partners WHERE id = $1',
      [id]
    );
    return res.rows[0] || null;
  }

  async findBySlug(slug: string): Promise<DeliveryPartnerRecord | null> {
    const res = await query<DeliveryPartnerRecord>(
      'SELECT * FROM delivery_partners WHERE slug = $1',
      [slug]
    );
    return res.rows[0] || null;
  }

  async create(data: {
    name: string;
    slug: string;
    logo_url?: string | null;
    partner_url?: string | null;
    badge_text?: string | null;
    description?: string | null;
    sort_order?: number;
    is_active?: boolean;
  }): Promise<DeliveryPartnerRecord> {
    const sql = `
      INSERT INTO delivery_partners (
        name, slug, logo_url, partner_url, badge_text, description, sort_order, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, 0), COALESCE($8, true))
      RETURNING *
    `;
    const res = await query<DeliveryPartnerRecord>(sql, [
      data.name,
      data.slug,
      data.logo_url || null,
      data.partner_url || null,
      data.badge_text || null,
      data.description || null,
      data.sort_order,
      data.is_active,
    ]);
    return res.rows[0];
  }

  async update(
    id: string,
    data: {
      name?: string;
      slug?: string;
      logo_url?: string | null;
      partner_url?: string | null;
      badge_text?: string | null;
      description?: string | null;
      sort_order?: number;
      is_active?: boolean;
    }
  ): Promise<DeliveryPartnerRecord | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${idx++}`);
      values.push(data.name);
    }
    if (data.slug !== undefined) {
      fields.push(`slug = $${idx++}`);
      values.push(data.slug);
    }
    if (data.logo_url !== undefined) {
      fields.push(`logo_url = $${idx++}`);
      values.push(data.logo_url);
    }
    if (data.partner_url !== undefined) {
      fields.push(`partner_url = $${idx++}`);
      values.push(data.partner_url);
    }
    if (data.badge_text !== undefined) {
      fields.push(`badge_text = $${idx++}`);
      values.push(data.badge_text);
    }
    if (data.description !== undefined) {
      fields.push(`description = $${idx++}`);
      values.push(data.description);
    }
    if (data.sort_order !== undefined) {
      fields.push(`sort_order = $${idx++}`);
      values.push(data.sort_order);
    }
    if (data.is_active !== undefined) {
      fields.push(`is_active = $${idx++}`);
      values.push(data.is_active);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const sql = `
      UPDATE delivery_partners
      SET ${fields.join(', ')}
      WHERE id = $${idx}
      RETURNING *
    `;

    const res = await query<DeliveryPartnerRecord>(sql, values);
    return res.rows[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const res = await query('DELETE FROM delivery_partners WHERE id = $1', [id]);
    return (res.rowCount ?? 0) > 0;
  }

  async bulkDelete(ids: string[]): Promise<number> {
    if (!ids || ids.length === 0) return 0;
    const res = await query('DELETE FROM delivery_partners WHERE id = ANY($1)', [ids]);
    return res.rowCount ?? 0;
  }

  async toggleActive(id: string, isActive: boolean): Promise<DeliveryPartnerRecord | null> {
    const res = await query<DeliveryPartnerRecord>(
      'UPDATE delivery_partners SET is_active = $1 WHERE id = $2 RETURNING *',
      [isActive, id]
    );
    return res.rows[0] || null;
  }
}

export const deliveryPartnerRepository = new DeliveryPartnerRepository();
