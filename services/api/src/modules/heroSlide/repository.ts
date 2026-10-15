import { query } from '../../database/connection.js';
import { HeroSlideRecord } from '../../types/index.js';

export class HeroSlideRepository {
  async findPublicSlides(): Promise<HeroSlideRecord[]> {
    const res = await query<HeroSlideRecord>(
      `SELECT * FROM hero_slides
       WHERE is_active = true
       ORDER BY sort_order ASC, created_at ASC`
    );
    return res.rows;
  }

  async findAllSlides(): Promise<HeroSlideRecord[]> {
    const res = await query<HeroSlideRecord>(
      `SELECT * FROM hero_slides
       ORDER BY sort_order ASC, created_at DESC`
    );
    return res.rows;
  }

  async findSlideById(id: string): Promise<HeroSlideRecord | null> {
    const res = await query<HeroSlideRecord>('SELECT * FROM hero_slides WHERE id = $1', [id]);
    return res.rows[0] || null;
  }

  async createSlide(data: {
    title: string;
    subtitle?: string | null;
    image_url: string;
    cta_text?: string | null;
    cta_link?: string | null;
    sort_order?: number;
    is_active?: boolean;
  }): Promise<HeroSlideRecord> {
    const sql = `
      INSERT INTO hero_slides (
        title, subtitle, image_url, cta_text, cta_link, sort_order, is_active
      ) VALUES ($1, $2, $3, $4, $5, COALESCE($6, 0), COALESCE($7, true))
      RETURNING *
    `;
    const res = await query<HeroSlideRecord>(sql, [
      data.title,
      data.subtitle || null,
      data.image_url,
      data.cta_text || null,
      data.cta_link || null,
      data.sort_order,
      data.is_active,
    ]);
    return res.rows[0];
  }

  async updateSlide(
    id: string,
    data: {
      title?: string;
      subtitle?: string | null;
      image_url?: string;
      cta_text?: string | null;
      cta_link?: string | null;
      sort_order?: number;
      is_active?: boolean;
    }
  ): Promise<HeroSlideRecord | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.title !== undefined) {
      fields.push(`title = $${idx++}`);
      values.push(data.title);
    }
    if (data.subtitle !== undefined) {
      fields.push(`subtitle = $${idx++}`);
      values.push(data.subtitle);
    }
    if (data.image_url !== undefined) {
      fields.push(`image_url = $${idx++}`);
      values.push(data.image_url);
    }
    if (data.cta_text !== undefined) {
      fields.push(`cta_text = $${idx++}`);
      values.push(data.cta_text);
    }
    if (data.cta_link !== undefined) {
      fields.push(`cta_link = $${idx++}`);
      values.push(data.cta_link);
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
      return this.findSlideById(id);
    }

    values.push(id);
    const sql = `
      UPDATE hero_slides
      SET ${fields.join(', ')}
      WHERE id = $${idx}
      RETURNING *
    `;

    const res = await query<HeroSlideRecord>(sql, values);
    return res.rows[0] || null;
  }

  async deleteSlide(id: string): Promise<boolean> {
    const res = await query('DELETE FROM hero_slides WHERE id = $1', [id]);
    return (res.rowCount ?? 0) > 0;
  }
}

export const heroSlideRepository = new HeroSlideRepository();
