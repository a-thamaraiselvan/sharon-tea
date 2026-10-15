import { query } from '../../database/connection.js';
import { ProductRecord, PaginatedResult } from '../../types/index.js';

export class ProductRepository {
  async findPublicProducts(): Promise<ProductRecord[]> {
    const res = await query<ProductRecord>(
      `SELECT * FROM products
       WHERE is_available = true AND is_deleted = false
       ORDER BY created_at ASC`
    );
    return res.rows;
  }

  async findPublicProductByIdOrSlug(idOrSlug: string): Promise<ProductRecord | null> {
    // Check if idOrSlug looks like a UUID
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

    let res;
    if (isUUID) {
      res = await query<ProductRecord>(
        `SELECT * FROM products
         WHERE (id = $1 OR slug = $2) AND is_available = true AND is_deleted = false`,
        [idOrSlug, idOrSlug]
      );
    } else {
      res = await query<ProductRecord>(
        `SELECT * FROM products
         WHERE slug = $1 AND is_available = true AND is_deleted = false`,
        [idOrSlug]
      );
    }

    return res.rows[0] || null;
  }

  async findAllProducts(options: {
    search?: string;
    isAvailable?: boolean;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResult<ProductRecord>> {
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, Math.min(100, options.limit || 20));
    const offset = (page - 1) * limit;

    const conditions: string[] = ['is_deleted = false'];
    const values: any[] = [];
    let idx = 1;

    if (options.isAvailable !== undefined) {
      conditions.push(`is_available = $${idx++}`);
      values.push(options.isAvailable);
    }

    if (options.search) {
      conditions.push(`(name ILIKE $${idx} OR short_description ILIKE $${idx} OR ingredients ILIKE $${idx})`);
      values.push(`%${options.search}%`);
      idx++;
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;

    const countRes = await query<{ total: string }>(
      `SELECT COUNT(*) as total FROM products ${whereClause}`,
      values
    );
    const total = parseInt(countRes.rows[0].total, 10);

    const dataSql = `
      SELECT * FROM products
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${idx++} OFFSET $${idx++}
    `;
    values.push(limit, offset);

    const dataRes = await query<ProductRecord>(dataSql, values);

    return {
      items: dataRes.rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findProductById(id: string): Promise<ProductRecord | null> {
    const res = await query<ProductRecord>(
      'SELECT * FROM products WHERE id = $1 AND is_deleted = false',
      [id]
    );
    return res.rows[0] || null;
  }

  async findProductBySlug(slug: string): Promise<ProductRecord | null> {
    const res = await query<ProductRecord>(
      'SELECT * FROM products WHERE slug = $1 AND is_deleted = false',
      [slug]
    );
    return res.rows[0] || null;
  }

  async createProduct(data: {
    name: string;
    slug: string;
    category?: string | null;
    badge?: string | null;
    is_featured?: boolean;
    short_description?: string | null;
    description?: string | null;
    price: number;
    original_price?: number | null;
    pack_size?: string | null;
    ingredients?: string | null;
    preparation_instructions?: string | null;
    image_url?: string | null;
    is_available?: boolean;
  }): Promise<ProductRecord> {
    const sql = `
      INSERT INTO products (
        name, slug, category, badge, is_featured, short_description, description, price, original_price,
        pack_size, ingredients, preparation_instructions, image_url, is_available
      ) VALUES ($1, $2, $3, $4, COALESCE($5, false), $6, $7, $8, $9, $10, $11, $12, $13, COALESCE($14, true))
      RETURNING *
    `;
    const res = await query<ProductRecord>(sql, [
      data.name,
      data.slug,
      data.category || null,
      data.badge || null,
      data.is_featured,
      data.short_description || null,
      data.description || null,
      data.price,
      data.original_price || null,
      data.pack_size || null,
      data.ingredients || null,
      data.preparation_instructions || null,
      data.image_url || null,
      data.is_available,
    ]);
    return res.rows[0];
  }

  async updateProduct(
    id: string,
    data: {
      name?: string;
      slug?: string;
      category?: string | null;
      badge?: string | null;
      is_featured?: boolean;
      short_description?: string | null;
      description?: string | null;
      price?: number;
      original_price?: number | null;
      pack_size?: string | null;
      ingredients?: string | null;
      preparation_instructions?: string | null;
      image_url?: string | null;
      is_available?: boolean;
    }
  ): Promise<ProductRecord | null> {
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
    if (data.category !== undefined) {
      fields.push(`category = $${idx++}`);
      values.push(data.category);
    }
    if (data.badge !== undefined) {
      fields.push(`badge = $${idx++}`);
      values.push(data.badge);
    }
    if (data.is_featured !== undefined) {
      fields.push(`is_featured = $${idx++}`);
      values.push(data.is_featured);
    }
    if (data.short_description !== undefined) {
      fields.push(`short_description = $${idx++}`);
      values.push(data.short_description);
    }
    if (data.description !== undefined) {
      fields.push(`description = $${idx++}`);
      values.push(data.description);
    }
    if (data.price !== undefined) {
      fields.push(`price = $${idx++}`);
      values.push(data.price);
    }
    if (data.original_price !== undefined) {
      fields.push(`original_price = $${idx++}`);
      values.push(data.original_price);
    }
    if (data.pack_size !== undefined) {
      fields.push(`pack_size = $${idx++}`);
      values.push(data.pack_size);
    }
    if (data.ingredients !== undefined) {
      fields.push(`ingredients = $${idx++}`);
      values.push(data.ingredients);
    }
    if (data.preparation_instructions !== undefined) {
      fields.push(`preparation_instructions = $${idx++}`);
      values.push(data.preparation_instructions);
    }
    if (data.image_url !== undefined) {
      fields.push(`image_url = $${idx++}`);
      values.push(data.image_url);
    }
    if (data.is_available !== undefined) {
      fields.push(`is_available = $${idx++}`);
      values.push(data.is_available);
    }

    if (fields.length === 0) {
      return this.findProductById(id);
    }

    values.push(id);
    const sql = `
      UPDATE products
      SET ${fields.join(', ')}
      WHERE id = $${idx} AND is_deleted = false
      RETURNING *
    `;

    const res = await query<ProductRecord>(sql, values);
    return res.rows[0] || null;
  }

  async softDeleteProduct(id: string): Promise<boolean> {
    const res = await query(
      `UPDATE products
       SET is_deleted = true, is_available = false
       WHERE id = $1 AND is_deleted = false`,
      [id]
    );
    return (res.rowCount ?? 0) > 0;
  }
}

export const productRepository = new ProductRepository();
