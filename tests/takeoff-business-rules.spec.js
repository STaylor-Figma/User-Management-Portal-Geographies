import { test, expect } from '@playwright/test';

test.describe('Business Rules - ORCA Licensing Logic', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/v2-takeoff-estimating.html');
  });

  test('Rule 1: ONE desktop module per user', async ({ page }) => {
    await test.step('Assign first desktop license', async () => {
      // Kaylee Frye has no licenses initially
      const userTable = page.locator('.user-table');
      const kayleeRow = userTable.locator('tr').filter({ hasText: 'Kaylee Frye' });
      await kayleeRow.locator('.action-btn.add').click();
      
      await page.locator('#appTypeSelect').selectOption('desktop');
      await page.locator('#tierSelect').selectOption('SUB003'); // OnScreen Takeoff Plus
      await page.locator('#confirmAssignBtn').click();
    });

    await test.step('Try to assign second desktop module', async () => {
      // Open modal programmatically since "+ Add" button is now "Remove"
      await page.evaluate(() => {
        window.openAssignModal('USR006'); // Kaylee's ID
      });
      
      const modal = page.locator('#assignLicenseModal');
      await expect(modal).toHaveClass(/show/);
      
      await page.locator('#appTypeSelect').selectOption('desktop');
      
      const errorBox = page.locator('#assignError');
      await expect(errorBox).toBeVisible();
      await expect(errorBox).toContainText('already has a desktop license');
    });

    await test.step('User does NOT have two desktop modules', async () => {
      // Close modal first
      await page.locator('#assignLicenseModal .btn-secondary').click();
      
      const userTable = page.locator('.user-table');
      const kayleeRow = userTable.locator('tr').filter({ hasText: 'Kaylee Frye' });
      const desktopLicenses = kayleeRow.locator('td').nth(2).locator('.license-pill.active');
      const count = await desktopLicenses.count();
      expect(count).toBeLessThanOrEqual(1);
    });
  });

  test('Rule 2: ONE web module per user', async ({ page }) => {
    await test.step('Assign first web license', async () => {
      // Malcolm has no licenses initially
      const userTable = page.locator('.user-table');
      const malcolmRow = userTable.locator('tr').filter({ hasText: 'Malcolm Reynolds' });
      await malcolmRow.locator('.action-btn.add').click();
      
      await page.locator('#appTypeSelect').selectOption('web');
      await page.locator('#tierSelect').selectOption('SUB001'); // Web Takeoff with AI
      await page.locator('#confirmAssignBtn').click();
    });

    await test.step('Try to assign second web license', async () => {
      // Open modal programmatically since "+Add" is now "Remove"
      await page.evaluate(() => {
        window.openAssignModal('USR001'); // Malcolm's ID
      });
      
      const modal = page.locator('#assignLicenseModal');
      await expect(modal).toHaveClass(/show/);
      
      await page.locator('#appTypeSelect').selectOption('web');
      
      const errorBox = page.locator('#assignError');
      await expect(errorBox).toBeVisible();
      await expect(errorBox).toContainText('already has a web license');
    });

    await test.step('User does NOT have two web modules', async () => {
      // Close modal first
      await page.locator('#assignLicenseModal .btn-secondary').click();
      
      const userTable = page.locator('.user-table');
      const malcolmRow = userTable.locator('tr').filter({ hasText: 'Malcolm Reynolds' });
      const webLicenses = malcolmRow.locator('td').nth(3).locator('.license-pill.active');
      const count = await webLicenses.count();
      expect(count).toBeLessThanOrEqual(1);
    });
  });

  test('Rule 3: Desktop + Web combo is allowed', async ({ page }) => {
    await test.step('Find user with desktop license only', async () => {
      // Jayne Cobb has PlanViewer (desktop), no web
      const userTable = page.locator('.user-table');
      const jayneRow = userTable.locator('tr').filter({ hasText: 'Jayne Cobb' });
      await expect(jayneRow.locator('td').nth(2).locator('.license-pill.active')).toBeVisible();
      await expect(jayneRow.locator('td').nth(3).locator('.license-pill.no-access')).toBeVisible();
    });

    await test.step('Assign web module to same user', async () => {
      // Use programmatic modal opening since "+ Add" is now "Remove"
      await page.evaluate(() => {
        window.openAssignModal('USR005'); // Jayne's ID
      });
      
      const modal = page.locator('#assignLicenseModal');
      await expect(modal).toHaveClass(/show/);
      
      await page.locator('#appTypeSelect').selectOption('web');
      await page.locator('#tierSelect').selectOption('SUB001'); // Web Takeoff with AI
      await page.locator('#confirmAssignBtn').click();
    });

    await test.step('User shows both desktop and web licenses', async () => {
      const userTable = page.locator('.user-table');
      const jayneRow = userTable.locator('tr').filter({ hasText: 'Jayne Cobb' });
      
      // Desktop license still present
      await expect(jayneRow.locator('td').nth(2).locator('.license-pill.active')).toBeVisible();
      
      // Web license now present
      await expect(jayneRow.locator('td').nth(3).locator('.license-pill.active')).toBeVisible();
    });
  });

  test('Rule 4: Seat availability check', async ({ page }) => {
    await test.step('Check initial OST Plus seat count', async () => {
      // OST Plus has 5 total seats, 2 assigned (Hoban, Shepherd)
      const plusCard = page.locator('.summary-card').filter({ hasText: 'OnScreen Takeoff Plus' });
      const seatsText = await plusCard.locator('.card-seats').textContent();
      expect(seatsText).toContain('/ 5');
    });

    await test.step('Assign licenses to fill remaining seats', async () => {
      // Need to assign 3 more to reach capacity (5 total - 2 assigned = 3 available)
      const usersToAssign = [
        { name: 'River Tam', id: 'USR008' },
        { name: 'Derrial Book', id: 'USR010' },
        { name: 'Kaylee Frye', id: 'USR006' }
      ];
      
      for (const user of usersToAssign) {
        const userTable = page.locator('.user-table');
        const userRow = userTable.locator('tr').filter({ hasText: user.name });
        await userRow.locator('.action-btn.add').click();
        
        await page.locator('#appTypeSelect').selectOption('desktop');
        await page.locator('#tierSelect').selectOption('SUB003'); // OnScreen Takeoff Plus
        await page.locator('#confirmAssignBtn').click();
        
        // Wait for modal to close
        await expect(page.locator('#assignLicenseModal')).not.toHaveClass(/show/);
      }
    });

    await test.step('Verify all seats are now assigned', async () => {
      const plusCard = page.locator('.summary-card').filter({ hasText: 'OnScreen Takeoff Plus' });
      const seatsText = await plusCard.locator('.card-seats').textContent();
      expect(seatsText).toContain('5 / 5');
    });

    await test.step('Try to assign when no seats available', async () => {
      // Malcolm has no licenses, try to assign OST Plus
      const userTable = page.locator('.user-table');
      const malcolmRow = userTable.locator('tr').filter({ hasText: 'Malcolm Reynolds' });
      await malcolmRow.locator('.action-btn.add').click();
      
      await page.locator('#appTypeSelect').selectOption('desktop');
      
      // OST Plus should show "(0 available)" and be disabled
      const tierOptions = await page.locator('#tierSelect option').allTextContents();
      const plusOption = tierOptions.find(opt => opt.includes('OnScreen Takeoff Plus'));
      expect(plusOption).toContain('(0 available)');
      
      // Verify it's disabled
      const plusOptionElement = page.locator('#tierSelect option').filter({ hasText: 'OnScreen Takeoff Plus' });
      await expect(plusOptionElement).toBeDisabled();
    });
  });

  test('Rule 5: Cannot have multiple tiers of same app type', async ({ page }) => {
    await test.step('User has OST Professional (desktop)', async () => {
      // Zoe Washburne has OST Professional
      const userTable = page.locator('.user-table');
      const zoeRow = userTable.locator('tr').filter({ hasText: 'Zoe Washburne' });
      await expect(zoeRow.locator('.license-pill.active').filter({ hasText: 'OST Professional' })).toBeVisible();
    });

    await test.step('Try to assign different desktop tier without removing first', async () => {
      // Use programmatic modal opening
      await page.evaluate(() => {
        window.openAssignModal('USR002'); // Zoe's ID
      });
      
      const modal = page.locator('#assignLicenseModal');
      await expect(modal).toHaveClass(/show/);
      
      await page.locator('#appTypeSelect').selectOption('desktop');
      
      // Should show error about existing license
      const errorBox = page.locator('#assignError');
      await expect(errorBox).toBeVisible();
      await expect(errorBox).toContainText('already has a desktop license');
    });

    await test.step('Must remove first, then can assign different tier', async () => {
      // Close assign modal
      await page.locator('#assignLicenseModal .btn-secondary').click();
      
      const userTable = page.locator('.user-table');
      const zoeRow = userTable.locator('tr').filter({ hasText: 'Zoe Washburne' });
      
      // Remove existing license
      await zoeRow.locator('.action-btn.remove').click();
      await page.locator('#removeLicenseModal .btn-primary').click();
      
      // Wait for modal to close
      await expect(page.locator('#removeLicenseModal')).not.toHaveClass(/show/);
      
      // Now assign different tier
      await zoeRow.locator('.action-btn.add').click();
      await page.locator('#appTypeSelect').selectOption('desktop');
      await page.locator('#tierSelect').selectOption('SUB003'); // OnScreen Takeoff Plus
      await page.locator('#confirmAssignBtn').click();
      
      // Wait for modal to close after assignment
      await expect(page.locator('#assignLicenseModal')).not.toHaveClass(/show/);
      
      // Verify new tier is assigned (shows as "OnScreen Takeoff Plus" when assigned via modal)
      await expect(zoeRow.locator('.license-pill.active').filter({ hasText: 'OnScreen Takeoff Plus' })).toBeVisible();
      await expect(zoeRow.locator('.license-pill').filter({ hasText: 'OST Professional' })).not.toBeVisible();
    });
  });

  test('Edge Case: Removing all licenses returns user to unassigned state', async ({ page }) => {
    await test.step('User with both licenses', async () => {
      const userTable = page.locator('.user-table');
      const shepherdRow = userTable.locator('tr').filter({ hasText: 'Shepherd Book' });
      await expect(shepherdRow.locator('.license-pill.active')).toHaveCount(2);
    });

    await test.step('Remove first license', async () => {
      const userTable = page.locator('.user-table');
      const shepherdRow = userTable.locator('tr').filter({ hasText: 'Shepherd Book' });
      await shepherdRow.locator('.action-btn.remove').click();
      await page.locator('#removeLicenseModal .btn-primary').click();
      
      await page.waitForTimeout(100);
    });

    await test.step('Remove second license', async () => {
      const userTable = page.locator('.user-table');
      const shepherdRow = userTable.locator('tr').filter({ hasText: 'Shepherd Book' });
      
      if (await shepherdRow.locator('.action-btn.remove').count() > 0) {
        await shepherdRow.locator('.action-btn.remove').click();
        await page.locator('#removeLicenseModal .btn-primary').click();
      }
    });

    await test.step('User shows Add button and No Access pills', async () => {
      const userTable = page.locator('.user-table');
      const shepherdRow = userTable.locator('tr').filter({ hasText: 'Shepherd Book' });
      await expect(shepherdRow.locator('.action-btn.add')).toBeVisible();
      await expect(shepherdRow.locator('.license-pill.no-access')).toHaveCount(2);
    });
  });
});
