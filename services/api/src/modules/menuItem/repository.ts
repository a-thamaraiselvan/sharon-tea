import { query } from '../../database/connection.js';
import { MenuItemRecord, PaginatedResult } from '../../types/index.js';

export class MenuItemRepository {
  async findPublicItems(categoryId?: string): Promise<MenuItemRecord[]> {
    const values: any[] = [];
    let sql = `
      SELECT m.*, c.name as category_name, c.slug as category_slug
      FROM menu_items m
      JOIN menu_categories c ON m.category_id = c.id
      WHERE m.is_deleted = false
        AND m.is_available = true
        AND c.is_active = true
        AND c.is_deleted = false
    `;

    if (categoryId) {
      values.push(categoryId);
      sql += ` AND m.category_id = $${values.length}`;
    }

    sql += ' ORDER BY c.sort_order ASC, m.sort_order ASC, m.name ASC';

    const res = await query<MenuItemRecord>(sql, values);
    return res.rows;
  }

  async findAllItems(options: {
    categoryId?: string;
    search?: string;
    isAvailable?: boolean;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResult<MenuItemRecord>> {
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, Math.min(100, options.limit || 50));
    const offset = (page - 1) * limit;

    const conditions: string[] = ['m.is_deleted = false'];
    const values: any[] = [];
    let idx = 1;

    if (options.categoryId) {
      conditions.push(`m.category_id = $${idx++}`);
      values.push(options.categoryId);
    }

    if (options.isAvailable !== undefined) {
      conditions.push(`m.is_available = $${idx++}`);
      values.push(options.isAvailable);
    }

    if (options.search) {
      conditions.push(`(m.name ILIKE $${idx} OR m.short_description ILIKE $${idx})`);
      values.push(`%${options.search}%`);
      idx++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countSql = `
      SELECT COUNT(*) as total
      FROM menu_items m
      ${whereClause}
    `;
    const countRes = await query<{ total: string }>(countSql, values);
    const total = parseInt(countRes.rows[0].total, 10);

    const itemsSql = `
      SELECT m.*, c.name as category_name, c.slug as category_slug
      FROM menu_items m
      LEFT JOIN menu_categories c ON m.category_id = c.id
      ${whereClause}
      ORDER BY c.sort_order ASC, m.sort_order ASC, m.created_at DESC
      LIMIT $${idx++} OFFSET $${idx++}
    `;
    values.push(limit, offset);

    const itemsRes = await query<MenuItemRecord>(itemsSql, values);

    return {
      items: itemsRes.rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findItemById(id: string): Promise<MenuItemRecord | null> {
    const sql = `
      SELECT m.*, c.name as category_name, c.slug as category_slug
      FROM menu_items m
      LEFT JOIN menu_categories c ON m.category_id = c.id
      WHERE m.id = $1 AND m.is_deleted = false
    `;
    const res = await query<MenuItemRecord>(sql, [id]);
    return res.rows[0] || null;
  }

  async createItem(data: {
    category_id: string;
    name: string;
    slug: string;
    short_description?: string | null;
    price: number;
    image_url?: string | null;
    is_available?: boolean;
    sort_order?: number;
  }): Promise<MenuItemRecord> {
    const sql = `
      INSERT INTO menu_items (
        category_id, name, slug, short_description, price, image_url, is_available, sort_order
      ) VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, true), COALESCE($8, 0))
      RETURNING *
    `;
    const res = await query<MenuItemRecord>(sql, [
      data.category_id,
      data.name,
      data.slug,
      data.short_description || null,
      data.price,
      data.image_url || null,
      data.is_available,
      data.sort_order,
    ]);
    return res.rows[0];
  }

  async updateItem(
    id: string,
    data: {
      category_id?: string;
      name?: string;
      slug?: string;
      short_description?: string | null;
      price?: number;
      image_url?: string | null;
      is_available?: boolean;
      sort_order?: number;
    }
  ): Promise<MenuItemRecord | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.category_id !== undefined) {
      fields.push(`category_id = $${idx++}`);
      values.push(data.category_id);
    }
    if (data.name !== undefined) {
      fields.push(`name = $${idx++}`);
      values.push(data.name);
    }
    if (data.slug !== undefined) {
      fields.push(`slug = $${idx++}`);
      values.push(data.slug);
    }
    if (data.short_description !== undefined) {
      fields.push(`short_description = $${idx++}`);
      values.push(data.short_description);
    }
    if (data.price !== undefined) {
      fields.push(`price = $${idx++}`);
      values.push(data.price);
    }
    if (data.image_url !== undefined) {
      fields.push(`image_url = $${idx++}`);
      values.push(data.image_url);
    }
    if (data.is_available !== undefined) {
      fields.push(`is_available = $${idx++}`);
      values.push(data.is_available);
    }
    if (data.sort_order !== undefined) {
      fields.push(`sort_order = $${idx++}`);
      values.push(data.sort_order);
    }

    if (fields.length === 0) {
      return this.findItemById(id);
    }

    values.push(id);
    const sql = `
      UPDATE menu_items
      SET ${fields.join(', ')}
      WHERE id = $${idx} AND is_deleted = false
      RETURNING *
    `;

    const res = await query<MenuItemRecord>(sql, values);
    return res.rows[0] || null;
  }

  async toggleAvailability(id: string, isAvailable?: boolean): Promise<MenuItemRecord | null> {
    let sql: string;
    let params: any[];

    if (isAvailable !== undefined) {
      sql = `
        UPDATE menu_items
        SET is_available = $1
        WHERE id = $2 AND is_deleted = false
        RETURNING *
      `;
      params = [isAvailable, id];
    } else {
      sql = `
        UPDATE menu_items
        SET is_available = NOT is_available
        WHERE id = $1 AND is_deleted = false
        RETURNING *
      `;
      params = [id];
    }

    const res = await query<MenuItemRecord>(sql, params);
    return res.rows[0] || null;
  }

  async softDeleteItem(id: string): Promise<boolean> {
    const res = await query(
      `UPDATE menu_items
       SET is_deleted = true, is_available = false
       WHERE id = $1 AND is_deleted = false`,
      [id]
    );
    return (res.rowCount ?? 0) > 0;
  }
}

export const menuItemRepository = new MenuItemRepository();
