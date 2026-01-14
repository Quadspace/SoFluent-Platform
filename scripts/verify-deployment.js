/**
 * Deployment Verification Script
 * Run this after deployment to verify everything works
 */

import axios from 'axios';
import { config } from 'dotenv';

config();

const BACKEND_URL = process.env.BACKEND_URL || process.env.VITE_BACKEND_URL || 'http://localhost:3000';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

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

const checks = {
  passed: 0,
  failed: 0,
  warnings: 0
};

async function checkEndpoint(name, url, expectedStatus = 200) {
  try {
    const start = Date.now();
    const response = await axios.get(url, { timeout: 5000 });
    const duration = Date.now() - start;
    
    if (response.status === expectedStatus) {
      log.success(`${name}: ${response.status} (${duration}ms)`);
      checks.passed++;
      return true;
    } else {
      log.error(`${name}: Expected ${expectedStatus}, got ${response.status}`);
      checks.failed++;
      return false;
    }
  } catch (error) {
    log.error(`${name}: ${error.message}`);
    checks.failed++;
    return false;
  }
}

async function checkHealth() {
  log.info('\n🏥 Health Checks');
  log.info('─'.repeat(50));
  
  await checkEndpoint('Basic Health', `${BACKEND_URL}/health`);
  await checkEndpoint('Detailed Health', `${BACKEND_URL}/health/detailed`);
  await checkEndpoint('Readiness', `${BACKEND_URL}/health/ready`);
  await checkEndpoint('Liveness', `${BACKEND_URL}/health/live`);
}

async function checkAPI() {
  log.info('\n🔌 API Endpoints');
  log.info('─'.repeat(50));
  
  // Check Swagger docs
  await checkEndpoint('Swagger Docs', `${BACKEND_URL}/api-docs`);
  
  // Check public endpoints (no auth required)
  await checkEndpoint('Courses List', `${BACKEND_URL}/api/courses/all`);
  
  // Note: Protected endpoints require authentication
  log.warning('Protected endpoints require authentication - skipping');
}

async function checkFrontend() {
  log.info('\n🌐 Frontend');
  log.info('─'.repeat(50));
  
  try {
    const response = await axios.get(FRONTEND_URL, { timeout: 5000 });
    if (response.status === 200) {
      log.success(`Frontend: ${response.status}`);
      checks.passed++;
      
      // Check for common errors in HTML
      if (response.data.includes('Error') && response.data.includes('Failed')) {
        log.warning('Frontend may have errors - check console');
        checks.warnings++;
      }
    } else {
      log.error(`Frontend: ${response.status}`);
      checks.failed++;
    }
  } catch (error) {
    log.error(`Frontend: ${error.message}`);
    checks.failed++;
  }
}

async function checkPerformance() {
  log.info('\n⚡ Performance');
  log.info('─'.repeat(50));
  
  const endpoints = [
    { name: 'Health Check', url: `${BACKEND_URL}/health` },
    { name: 'API Docs', url: `${BACKEND_URL}/api-docs` }
  ];
  
  for (const endpoint of endpoints) {
    try {
      const times = [];
      for (let i = 0; i < 5; i++) {
        const start = Date.now();
        await axios.get(endpoint.url, { timeout: 5000 });
        times.push(Date.now() - start);
      }
      
      const avg = times.reduce((a, b) => a + b, 0) / times.length;
      const max = Math.max(...times);
      const min = Math.min(...times);
      
      if (avg < 500) {
        log.success(`${endpoint.name}: ${avg.toFixed(0)}ms avg (${min}-${max}ms)`);
        checks.passed++;
      } else {
        log.warning(`${endpoint.name}: ${avg.toFixed(0)}ms avg (slow)`);
        checks.warnings++;
      }
    } catch (error) {
      log.error(`${endpoint.name}: ${error.message}`);
      checks.failed++;
    }
  }
}

async function checkEnvironment() {
  log.info('\n🔐 Environment Variables');
  log.info('─'.repeat(50));
  
  const required = [
    'NODE_ENV',
    'PORT',
    'MONGODB_URI', // or MYSQL_URI for Manus
    'CLERK_SECRET_KEY',
    'STRIPE_SECRET_KEY'
  ];
  
  const optional = [
    'SENTRY_DSN',
    'OPENROUTER_API_KEY',
    'EMAIL_SERVICE_API_KEY'
  ];
  
  let missing = [];
  let present = [];
  
  required.forEach(key => {
    if (process.env[key]) {
      present.push(key);
      log.success(`${key}: Set`);
    } else {
      missing.push(key);
      log.error(`${key}: Missing (REQUIRED)`);
    }
  });
  
  optional.forEach(key => {
    if (process.env[key]) {
      log.success(`${key}: Set`);
    } else {
      log.warning(`${key}: Not set (optional)`);
    }
  });
  
  if (missing.length > 0) {
    checks.failed += missing.length;
    log.error(`\nMissing ${missing.length} required environment variables!`);
  } else {
    checks.passed += required.length;
    log.success(`\nAll required environment variables are set!`);
  }
}

async function main() {
  console.log('\n🚀 So Fluent Deployment Verification');
  console.log('═'.repeat(50));
  console.log(`Backend: ${BACKEND_URL}`);
  console.log(`Frontend: ${FRONTEND_URL}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('═'.repeat(50));
  
  await checkHealth();
  await checkAPI();
  await checkFrontend();
  await checkPerformance();
  await checkEnvironment();
  
  // Summary
  console.log('\n📊 Summary');
  console.log('═'.repeat(50));
  log.success(`Passed: ${checks.passed}`);
  log.warning(`Warnings: ${checks.warnings}`);
  log.error(`Failed: ${checks.failed}`);
  
  const total = checks.passed + checks.failed + checks.warnings;
  const successRate = ((checks.passed / total) * 100).toFixed(1);
  
  console.log(`\nSuccess Rate: ${successRate}%`);
  
  if (checks.failed === 0) {
    log.success('\n🎉 All checks passed! Deployment is successful!');
    process.exit(0);
  } else {
    log.error(`\n⚠️  ${checks.failed} check(s) failed. Please review and fix.`);
    process.exit(1);
  }
}

main().catch(error => {
  log.error(`\nFatal error: ${error.message}`);
  process.exit(1);
});
