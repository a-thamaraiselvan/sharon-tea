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

  async createSlide(data: any): Promise<HeroSlideRecord> {
    const title = data.title;
    const subtitle = data.subtitle || null;
    const imageUrl = data.image_url ?? data.imageUrl;
    const ctaText = data.cta_text ?? data.ctaText ?? null;
    const ctaLink = data.cta_link ?? data.ctaLink ?? null;
    const secondaryCtaText = data.secondary_cta_text ?? data.secondaryCtaText ?? null;
    const secondaryCtaLink = data.secondary_cta_link ?? data.secondaryCtaLink ?? null;
    const sortOrder = Number(data.sort_order ?? data.sortOrder ?? 0);
    const isActive = data.is_active !== undefined ? Boolean(data.is_active) : (data.isActive !== undefined ? Boolean(data.isActive) : true);

    const sql = `
      INSERT INTO hero_slides (
        title, subtitle, image_url, cta_text, cta_link, secondary_cta_text, secondary_cta_link, sort_order, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8, 0), COALESCE($9, true))
      RETURNING *
    `;
    const res = await query<HeroSlideRecord>(sql, [
      title,
      subtitle,
      imageUrl,
      ctaText,
      ctaLink,
      secondaryCtaText,
      secondaryCtaLink,
      sortOrder,
      isActive,
    ]);
    return res.rows[0];
  }

  async updateSlide(id: string, data: any): Promise<HeroSlideRecord | null> {
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
    const imageUrl = data.image_url !== undefined ? data.image_url : data.imageUrl;
    if (imageUrl !== undefined) {
      fields.push(`image_url = $${idx++}`);
      values.push(imageUrl);
    }
    const ctaText = data.cta_text !== undefined ? data.cta_text : data.ctaText;
    if (ctaText !== undefined) {
      fields.push(`cta_text = $${idx++}`);
      values.push(ctaText);
    }
    const ctaLink = data.cta_link !== undefined ? data.cta_link : data.ctaLink;
    if (ctaLink !== undefined) {
      fields.push(`cta_link = $${idx++}`);
      values.push(ctaLink);
    }
    const secondaryCtaText = data.secondary_cta_text !== undefined ? data.secondary_cta_text : data.secondaryCtaText;
    if (secondaryCtaText !== undefined) {
      fields.push(`secondary_cta_text = $${idx++}`);
      values.push(secondaryCtaText);
    }
    const secondaryCtaLink = data.secondary_cta_link !== undefined ? data.secondary_cta_link : data.secondaryCtaLink;
    if (secondaryCtaLink !== undefined) {
      fields.push(`secondary_cta_link = $${idx++}`);
      values.push(secondaryCtaLink);
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
