import { test, expect } from '@playwright/test';

test.describe('Sharon Tea & Coffee Admin Portal - End-to-End', () => {
  test('Login page renders with branding and input fields', async ({ page }) => {
    await page.goto('/login');

    // Verify Title & Branding
    await expect(page.locator('h1')).toContainText('Sharon Tea and Coffee');
    await expect(page.getByText('Official Management Portal')).toBeVisible();
    await expect(page.getByText('Admin Login')).toBeVisible();

    // Verify Inputs & Submit Button
    await expect(page.getByPlaceholder('Enter email id')).toBeVisible();
    await expect(page.getByPlaceholder('Enter password')).toBeVisible();
    await expect(page.getByRole('button', { name: /Sign In/i })).toBeVisible();
  });

  test('Shows validation error on invalid login credentials', async ({ page }) => {
    await page.goto('/login');

    await page.getByPlaceholder('Enter email id').fill('invalid@sharon.com');
    await page.getByPlaceholder('Enter password').fill('WrongPassword123');
    await page.getByRole('button', { name: /Sign In/i }).click();

    // Verify error notification / alert appears
    const alertOrMessage = page.locator('.ant-alert, .ant-message');
    await expect(alertOrMessage.first()).toBeVisible({ timeout: 10000 });
  });

  test('Successful login with admin@sharon.com navigates to Dashboard', async ({ page }) => {
    await page.goto('/login');

    await page.getByPlaceholder('Enter email id').fill('admin@sharon.com');
    await page.getByPlaceholder('Enter password').fill('Sharon@2024');
    await page.getByRole('button', { name: /Sign In/i }).click();

    // Successfully redirects away from /login to Dashboard
    await expect(page).not.toHaveURL(/\/login/, { timeout: 15000 });

    // Verify Dashboard layout & navigation elements
    await expect(page.locator('.ant-layout').first()).toBeVisible();
    await expect(page.getByText(/Sharon Tea and Coffee Admin/i)).toBeVisible();
  });

  test('Admin can navigate to Menu Items page and see items', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.getByPlaceholder('Enter email id').fill('admin@sharon.com');
    await page.getByPlaceholder('Enter password').fill('Sharon@2024');
    await page.getByRole('button', { name: /Sign In/i }).click();
    await expect(page).not.toHaveURL(/\/login/, { timeout: 15000 });

    // Navigate to Menu Items
    await page.goto('/menu-items');
    await expect(page.locator('.ant-table').first()).toBeVisible({ timeout: 15000 });

    // Verify table has items
    const rows = page.locator('.ant-table-row');
    await expect(rows.first()).toBeVisible();
  });

  test('Admin can navigate to Outlets page and see Bangalore locations', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('Enter email id').fill('admin@sharon.com');
    await page.getByPlaceholder('Enter password').fill('Sharon@2024');
    await page.getByRole('button', { name: /Sign In/i }).click();
    await expect(page).not.toHaveURL(/\/login/, { timeout: 15000 });

    await page.goto('/outlets');
    await expect(page.getByText(/Indiranagar|Koramangala|Whitefield/i).first()).toBeVisible({ timeout: 15000 });
  });

  test('Admin can navigate to Gallery page and see image cards', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('Enter email id').fill('admin@sharon.com');
    await page.getByPlaceholder('Enter password').fill('Sharon@2024');
    await page.getByRole('button', { name: /Sign In/i }).click();
    await expect(page).not.toHaveURL(/\/login/, { timeout: 15000 });

    await page.goto('/gallery');
    await expect(page.locator('img').first()).toBeVisible({ timeout: 15000 });
  });
});
