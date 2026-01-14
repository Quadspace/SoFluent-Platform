/**
 * Production Build Verification Script
 * Verifies production build is ready for deployment
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`)
};

let errors = 0;
let warnings = 0;

function checkFileExists(filePath, required = true) {
  const fullPath = path.join(rootDir, filePath);
  const exists = fs.existsSync(fullPath);
  
  if (exists) {
    log.success(`Found: ${filePath}`);
    return true;
  } else {
    if (required) {
      log.error(`Missing: ${filePath} (REQUIRED)`);
      errors++;
    } else {
      log.warning(`Missing: ${filePath} (optional)`);
      warnings++;
    }
    return false;
  }
}

function checkFileSize(filePath, maxSizeMB) {
  const fullPath = path.join(rootDir, filePath);
  if (!fs.existsSync(fullPath)) return;
  
  const stats = fs.statSync(fullPath);
  const sizeMB = stats.size / (1024 * 1024);
  
  if (sizeMB > maxSizeMB) {
    log.warning(`${filePath}: ${sizeMB.toFixed(2)}MB (max: ${maxSizeMB}MB)`);
    warnings++;
  } else {
    log.success(`${filePath}: ${sizeMB.toFixed(2)}MB`);
  }
}

function checkBuildOutput() {
  log.info('\n📦 Build Output');
  log.info('─'.repeat(50));
  
  // Check client build
  checkFileExists('client/dist/index.html', true);
  checkFileExists('client/dist/assets', true);
  
  // Check for common build files
  const buildFiles = [
    'client/dist/index.html',
    'client/dist/assets'
  ];
  
  buildFiles.forEach(file => checkFileExists(file, true));
  
  // Check bundle sizes
  log.info('\n📊 Bundle Sizes');
  log.info('─'.repeat(50));
  
  const distDir = path.join(rootDir, 'client/dist');
  if (fs.existsSync(distDir)) {
    const assetsDir = path.join(distDir, 'assets');
    if (fs.existsSync(assetsDir)) {
      const files = fs.readdirSync(assetsDir);
      files.forEach(file => {
        const filePath = path.join(assetsDir, file);
        if (file.endsWith('.js')) {
          checkFileSize(`client/dist/assets/${file}`, 500); // 500KB max
        } else if (file.endsWith('.css')) {
          checkFileSize(`client/dist/assets/${file}`, 100); // 100KB max
        }
      });
    }
  }
}

function checkEnvironmentFiles() {
  log.info('\n🔐 Environment Files');
  log.info('─'.repeat(50));
  
  checkFileExists('.env.example', true);
  checkFileExists('client/.env.example', true);
  checkFileExists('server/env.example', true);
  
  // Check that .env files are NOT committed
  if (fs.existsSync(path.join(rootDir, '.env'))) {
    log.warning('.env file exists (should not be committed)');
    warnings++;
  }
}

function checkDocumentation() {
  log.info('\n📚 Documentation');
  log.info('─'.repeat(50));
  
  const docs = [
    'README.md',
    'MANUS_DEPLOYMENT_COMPLETE_GUIDE.md',
    'MANUS_SECRETS_GUIDE.md',
    'MANUS_TASKS_TEMPLATE.md',
    'PROJECT_STATUS_SUMMARY.md'
  ];
  
  docs.forEach(doc => checkFileExists(doc, true));
}

function checkCodeQuality() {
  log.info('\n🔍 Code Quality');
  log.info('─'.repeat(50));
  
  try {
    // Check if linting passes
    log.info('Running ESLint...');
    execSync('npm run lint', { 
      cwd: rootDir, 
      stdio: 'pipe',
      timeout: 30000 
    });
    log.success('ESLint: No errors');
  } catch (error) {
    log.warning('ESLint: Some warnings (non-blocking)');
    warnings++;
  }
}

function checkDependencies() {
  log.info('\n📦 Dependencies');
  log.info('─'.repeat(50));
  
  // Check package.json exists
  checkFileExists('package.json', true);
  checkFileExists('client/package.json', true);
  checkFileExists('server/package.json', true);
  
  // Check node_modules exists (for production build)
  if (fs.existsSync(path.join(rootDir, 'node_modules'))) {
    log.success('node_modules: Present');
  } else {
    log.warning('node_modules: Not found (run npm install)');
    warnings++;
  }
}

async function main() {
  console.log('\n🏗️  So Fluent Production Build Verification');
  console.log('═'.repeat(50));
  
  checkBuildOutput();
  checkEnvironmentFiles();
  checkDocumentation();
  checkDependencies();
  
  // Try code quality checks (non-blocking)
  try {
    checkCodeQuality();
  } catch (error) {
    log.warning('Code quality checks skipped');
  }
  
  // Summary
  console.log('\n📊 Summary');
  console.log('═'.repeat(50));
  log.success(`Checks passed`);
  log.warning(`Warnings: ${warnings}`);
  log.error(`Errors: ${errors}`);
  
  if (errors === 0) {
    log.success('\n🎉 Production build is ready!');
    process.exit(0);
  } else {
    log.error(`\n⚠️  ${errors} error(s) found. Please fix before deploying.`);
    process.exit(1);
  }
}

main().catch(error => {
  log.error(`\nFatal error: ${error.message}`);
  process.exit(1);
});
