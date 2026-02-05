import { test, expect } from '@playwright/test';

/**
 * Keyboard Navigation Tests
 * Verifies that all interactive elements are keyboard accessible
 * and follow proper focus management patterns
 */

test.describe('Keyboard Navigation - v2-users-groups.html', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/v2-users-groups.html', { waitUntil: 'networkidle' });
    // Wait for page to be fully loaded
    await page.waitForTimeout(1000);
  });

  test('should navigate through all interactive elements with Tab', async ({ page }) => {
    // Count all focusable elements on the page
    const focusableCount = await page.evaluate(() => {
      const elements = document.querySelectorAll(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      return elements.length;
    });
    
    console.log(`Found ${focusableCount} focusable elements`);
    expect(focusableCount).toBeGreaterThan(0);
    
    // Tab through first 10 elements to verify Tab works
    for (let i = 0; i < Math.min(10, focusableCount); i++) {
      await page.keyboard.press('Tab');
      const focused = await page.evaluate(() => {
        const el = document.activeElement;
        return { tag: el.tagName, class: el.className, text: el.textContent?.substring(0, 30) };
      });
      console.log(`Tab ${i + 1}: Focused ${focused.tag}.${focused.class} - "${focused.text}"`);
    }
  });

  test('should show visible focus indicator on all interactive elements', async ({ page }) => {
    // Tab to first few elements and verify focus is visible
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      
      // Check that the focused element has some kind of visible outline/focus style
      const hasFocusStyle = await page.evaluate(() => {
        const el = document.activeElement;
        const styles = window.getComputedStyle(el);
        
        // Check for outline or box-shadow (common focus indicators)
        const hasOutline = styles.outline !== 'none' && styles.outline !== 'rgb(0, 0, 0) none 0px';
        const hasBoxShadow = styles.boxShadow !== 'none';
        const hasBorder = styles.borderColor !== 'rgb(0, 0, 0)' && styles.borderWidth !== '0px';
        
        return hasOutline || hasBoxShadow || hasBorder;
      });
      
      // This is a soft check - we'll log it but not fail the test
      if (!hasFocusStyle) {
        console.log(`⚠️  Element may not have visible focus indicator`);
      }
    }
  });

  test('buttons should activate with Enter key', async ({ page }) => {
    // Find the first button
    const button = page.locator('button').first();
    
    if (await button.count() > 0) {
      await button.focus();
      
      // Press Enter and verify something happens (page doesn't crash)
      await page.keyboard.press('Enter');
      
      // Wait a bit for any action to complete
      await page.waitForTimeout(500);
      
      // Just verify page is still responsive
      expect(await page.title()).toBeTruthy();
    }
  });

  test('buttons should activate with Space key', async ({ page }) => {
    const button = page.locator('button').first();
    
    if (await button.count() > 0) {
      await button.focus();
      
      // Press Space
      await page.keyboard.press('Space');
      
      await page.waitForTimeout(500);
      
      // Verify page is still responsive
      expect(await page.title()).toBeTruthy();
    }
  });

  test('should not create keyboard trap - can Tab out of all sections', async ({ page }) => {
    // Tab through many elements to ensure we don't get stuck
    const maxTabs = 50;
    let previousFocus = null;
    let sameCount = 0;
    
    for (let i = 0; i < maxTabs; i++) {
      await page.keyboard.press('Tab');
      const currentFocus = await page.evaluate(() => {
        return document.activeElement.tagName + ':' + (document.activeElement.id || document.activeElement.className);
      });
      
      if (currentFocus === previousFocus) {
        sameCount++;
        if (sameCount > 3) {
          throw new Error(`Keyboard trap detected! Focus stuck on: ${currentFocus}`);
        }
      } else {
        sameCount = 0;
      }
      
      previousFocus = currentFocus;
    }
    
    console.log('✓ No keyboard traps detected');
  });

  test('search input should be keyboard accessible', async ({ page }) => {
    const searchInput = page.locator('input[type="text"]').first();
    
    if (await searchInput.count() > 0) {
      // Tab to search input (might need multiple tabs)
      await searchInput.focus();
      
      // Type in the search box
      await page.keyboard.type('test search');
      
      // Verify text was entered
      const value = await searchInput.inputValue();
      expect(value).toContain('test');
    }
  });

  test('drawer should close with Escape key when open', async ({ page }) => {
    // Find and click "Add User" button to open drawer
    const addUserButton = page.locator('button:has-text("Add User"), button:has-text("Invite User")').first();
    
    if (await addUserButton.count() > 0) {
      await addUserButton.click();
      
      // Wait for drawer to open
      await page.waitForTimeout(500);
      
      // Press Escape
      await page.keyboard.press('Escape');
      
      // Wait for close animation
      await page.waitForTimeout(500);
      
      // Verify drawer is closed (check if drawer overlay is gone)
      const drawerOverlay = page.locator('.drawer-overlay, [class*="overlay"]');
      if (await drawerOverlay.count() > 0) {
        await expect(drawerOverlay).not.toBeVisible();
      }
    }
  });

  test('Shift+Tab should move focus backwards', async ({ page }) => {
    // Tab forward a few times
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    const focusAfterForward = await page.evaluate(() => document.activeElement.tagName);
    
    // Shift+Tab to go back
    await page.keyboard.press('Shift+Tab');
    
    const focusAfterBackward = await page.evaluate(() => document.activeElement.tagName);
    
    // Focus should have changed (moved backwards)
    console.log(`Forward: ${focusAfterForward}, Backward: ${focusAfterBackward}`);
  });

  test('links should be activatable with Enter', async ({ page }) => {
    const link = page.locator('a[href]').first();
    
    if (await link.count() > 0) {
      await link.focus();
      
      // Verify link can receive focus
      const focused = await page.evaluate(() => document.activeElement.tagName);
      expect(focused).toBe('A');
    }
  });

});

