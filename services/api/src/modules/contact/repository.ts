import { query } from '../../database/connection.js';
import { ContactEnquiryRecord, PaginatedResult } from '../../types/index.js';

export class ContactRepository {
  async createEnquiry(data: {
    business_id: string;
    name: string;
    email: string;
    phone?: string | null;
    message: string;
  }): Promise<ContactEnquiryRecord> {
    const sql = `
      INSERT INTO contact_enquiries (business_id, name, email, phone, message, status)
      VALUES ($1, $2, $3, $4, $5, 'new')
      RETURNING *
    `;
    const res = await query<ContactEnquiryRecord>(sql, [
      data.business_id,
      data.name,
      data.email,
      data.phone || null,
      data.message,
    ]);
    return res.rows[0];
  }

  async findAllEnquiries(options: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResult<ContactEnquiryRecord>> {
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
      conditions.push(`(name ILIKE $${idx} OR email ILIKE $${idx} OR phone ILIKE $${idx} OR business_id ILIKE $${idx})`);
      values.push(`%${options.search}%`);
      idx++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countRes = await query<{ total: string }>(
      `SELECT COUNT(*) as total FROM contact_enquiries ${whereClause}`,
      values
    );
    const total = parseInt(countRes.rows[0].total, 10);

    const dataSql = `
      SELECT * FROM contact_enquiries
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${idx++} OFFSET $${idx++}
    `;
    values.push(limit, offset);

    const dataRes = await query<ContactEnquiryRecord>(dataSql, values);

    return {
      items: dataRes.rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findEnquiryById(id: string): Promise<ContactEnquiryRecord | null> {
    const res = await query<ContactEnquiryRecord>(
      'SELECT * FROM contact_enquiries WHERE id = $1',
      [id]
    );
    return res.rows[0] || null;
  }

  async updateEnquiry(
    id: string,
    data: {
      status?: string;
    }
  ): Promise<ContactEnquiryRecord | null> {
    if (!data.status) {
      return this.findEnquiryById(id);
    }

    const sql = `
      UPDATE contact_enquiries
      SET status = $1
      WHERE id = $2
      RETURNING *
    `;
    const res = await query<ContactEnquiryRecord>(sql, [data.status, id]);
    return res.rows[0] || null;
  }

  async deleteEnquiry(id: string): Promise<boolean> {
    const res = await query('DELETE FROM contact_enquiries WHERE id = $1', [id]);
    return (res.rowCount ?? 0) > 0;
  }
}

export const contactRepository = new ContactRepository();
