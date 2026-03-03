import { test, expect } from '@playwright/test';

test.describe('User Table', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/v2-takeoff-estimating.html');
  });

  test('should display 10 users in the table', async ({ page }) => {
    await test.step('Count table rows', async () => {
      const tbody = page.locator('#userTableBody');
      const rows = tbody.locator('tr');
      await expect(rows).toHaveCount(10);
    });
  });

  test('should show desktop and web assignment columns', async ({ page }) => {
    await test.step('Table headers exist', async () => {
      const desktopHeader = page.locator('.user-table th').filter({ hasText: 'Desktop License' });
      await expect(desktopHeader).toBeVisible();
      
      const webHeader = page.locator('.user-table th').filter({ hasText: 'Web License' });
      await expect(webHeader).toBeVisible();
    });

    await test.step('Assigned users show module names', async () => {
      // Zoe Washburne has OST Professional desktop
      const zoeRow = page.locator('tr').filter({ hasText: 'Zoe Washburne' });
      await expect(zoeRow.locator('.license-pill.active').filter({ hasText: 'OST Professional' })).toBeVisible();
    });

    await test.step('Unassigned users show No Access', async () => {
      // Kaylee Frye has no licenses
      const kayleeRow = page.locator('tr').filter({ hasText: 'Kaylee Frye' });
      await expect(kayleeRow.locator('.license-pill.no-access').filter({ hasText: 'No Access' })).toHaveCount(2);
    });
  });

  test('should have Add and Remove action buttons per row', async ({ page }) => {
    await test.step('Unassigned users have Add button', async () => {
      const kayleeRow = page.locator('tr').filter({ hasText: 'Kaylee Frye' });
      await expect(kayleeRow.locator('.action-btn.add').filter({ hasText: '+ Add' })).toBeVisible();
    });

    await test.step('Assigned users have Remove button', async () => {
      const zoeRow = page.locator('tr').filter({ hasText: 'Zoe Washburne' });
      await expect(zoeRow.locator('.action-btn.remove').filter({ hasText: 'Remove' })).toBeVisible();
    });
  });

  test('should display user information correctly', async ({ page }) => {
    await test.step('User names are links', async () => {
      const userLinks = page.locator('.user-link');
      await expect(userLinks.first()).toBeVisible();
      const count = await userLinks.count();
      expect(count).toBeGreaterThanOrEqual(10);
    });

    await test.step('Job titles are shown in subtitle', async () => {
      const malcolmRow = page.locator('tr').filter({ hasText: 'Malcolm Reynolds' });
      await expect(malcolmRow.locator('.user-subtitle').filter({ hasText: 'Project Manager' })).toBeVisible();
    });

    await test.step('Last Access dates are shown', async () => {
      const lastAccessCells = page.locator('.user-table tbody td').nth(4);
      await expect(lastAccessCells.first()).not.toBeEmpty();
    });
  });

  test('should show role badges for admins and owners', async ({ page }) => {
    await test.step('Owner badge is visible', async () => {
      const malcolmRow = page.locator('tr').filter({ hasText: 'Malcolm Reynolds' });
      await expect(malcolmRow.locator('.role-badge').filter({ hasText: 'OWNER' })).toBeVisible();
    });

    await test.step('Admin badge is visible', async () => {
      const zoeRow = page.locator('tr').filter({ hasText: 'Zoe Washburne' });
      await expect(zoeRow.locator('.role-badge').filter({ hasText: 'ADMIN' })).toBeVisible();
    });
  });
});
