import { query } from '../../database/connection.js';
import { MenuCategoryRecord } from '../../types/index.js';

export class MenuCategoryRepository {
  async findPublicCategories(): Promise<MenuCategoryRecord[]> {
    const res = await query<MenuCategoryRecord>(
      `SELECT * FROM menu_categories
       WHERE is_active = true AND is_deleted = false
       ORDER BY sort_order ASC, name ASC`
    );
    return res.rows;
  }

  async findAllCategories(): Promise<MenuCategoryRecord[]> {
    const res = await query<MenuCategoryRecord>(
      `SELECT * FROM menu_categories
       WHERE is_deleted = false
       ORDER BY sort_order ASC, created_at ASC`
    );
    return res.rows;
  }

  async findCategoryById(id: string): Promise<MenuCategoryRecord | null> {
    const res = await query<MenuCategoryRecord>(
      'SELECT * FROM menu_categories WHERE id = $1 AND is_deleted = false',
      [id]
    );
    return res.rows[0] || null;
  }

  async findCategoryBySlug(slug: string): Promise<MenuCategoryRecord | null> {
    const res = await query<MenuCategoryRecord>(
      'SELECT * FROM menu_categories WHERE slug = $1 AND is_deleted = false',
      [slug]
    );
    return res.rows[0] || null;
  }

  async createCategory(data: {
    name: string;
    slug: string;
    description?: string | null;
    image_url?: string | null;
    sort_order?: number;
    is_active?: boolean;
  }): Promise<MenuCategoryRecord> {
    const res = await query<MenuCategoryRecord>(
      `INSERT INTO menu_categories (name, slug, description, image_url, sort_order, is_active)
       VALUES ($1, $2, $3, $4, COALESCE($5, 0), COALESCE($6, true))
       RETURNING *`,
      [
        data.name,
        data.slug,
        data.description || null,
        data.image_url || null,
        data.sort_order,
        data.is_active,
      ]
    );
    return res.rows[0];
  }

  async updateCategory(
    id: string,
    data: {
      name?: string;
      slug?: string;
      description?: string | null;
      image_url?: string | null;
      sort_order?: number;
      is_active?: boolean;
    }
  ): Promise<MenuCategoryRecord | null> {
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
    if (data.description !== undefined) {
      fields.push(`description = $${idx++}`);
      values.push(data.description);
    }
    if (data.image_url !== undefined) {
      fields.push(`image_url = $${idx++}`);
      values.push(data.image_url);
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
      return this.findCategoryById(id);
    }

    values.push(id);
    const sql = `
      UPDATE menu_categories
      SET ${fields.join(', ')}
      WHERE id = $${idx} AND is_deleted = false
      RETURNING *
    `;

    const res = await query<MenuCategoryRecord>(sql, values);
    return res.rows[0] || null;
  }

  async softDeleteCategory(id: string): Promise<boolean> {
    const res = await query(
      `UPDATE menu_categories
       SET is_deleted = true, is_active = false
       WHERE id = $1 AND is_deleted = false`,
      [id]
    );
    return (res.rowCount ?? 0) > 0;
  }
}

export const menuCategoryRepository = new MenuCategoryRepository();