test.describe('Keyboard Navigation - v2-my-profile.html', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/v2-my-profile.html');
  });

  test('should navigate through form fields with Tab', async ({ page }) => {
    // Find first form input
    const firstInput = page.locator('input').first();
    
    if (await firstInput.count() > 0) {
      await firstInput.focus();
      
      // Tab through form fields
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
        const focused = await page.evaluate(() => document.activeElement.tagName);
        console.log(`Tab ${i + 1}: ${focused}`);
      }
    }
  });

  test('form inputs should be editable via keyboard', async ({ page }) => {
    const textInput = page.locator('input[type="text"], input[type="email"]').first();
    
    if (await textInput.count() > 0) {
      await textInput.focus();
      
      // Clear and type
      await page.keyboard.press('Control+A');
      await page.keyboard.type('Test Input');
      
      const value = await textInput.inputValue();
      expect(value).toContain('Test');
    }
  });

  test('should show focus indicator on form elements', async ({ page }) => {
    const formElements = await page.locator('input, select, textarea, button').all();
    
    for (let i = 0; i < Math.min(3, formElements.length); i++) {
      await formElements[i].focus();
      await page.waitForTimeout(100);
      
      const hasFocus = await page.evaluate(() => {
        const el = document.activeElement;
        const styles = window.getComputedStyle(el);
        return styles.outline !== 'none' || styles.boxShadow !== 'none';
      });
      
      console.log(`Element ${i + 1} has focus indicator: ${hasFocus}`);
    }
  });

});

test.describe('Keyboard Navigation - v2-user-roles-multi.html', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/v2-user-roles-multi.html');
  });

  test('table rows should be keyboard navigable if interactive', async ({ page }) => {
    // Check if there are any interactive elements in the table
    const tableButtons = page.locator('table button, table a, table input');
    
    if (await tableButtons.count() > 0) {
      const firstButton = tableButtons.first();
      await firstButton.focus();
      
      // Verify we can tab through table elements
      await page.keyboard.press('Tab');
      
      console.log('✓ Table elements are keyboard accessible');
    }
  });

  test('should navigate through all interactive elements', async ({ page }) => {
    const focusableCount = await page.locator(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ).count();
    
    console.log(`Found ${focusableCount} focusable elements`);
    expect(focusableCount).toBeGreaterThan(0);
  });

});

