import { query } from '../../database/connection.js';
import { GalleryImageRecord } from '../../types/index.js';

export class GalleryRepository {
  async findPublicImages(category?: string): Promise<GalleryImageRecord[]> {
    const values: any[] = [];
    let sql = 'SELECT * FROM gallery_images WHERE is_active = true';

    if (category) {
      values.push(category);
      sql += ' AND category = $1';
    }

    sql += ' ORDER BY sort_order ASC, created_at DESC';

    const res = await query<GalleryImageRecord>(sql, values);
    return res.rows;
  }

  async findAllImages(category?: string): Promise<GalleryImageRecord[]> {
    const values: any[] = [];
    let sql = 'SELECT * FROM gallery_images';

    if (category) {
      values.push(category);
      sql += ' WHERE category = $1';
    }

    sql += ' ORDER BY sort_order ASC, created_at DESC';

    const res = await query<GalleryImageRecord>(sql, values);
    return res.rows;
  }

  async findImageById(id: string): Promise<GalleryImageRecord | null> {
    const res = await query<GalleryImageRecord>(
      'SELECT * FROM gallery_images WHERE id = $1',
      [id]
    );
    return res.rows[0] || null;
  }

  async createImage(data: any): Promise<GalleryImageRecord> {
    const imageUrl = data.image_url ?? data.imageUrl;
    const caption = data.caption ?? null;
    const category = data.category ?? null;
    const sortOrder = Number(data.sort_order ?? data.sortOrder ?? 0);
    const isActive = data.is_active !== undefined ? Boolean(data.is_active) : (data.isActive !== undefined ? Boolean(data.isActive) : true);

    const sql = `
      INSERT INTO gallery_images (image_url, caption, category, sort_order, is_active)
      VALUES ($1, $2, $3, COALESCE($4, 0), COALESCE($5, true))
      RETURNING *
    `;
    const res = await query<GalleryImageRecord>(sql, [
      imageUrl,
      caption,
      category,
      sortOrder,
      isActive,
    ]);
    return res.rows[0];
  }

  async updateImage(id: string, data: any): Promise<GalleryImageRecord | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    const imageUrl = data.image_url !== undefined ? data.image_url : data.imageUrl;
    if (imageUrl !== undefined) {
      fields.push(`image_url = $${idx++}`);
      values.push(imageUrl);
    }
    if (data.caption !== undefined) {
      fields.push(`caption = $${idx++}`);
      values.push(data.caption);
    }
    if (data.category !== undefined) {
      fields.push(`category = $${idx++}`);
      values.push(data.category);
    }
    const sortOrder = data.sort_order !== undefined ? data.sort_order : data.sortOrder;
    if (sortOrder !== undefined) {
      fields.push(`sort_order = $${idx++}`);
      values.push(Number(sortOrder));
    }
    const isActive = data.is_active !== undefined ? data.is_active : data.isActive;
    if (isActive !== undefined) {
      fields.push(`is_active = $${idx++}`);
      values.push(Boolean(isActive));
    }

    if (fields.length === 0) {
      return this.findImageById(id);
    }

    values.push(id);
    const sql = `
      UPDATE gallery_images
      SET ${fields.join(', ')}
      WHERE id = $${idx}
      RETURNING *
    `;

    const res = await query<GalleryImageRecord>(sql, values);
    return res.rows[0] || null;
  }

  async deleteImage(id: string): Promise<boolean> {
    const res = await query('DELETE FROM gallery_images WHERE id = $1', [id]);
    return (res.rowCount ?? 0) > 0;
  }
}

export const galleryRepository = new GalleryRepository();
