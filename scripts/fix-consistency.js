/**
 * Consistency Fix Script
 * Finds and reports hardcoded colors and inconsistencies
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pagesDir = path.join(__dirname, '../client/src/pages');
const issues = [];

// Color replacements
const colorReplacements = {
  'bg-\\[#0A0A0A\\]': 'bg-sofluent-dark',
  'bg-\\[#1A1A1A\\]': 'bg-sofluent-black',
  'from-\\[#0A0A0A\\]': 'from-sofluent-dark',
  'via-\\[#1A1A1A\\]': 'via-sofluent-black',
  'to-\\[#0A0A0A\\]': 'to-sofluent-dark',
  'text-gray-800': 'text-sofluent-black',
  'text-gray-500': 'text-sofluent-gris',
  'text-gray-600': 'text-sofluent-gris',
  'text-blue-600': 'text-sofluent-cherry',
  'bg-blue-600': 'bg-sofluent-cherry',
  'from-\\[#E91E63\\]': 'from-sofluent-cherry',
  'to-\\[#C2185B\\]': 'to-sofluent-cherry-dark',
  'border-\\[#E91E63\\]': 'border-sofluent-cherry',
  'shadow-\\[#E91E63\\]': 'shadow-sofluent-cherry',
};

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(pagesDir, filePath);
  const fileIssues = [];

  // Check for hardcoded colors
  Object.entries(colorReplacements).forEach(([pattern, replacement]) => {
    const regex = new RegExp(pattern, 'g');
    const matches = content.match(regex);
    if (matches) {
      fileIssues.push({
        type: 'hardcoded-color',
        pattern,
        replacement,
        count: matches.length,
      });
    }
  });

  // Check for manual Footer inclusion
  if (content.includes('<Footer') && !content.includes('StandardPage')) {
    fileIssues.push({
      type: 'manual-footer',
      message: 'Page manually includes Footer instead of using StandardPage',
    });
  }

  // Check for inconsistent typography
  if (content.match(/className=".*text-\d+xl.*font-/)) {
    fileIssues.push({
      type: 'inconsistent-typography',
      message: 'Uses hardcoded typography classes instead of BrandText',
    });
  }

  // Check for inconsistent buttons
  if (content.match(/className=".*bg-.*px-.*py-.*rounded/)) {
    fileIssues.push({
      type: 'inconsistent-button',
      message: 'Uses hardcoded button styles instead of BrandButton',
    });
  }

  if (fileIssues.length > 0) {
    issues.push({
      file: relativePath,
      issues: fileIssues,
    });
  }
}

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      scanDirectory(filePath);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      scanFile(filePath);
    }
  });
}

// Run scan
console.log('🔍 Scanning pages for consistency issues...\n');
scanDirectory(pagesDir);

// Report
console.log(`Found ${issues.length} files with issues:\n`);
issues.forEach(({ file, issues: fileIssues }) => {
  console.log(`📄 ${file}`);
  fileIssues.forEach((issue) => {
    if (issue.type === 'hardcoded-color') {
      console.log(`   ⚠️  ${issue.count}x ${issue.pattern} → ${issue.replacement}`);
    } else {
      console.log(`   ⚠️  ${issue.message}`);
    }
  });
  console.log('');
});

console.log(`\n✅ Scan complete. Found issues in ${issues.length} files.`);
