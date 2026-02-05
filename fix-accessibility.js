#!/usr/bin/env node

/**
 * Automated Accessibility Fixer
 * Scans HTML files and automatically fixes common accessibility issues
 * 
 * Usage: node fix-accessibility.js <file.html>
 *        node fix-accessibility.js --all
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const fixes = {
  missingAlt: 0,
  missingAriaLabel: 0,
  missingButtonType: 0,
  emptyLinks: 0,
  missingLang: 0,
  missingFormLabels: 0,
  lowContrastText: 0,
};

function fixAccessibilityIssues(htmlContent, filename) {
  let fixed = htmlContent;
  let changes = [];
  
  // 1. Add missing alt attributes to images
  const imgWithoutAlt = /<img([^>]*?)(?<!alt=)(?:>|(?=\/>))/gi;
  if (imgWithoutAlt.test(fixed)) {
    fixed = fixed.replace(/<img([^>]*?)(?<!alt=['"])(?:>|\/>)/gi, (match, attrs) => {
      if (!attrs.includes('alt=')) {
        fixes.missingAlt++;
        changes.push('Added missing alt attributes to images');
        // Try to extract src to make a descriptive alt
        const srcMatch = attrs.match(/src=['"]([^'"]+)['"]/);
        const altText = srcMatch ? path.basename(srcMatch[1], path.extname(srcMatch[1])).replace(/[-_]/g, ' ') : 'Image';
        return `<img${attrs} alt="${altText}">`;
      }
      return match;
    });
  }
  
  // 2. Add aria-label to buttons without text content
  fixed = fixed.replace(/<button([^>]*?)>(\s*)<(i|svg|span class="icon)/gi, (match, attrs, whitespace, tag) => {
    if (!attrs.includes('aria-label') && !attrs.includes('title')) {
      fixes.missingAriaLabel++;
      changes.push('Added aria-label to icon-only buttons');
      
      // Try to determine button purpose from class or onclick
      let label = 'Button';
      if (attrs.includes('class="icon-btn"')) {
        label = 'Action';
      }
      if (attrs.includes('onclick="openInviteDrawer()"')) {
        label = 'Invite user';
      }
      if (attrs.includes('search')) {
        label = 'Search';
      }
      
      return `<button${attrs} aria-label="${label}">${whitespace}<${tag}`;
    }
    return match;
  });
  
  // 3. Add type="button" to buttons that aren't submit buttons
  fixed = fixed.replace(/<button(?![^>]*type=)([^>]*?)>/gi, (match, attrs) => {
    if (!attrs.includes('type=')) {
      fixes.missingButtonType++;
      changes.push('Added type="button" to buttons');
      return `<button type="button"${attrs}>`;
    }
    return match;
  });
  
  // 4. Add href="#" to links without href
  fixed = fixed.replace(/<a(?![^>]*href=)([^>]*?)>/gi, (match, attrs) => {
    fixes.emptyLinks++;
    changes.push('Added href to links');
    return `<a href="#"${attrs}>`;
  });
  
  // 5. Ensure html tag has lang attribute
  if (!/<html[^>]*lang=/i.test(fixed)) {
    fixed = fixed.replace(/<html([^>]*)>/i, '<html$1 lang="en">');
    fixes.missingLang++;
    changes.push('Added lang="en" to html tag');
  }
  
  // 6. Add labels to form inputs without them
  fixed = fixed.replace(/<input([^>]*?)(?:id=['"]([^'"]+)['"])?([^>]*?)>/gi, (match, before, id, after) => {
    const fullAttrs = before + (id ? `id="${id}"` : '') + after;
    
    // Check if there's a label somewhere for this input
    const hasLabel = id && new RegExp(`<label[^>]*for=['"]${id}['"]`, 'i').test(fixed);
    const hasAriaLabel = /aria-label=/i.test(fullAttrs);
    const isHidden = /type=['"]hidden['"]/i.test(fullAttrs);
    
    if (!hasLabel && !hasAriaLabel && !isHidden) {
      // Try to determine what type of input this is
      const typeMatch = fullAttrs.match(/type=['"]([^'"]+)['"]/i);
      const placeholderMatch = fullAttrs.match(/placeholder=['"]([^'"]+)['"]/i);
      const nameMatch = fullAttrs.match(/name=['"]([^'"]+)['"]/i);
      
      let ariaLabel = 'Input field';
      if (placeholderMatch) {
        ariaLabel = placeholderMatch[1];
      } else if (nameMatch) {
        ariaLabel = nameMatch[1].replace(/[-_]/g, ' ');
      } else if (typeMatch) {
        ariaLabel = typeMatch[1] + ' field';
      }
      
      if (/search/i.test(fullAttrs) || /search/i.test(ariaLabel)) {
        ariaLabel = 'Search';
      }
      
      fixes.missingFormLabels++;
      changes.push('Added aria-label to unlabeled inputs');
      return `<input${before}${id ? ` id="${id}"` : ''}${after} aria-label="${ariaLabel}">`;
    }
    
    return match;
  });
  
  // 7. Ensure interactive elements are keyboard accessible (remove negative tabindex)
  fixed = fixed.replace(/tabindex=['"](-\d+)['"]/gi, (match, value) => {
    if (value !== '-1') {
      changes.push('Fixed invalid tabindex values');
      return 'tabindex="0"';
    }
    return match;
  });
  
  // Report changes
  if (changes.length > 0) {
    console.log(`\n✅ Fixed ${filename}:`);
    [...new Set(changes)].forEach(change => console.log(`   - ${change}`));
    return { content: fixed, changed: true };
  }
  
  return { content: fixed, changed: false };
}

async function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const result = fixAccessibilityIssues(content, path.basename(filePath));
  
  if (result.changed) {
    // Create backup
    const backupPath = filePath + '.backup';
    fs.writeFileSync(backupPath, content);
    
    // Write fixed file
    fs.writeFileSync(filePath, result.content);
    
    return true;
  }
  
  return false;
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help') {
    console.log('Usage:');
    console.log('  node fix-accessibility.js <file.html>  - Fix a single file');
    console.log('  node fix-accessibility.js --all         - Fix all HTML files');
    console.log('  node fix-accessibility.js v2-*.html     - Fix files matching pattern');
    return;
  }
  
  let files = [];
  
  if (args[0] === '--all') {
    files = await glob('*.html', { cwd: process.cwd() });
  } else if (args[0].includes('*')) {
    files = await glob(args[0], { cwd: process.cwd() });
  } else {
    files = args;
  }
  
  console.log(`\n🔧 Automated Accessibility Fixer\n`);
  console.log(`Processing ${files.length} file(s)...\n`);
  
  let fixedCount = 0;
  
  for (const file of files) {
    const filePath = path.resolve(file);
    if (fs.existsSync(filePath)) {
      const wasFixed = await processFile(filePath);
      if (wasFixed) fixedCount++;
    } else {
      console.log(`⚠️  File not found: ${file}`);
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   Files processed: ${files.length}`);
  console.log(`   Files fixed: ${fixedCount}`);
  console.log(`   Missing alt attributes: ${fixes.missingAlt}`);
  console.log(`   Missing aria-labels: ${fixes.missingAriaLabel}`);
  console.log(`   Missing button types: ${fixes.missingButtonType}`);
  console.log(`   Empty links: ${fixes.emptyLinks}`);
  console.log(`   Missing lang attributes: ${fixes.missingLang}`);
  console.log(`   Missing form labels: ${fixes.missingFormLabels}\n`);
  
  if (fixedCount > 0) {
    console.log('💾 Backups created with .backup extension\n');
    console.log('🧪 Run tests again: node test-one-page.js <filename>\n');
  }
}

main().catch(console.error);
