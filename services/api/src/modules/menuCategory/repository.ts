import { query } from '../../database/connection.js';
import { MenuCategoryRecord } from '../../types/index.js';

export class MenuCategoryRepository {
  async findPublicCategories(type?: string): Promise<MenuCategoryRecord[]> {
    let sql = `SELECT * FROM menu_categories
       WHERE is_active = true AND is_deleted = false`;
    const params: any[] = [];
    if (type) {
      params.push(type);
      sql += ` AND type = $${params.length}`;
    }
    sql += ` ORDER BY sort_order ASC, name ASC`;
    const res = await query<MenuCategoryRecord>(sql, params);
    return res.rows;
  }

  async findAllCategories(type?: string): Promise<MenuCategoryRecord[]> {
    let sql = `SELECT * FROM menu_categories
       WHERE is_deleted = false`;
    const params: any[] = [];
    if (type) {
      params.push(type);
      sql += ` AND type = $${params.length}`;
    }
    sql += ` ORDER BY sort_order ASC, created_at ASC`;
    const res = await query<MenuCategoryRecord>(sql, params);
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

  async createCategory(data: any): Promise<MenuCategoryRecord> {
    const imageUrl = data.image_url ?? data.imageUrl ?? null;
    const sortOrder = Number(data.sort_order ?? data.sortOrder ?? 0);
    const isActive = data.is_active !== undefined ? Boolean(data.is_active) : (data.isActive !== undefined ? Boolean(data.isActive) : true);
    const type = data.type || 'menu';

    const res = await query<MenuCategoryRecord>(
      `INSERT INTO menu_categories (name, slug, description, image_url, sort_order, is_active, type)
       VALUES ($1, $2, $3, $4, COALESCE($5, 0), COALESCE($6, true), COALESCE($7, 'menu'))
       RETURNING *`,
      [
        data.name,
        data.slug,
        data.description || null,
        imageUrl,
        sortOrder,
        isActive,
        type,
      ]
    );
    return res.rows[0];
  }

  async updateCategory(id: string, data: any): Promise<MenuCategoryRecord | null> {
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
    const imageUrl = data.image_url !== undefined ? data.image_url : data.imageUrl;
    if (imageUrl !== undefined) {
      fields.push(`image_url = $${idx++}`);
      values.push(imageUrl);
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
    if (data.type !== undefined) {
      fields.push(`type = $${idx++}`);
      values.push(data.type);
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
