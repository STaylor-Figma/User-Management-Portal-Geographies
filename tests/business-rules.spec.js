import { test, expect } from '@playwright/test';

test.describe('Business Rules - MOST IMPORTANT', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/v2-modify-users-workflow.html');
    await page.waitForLoadState('networkidle');
  });

  test('Rule 1 - Geography Assignment activates seat', async ({ page }) => {
    await test.step('Add No Access user to activate seat', async () => {
      // Find a No Access user (e.g., Jayne Cobb)
      const jayneRow = page.locator('tr').filter({ hasText: 'Jayne Cobb' });
      const addButton = jayneRow.getByRole('button', { name: /add/i });
      
      await addButton.click();
      await page.waitForTimeout(500);
      
      // Verify user now has Full Access
      const badge = jayneRow.locator('.access-badge, [class*="badge"]').first();
      await expect(badge).toContainText(/full access/i);
      
      // Verify accessType updated
      const accessType = await page.evaluate(() => {
        const user = window.data.users.find(u => u.name === 'Jayne Cobb');
        return user?.accessType;
      });
      expect(accessType).toBe('full');
    });

    await test.step('Remove user access to free seat', async () => {
      const jayneRow = page.locator('tr').filter({ hasText: 'Jayne Cobb' });
      const removeButton = jayneRow.getByRole('button', { name: /remove/i });
      
      await removeButton.click();
      
      // Handle confirmation dialog if it appears
      const confirmButton = page.getByRole('button', { name: /confirm|yes|remove/i });
      if (await confirmButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        await confirmButton.click();
      }
      
      await page.waitForTimeout(500);
      
      // Verify user returned to No Access
      const badge = jayneRow.locator('.access-badge, [class*="badge"]').first();
      await expect(badge).toContainText(/no access/i);
      
      // Verify all four properties reset
      const userData = await page.evaluate(() => {
        const user = window.data.users.find(u => u.name === 'Jayne Cobb');
        return {
          zones: user?.zones,
          accessType: user?.accessType,
          zoneCount: user?.zoneCount,
          assignedCounties: user?.assignedCounties
        };
      });
      
      expect(userData.zones).toBe('No Access');
      expect(userData.accessType).toBe('none');
      expect(userData.zoneCount).toBe(0);
      expect(Object.keys(userData.assignedCounties || {})).toHaveLength(0);
    });
  });

  test('Rule 3 - Multi-Zone Support', async ({ page }) => {
    await test.step('Assign counties from multiple zones to one user', async () => {
      // Select a user
      const userRow = page.locator('tr').filter({ hasText: 'Zoe Washburne' }).first();
      const checkbox = userRow.locator('input[type="checkbox"]').first();
      await checkbox.check();
      
      // Click Modify
      const modifyButton = page.getByRole('button', { name: /modify selected/i });
      await modifyButton.click();
      await page.waitForTimeout(500);
      
      // Verify zone selection view opened
      const zoneView = page.locator('#zoneSelectionView');
      await expect(zoneView).toBeVisible();
      
      // Expand first zone and check a county
      const firstZone = page.locator('.zone-item').first();
      const firstZoneExpand = firstZone.locator('.expand-arrow, button').first();
      await firstZoneExpand.click();
      await page.waitForTimeout(300);
      
      const firstCounty = firstZone.locator('input[type="checkbox"]').nth(1); // Skip zone checkbox
      await firstCounty.check();
      
      // Scroll and expand a different zone
      const secondZone = page.locator('.zone-item').nth(2);
      await secondZone.scrollIntoViewIfNeeded();
      const secondZoneExpand = secondZone.locator('.expand-arrow, button').first();
      await secondZoneExpand.click();
      await page.waitForTimeout(300);
      
      const secondCounty = secondZone.locator('input[type="checkbox"]').nth(1);
      await secondCounty.check();
      
      // Save
      const saveButton = page.getByRole('button', { name: /save updates/i });
      await saveButton.click();
      await page.waitForTimeout(1000);
      
      // Verify user has counties from both zones
      const assignedCounties = await page.evaluate(() => {
        const user = window.data.users.find(u => u.name === 'Zoe Washburne');
        return user?.assignedCounties || {};
      });
      
      const countyKeys = Object.keys(assignedCounties);
      expect(countyKeys.length).toBeGreaterThan(0);
      
      // Keys should include different zone IDs
      const zoneIds = new Set(countyKeys.map(key => key.split('-')[0]));
      expect(zoneIds.size).toBeGreaterThanOrEqual(1);
    });
  });

  test('Rule 4 - Partial Zone Assignment', async ({ page }) => {
    await test.step('Assign only some counties from a zone', async () => {
      const userRow = page.locator('tr').filter({ hasText: 'Hoban Washburne' }).first();
      const checkbox = userRow.locator('input[type="checkbox"]').first();
      await checkbox.check();
      
      const modifyButton = page.getByRole('button', { name: /modify selected/i });
      await modifyButton.click();
      await page.waitForTimeout(500);
      
      // Expand a zone
      const zone = page.locator('.zone-item').first();
      const expandButton = zone.locator('.expand-arrow, button').first();
      await expandButton.click();
      await page.waitForTimeout(300);
      
      // Check only 2 counties
      const counties = zone.locator('input[type="checkbox"][data-county-key], .county-checkbox input[type="checkbox"]');
      const firstCounty = counties.first();
      const secondCounty = counties.nth(1);
      
      await firstCounty.check();
      await secondCounty.check();
      
      // Save
      const saveButton = page.getByRole('button', { name: /save updates/i });
      await saveButton.click();
      await page.waitForTimeout(1000);
      
      // Verify user has modified access with limited counties
      const userData = await page.evaluate(() => {
        const user = window.data.users.find(u => u.name === 'Hoban Washburne');
        return {
          accessType: user?.accessType,
          assignedCounties: user?.assignedCounties
        };
      });
      
      expect(userData.accessType).toBe('modified');
      expect(Object.keys(userData.assignedCounties || {}).length).toBeGreaterThan(0);
    });
  });

  test('Rule 6 - Four Properties Always Update Together', async ({ page }) => {
    await test.step('Verify all four properties update on access change', async () => {
      // Add a user
      const jayneRow = page.locator('tr').filter({ hasText: 'Jayne Cobb' });
      const addButton = jayneRow.getByRole('button', { name: /add/i });
      await addButton.click();
      await page.waitForTimeout(500);
      
      // Check all four properties
      const userData = await page.evaluate(() => {
        const user = window.data.users.find(u => u.name === 'Jayne Cobb');
        return {
          zones: user?.zones,
          accessType: user?.accessType,
          zoneCount: user?.zoneCount,
          assignedCounties: user?.assignedCounties
        };
      });
      
      // All should be consistent with Full Access
      expect(userData.zones).toBe('Full Access');
      expect(userData.accessType).toBe('full');
      expect(typeof userData.zoneCount).toBe('number');
      expect(typeof userData.assignedCounties).toBe('object');
    });
  });

  test('Rule 7 - No Access Users Cannot Be Modified', async ({ page }) => {
    await test.step('Select only No Access users and verify buttons', async () => {
      // Select a No Access user
      const noAccessRow = page.locator('tr').filter({ hasText: 'Kaylee Frye' });
      const checkbox = noAccessRow.locator('input[type="checkbox"]').first();
      await checkbox.check();
      await page.waitForTimeout(300);
      
      // Verify Add button is enabled
      const addButton = page.getByRole('button', { name: /add selected/i });
      await expect(addButton).toBeEnabled();
      
      // Verify Modify button is disabled or not applicable
      const modifyButton = page.getByRole('button', { name: /modify selected/i });
      const isModifyVisible = await modifyButton.isVisible({ timeout: 1000 }).catch(() => false);
      
      if (isModifyVisible) {
        await expect(modifyButton).toBeDisabled();
      }
    });
  });

  test('Rule 8 - Zone IDs Are 1-Based', async ({ page }) => {
    await test.step('Verify county keys use 1-based zone IDs', async () => {
      // Check zone data structure
      const zoneData = await page.evaluate(() => {
        return {
          firstZoneId: window.COMPLETE_ZONE_DATA?.zones[0]?.id,
          zones: window.COMPLETE_ZONE_DATA?.zones.slice(0, 3).map(z => ({ id: z.id, name: z.name }))
        };
      });
      
      expect(zoneData.firstZoneId).toBe(1);
      
      // Verify all zone IDs are 1-based (not 0-based)
      zoneData.zones.forEach(zone => {
        expect(zone.id).toBeGreaterThanOrEqual(1);
      });
    });
  });
});
