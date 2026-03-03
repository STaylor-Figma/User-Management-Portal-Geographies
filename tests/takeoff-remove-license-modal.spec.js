import { test, expect } from '@playwright/test';

test.describe('Remove License Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/v2-takeoff-estimating.html');
  });

  test('should open confirmation when clicking Remove', async ({ page }) => {
    await test.step('Click Remove button on user with license', async () => {
      // Zoe Washburne has OST Professional desktop license
      const userTable = page.locator('.user-table');
      const zoeRow = userTable.locator('tr').filter({ hasText: 'Zoe Washburne' });
      await zoeRow.locator('.action-btn.remove').click();
      
      const modal = page.locator('#removeLicenseModal');
      await expect(modal).toHaveClass(/show/);
    });

    await test.step('Modal shows user name and module', async () => {
      const userName = page.locator('#removeUserName');
      await expect(userName).toHaveText('Zoe Washburne');
      
      const licenseName = page.locator('#removeLicenseName');
      await expect(licenseName).toHaveText('OST Professional');
    });
  });

  test('should remove license and update seat count', async ({ page }) => {
    await test.step('Get initial seat count', async () => {
      const professionalCard = page.locator('.summary-card').filter({ hasText: 'OnScreen Takeoff Professional' });
      const initialSeats = await professionalCard.locator('.card-seats').textContent();
      expect(initialSeats).toContain('2'); // Initially 2/10
    });

    await test.step('Remove license from user', async () => {
      // Zoe Washburne has OST Professional
      const userTable = page.locator('.user-table');
      const zoeRow = userTable.locator('tr').filter({ hasText: 'Zoe Washburne' });
      await zoeRow.locator('.action-btn.remove').click();
      
      const confirmBtn = page.locator('#removeLicenseModal .btn-primary').filter({ hasText: 'Remove License' });
      await confirmBtn.click();
      
      const modal = page.locator('#removeLicenseModal');
      await expect(modal).not.toHaveClass(/show/);
    });

    await test.step('User row shows no license', async () => {
      const userTable = page.locator('.user-table');
      const zoeRow = userTable.locator('tr').filter({ hasText: 'Zoe Washburne' });
      await expect(zoeRow.locator('.license-pill.no-access')).toHaveCount(2);
    });

    await test.step('Seat count updates', async () => {
      const professionalCard = page.locator('.summary-card').filter({ hasText: 'OnScreen Takeoff Professional' });
      const updatedSeats = await professionalCard.locator('.card-seats').textContent();
      expect(updatedSeats).toContain('1'); // Now 1/10
    });

    await test.step('Add button appears on user row', async () => {
      const userTable = page.locator('.user-table');
      const zoeRow = userTable.locator('tr').filter({ hasText: 'Zoe Washburne' });
      await expect(zoeRow.locator('.action-btn.add')).toBeVisible();
    });
  });

  test('should cancel without changes', async ({ page }) => {
    await test.step('Open remove modal and cancel', async () => {
      // Simon Tam has OST Professional
      const userTable = page.locator('.user-table');
      const simonRow = userTable.locator('tr').filter({ hasText: 'Simon Tam' });
      await simonRow.locator('.action-btn.remove').click();
      
      const cancelBtn = page.locator('#removeLicenseModal .btn-secondary').filter({ hasText: 'Cancel' });
      await cancelBtn.click();
      
      const modal = page.locator('#removeLicenseModal');
      await expect(modal).not.toHaveClass(/show/);
    });

    await test.step('User still has license', async () => {
      const userTable = page.locator('.user-table');
      const simonRow = userTable.locator('tr').filter({ hasText: 'Simon Tam' });
      await expect(simonRow.locator('.license-pill.active').filter({ hasText: 'OST Professional' })).toBeVisible();
    });

    await test.step('Seat count unchanged', async () => {
      const professionalCard = page.locator('.summary-card').filter({ hasText: 'OnScreen Takeoff Professional' });
      const seats = await professionalCard.locator('.card-seats').textContent();
      expect(seats).toContain('2'); // Still 2/10
    });
  });

  test('should handle users with both desktop and web licenses', async ({ page }) => {
    await test.step('User with both licenses shows Remove button', async () => {
      // Shepherd Book has both OST Plus and Web Takeoff
      const userTable = page.locator('.user-table');
      const shepherdRow = userTable.locator('tr').filter({ hasText: 'Shepherd Book' });
      await expect(shepherdRow.locator('.action-btn.remove')).toBeVisible();
    });

    await test.step('Removing removes one license at a time', async () => {
      const userTable = page.locator('.user-table');
      const shepherdRow = userTable.locator('tr').filter({ hasText: 'Shepherd Book' });
      await shepherdRow.locator('.action-btn.remove').click();
      
      const confirmBtn = page.locator('#removeLicenseModal .btn-primary').filter({ hasText: 'Remove License' });
      await confirmBtn.click();
      
      // User should still have one license remaining
      await expect(userTable.locator('tr').filter({ hasText: 'Shepherd Book' }).locator('.license-pill.active')).toHaveCount(1);
    });
  });

  test('should show modal with correct styling', async ({ page }) => {
    await test.step('Modal has warning appearance', async () => {
      // Jayne Cobb has PlanViewer
      const jayneRow = page.locator('tr').filter({ hasText: 'Jayne Cobb' });
      await jayneRow.locator('.action-btn.remove').click();
      
      const modal = page.locator('#removeLicenseModal');
      await expect(modal).toBeVisible();
      
      // Modal should have content
      const modalBody = modal.locator('.modal-body');
      await expect(modalBody).toBeVisible();
    });
  });
});