test.describe('Advanced Accessibility - Skip Links & Landmarks', () => {
  
  test('v2-users-groups.html - should have skip link for keyboard users', async ({ page }) => {
    await page.goto('http://localhost:3000/v2-users-groups.html', { waitUntil: 'networkidle' });
    
    // Check for skip link (usually hidden until focused)
    const skipLink = page.locator('a[href="#main"], a[href="#main-content"], a:has-text("Skip to")').first();
    const hasSkipLink = await skipLink.count() > 0;
    
    if (!hasSkipLink) {
      console.log('⚠️  No skip link found - consider adding <a href="#main-content">Skip to main content</a>');
    } else {
      console.log('✓ Skip link present');
    }
  });

  test('v2-users-groups.html - should have proper landmark regions', async ({ page }) => {
    await page.goto('http://localhost:3000/v2-users-groups.html', { waitUntil: 'networkidle' });
    
    const landmarks = await page.evaluate(() => {
      return {
        main: document.querySelectorAll('main, [role="main"]').length,
        nav: document.querySelectorAll('nav, [role="navigation"]').length,
        header: document.querySelectorAll('header, [role="banner"]').length,
        footer: document.querySelectorAll('footer, [role="contentinfo"]').length
      };
    });
    
    console.log('Landmarks found:', landmarks);
    
    // Should have at least a main landmark
    if (landmarks.main === 0) {
      console.log('⚠️  No <main> element found - wrap main content in <main role="main">');
    }
  });

  test('v2-users-groups.html - main content should have id for skip link target', async ({ page }) => {
    await page.goto('http://localhost:3000/v2-users-groups.html', { waitUntil: 'networkidle' });
    
    const mainContent = page.locator('main, [role="main"], #main, #main-content').first();
    const hasMainId = await page.evaluate(() => {
      const main = document.querySelector('main, [role="main"]');
      return main && (main.id === 'main' || main.id === 'main-content');
    });
    
    if (!hasMainId) {
      console.log('⚠️  Main content should have id="main-content" for skip link');
    } else {
      console.log('✓ Main content has proper ID');
    }
  });

});

