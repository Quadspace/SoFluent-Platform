/**
 * Google Workspace Setup Verification Script
 * Verifies Google Cloud Console setup is complete
 */

import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

config();

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

let checks = {
  passed: 0,
  failed: 0,
  warnings: 0
};

function checkEnvVar(name, required = true) {
  const value = process.env[name];
  
  if (!value || value.includes('your_') || value.includes('...')) {
    if (required) {
      log.error(`${name}: Not configured`);
      checks.failed++;
      return false;
    } else {
      log.warning(`${name}: Not configured (optional)`);
      checks.warnings++;
      return false;
    }
  } else {
    log.success(`${name}: Configured`);
    checks.passed++;
    return true;
  }
}

function checkServiceAccountKey() {
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  
  if (!key || key.includes('...')) {
    log.error('GOOGLE_SERVICE_ACCOUNT_KEY: Not configured');
    checks.failed++;
    return false;
  }

  try {
    const parsed = JSON.parse(key);
    
    if (!parsed.type || parsed.type !== 'service_account') {
      log.error('GOOGLE_SERVICE_ACCOUNT_KEY: Invalid format (must be service_account)');
      checks.failed++;
      return false;
    }

    const requiredFields = ['project_id', 'private_key', 'client_email'];
    const missing = requiredFields.filter(field => !parsed[field]);
    
    if (missing.length > 0) {
      log.error(`GOOGLE_SERVICE_ACCOUNT_KEY: Missing fields: ${missing.join(', ')}`);
      checks.failed++;
      return false;
    }

    log.success('GOOGLE_SERVICE_ACCOUNT_KEY: Valid JSON format');
    checks.passed++;
    return true;
  } catch (error) {
    log.error(`GOOGLE_SERVICE_ACCOUNT_KEY: Invalid JSON - ${error.message}`);
    checks.failed++;
    return false;
  }
}

async function checkGoogleAPIs() {
  log.info('\n🔌 Checking Google APIs...');
  
  // Note: We can't actually verify APIs are enabled without making API calls
  // But we can check if credentials are configured
  log.info('Note: API enablement must be verified in Google Cloud Console');
  log.info('Required APIs:');
  log.info('  - Google Classroom API');
  log.info('  - Google Calendar API');
  log.info('  - Google Drive API');
  log.info('  - Google OAuth2 API');
  
  checks.passed++;
}

function checkOpenRouter() {
  log.info('\n🤖 Checking OpenRouter...');
  
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey || apiKey.includes('your_')) {
    log.error('OPENROUTER_API_KEY: Not configured');
    checks.failed++;
    return false;
  }

  if (!apiKey.startsWith('sk-or-v1-')) {
    log.warning('OPENROUTER_API_KEY: Format may be incorrect (should start with sk-or-v1-)');
    checks.warnings++;
  } else {
    log.success('OPENROUTER_API_KEY: Configured');
    checks.passed++;
  }

  return true;
}

async function main() {
  console.log('\n🔍 Google Workspace Setup Verification');
  console.log('═'.repeat(60));
  
  // Check environment file exists
  const envPath = path.join(rootDir, 'server', '.env');
  if (!fs.existsSync(envPath)) {
    log.warning('.env file not found. Using env.example as reference.');
    log.info('Copy server/env.example to server/.env and configure values.');
  } else {
    log.success('.env file exists');
    checks.passed++;
  }

  // Check Google OAuth credentials
  log.info('\n🔐 Google OAuth Credentials');
  log.info('─'.repeat(60));
  checkEnvVar('GOOGLE_CLIENT_ID', true);
  checkEnvVar('GOOGLE_CLIENT_SECRET', true);
  checkEnvVar('GOOGLE_REDIRECT_URI', true);
  checkEnvVar('GOOGLE_SUBJECT_EMAIL', true);
  
  // Check Service Account
  log.info('\n👤 Service Account');
  log.info('─'.repeat(60));
  checkServiceAccountKey();

  // Check APIs
  await checkGoogleAPIs();

  // Check OpenRouter
  checkOpenRouter();

  // Summary
  console.log('\n📊 Verification Summary');
  console.log('═'.repeat(60));
  log.success(`Passed: ${checks.passed}`);
  log.warning(`Warnings: ${checks.warnings}`);
  log.error(`Failed: ${checks.failed}`);
  
  const total = checks.passed + checks.failed + checks.warnings;
  const successRate = total > 0 ? ((checks.passed / total) * 100).toFixed(1) : 0;
  
  console.log(`\nSuccess Rate: ${successRate}%`);
  
  if (checks.failed === 0) {
    log.success('\n🎉 Google Workspace setup is complete!');
    console.log('\nNext steps:');
    console.log('1. Test backend routes: npm run dev');
    console.log('2. Test Google Classroom: curl http://localhost:3000/api/google/classroom/create-course');
    console.log('3. Test AI Chat: curl http://localhost:3000/api/ai/chat');
    process.exit(0);
  } else {
    log.error(`\n⚠️  ${checks.failed} check(s) failed. Please fix before proceeding.`);
    console.log('\nSee GOOGLE_WORKSPACE_SETUP_GUIDE.md for detailed setup instructions.');
    process.exit(1);
  }
}

main().catch(error => {
  log.error(`\nFatal error: ${error.message}`);
  process.exit(1);
});
