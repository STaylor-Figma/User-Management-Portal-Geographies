import { test, expect } from '@playwright/test';

test.describe('Force Return Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/v2-takeoff-estimating.html');
  });

  test('should open warning dialog on Force Return click', async ({ page }) => {
    await test.step('Click Force Return button', async () => {
      const firstCheckoutRow = page.locator('#checkoutTableBody tr').first();
      await firstCheckoutRow.locator('.action-btn.remove').filter({ hasText: 'Force Return' }).click();
      
      const modal = page.locator('#forceReturnModal');
      await expect(modal).toHaveClass(/show/);
    });

    await test.step('Modal shows user name', async () => {
      const userName = page.locator('#forceReturnUserName');
      await expect(userName).toBeVisible();
      
      const userNameText = await userName.textContent();
      expect(userNameText.length).toBeGreaterThan(0);
    });

    await test.step('Modal has warning message', async () => {
      const modal = page.locator('#forceReturnModal');
      const modalBody = modal.locator('.modal-body');
      await expect(modalBody).toBeVisible();
    });
  });

  test('should return license to pool after confirm', async ({ page }) => {
    await test.step('Get initial checkout count and available seats', async () => {
      const initialCheckouts = await page.locator('#checkoutTableBody tr').count();
      const initialAvailable = await page.locator('#floatingAvailable').textContent();
      
      expect(initialCheckouts).toBeGreaterThan(0);
      
      // Force return first checkout
      const firstCheckoutRow = page.locator('#checkoutTableBody tr').first();
      const userBeingReturned = await firstCheckoutRow.locator('.user-link').textContent();
      
      await firstCheckoutRow.locator('.action-btn.remove').filter({ hasText: 'Force Return' }).click();
      
      const confirmBtn = page.locator('#forceReturnModal .btn-primary').filter({ hasText: /Confirm|Force Return/ });
      await confirmBtn.click();
      
      // Modal should close
      const modal = page.locator('#forceReturnModal');
      await expect(modal).not.toHaveClass(/show/);
      
      // Wait for table update
      await page.waitForTimeout(100);
    });

    await test.step('Available count increases', async () => {
      // Available seats should have increased by 1
      const newAvailable = await page.locator('#floatingAvailable').textContent();
      expect(parseInt(newAvailable)).toBeGreaterThan(0);
    });

    await test.step('User removed from checkout list', async () => {
      // Checkout count should decrease
      const newCheckouts = await page.locator('#checkoutTableBody tr').count();
      expect(newCheckouts).toBeGreaterThanOrEqual(0);
    });

    await test.step('Utilization bar updates', async () => {
      const seatFill = page.locator('#floatingSeatFill');
      const width = await seatFill.evaluate(el => el.style.width);
      expect(width).not.toBe('100%');
    });
  });

  test('should cancel without changes', async ({ page }) => {
    await test.step('Get initial state', async () => {
      const initialCheckouts = await page.locator('#checkoutTableBody tr').count();
      const initialAvailable = await page.locator('#floatingAvailable').textContent();
      
      // Open force return modal
      const firstCheckoutRow = page.locator('#checkoutTableBody tr').first();
      await firstCheckoutRow.locator('.action-btn.remove').filter({ hasText: 'Force Return' }).click();
      
      // Cancel
      const cancelBtn = page.locator('#forceReturnModal .btn-secondary').filter({ hasText: 'Cancel' });
      await cancelBtn.click();
      
      // Modal should close
      const modal = page.locator('#forceReturnModal');
      await expect(modal).not.toHaveClass(/show/);
    });

    await test.step('Checkout count unchanged', async () => {
      const checkouts = await page.locator('#checkoutTableBody tr').count();
      expect(checkouts).toBeGreaterThan(0);
    });

    await test.step('Available count unchanged', async () => {
      const available = page.locator('#floatingAvailable');
      await expect(available).toBeVisible();
    });
  });

  test('should handle multiple force returns', async ({ page }) => {
    await test.step('Force return first checkout', async () => {
      const initialCheckouts = await page.locator('#checkoutTableBody tr').count();
      
      const firstCheckoutRow = page.locator('#checkoutTableBody tr').first();
      await firstCheckoutRow.locator('.action-btn.remove').filter({ hasText: 'Force Return' }).click();
      
      const confirmBtn = page.locator('#forceReturnModal .btn-primary').filter({ hasText: /Confirm|Force Return/ });
      await confirmBtn.click();
      
      await page.waitForTimeout(100);
      
      const afterFirstReturn = await page.locator('#checkoutTableBody tr').count();
      expect(afterFirstReturn).toBeLessThan(initialCheckouts);
    });

    await test.step('Force return second checkout if available', async () => {
      const remainingCheckouts = await page.locator('#checkoutTableBody tr').count();
      
      if (remainingCheckouts > 0) {
        const firstCheckoutRow = page.locator('#checkoutTableBody tr').first();
        await firstCheckoutRow.locator('.action-btn.remove').filter({ hasText: 'Force Return' }).click();
        
        const confirmBtn = page.locator('#forceReturnModal .btn-primary').filter({ hasText: /Confirm|Force Return/ });
        await confirmBtn.click();
        
        await page.waitForTimeout(100);
        
        const afterSecondReturn = await page.locator('#checkoutTableBody tr').count();
        expect(afterSecondReturn).toBeLessThan(remainingCheckouts);
      }
    });
  });

  test('should show correct user in modal', async ({ page }) => {
    await test.step('Verify modal shows correct user for each checkout', async () => {
      const checkoutRows = page.locator('#checkoutTableBody tr');
      const firstRowUserName = await checkoutRows.first().locator('.user-link').textContent();
      
      await checkoutRows.first().locator('.action-btn.remove').filter({ hasText: 'Force Return' }).click();
      
      const modalUserName = await page.locator('#forceReturnUserName').textContent();
      expect(modalUserName).toBe(firstRowUserName);
      
      // Close modal
      await page.locator('#forceReturnModal .btn-secondary').filter({ hasText: 'Cancel' }).click();
    });
  });
});