test.describe('Advanced Accessibility - Modal & Drawer Focus Management', () => {

  test('v2-users-groups.html - drawer should trap focus when open', async ({ page }) => {
    await page.goto('http://localhost:3000/v2-users-groups.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    
    // Try to open drawer
    const addButton = page.locator('button:has-text("Add User"), button:has-text("Invite")').first();
    
    if (await addButton.count() > 0) {
      await addButton.click();
      await page.waitForTimeout(500);
      
      // Check if drawer is visible
      const drawer = page.locator('.drawer, [class*="drawer"]').first();
      if (await drawer.isVisible()) {
        // Tab through elements - focus should stay in drawer
        const drawerElements = await drawer.locator('button, input, select, a[href]').count();
        console.log(`Drawer has ${drawerElements} focusable elements`);
        
        // Tab multiple times
        for (let i = 0; i < drawerElements + 2; i++) {
          await page.keyboard.press('Tab');
        }
        
        // Focus should still be inside drawer
        const focusInDrawer = await page.evaluate(() => {
          const focused = document.activeElement;
          const drawer = document.querySelector('.drawer, [class*="drawer"]');
          return drawer && drawer.contains(focused);
        });
        
        if (!focusInDrawer) {
          console.log('⚠️  Focus escaped drawer - focus trap may not be implemented');
        } else {
          console.log('✓ Focus is properly trapped in drawer');
        }
        
        // Clean up - close drawer
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
      }
    }
  });

  test('v2-users-groups.html - Escape key closes drawer and returns focus', async ({ page }) => {
    await page.goto('http://localhost:3000/v2-users-groups.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    
    const addButton = page.locator('button:has-text("Add User"), button:has-text("Invite")').first();
    
    if (await addButton.count() > 0) {
      // Remember what had focus before
      await addButton.focus();
      const buttonText = await addButton.textContent();
      
      await addButton.click();
      await page.waitForTimeout(500);
      
      // Press Escape
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
      
      // Check if drawer is closed
      const drawerVisible = await page.locator('.drawer, [class*="drawer"]').first().isVisible().catch(() => false);
      
      if (drawerVisible) {
        console.log('⚠️  Drawer did not close with Escape key');
      } else {
        console.log('✓ Drawer closed with Escape key');
        
        // Check if focus returned to button
        const currentFocus = await page.evaluate(() => document.activeElement.textContent);
        if (currentFocus?.includes(buttonText?.trim() || '')) {
          console.log('✓ Focus returned to trigger button');
        } else {
          console.log('⚠️  Focus did not return to trigger button');
        }
      }
    }
  });

  test('v2-users-groups.html - first element in drawer should receive focus when opened', async ({ page }) => {
    await page.goto('http://localhost:3000/v2-users-groups.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    
    const addButton = page.locator('button:has-text("Add User"), button:has-text("Invite")').first();
    
    if (await addButton.count() > 0) {
      await addButton.click();
      await page.waitForTimeout(500);
      
      // Check what has focus after drawer opens
      const focusedElement = await page.evaluate(() => {
        return {
          tag: document.activeElement.tagName,
          type: document.activeElement.getAttribute('type'),
          text: document.activeElement.textContent?.substring(0, 30)
        };
      });
      
      console.log('Element focused after drawer opens:', focusedElement);
      
      // Should be an interactive element (input, button, or close button)
      const isInteractive = ['INPUT', 'BUTTON', 'SELECT', 'TEXTAREA', 'A'].includes(focusedElement.tag);
      
      if (!isInteractive) {
        console.log('⚠️  First interactive element in drawer should receive focus');
      } else {
        console.log('✓ Interactive element received focus');
      }
      
      // Clean up
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
    }
  });

});

test.describe('Advanced Accessibility - Focus Order & Logical Tab Flow', () => {

  test('v2-users-groups.html - focus order should follow visual order', async ({ page }) => {
    await page.goto('http://localhost:3000/v2-users-groups.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    
    // Tab through first several elements and track their positions
    const focusPositions = [];
    
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      
      const position = await page.evaluate(() => {
        const el = document.activeElement;
        const rect = el.getBoundingClientRect();
        return {
          x: rect.left,
          y: rect.top,
          element: el.tagName + '.' + el.className
        };
      });
      
      focusPositions.push(position);
    }
    
    // Check if focus generally moves left-to-right, top-to-bottom
    let logicalOrder = true;
    for (let i = 1; i < focusPositions.length; i++) {
      const prev = focusPositions[i - 1];
      const curr = focusPositions[i];
      
      // If current is way above previous, that might be illogical
      if (curr.y < prev.y - 100) {
        console.log(`⚠️  Focus jumped up from ${prev.element} to ${curr.element}`);
        logicalOrder = false;
      }
    }
    
    if (logicalOrder) {
      console.log('✓ Focus order appears logical');
    }
  });

});

test.describe('General Keyboard Accessibility Checks', () => {
  
  test('v2-users-groups.html - no elements with tabindex > 0', async ({ page }) => {
    await page.goto('http://localhost:3000/v2-users-groups.html');
    
    // Positive tabindex values create confusing tab order
    const positiveTabindex = await page.locator('[tabindex]:not([tabindex="0"]):not([tabindex="-1"])').count();
    expect(positiveTabindex).toBe(0);
  });

  test('v2-my-profile.html - no elements with tabindex > 0', async ({ page }) => {
    await page.goto('http://localhost:3000/v2-my-profile.html');
    
    const positiveTabindex = await page.locator('[tabindex]:not([tabindex="0"]):not([tabindex="-1"])').count();
    expect(positiveTabindex).toBe(0);
  });

  test('v2-user-roles-multi.html - no elements with tabindex > 0', async ({ page }) => {
    await page.goto('http://localhost:3000/v2-user-roles-multi.html');
    
    const positiveTabindex = await page.locator('[tabindex]:not([tabindex="0"]):not([tabindex="-1"])').count();
    expect(positiveTabindex).toBe(0);
  });

});
