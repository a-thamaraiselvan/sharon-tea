import { test, expect } from '@playwright/test';

test.describe('Sharon Tea & Coffee Web App - End-to-End', () => {
  test('Homepage loads with branding, hero, and header navigation', async ({ page }) => {
    await page.goto('/');

    // Check brand title
    await expect(page).toHaveTitle(/Sharon Tea and Coffee/i);
    await expect(page.locator('header')).toBeVisible();

    // Check main navigation links in header nav
    const nav = page.locator('header nav');
    await expect(nav.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Menu', exact: true })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Products', exact: true })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Franchise', exact: true }).first()).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Visit Us', exact: true })).toBeVisible();

    // Check Footer renders
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('footer')).toContainText('Sharon Tea and Coffee');
    // Ensure no novacodex link in footer
    await expect(page.locator('footer')).not.toContainText('Novacodex');
  });

  test('Menu page renders categories and beverage items', async ({ page }) => {
    await page.goto('/menu');

    // Heading
    await expect(page.locator('h1')).toContainText(/Beverage/i);

    // Menu category tabs/buttons
    const categoryButtons = page.locator('button:has-text("Tea"), button:has-text("Coffee"), button:has-text("All")');
    await expect(categoryButtons.first()).toBeVisible({ timeout: 10000 });

    // Menu items grid renders beverage cards
    const menuGrid = page.locator('#menu-items-grid');
    await expect(menuGrid).toBeVisible({ timeout: 15000 });
    const itemCards = menuGrid.locator('img, h3, h4');
    await expect(itemCards.first()).toBeVisible({ timeout: 15000 });
  });

  test('Products page displays retail packaged blends and handles Add to Cart', async ({ page }) => {
    await page.goto('/products');

    // Heading
    await expect(page.locator('h1')).toContainText(/Sharon/i);

    // Find first "Add ... to cart" button
    const addToCartBtn = page.locator('button[aria-label*="Add"][aria-label*="to cart"]').first();
    await expect(addToCartBtn).toBeVisible({ timeout: 15000 });

    // Click "Add to Cart"
    await addToCartBtn.click();

    // CRITICAL UI TEST:
    // Verify Cart Drawer DOES NOT automatically pop open upon adding
    // The cart drawer should remain closed until the user explicitly clicks the cart icon
    const cartDrawer = page.locator('.ant-drawer-content:has-text("Your Cart")');
    await expect(cartDrawer).not.toBeVisible();

    // Verify cart header badge counter is updated
    const cartButton = page.locator('header button[aria-label*="View cart"]');
    await expect(cartButton).toBeVisible();

    // Now manually click the cart button
    await cartButton.click();

    // Cart Drawer should now be open
    await expect(cartDrawer).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Your Cart')).toBeVisible();

    // Close cart drawer
    const closeBtn = page.locator('.ant-drawer-close, button[aria-label="Close"]').first();
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
      await expect(cartDrawer).not.toBeVisible();
    }
  });

  test('Outlets (Visit Us) page renders 3 Bangalore locations', async ({ page }) => {
    await page.goto('/visit-us');

    await expect(page.locator('h1')).toContainText(/Visit Sharon Tea/i);

    // Verify Bangalore locations are displayed
    await expect(page.getByText(/Indiranagar/i).first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/Thippasandra/i).first()).toBeVisible();
    await expect(page.getByText(/Kaggadasapura/i).first()).toBeVisible();
  });

  test('Franchise page renders inquiry form with validations', async ({ page }) => {
    await page.goto('/franchise');

    // Heading
    await expect(page.locator('h1, h2').filter({ hasText: /Franchise/i }).first()).toBeVisible();

    // Form inputs
    const form = page.locator('form');
    await expect(form).toBeVisible();

    // Check input fields
    await expect(page.locator('input[name="fullName"]')).toBeVisible();
    await expect(page.locator('input[name="phone"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="city"]')).toBeVisible();
  });
});
