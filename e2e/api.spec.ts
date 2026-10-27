import { test, expect } from '@playwright/test';

test.describe('Sharon Tea & Coffee API - End-to-End', () => {
  test('Health check endpoint returns 200 and UP status', async ({ request }) => {
    const response = await request.get('/api/v1/health');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.status).toBe('UP');
    expect(body.brand).toContain('Sharon Tea');
    expect(body.environment).toBe('production');
  });

  test('Public Products endpoint returns active menu items', async ({ request }) => {
    const response = await request.get('/api/v1/Product');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThanOrEqual(50);
  });

  test('Product Categories endpoint returns all categories', async ({ request }) => {
    const response = await request.get('/api/v1/ProductCategory');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
  });

  test('Outlets endpoint returns all store locations', async ({ request }) => {
    const response = await request.get('/api/v1/Outlet');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.length).toBe(3);

    const outletNames = body.data.map((o: any) => o.name);
    expect(outletNames.some((n: string) => n.includes('Indiranagar'))).toBe(true);
  });

  test('Gallery endpoint returns 20 permanent WebP images', async ({ request }) => {
    const response = await request.get('/api/v1/Gallery');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.length).toBe(20);
    expect(body.data[0].imageUrl).toContain('.webp');
  });

  test('Auth login rejects invalid credentials', async ({ request }) => {
    const response = await request.post('/api/v1/Auth/Login', {
      data: {
        email: 'invalid@sharon.com',
        password: 'WrongPassword123'
      }
    });
    expect([400, 401]).toContain(response.status());
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  test('Auth login succeeds for admin@sharon.com', async ({ request }) => {
    const response = await request.post('/api/v1/Auth/Login', {
      data: {
        email: 'admin@sharon.com',
        password: 'Sharon@2024'
      }
    });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    const token = body.data?.tokens?.accessToken || body.data?.accessToken;
    expect(token).toBeTruthy();
  });
});
