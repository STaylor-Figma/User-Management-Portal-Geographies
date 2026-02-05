#!/usr/bin/env node

/**
 * Accessibility test that generates an HTML report
 * Usage: node test-with-report.js v2-users-groups.html
 */

import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'fs';

const pageName = process.argv[2] || 'v2-users-groups.html';
const baseURL = 'http://localhost:3000';

console.log(`\n🔍 Testing ${pageName} for accessibility violations...\n`);

const browser = await chromium.launch({ headless: false, slowMo: 500 });
const context = await browser.newContext();
const page = await context.newPage();

try {
  await page.goto(`${baseURL}/${pageName}`);
  console.log(`✓ Page loaded: ${baseURL}/${pageName}\n`);
  console.log('⏳ Running accessibility scan (browser will stay open for 3 seconds)...\n');
  
  const results = await new AxeBuilder({ page }, context)
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  
  console.log(`📊 Test Results:`);
  console.log(`   Passes: ${results.passes.length}`);
  console.log(`   Violations: ${results.violations.length}`);
  console.log(`   Incomplete: ${results.incomplete.length}`);
  console.log(`   Inapplicable: ${results.inapplicable.length}\n`);
  
  // Generate HTML report
  const reportName = `accessibility-report-${pageName.replace('.html', '')}-${Date.now()}.html`;
  const html = generateHTMLReport(pageName, results);
  fs.writeFileSync(reportName, html);
  
  if (results.violations.length === 0) {
    console.log('✅ NO ACCESSIBILITY VIOLATIONS FOUND!\n');
  } else {
    console.log('❌ VIOLATIONS FOUND:\n');
    results.violations.forEach((violation, index) => {
      console.log(`${index + 1}. ${violation.id}`);
      console.log(`   Impact: ${violation.impact}`);
      console.log(`   Description: ${violation.description}`);
      console.log(`   Affected elements: ${violation.nodes.length}`);
      console.log(`   Learn more: ${violation.helpUrl}\n`);
    });
  }
  
  console.log(`📄 HTML Report saved: ${reportName}`);
  console.log(`   Open it with: open ${reportName}\n`);
  
  // Keep browser open for 3 seconds so you can see it
  await page.waitForTimeout(3000);
  
} catch (error) {
  console.error('❌ Error:', error.message);
} finally {
  await browser.close();
  console.log('Test complete.\n');
}

function generateHTMLReport(pageName, results) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Accessibility Report - ${pageName}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
    h1 { color: #333; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
    .stat-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .stat-card h3 { margin: 0 0 10px 0; color: #666; font-size: 14px; text-transform: uppercase; }
    .stat-card .number { font-size: 36px; font-weight: bold; margin: 0; }
    .passes .number { color: #10b981; }
    .violations .number { color: #ef4444; }
    .incomplete .number { color: #f59e0b; }
    .inapplicable .number { color: #6b7280; }
    .violation { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #ef4444; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .violation h3 { margin-top: 0; color: #ef4444; }
    .impact { display: inline-block; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
    .impact.critical { background: #fee; color: #c00; }
    .impact.serious { background: #fef3c7; color: #92400e; }
    .impact.moderate { background: #dbeafe; color: #1e40af; }
    .impact.minor { background: #f3f4f6; color: #374151; }
    .node { background: #f9fafb; padding: 12px; margin: 10px 0; border-radius: 4px; font-family: monospace; font-size: 12px; }
    .success { background: #d1fae5; padding: 30px; border-radius: 8px; text-align: center; margin: 20px 0; }
    .success h2 { color: #059669; margin: 0; }
    a { color: #2563eb; }
    .wcag-tags { display: flex; gap: 8px; flex-wrap: wrap; margin: 10px 0; }
    .tag { background: #e0e7ff; color: #3730a3; padding: 4px 8px; border-radius: 4px; font-size: 11px; }
  </style>
</head>
<body>
  <h1>🔍 Accessibility Report</h1>
  <p><strong>Page:</strong> ${pageName}</p>
  <p><strong>Tested:</strong> ${new Date().toLocaleString()}</p>
  <p><strong>Standards:</strong> WCAG 2.0 Level A/AA, WCAG 2.1 Level A/AA, WCAG 2.2 Level AA</p>
  
  <div class="summary">
    <div class="stat-card passes">
      <h3>Passes</h3>
      <p class="number">${results.passes.length}</p>
    </div>
    <div class="stat-card violations">
      <h3>Violations</h3>
      <p class="number">${results.violations.length}</p>
    </div>
    <div class="stat-card incomplete">
      <h3>Incomplete</h3>
      <p class="number">${results.incomplete.length}</p>
    </div>
    <div class="stat-card inapplicable">
      <h3>Inapplicable</h3>
      <p class="number">${results.inapplicable.length}</p>
    </div>
  </div>
  
  ${results.violations.length === 0 ? `
    <div class="success">
      <h2>✅ No Accessibility Violations Found!</h2>
      <p>Your page meets WCAG 2.2 Level AA standards.</p>
    </div>
  ` : `
    <h2>❌ Violations (${results.violations.length})</h2>
    ${results.violations.map((violation, index) => `
      <div class="violation">
        <h3>${index + 1}. ${violation.id}</h3>
        <span class="impact ${violation.impact}">${violation.impact} impact</span>
        <p><strong>Description:</strong> ${violation.description}</p>
        <p><strong>Help:</strong> ${violation.help}</p>
        <div class="wcag-tags">
          ${violation.tags.filter(t => t.startsWith('wcag')).map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <p><strong>Learn more:</strong> <a href="${violation.helpUrl}" target="_blank">${violation.helpUrl}</a></p>
        <p><strong>Affected elements:</strong> ${violation.nodes.length}</p>
        ${violation.nodes.map((node, i) => `
          <div class="node">
            <strong>Element ${i + 1}:</strong><br>
            ${node.html}<br><br>
            <strong>Fix:</strong> ${node.failureSummary}
          </div>
        `).join('')}
      </div>
    `).join('')}
  `}
  
  <h2>✅ Passes (${results.passes.length})</h2>
  <p>Your page successfully passes these accessibility checks:</p>
  <div class="wcag-tags">
    ${results.passes.map(pass => `<span class="tag">${pass.id}</span>`).join('')}
  </div>
</body>
</html>`;
}
