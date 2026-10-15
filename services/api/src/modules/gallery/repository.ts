import { query } from '../../database/connection.js';
import { GalleryImageRecord } from '../../types/index.js';

export class GalleryRepository {
  async findPublicImages(category?: string): Promise<GalleryImageRecord[]> {
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

  async createImage(data: {
    image_url: string;
    caption?: string | null;
    category?: string | null;
    sort_order?: number;
  }): Promise<GalleryImageRecord> {
    const sql = `
      INSERT INTO gallery_images (image_url, caption, category, sort_order)
      VALUES ($1, $2, $3, COALESCE($4, 0))
      RETURNING *
    `;
    const res = await query<GalleryImageRecord>(sql, [
      data.image_url,
      data.caption || null,
      data.category || null,
      data.sort_order,
    ]);
    return res.rows[0];
  }

  async updateImage(
    id: string,
    data: {
      image_url?: string;
      caption?: string | null;
      category?: string | null;
      sort_order?: number;
    }
  ): Promise<GalleryImageRecord | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.image_url !== undefined) {
      fields.push(`image_url = $${idx++}`);
      values.push(data.image_url);
    }
    if (data.caption !== undefined) {
      fields.push(`caption = $${idx++}`);
      values.push(data.caption);
    }
    if (data.category !== undefined) {
      fields.push(`category = $${idx++}`);
      values.push(data.category);
    }
    if (data.sort_order !== undefined) {
      fields.push(`sort_order = $${idx++}`);
      values.push(data.sort_order);
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
