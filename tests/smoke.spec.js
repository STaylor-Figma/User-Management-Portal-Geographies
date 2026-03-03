import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/v2-modify-users-workflow.html');
  });

  test('page loads successfully', async ({ page }) => {
    await test.step('Verify page loaded with correct title', async () => {
      await expect(page).toHaveTitle(/Project Intelligence|Subscriptions/i);
    });
  });

  test('main heading visible', async ({ page }) => {
    await test.step('Check for main heading', async () => {
      const heading = page.locator('h1').first();
      await expect(heading).toBeVisible();
    });
  });

  test('no console errors on load', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await test.step('Reload page and check for console errors', async () => {
      await page.reload();
      await page.waitForLoadState('networkidle');
      expect(errors).toHaveLength(0);
    });
  });

  test('two-panel layout renders', async ({ page }) => {
    await test.step('Verify left and right panels are visible', async () => {
      const leftPanel = page.locator('.left-panel');
      const rightPanel = page.locator('.right-panel');
      
      await expect(leftPanel).toBeVisible();
      await expect(rightPanel).toBeVisible();
    });
  });

  test('external zone data loaded', async ({ page }) => {
    await test.step('Check COMPLETE_ZONE_DATA is available', async () => {
      const zoneDataExists = await page.evaluate(() => {
        return typeof window.COMPLETE_ZONE_DATA !== 'undefined' && 
               Array.isArray(window.COMPLETE_ZONE_DATA.zones);
      });
      expect(zoneDataExists).toBe(true);
    });
  });

  test('all 8 users render in user table', async ({ page }) => {
    await test.step('Count user rows in table', async () => {
      const userRows = page.locator('.user-table tbody tr, table tbody tr');
      await expect(userRows).toHaveCount(8);
    });
  });
});
