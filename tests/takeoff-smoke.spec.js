import { test, expect } from '@playwright/test';

test.describe('Takeoff & Estimating - Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/v2-takeoff-estimating.html');
  });

  test('should load page successfully', async ({ page }) => {
    await test.step('Page loads without errors', async () => {
      await expect(page).toHaveTitle('Takeoff & Estimating - Subscriptions & Licenses');
    });
  });

  test('should display main heading', async ({ page }) => {
    await test.step('Main heading is visible', async () => {
      const heading = page.getByRole('heading', { name: 'Subscriptions & Licenses', level: 1 });
      await expect(heading).toBeVisible();
    });
  });

  test('should display active tab', async ({ page }) => {
    await test.step('Takeoff & Estimating tab is active', async () => {
      const activeTab = page.getByRole('button', { name: 'Takeoff & Estimating' });
      await expect(activeTab).toHaveClass(/active/);
    });
  });

  test('should not have console errors on load', async ({ page }) => {
    const errors = [];
    
    await test.step('Capture console errors', async () => {
      page.on('console', msg => {
        if (msg.type() === 'error') {
          const text = msg.text();
          // Filter out expected network/resource errors
          const isExpectedError = 
            text.includes('Font Awesome') ||
            text.includes('Failed to fetch') ||
            text.includes('net::ERR') ||
            text.includes('favicon.ico');
          
          if (!isExpectedError) {
            errors.push(text);
          }
        }
      });
      
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      expect(errors).toHaveLength(0);
    });
  });

  test('should display section headers', async ({ page }) => {
    await test.step('Named-User Licenses section is visible', async () => {
      const namedUserSection = page.getByRole('heading', { name: 'Named-User Licenses', level: 2 });
      await expect(namedUserSection).toBeVisible();
    });

    await test.step('Floating/Shared Licenses section is visible', async () => {
      const floatingSection = page.getByRole('heading', { name: 'Floating/Shared Licenses', level: 2 });
      await expect(floatingSection).toBeVisible();
    });
  });
});
