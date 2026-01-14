/**
 * Rollback Script
 * Emergency rollback procedures for deployment
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

async function rollbackDatabase() {
  log.info('\n🔄 Rolling back database migrations...');
  try {
    execSync('npm run migrate:rollback', { 
      cwd: path.join(rootDir, 'server'),
      stdio: 'inherit'
    });
    log.success('Database rollback completed');
  } catch (error) {
    log.error(`Database rollback failed: ${error.message}`);
    throw error;
  }
}

async function rollbackDeployment() {
  log.info('\n🔄 Rolling back deployment...');
  log.warning('This will:');
  log.warning('1. Rollback database migrations');
  log.warning('2. Revert to previous Git commit');
  log.warning('3. Rebuild and redeploy');
  
  // Get current commit
  try {
    const currentCommit = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
    log.info(`Current commit: ${currentCommit}`);
    
    // Get previous commit
    const previousCommit = execSync('git rev-parse HEAD~1', { encoding: 'utf-8' }).trim();
    log.info(`Previous commit: ${previousCommit}`);
    
    log.warning('\n⚠️  WARNING: This will reset to previous commit!');
    log.info('To proceed, run:');
    log.info(`git reset --hard ${previousCommit}`);
    log.info('npm run deploy');
    
  } catch (error) {
    log.error(`Git rollback failed: ${error.message}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';
  
  console.log('\n🔄 So Fluent Rollback Script');
  console.log('═'.repeat(50));
  
  switch (command) {
    case 'database':
      await rollbackDatabase();
      break;
    case 'deployment':
      await rollbackDeployment();
      break;
    case 'help':
    default:
      console.log('\nUsage:');
      console.log('  node scripts/rollback.js database    - Rollback database migrations');
      console.log('  node scripts/rollback.js deployment - Rollback deployment');
      console.log('  node scripts/rollback.js help       - Show this help');
      break;
  }
}

main().catch(error => {
  log.error(`\nFatal error: ${error.message}`);
  process.exit(1);
});
