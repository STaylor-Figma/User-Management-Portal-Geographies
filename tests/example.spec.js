import { test, expect } from '@playwright/test';

/**
 * Example test suite for subscription overview pages
 * Shows basic Playwright testing patterns
 */

test.describe('Subscription Overview - Single', () => {
  test('should load page successfully', async ({ page }) => {
    await page.goto('/v2-subscription-overview.html');
    
    // Check page title
    await expect(page.locator('h1')).toContainText('Subscriptions & Licenses');
  });

  test('should display navigation correctly', async ({ page }) => {
    await page.goto('/v2-subscription-overview.html');
    
    // Check navigation is visible
    await expect(page.locator('.sidebar')).toBeVisible();
    
    // Check for navigation icons
    await expect(page.locator('.nav-icon.fa-building')).toBeVisible();
    await expect(page.locator('.nav-icon.fa-users')).toBeVisible();
    await expect(page.locator('.nav-icon.fa-user-shield')).toBeVisible();
    await expect(page.locator('.nav-icon.fa-file-contract')).toBeVisible();
    await expect(page.locator('.nav-icon.fa-file-invoice-dollar')).toBeVisible();
  });

  test('should display tabs correctly', async ({ page }) => {
    await page.goto('/v2-subscription-overview.html');
    
    // Check tabs are present
    await expect(page.locator('.tab-group')).toBeVisible();
    await expect(page.locator('button:has-text("Subscriptions")')).toBeVisible();
    await expect(page.locator('button:has-text("Licenses")')).toBeVisible();
    
    // Verify API Apps tab is NOT present
    await expect(page.locator('button:has-text("API Apps")')).not.toBeVisible();
  });

  test('should display subscription card', async ({ page }) => {
    await page.goto('/v2-subscription-overview.html');
    
    // Check subscription card exists
    await expect(page.locator('.subscription-card')).toBeVisible();
    await expect(page.locator('.card-header')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/v2-subscription-overview.html');
    
    // Check hamburger menu is visible
    await expect(page.locator('.hamburger')).toBeVisible();
    
    // Desktop sidebar should be hidden
    await expect(page.locator('.sidebar')).toHaveCSS('transform', 'matrix(1, 0, 0, 1, -320, 0)');
  });
});

test.describe('Subscription Overview - Multi', () => {
  test('should load page successfully', async ({ page }) => {
    await page.goto('/v2-subscription-overview-multi.html');
    
    // Check page title
    await expect(page.locator('h1')).toContainText('Subscriptions & Licenses');
  });

  test('should display multiple subscription cards', async ({ page }) => {
    await page.goto('/v2-subscription-overview-multi.html');
    
    // Check for multiple cards
    const cards = page.locator('.subscription-card');
    await expect(cards).toHaveCount(3);
  });

  test('should NOT have API Apps tab', async ({ page }) => {
    await page.goto('/v2-subscription-overview-multi.html');
    
    // Verify API Apps tab is removed
    await expect(page.locator('button:has-text("API Apps")')).not.toBeVisible();
  });
});
