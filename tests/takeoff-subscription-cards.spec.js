import { test, expect } from '@playwright/test';

test.describe('Subscription Summary Cards', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/v2-takeoff-estimating.html');
  });

  test('should display 4 subscription summary cards', async ({ page }) => {
    await test.step('Count subscription cards', async () => {
      const cards = page.locator('.summary-card');
      await expect(cards).toHaveCount(4);
    });
  });

  test('should show seat counts in Used/Total format', async ({ page }) => {
    await test.step('Each card shows seat tracking', async () => {
      const cards = page.locator('.summary-card');
      const count = await cards.count();
      
      for (let i = 0; i < count; i++) {
        const card = cards.nth(i);
        const seatsText = card.locator('.card-seats');
        await expect(seatsText).toContainText('/');
      }
    });
  });

  test('should color-code capacity status', async ({ page }) => {
    await test.step('Cards show green status for plenty of seats', async () => {
      const plentyStatus = page.locator('.card-status.plenty');
      const count = await plentyStatus.count();
      expect(count).toBeGreaterThan(0);
    });

    await test.step('Check for color-coded fill bars', async () => {
      // At least one card should have a fill bar (any color)
      const fillBars = page.locator('.seat-fill');
      await expect(fillBars.first()).toBeVisible();
    });
  });

  test('should display tier names in cards', async ({ page }) => {
    await test.step('Verify tier names are present', async () => {
      await expect(page.locator('.card-title').first()).toBeVisible();
      
      // Check for specific tiers from the data
      await expect(page.locator('.card-title').filter({ hasText: 'Web Takeoff with AI' })).toBeVisible();
      await expect(page.locator('.card-title').filter({ hasText: 'OnScreen Takeoff Professional' })).toBeVisible();
      await expect(page.locator('.card-title').filter({ hasText: 'OnScreen Takeoff Plus' })).toBeVisible();
      await expect(page.locator('.card-title').filter({ hasText: 'PlanViewer' })).toBeVisible();
    });
  });

  test('should show visual seat utilization bar', async ({ page }) => {
    await test.step('Each card has a seat bar', async () => {
      const cards = page.locator('.summary-card');
      const count = await cards.count();
      
      for (let i = 0; i < count; i++) {
        const card = cards.nth(i);
        const seatBar = card.locator('.seat-bar');
        await expect(seatBar).toBeVisible();
        
        const seatFill = card.locator('.seat-fill');
        await expect(seatFill).toBeVisible();
      }
    });
  });
});
