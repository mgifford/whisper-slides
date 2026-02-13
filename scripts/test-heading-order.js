#!/usr/bin/env node
/**
 * Test heading order in HTML files
 * Ensures headings don't skip levels (e.g., h1 -> h3 without h2)
 * Run with: node scripts/test-heading-order.js
 */

const fs = require('fs');
const path = require('path');

function extractHeadings(html) {
  const headings = [];
  const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h\1>/gi;
  let match;
  
  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1]);
    // Note: This tag stripping is for display in console output only, not for
    // HTML sanitization. The text is never inserted into HTML or used in a
    // security-sensitive context.
    const text = match[2]
      .replace(/<[^>]*>/g, '')  // Remove all tags
      .replace(/&lt;/g, '<')    // Decode common entities
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .trim();
    headings.push({ level, text });
  }
  
  return headings;
}

function checkHeadingOrder(headings) {
  const errors = [];
  
  for (let i = 1; i < headings.length; i++) {
    const prev = headings[i - 1];
    const curr = headings[i];
    
    // Check if we're increasing heading level
    if (curr.level > prev.level) {
      // Can only increase by 1 level at a time
      if (curr.level - prev.level > 1) {
        errors.push({
          message: `Heading level skipped: h${prev.level} "${prev.text}" followed by h${curr.level} "${curr.text}"`,
          previous: prev,
          current: curr
        });
      }
    }
  }
  
  return errors;
}

function testFile(filePath) {
  console.log(`\nChecking ${filePath}...`);
  
  const html = fs.readFileSync(filePath, 'utf8');
  const headings = extractHeadings(html);
  
  console.log(`Found ${headings.length} headings:`);
  headings.forEach(h => {
    console.log(`  h${h.level}: ${h.text}`);
  });
  
  const errors = checkHeadingOrder(headings);
  
  if (errors.length > 0) {
    console.error('\n❌ Heading order errors found:');
    errors.forEach(err => {
      console.error(`  - ${err.message}`);
    });
    return false;
  } else {
    console.log('✅ Heading order is correct');
    return true;
  }
}

// Test index.html
const indexPath = path.join(__dirname, '..', 'index.html');
const success = testFile(indexPath);

process.exit(success ? 0 : 1);
