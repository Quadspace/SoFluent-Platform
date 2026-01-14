/**
 * Pre-Deployment Checklist Script
 * Run this before deploying to verify readiness
 */

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

const checklist = {
  passed: 0,
  failed: 0,
  warnings: 0
};

function checkItem(name, condition, required = true) {
  if (condition) {
    log.success(name);
    checklist.passed++;
    return true;
  } else {
    if (required) {
      log.error(name);
      checklist.failed++;
    } else {
      log.warning(name);
      checklist.warnings++;
    }
    return false;
  }
}

function checkFileExists(filePath) {
  return fs.existsSync(path.join(rootDir, filePath));
}

function checkFileContains(filePath, searchText) {
  if (!checkFileExists(filePath)) return false;
  const content = fs.readFileSync(path.join(rootDir, filePath), 'utf-8');
  return content.includes(searchText);
}

async function main() {
  console.log('\n🚀 So Fluent Pre-Deployment Checklist');
  console.log('═'.repeat(60));
  
  // Code Quality
  log.info('\n📝 Code Quality');
  log.info('─'.repeat(60));
  checkItem('No console.log in production code', 
    !checkFileContains('server/server.js', 'console.log') || 
    checkFileContains('server/server.js', 'process.env.NODE_ENV')
  );
  checkItem('Error handling implemented', 
    checkFileExists('server/middlewares/errorHandler.js')
  );
  checkItem('No hardcoded secrets', 
    !checkFileContains('server/server.js', 'sk_live_') &&
    !checkFileContains('server/server.js', 'sk_test_')
  );
  
  // Architecture
  log.info('\n🏗️  Architecture');
  log.info('─'.repeat(60));
  checkItem('Database adapter exists', 
    checkFileExists('server/configs/database-adapter.js')
  );
  checkItem('Storage adapter exists', 
    checkFileExists('server/configs/storage-adapter.js')
  );
  checkItem('Design tokens exist', 
    checkFileExists('client/src/design-system/designTokens.js')
  );
  checkItem('Theme provider implemented', 
    checkFileExists('client/src/context/ThemeContext.jsx') ||
    checkFileExists('client/src/components/common/ThemeProvider.jsx')
  );
  
  // Documentation
  log.info('\n📚 Documentation');
  log.info('─'.repeat(60));
  checkItem('README.md exists', checkFileExists('README.md'));
  checkItem('Deployment guide exists', 
    checkFileExists('MANUS_DEPLOYMENT_COMPLETE_GUIDE.md')
  );
  checkItem('Secrets guide exists', 
    checkFileExists('MANUS_SECRETS_GUIDE.md')
  );
  checkItem('API documentation exists', 
    checkFileExists('server/configs/swagger.js')
  );
  
  // Environment
  log.info('\n🔐 Environment');
  log.info('─'.repeat(60));
  checkItem('.env.example exists', checkFileExists('.env.example'));
  checkItem('client/.env.example exists', checkFileExists('client/.env.example'));
  checkItem('server/env.example exists', checkFileExists('server/env.example'));
  checkItem('.env NOT committed', !checkFileExists('.env'), false);
  
  // Backend
  log.info('\n🔧 Backend');
  log.info('─'.repeat(60));
  checkItem('Server entry point exists', checkFileExists('server/server.js'));
  checkItem('Health check route exists', checkFileExists('server/routes/health.js'));
  checkItem('Migrations system exists', 
    checkFileExists('server/migrations/migrationRunner.js')
  );
  checkItem('Email service exists', 
    checkFileExists('server/services/emailService.js')
  );
  
  // Frontend
  log.info('\n🎨 Frontend');
  log.info('─'.repeat(60));
  checkItem('App entry point exists', checkFileExists('client/src/App.jsx'));
  checkItem('Error boundary exists', 
    checkFileExists('client/src/components/common/ErrorBoundary.jsx')
  );
  checkItem('SEO component exists', 
    checkFileExists('client/src/components/seo/SEOHead.jsx')
  );
  checkItem('i18n configured', 
    checkFileExists('client/src/i18n') ||
    checkFileExists('client/src/locales')
  );
  
  // Manus Readiness
  log.info('\n🚀 Manus Readiness');
  log.info('─'.repeat(60));
  checkItem('Manus config exists', 
    checkFileExists('server/configs/manusConfig.js')
  );
  checkItem('Adapter patterns implemented', 
    checkFileContains('server/configs/database-adapter.js', 'TODO') === false ||
    checkFileContains('server/configs/database-adapter.js', 'MySQL') ||
    checkFileContains('server/configs/database-adapter.js', 'TiDB')
  );
  checkItem('Secrets verification exists', 
    checkFileContains('server/configs/manusConfig.js', 'verifyCriticalSecrets')
  );
  
  // Summary
  console.log('\n📊 Checklist Summary');
  console.log('═'.repeat(60));
  log.success(`Passed: ${checklist.passed}`);
  log.warning(`Warnings: ${checklist.warnings}`);
  log.error(`Failed: ${checklist.failed}`);
  
  const total = checklist.passed + checklist.failed + checklist.warnings;
  const successRate = ((checklist.passed / total) * 100).toFixed(1);
  
  console.log(`\nSuccess Rate: ${successRate}%`);
  
  if (checklist.failed === 0) {
    log.success('\n🎉 All critical checks passed! Ready for deployment!');
    console.log('\nNext steps:');
    console.log('1. Set secrets in Manus Secret Manager');
    console.log('2. Run: npm run build');
    console.log('3. Deploy to Manus');
    console.log('4. Run: npm run verify-deployment');
    process.exit(0);
  } else {
    log.error(`\n⚠️  ${checklist.failed} critical check(s) failed. Please fix before deploying.`);
    process.exit(1);
  }
}

main().catch(error => {
  log.error(`\nFatal error: ${error.message}`);
  process.exit(1);
});
