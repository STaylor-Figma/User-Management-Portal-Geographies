import { test, expect } from '@playwright/test';

test.describe('Checkbox Selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/v2-takeoff-estimating.html');
  });

  test('should start with no checkboxes checked', async ({ page }) => {
    await test.step('Verify no checkboxes are checked on load', async () => {
      const selectAll = page.locator('#selectAll');
      await expect(selectAll).not.toBeChecked();
      
      const userCheckboxes = page.locator('.user-checkbox');
      const count = await userCheckboxes.count();
      
      for (let i = 0; i < count; i++) {
        await expect(userCheckboxes.nth(i)).not.toBeChecked();
      }
    });
  });

  test('Select All should check every row', async ({ page }) => {
    await test.step('Click Select All to check all rows', async () => {
      const selectAll = page.locator('#selectAll');
      await selectAll.click();
      
      const userCheckboxes = page.locator('.user-checkbox');
      const count = await userCheckboxes.count();
      
      for (let i = 0; i < count; i++) {
        await expect(userCheckboxes.nth(i)).toBeChecked();
      }
    });

    await test.step('Click Select All again to uncheck all rows', async () => {
      const selectAll = page.locator('#selectAll');
      await selectAll.click();
      
      const userCheckboxes = page.locator('.user-checkbox');
      const count = await userCheckboxes.count();
      
      for (let i = 0; i < count; i++) {
        await expect(userCheckboxes.nth(i)).not.toBeChecked();
      }
    });
  });

  test('should show indeterminate state when some rows selected', async ({ page }) => {
    await test.step('Check one row and verify indeterminate state', async () => {
      const firstCheckbox = page.locator('.user-checkbox').first();
      await firstCheckbox.click();
      
      const selectAll = page.locator('#selectAll');
      const isIndeterminate = await selectAll.evaluate(el => el.indeterminate);
      expect(isIndeterminate).toBe(true);
      await expect(selectAll).not.toBeChecked();
    });

    await test.step('Check all rows manually and verify Select All is checked', async () => {
      const userCheckboxes = page.locator('.user-checkbox');
      const count = await userCheckboxes.count();
      
      for (let i = 1; i < count; i++) {
        await userCheckboxes.nth(i).click();
      }
      
      const selectAll = page.locator('#selectAll');
      await expect(selectAll).toBeChecked();
      const isIndeterminate = await selectAll.evaluate(el => el.indeterminate);
      expect(isIndeterminate).toBe(false);
    });
  });

  test('should enable bulk action buttons when rows are selected', async ({ page }) => {
    await test.step('Buttons are disabled with no selection', async () => {
      const addBtn = page.locator('#addLicenseBtn');
      const removeBtn = page.locator('#removeLicenseBtn');
      
      await expect(addBtn).toBeDisabled();
      await expect(removeBtn).toBeDisabled();
    });

    await test.step('Select users without licenses - Add button enabled', async () => {
      // Kaylee Frye has no licenses
      const kayleeRow = page.locator('tr').filter({ hasText: 'Kaylee Frye' });
      await kayleeRow.locator('.user-checkbox').click();
      
      const addBtn = page.locator('#addLicenseBtn');
      await expect(addBtn).not.toBeDisabled();
    });

    await test.step('Select users with licenses - Remove button enabled', async () => {
      await page.reload();
      
      // Zoe Washburne has a desktop license
      const zoeRow = page.locator('tr').filter({ hasText: 'Zoe Washburne' });
      await zoeRow.locator('.user-checkbox').click();
      
      const removeBtn = page.locator('#removeLicenseBtn');
      await expect(removeBtn).not.toBeDisabled();
    });
  });

  test('should update button states based on selection mix', async ({ page }) => {
    await test.step('Select mix of users with and without licenses', async () => {
      // Select user with license
      const zoeRow = page.locator('tr').filter({ hasText: 'Zoe Washburne' });
      await zoeRow.locator('.user-checkbox').click();
      
      // Select user without license
      const kayleeRow = page.locator('tr').filter({ hasText: 'Kaylee Frye' });
      await kayleeRow.locator('.user-checkbox').click();
      
      // Both buttons should be enabled
      const addBtn = page.locator('#addLicenseBtn');
      const removeBtn = page.locator('#removeLicenseBtn');
      
      await expect(addBtn).not.toBeDisabled();
      await expect(removeBtn).not.toBeDisabled();
    });
  });
});
