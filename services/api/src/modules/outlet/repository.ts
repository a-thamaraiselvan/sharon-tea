import { query } from '../../database/connection.js';
import { OutletRecord } from '../../types/index.js';

export class OutletRepository {
  async findPublicOutlets(): Promise<OutletRecord[]> {
    const res = await query<OutletRecord>(
      `SELECT * FROM outlets
       WHERE is_active = true
       ORDER BY name ASC`
    );
    return res.rows;
  }

  async findAllOutlets(): Promise<OutletRecord[]> {
    const res = await query<OutletRecord>(
      `SELECT * FROM outlets
       ORDER BY created_at DESC`
    );
    return res.rows;
  }

  async findOutletById(id: string): Promise<OutletRecord | null> {
    const res = await query<OutletRecord>('SELECT * FROM outlets WHERE id = $1', [id]);
    return res.rows[0] || null;
  }

  async createOutlet(data: {
    name: string;
    address: string;
    phone?: string | null;
    operating_hours?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    image_url?: string | null;
    maps_url?: string | null;
    is_active?: boolean;
  }): Promise<OutletRecord> {
    const sql = `
      INSERT INTO outlets (
        name, address, phone, operating_hours, latitude, longitude, image_url, maps_url, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, COALESCE($9, true))
      RETURNING *
    `;
    const res = await query<OutletRecord>(sql, [
      data.name,
      data.address,
      data.phone || null,
      data.operating_hours || null,
      data.latitude || null,
      data.longitude || null,
      data.image_url || null,
      data.maps_url || null,
      data.is_active,
    ]);
    return res.rows[0];
  }

  async updateOutlet(
    id: string,
    data: {
      name?: string;
      address?: string;
      phone?: string | null;
      operating_hours?: string | null;
      latitude?: number | null;
      longitude?: number | null;
      image_url?: string | null;
      maps_url?: string | null;
      is_active?: boolean;
    }
  ): Promise<OutletRecord | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${idx++}`);
      values.push(data.name);
    }
    if (data.address !== undefined) {
      fields.push(`address = $${idx++}`);
      values.push(data.address);
    }
    if (data.phone !== undefined) {
      fields.push(`phone = $${idx++}`);
      values.push(data.phone);
    }
    if (data.operating_hours !== undefined) {
      fields.push(`operating_hours = $${idx++}`);
      values.push(data.operating_hours);
    }
    if (data.latitude !== undefined) {
      fields.push(`latitude = $${idx++}`);
      values.push(data.latitude);
    }
    if (data.longitude !== undefined) {
      fields.push(`longitude = $${idx++}`);
      values.push(data.longitude);
    }
    if (data.image_url !== undefined) {
      fields.push(`image_url = $${idx++}`);
      values.push(data.image_url);
    }
    if (data.maps_url !== undefined) {
      fields.push(`maps_url = $${idx++}`);
      values.push(data.maps_url);
    }
    if (data.is_active !== undefined) {
      fields.push(`is_active = $${idx++}`);
      values.push(data.is_active);
    }

    if (fields.length === 0) {
      return this.findOutletById(id);
    }

    values.push(id);
    const sql = `
      UPDATE outlets
      SET ${fields.join(', ')}
      WHERE id = $${idx}
      RETURNING *
    `;

    const res = await query<OutletRecord>(sql, values);
    return res.rows[0] || null;
  }

  async deleteOutlet(id: string): Promise<boolean> {
    const res = await query('DELETE FROM outlets WHERE id = $1', [id]);
    return (res.rowCount ?? 0) > 0;
  }
}

export const outletRepository = new OutletRepository();
