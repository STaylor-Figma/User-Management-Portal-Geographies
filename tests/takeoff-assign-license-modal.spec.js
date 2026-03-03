import { test, expect } from '@playwright/test';

test.describe('Assign License Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/v2-takeoff-estimating.html');
  });

  test('should open modal from individual Add button', async ({ page }) => {
    await test.step('Click Add button on unassigned user', async () => {
      const kayleeRow = page.locator('tr').filter({ hasText: 'Kaylee Frye' });
      await kayleeRow.locator('.action-btn.add').click();
      
      const modal = page.locator('#assignLicenseModal');
      await expect(modal).toHaveClass(/show/);
    });

    await test.step('Modal title is visible', async () => {
      const modalTitle = page.locator('.modal-title').filter({ hasText: 'Assign License' });
      await expect(modalTitle).toBeVisible();
    });
  });

  test('should show module selection dropdown', async ({ page }) => {
    await test.step('Open modal and verify dropdowns', async () => {
      const kayleeRow = page.locator('tr').filter({ hasText: 'Kaylee Frye' });
      await kayleeRow.locator('.action-btn.add').click();
      
      const appTypeSelect = page.locator('#appTypeSelect');
      await expect(appTypeSelect).toBeVisible();
      
      const tierSelect = page.locator('#tierSelect');
      await expect(tierSelect).toBeVisible();
      await expect(tierSelect).toBeDisabled(); // Initially disabled
    });

    await test.step('Select application type enables tier dropdown', async () => {
      const appTypeSelect = page.locator('#appTypeSelect');
      await appTypeSelect.selectOption('desktop');
      
      const tierSelect = page.locator('#tierSelect');
      await expect(tierSelect).not.toBeDisabled();
    });

    await test.step('Tier dropdown shows available options', async () => {
      const appTypeSelect = page.locator('#appTypeSelect');
      await appTypeSelect.selectOption('desktop');
      
      const tierSelect = page.locator('#tierSelect');
      const options = await tierSelect.locator('option').allTextContents();
      
      // Should have placeholder + tier options
      expect(options.length).toBeGreaterThan(1);
      
      // Check for specific tier
      expect(options.some(text => text.includes('OnScreen Takeoff Professional'))).toBeTruthy();
    });
  });

  test('should assign and update table on confirm', async ({ page }) => {
    await test.step('Complete license assignment flow', async () => {
      const kayleeRow = page.locator('tr').filter({ hasText: 'Kaylee Frye' });
      await kayleeRow.locator('.action-btn.add').click();
      
      // Select desktop application
      const appTypeSelect = page.locator('#appTypeSelect');
      await appTypeSelect.selectOption('desktop');
      
      // Select a tier
      const tierSelect = page.locator('#tierSelect');
      await tierSelect.selectOption('SUB003'); // OnScreen Takeoff Plus
      
      // Confirm button should be enabled
      const confirmBtn = page.locator('#confirmAssignBtn');
      await expect(confirmBtn).not.toBeDisabled();
      
      // Click confirm
      await confirmBtn.click();
      
      // Modal should close
      const modal = page.locator('#assignLicenseModal');
      await expect(modal).not.toHaveClass(/show/);
    });

    await test.step('User row shows new module', async () => {
      const kayleeRow = page.locator('tr').filter({ hasText: 'Kaylee Frye' });
      await expect(kayleeRow.locator('.license-pill.active').filter({ hasText: 'OnScreen Takeoff Plus' })).toBeVisible();
    });

    await test.step('Subscription card updates seat count', async () => {
      // OnScreen Takeoff Plus card should show increased usage
      const plusCard = page.locator('.summary-card').filter({ hasText: 'OnScreen Takeoff Plus' });
      await expect(plusCard).toBeVisible();
    });
  });

  test('should close on Cancel without changes', async ({ page }) => {
    await test.step('Open modal and click cancel', async () => {
      const kayleeRow = page.locator('tr').filter({ hasText: 'Kaylee Frye' });
      await kayleeRow.locator('.action-btn.add').click();
      
      const cancelBtn = page.locator('#assignLicenseModal .btn-secondary').filter({ hasText: 'Cancel' });
      await cancelBtn.click();
      
      const modal = page.locator('#assignLicenseModal');
      await expect(modal).not.toHaveClass(/show/);
    });

    await test.step('User still has no license', async () => {
      const kayleeRow = page.locator('tr').filter({ hasText: 'Kaylee Frye' });
      await expect(kayleeRow.locator('.license-pill.no-access')).toHaveCount(2);
    });
  });

  test('should show error when user already has license type', async ({ page }) => {
    await test.step('Try to assign second desktop license', async () => {
      // Zoe Washburne already has OST Professional (desktop) in initial state
      // Open modal programmatically for her since "+ Add" button doesn't exist
      await page.evaluate(() => {
        window.openAssignModal('USR002'); // Zoe's ID
      });
      
      // Wait for modal to open
      const modal = page.locator('#assignLicenseModal');
      await expect(modal).toHaveClass(/show/);
      
      // Try to assign a desktop license (she already has one)
      const appTypeSelect = page.locator('#appTypeSelect');
      await appTypeSelect.selectOption('desktop');
      
      // Error should show
      const errorBox = page.locator('#assignError');
      await expect(errorBox).toBeVisible();
      await expect(errorBox).toContainText('already has a desktop license');
    });
  });

  test('should allow desktop + web combo', async ({ page }) => {
    await test.step('Assign desktop license first', async () => {
      const kayleeRow = page.locator('tr').filter({ hasText: 'Kaylee Frye' });
      await kayleeRow.locator('.action-btn.add').click();
      
      await page.locator('#appTypeSelect').selectOption('desktop');
      await page.locator('#tierSelect').selectOption('SUB004'); // PlanViewer
      await page.locator('#confirmAssignBtn').click();
      
      // Wait for modal to close
      const modal = page.locator('#assignLicenseModal');
      await expect(modal).not.toHaveClass(/show/);
    });

    await test.step('Assign web license to same user', async () => {
      // After desktop assignment, open modal programmatically for Kaylee
      await page.evaluate(() => {
        window.openAssignModal('USR006'); // Kaylee's ID
      });
      
      // Wait for modal to open
      const modal = page.locator('#assignLicenseModal');
      await expect(modal).toHaveClass(/show/);
      
      await page.locator('#appTypeSelect').selectOption('web');
      await page.locator('#tierSelect').selectOption('SUB001'); // Web Takeoff with AI
      await page.locator('#confirmAssignBtn').click();
    });

    await test.step('User shows both licenses', async () => {
      const kayleeRow = page.locator('tr').filter({ hasText: 'Kaylee Frye' });
      await expect(kayleeRow.locator('.license-pill.active').filter({ hasText: 'PlanViewer' })).toBeVisible();
      await expect(kayleeRow.locator('.license-pill.active').filter({ hasText: 'Web Takeoff' })).toBeVisible();
    });
  });
});
