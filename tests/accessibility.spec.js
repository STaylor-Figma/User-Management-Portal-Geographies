import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Accessibility Tests for Platform Services Portals
 * Tests pages against WCAG 2.2 Level AA standards using axe-core
 */

test.describe('Accessibility Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Ensure local server is running at http://localhost:3000
    // Start with: lsof -ti:3000 | xargs kill -9 2>/dev/null; node ../server.js &
  });

  test('v2-users-groups.html should not have accessibility violations', async ({ page }) => {
    await page.goto('http://localhost:3000/v2-users-groups.html');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('v2-my-profile.html should not have accessibility violations', async ({ page }) => {
    await page.goto('http://localhost:3000/v2-my-profile.html');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('v2-user-roles-multi.html should not have accessibility violations', async ({ page }) => {
    await page.goto('http://localhost:3000/v2-user-roles-multi.html');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('v2-company-overview.html should not have accessibility violations', async ({ page }) => {
    await page.goto('http://localhost:3000/v2-company-overview.html');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('subscription-detail-landing.html should not have accessibility violations', async ({ page }) => {
    await page.goto('http://localhost:3000/subscription-detail-landing.html');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

});

/**
 * Advanced Accessibility Testing Examples
 * Uncomment and customize as needed
 */

// Test with custom exclusions
test.skip('Example: Test with excluded regions', async ({ page }) => {
  await page.goto('http://localhost:3000/v2-users-groups.html');
  
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .exclude('#third-party-widget') // Exclude elements you don't control
    .analyze();
  
  expect(accessibilityScanResults.violations).toEqual([]);
});

// Test with disabled rules
test.skip('Example: Test with disabled rules', async ({ page }) => {
  await page.goto('http://localhost:3000/v2-users-groups.html');
  
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .disableRules(['color-contrast']) // Temporarily disable specific rules
    .analyze();
  
  expect(accessibilityScanResults.violations).toEqual([]);
});

// Test specific sections only
test.skip('Example: Test specific region only', async ({ page }) => {
  await page.goto('http://localhost:3000/v2-users-groups.html');
  
  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('.main-content') // Only test specific sections
    .analyze();
  
  expect(accessibilityScanResults.violations).toEqual([]);
});

// Generate detailed violation report
test.skip('Example: Log detailed violations', async ({ page }) => {
  await page.goto('http://localhost:3000/v2-users-groups.html');
  
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  
  if (accessibilityScanResults.violations.length > 0) {
    console.log('Accessibility Violations Found:');
    accessibilityScanResults.violations.forEach(violation => {
      console.log(`\n${violation.id}: ${violation.description}`);
      console.log(`Impact: ${violation.impact}`);
      console.log(`Help: ${violation.helpUrl}`);
      console.log(`Affected nodes: ${violation.nodes.length}`);
      violation.nodes.forEach(node => {
        console.log(`  - ${node.html}`);
        console.log(`    Fix: ${node.failureSummary}`);
      });
    });
  }
  
  expect(accessibilityScanResults.violations).toEqual([]);
});
