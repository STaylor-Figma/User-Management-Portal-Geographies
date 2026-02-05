#!/usr/bin/env node

/**
 * Quick accessibility test runner for a single page
 * Usage: node test-one-page.js v2-users-groups.html
 */

import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pageName = process.argv[2] || 'v2-users-groups.html';
const baseURL = 'http://localhost:3000';

console.log(`\n🔍 Testing ${pageName} for accessibility violations...\n`);

const browser = await chromium.launch({ headless: false });
const context = await browser.newContext();
const page = await context.newPage();

try {
  await page.goto(`${baseURL}/${pageName}`);
  console.log(`✓ Page loaded: ${baseURL}/${pageName}\n`);
  
  const results = await new AxeBuilder({ page }, context)
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  
  console.log(`📊 Test Results:`);
  console.log(`   Passes: ${results.passes.length}`);
  console.log(`   Violations: ${results.violations.length}`);
  console.log(`   Incomplete: ${results.incomplete.length}`);
  console.log(`   Inapplicable: ${results.inapplicable.length}\n`);
  
  if (results.violations.length === 0) {
    console.log('✅ NO ACCESSIBILITY VIOLATIONS FOUND!\n');
  } else {
    console.log('❌ VIOLATIONS FOUND:\n');
    results.violations.forEach((violation, index) => {
      console.log(`${index + 1}. ${violation.id}`);
      console.log(`   Impact: ${violation.impact}`);
      console.log(`   Description: ${violation.description}`);
      console.log(`   Help: ${violation.help}`);
      console.log(`   WCAG: ${violation.tags.filter(t => t.startsWith('wcag')).join(', ')}`);
      console.log(`   Affected elements: ${violation.nodes.length}`);
      console.log(`   Learn more: ${violation.helpUrl}\n`);
      
      violation.nodes.forEach((node, nodeIndex) => {
        console.log(`   Element ${nodeIndex + 1}:`);
        console.log(`   ${node.html.substring(0, 100)}${node.html.length > 100 ? '...' : ''}`);
        console.log(`   Fix: ${node.failureSummary}\n`);
      });
    });
  }
  
} catch (error) {
  console.error('❌ Error:', error.message);
} finally {
  await browser.close();
  console.log('Test complete.\n');
}
