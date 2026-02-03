#!/usr/bin/env node

/**
 * Verify GitHub Repository Completeness
 * Checks that all essential files are tracked and committed
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Essential files and directories that MUST be in the repository
const ESSENTIAL_PATHS = [
  // Root files
  'package.json',
  'README.md',
  '.gitignore',
  
  // Client
  'client/package.json',
  'client/vite.config.js',
  'client/tailwind.config.js',
  'client/index.html',
  'client/src/main.jsx',
  'client/src/App.jsx',
  'client/env.template',
  
  // Server
  'server/package.json',
  'server/server.js',
  'server/env.example',
  'server/env.template',
  
  // Configs
  'server/configs/database-adapter-manus.js',
  'server/configs/storage-adapter-manus.js',
  'server/configs/database-adapter.js',
  'server/configs/storage-adapter.js',
  
  // Migrations
  'server/migrations/002_mysql_schema.js',
  'server/migrations/003_mysql_indexes.js',
  
  // Scripts
  'scripts/verify-manus-readiness.mjs',
  'scripts/create-admin-user.js',
  
  // Documentation
  'MANUS_DEPLOYMENT_PROMPT.md',
  'MANUS_DEPLOYMENT.md',
];

// Directories that should have files tracked
const ESSENTIAL_DIRECTORIES = [
  'client/src',
  'client/public',
  'server/controllers',
  'server/models',
  'server/routes',
  'server/middlewares',
  'server/services',
  'server/migrations',
  'scripts',
];

console.log('🔍 Verifying GitHub Repository Completeness...\n');

let allGood = true;
const missing = [];
const untracked = [];

// Check if files exist and are tracked
console.log('📋 Checking essential files...');
for (const path of ESSENTIAL_PATHS) {
  const fullPath = join(rootDir, path);
  const exists = existsSync(fullPath);
  
  if (!exists) {
    console.log(`❌ Missing: ${path}`);
    missing.push(path);
    allGood = false;
    continue;
  }
  
  try {
    const result = execSync(`git ls-files --error-unmatch "${path}"`, {
      cwd: rootDir,
      encoding: 'utf-8',
      stdio: 'pipe'
    });
    if (!result.trim()) {
      console.log(`⚠️  Not tracked: ${path}`);
      untracked.push(path);
      allGood = false;
    } else {
      console.log(`✅ ${path}`);
    }
  } catch (error) {
    console.log(`⚠️  Not tracked: ${path}`);
    untracked.push(path);
    allGood = false;
  }
}

// Check directories have tracked files
console.log('\n📁 Checking essential directories...');
for (const dir of ESSENTIAL_DIRECTORIES) {
  const fullPath = join(rootDir, dir);
  if (!existsSync(fullPath)) {
    console.log(`❌ Missing directory: ${dir}`);
    missing.push(dir);
    allGood = false;
    continue;
  }
  
  try {
    const result = execSync(`git ls-files "${dir}/" | Measure-Object -Line`, {
      cwd: rootDir,
      encoding: 'utf-8',
      stdio: 'pipe',
      shell: 'powershell.exe'
    });
    const count = parseInt(result.match(/\d+/)?.[0] || '0');
    if (count === 0) {
      console.log(`⚠️  No tracked files in: ${dir}`);
      untracked.push(dir);
      allGood = false;
    } else {
      console.log(`✅ ${dir} (${count} files tracked)`);
    }
  } catch (error) {
    console.log(`⚠️  Could not check: ${dir}`);
  }
}

// Check for uncommitted changes
console.log('\n📝 Checking git status...');
try {
  const status = execSync('git status --porcelain', {
    cwd: rootDir,
    encoding: 'utf-8'
  });
  
  if (status.trim()) {
    console.log('⚠️  Uncommitted changes found:');
    console.log(status);
    allGood = false;
  } else {
    console.log('✅ No uncommitted changes');
  }
} catch (error) {
  console.log('⚠️  Could not check git status');
}

// Check if pushed to remote
console.log('\n🌐 Checking remote status...');
try {
  const remoteUrl = execSync('git remote get-url origin', {
    cwd: rootDir,
    encoding: 'utf-8'
  }).trim();
  console.log(`📍 Remote: ${remoteUrl}`);
  
  const branch = execSync('git rev-parse --abbrev-ref HEAD', {
    cwd: rootDir,
    encoding: 'utf-8'
  }).trim();
  
  try {
    execSync(`git ls-remote --heads origin ${branch}`, {
      cwd: rootDir,
      encoding: 'utf-8',
      stdio: 'pipe'
    });
    console.log(`✅ Branch '${branch}' exists on remote`);
  } catch (error) {
    console.log(`⚠️  Branch '${branch}' not found on remote - needs push`);
    allGood = false;
  }
} catch (error) {
  console.log('⚠️  Could not check remote status');
}

// Summary
console.log('\n' + '='.repeat(60));
if (allGood && missing.length === 0 && untracked.length === 0) {
  console.log('✅ ALL CHECKS PASSED - Repository is complete!');
  console.log('\n📦 Repository is ready for Manus deployment.');
} else {
  console.log('❌ ISSUES FOUND:');
  if (missing.length > 0) {
    console.log(`\n❌ Missing files (${missing.length}):`);
    missing.forEach(f => console.log(`   - ${f}`));
  }
  if (untracked.length > 0) {
    console.log(`\n⚠️  Untracked files (${untracked.length}):`);
    untracked.forEach(f => console.log(`   - ${f}`));
    console.log('\n💡 Run: git add <file> && git commit -m "Add missing files"');
  }
  console.log('\n📝 Next steps:');
  console.log('   1. Add missing files: git add .');
  console.log('   2. Commit: git commit -m "Complete codebase for Manus"');
  console.log('   3. Push: git push origin main');
}

process.exit(allGood && missing.length === 0 && untracked.length === 0 ? 0 : 1);
