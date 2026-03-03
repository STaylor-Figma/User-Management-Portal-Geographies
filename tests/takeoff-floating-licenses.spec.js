import { test, expect } from '@playwright/test';

test.describe('Floating Licenses', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/v2-takeoff-estimating.html');
  });

  test('should display pool status with available/total', async ({ page }) => {
    await test.step('Floating license section is visible', async () => {
      const floatingTitle = page.locator('.floating-title');
      await expect(floatingTitle).toHaveText('Shared Licenses - OnScreen Takeoff');
    });

    await test.step('Shows available count', async () => {
      const floatingAvailable = page.locator('#floatingAvailable');
      await expect(floatingAvailable).toBeVisible();
      
      const availableText = await floatingAvailable.textContent();
      expect(parseInt(availableText)).toBeGreaterThanOrEqual(0);
    });

    await test.step('Shows total count', async () => {
      const floatingTotal = page.locator('#floatingTotal');
      await expect(floatingTotal).toHaveText('20');
    });

    await test.step('Displays in format: X Available / Y Total', async () => {
      const floatingStatus = page.locator('#floatingStatus');
      const statusText = await floatingStatus.textContent();
      expect(statusText).toMatch(/\d+\s+Available\s+\/\s+\d+\s+Total/);
    });
  });

  test('should show checkout list with active and borrowed licenses', async ({ page }) => {
    await test.step('Checkout table is visible', async () => {
      const checkoutTable = page.locator('#checkoutTable');
      await expect(checkoutTable).toBeVisible();
    });

    await test.step('Table has correct headers', async () => {
      const headers = page.locator('#checkoutTable th');
      await expect(headers.filter({ hasText: 'User Name' })).toBeVisible();
      await expect(headers.filter({ hasText: 'Checkout Time' })).toBeVisible();
      await expect(headers.filter({ hasText: 'Status' })).toBeVisible();
      await expect(headers.filter({ hasText: 'Machine' })).toBeVisible();
      await expect(headers.filter({ hasText: 'Actions' })).toBeVisible();
    });

    await test.step('Shows active checkouts', async () => {
      const activeStatus = page.locator('.status-badge.active');
      const count = await activeStatus.count();
      expect(count).toBeGreaterThan(0);
    });

    await test.step('Shows borrowed/offline licenses', async () => {
      const borrowedStatus = page.locator('.status-badge.borrowed');
      const count = await borrowedStatus.count();
      // At least one borrowed license should exist
      expect(count).toBeGreaterThan(0);
    });
  });

  test('should show Force Return button for each checkout', async ({ page }) => {
    await test.step('Each checkout row has Force Return button', async () => {
      const checkoutRows = page.locator('#checkoutTableBody tr');
      const rowCount = await checkoutRows.count();
      
      for (let i = 0; i < rowCount; i++) {
        const row = checkoutRows.nth(i);
        await expect(row.locator('.action-btn.remove').filter({ hasText: 'Force Return' })).toBeVisible();
      }
    });
  });

  test('should display user names as links in checkout table', async ({ page }) => {
    await test.step('User names are clickable links', async () => {
      const userLinks = page.locator('#checkoutTable .user-link');
      const count = await userLinks.count();
      expect(count).toBeGreaterThan(0);
      
      await expect(userLinks.first()).toBeVisible();
    });

    await test.step('Check specific user in checkouts', async () => {
      await expect(page.locator('#checkoutTable .user-link').filter({ hasText: 'Hoban Washburne' })).toBeVisible();
    });
  });

  test('should show machine information for checkouts', async ({ page }) => {
    await test.step('Machine names are displayed', async () => {
      const firstRow = page.locator('#checkoutTableBody tr').first();
      const machineCell = firstRow.locator('td').nth(3);
      const machineText = await machineCell.textContent();
      
      expect(machineText.trim().length).toBeGreaterThan(0);
    });
  });

  test('should display utilization bar for floating pool', async ({ page }) => {
    await test.step('Seat bar is visible', async () => {
      const floatingSummary = page.locator('.floating-summary');
      const seatBar = floatingSummary.locator('.seat-bar');
      await expect(seatBar).toBeVisible();
    });

    await test.step('Fill bar shows usage', async () => {
      const seatFill = page.locator('#floatingSeatFill');
      await expect(seatFill).toBeVisible();
      
      const width = await seatFill.evaluate(el => el.style.width);
      expect(width).not.toBe('');
    });
  });

  test('should show helpful note about floating licenses', async ({ page }) => {
    await test.step('Note is displayed', async () => {
      const note = page.locator('.floating-note');
      await expect(note).toBeVisible();
      await expect(note).toContainText('automatically checked out');
    });
  });

  test('should calculate available seats correctly', async ({ page }) => {
    await test.step('Available = Total - Checked Out', async () => {
      const available = await page.locator('#floatingAvailable').textContent();
      const total = await page.locator('#floatingTotal').textContent();
      const checkoutRows = page.locator('#checkoutTableBody tr');
      const checkedOut = await checkoutRows.count();
      
      const calculatedAvailable = parseInt(total) - checkedOut;
      expect(parseInt(available)).toBe(calculatedAvailable);
    });
  });
});
