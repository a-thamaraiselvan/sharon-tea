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

  async createOutlet(data: any): Promise<OutletRecord> {
    const name = data.name;
    const address = data.address;
    const phone = data.phone || null;
    const operatingHours = data.operating_hours ?? data.operatingHours ?? null;
    const latitude = data.latitude || null;
    const longitude = data.longitude || null;
    const imageUrl = data.image_url ?? data.imageUrl ?? null;
    const mapsUrl = data.maps_url ?? data.mapsUrl ?? data.googleMapsUrl ?? data.google_maps_url ?? null;
    const isActive = data.is_active !== undefined ? Boolean(data.is_active) : (data.isActive !== undefined ? Boolean(data.isActive) : true);
    const sortOrder = Number(data.sort_order ?? data.sortOrder ?? 0);

    const sql = `
      INSERT INTO outlets (
        name, address, phone, operating_hours, latitude, longitude, image_url, maps_url, is_active, sort_order
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, COALESCE($9, true), COALESCE($10, 0))
      RETURNING *
    `;
    const res = await query<OutletRecord>(sql, [
      name,
      address,
      phone,
      operatingHours,
      latitude,
      longitude,
      imageUrl,
      mapsUrl,
      isActive,
      sortOrder,
    ]);
    return res.rows[0];
  }

  async updateOutlet(id: string, data: any): Promise<OutletRecord | null> {
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
    const operatingHours = data.operating_hours !== undefined ? data.operating_hours : data.operatingHours;
    if (operatingHours !== undefined) {
      fields.push(`operating_hours = $${idx++}`);
      values.push(operatingHours);
    }
    if (data.latitude !== undefined) {
      fields.push(`latitude = $${idx++}`);
      values.push(data.latitude);
    }
    if (data.longitude !== undefined) {
      fields.push(`longitude = $${idx++}`);
      values.push(data.longitude);
    }
    const imageUrl = data.image_url !== undefined ? data.image_url : data.imageUrl;
    if (imageUrl !== undefined) {
      fields.push(`image_url = $${idx++}`);
      values.push(imageUrl);
    }
    const mapsUrl = data.maps_url !== undefined ? data.maps_url : (data.mapsUrl ?? data.googleMapsUrl ?? data.google_maps_url);
    if (mapsUrl !== undefined) {
      fields.push(`maps_url = $${idx++}`);
      values.push(mapsUrl);
    }
    const isActive = data.is_active !== undefined ? data.is_active : data.isActive;
    if (isActive !== undefined) {
      fields.push(`is_active = $${idx++}`);
      values.push(Boolean(isActive));
    }
    const sortOrder = data.sort_order !== undefined ? data.sort_order : data.sortOrder;
    if (sortOrder !== undefined) {
      fields.push(`sort_order = $${idx++}`);
      values.push(Number(sortOrder));
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
