import { query } from '../../database/connection.js';
import { FranchiseEnquiryRecord, PaginatedResult } from '../../types/index.js';

export class FranchiseRepository {
  async createEnquiry(data: {
    business_id: string;
    full_name: string;
    phone: string;
    email: string;
    city: string;
    investment_budget: string;
    message?: string | null;
  }): Promise<FranchiseEnquiryRecord> {
    const sql = `
      INSERT INTO franchise_enquiries (
        business_id, full_name, phone, email, city, investment_budget, message, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'new')
      RETURNING *
    `;
    const res = await query<FranchiseEnquiryRecord>(sql, [
      data.business_id,
      data.full_name,
      data.phone,
      data.email,
      data.city,
      data.investment_budget,
      data.message || null,
    ]);
    return res.rows[0];
  }

  async findAllEnquiries(options: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResult<FranchiseEnquiryRecord>> {
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, Math.min(100, options.limit || 20));
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (options.status) {
      conditions.push(`status = $${idx++}`);
      values.push(options.status);
    }

    if (options.search) {
      conditions.push(`(full_name ILIKE $${idx} OR email ILIKE $${idx} OR phone ILIKE $${idx} OR city ILIKE $${idx} OR business_id ILIKE $${idx})`);
      values.push(`%${options.search}%`);
      idx++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countRes = await query<{ total: string }>(
      `SELECT COUNT(*) as total FROM franchise_enquiries ${whereClause}`,
      values
    );
    const total = parseInt(countRes.rows[0].total, 10);

    const dataSql = `
      SELECT * FROM franchise_enquiries
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${idx++} OFFSET $${idx++}
    `;
    values.push(limit, offset);

    const dataRes = await query<FranchiseEnquiryRecord>(dataSql, values);

    return {
      items: dataRes.rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findEnquiryById(id: string): Promise<FranchiseEnquiryRecord | null> {
    const res = await query<FranchiseEnquiryRecord>(
      'SELECT * FROM franchise_enquiries WHERE id = $1',
      [id]
    );
    return res.rows[0] || null;
  }

  async updateEnquiry(
    id: string,
    data: {
      status?: string;
      admin_notes?: string;
    }
  ): Promise<FranchiseEnquiryRecord | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.status !== undefined) {
      fields.push(`status = $${idx++}`);
      values.push(data.status);
    }
    if (data.admin_notes !== undefined) {
      fields.push(`admin_notes = $${idx++}`);
      values.push(data.admin_notes);
    }

    if (fields.length === 0) {
      return this.findEnquiryById(id);
    }

    values.push(id);
    const sql = `
      UPDATE franchise_enquiries
      SET ${fields.join(', ')}
      WHERE id = $${idx}
      RETURNING *
    `;

    const res = await query<FranchiseEnquiryRecord>(sql, values);
    return res.rows[0] || null;
  }

  async deleteEnquiry(id: string): Promise<boolean> {
    const res = await query('DELETE FROM franchise_enquiries WHERE id = $1', [id]);
    return (res.rowCount ?? 0) > 0;
  }
}

export const franchiseRepository = new FranchiseRepository();
