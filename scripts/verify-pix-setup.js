/**
 * Verify Pix Setup Script
 * Checks if Pix integration is properly configured
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Verifying Pix Integration Setup...\n');

let allChecksPassed = true;

// Check 1: Environment Variables
console.log('1️⃣ Checking Environment Variables...');
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY not found');
  console.error('   Add it to server/.env or configure in Manus Secret Manager');
  allChecksPassed = false;
} else {
  const keyPrefix = process.env.STRIPE_SECRET_KEY.substring(0, 7);
  if (keyPrefix === 'sk_test') {
    console.log('✅ STRIPE_SECRET_KEY found (TEST mode)');
  } else if (keyPrefix === 'sk_live') {
    console.log('✅ STRIPE_SECRET_KEY found (LIVE mode)');
  } else {
    console.warn('⚠️  STRIPE_SECRET_KEY format may be invalid');
  }
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  console.warn('⚠️  STRIPE_WEBHOOK_SECRET not found (webhooks may not work)');
} else {
  console.log('✅ STRIPE_WEBHOOK_SECRET found');
}
console.log('');

// Check 2: Service File Exists
console.log('2️⃣ Checking Service Files...');
const servicePath = path.join(__dirname, '../server/services/stripePixService.js');
if (fs.existsSync(servicePath)) {
  console.log('✅ stripePixService.js exists');
} else {
  console.error('❌ stripePixService.js not found');
  allChecksPassed = false;
}

const controllerPath = path.join(__dirname, '../server/controllers/pixController.js');
if (fs.existsSync(controllerPath)) {
  console.log('✅ pixController.js exists');
} else {
  console.error('❌ pixController.js not found');
  allChecksPassed = false;
}

const routesPath = path.join(__dirname, '../server/routes/pixRoutes.js');
if (fs.existsSync(routesPath)) {
  console.log('✅ pixRoutes.js exists');
} else {
  console.error('❌ pixRoutes.js not found');
  allChecksPassed = false;
}
console.log('');

// Check 3: Frontend Component
console.log('3️⃣ Checking Frontend Component...');
const frontendPath = path.join(__dirname, '../client/src/components/payments/PixPayment.jsx');
if (fs.existsSync(frontendPath)) {
  console.log('✅ PixPayment.jsx exists');
} else {
  console.error('❌ PixPayment.jsx not found');
  allChecksPassed = false;
}
console.log('');

// Check 4: Routes Registered
console.log('4️⃣ Checking Route Registration...');
const serverPath = path.join(__dirname, '../server/server.js');
if (fs.existsSync(serverPath)) {
  const serverContent = fs.readFileSync(serverPath, 'utf8');
  if (serverContent.includes('/api/payments/pix')) {
    console.log('✅ Pix routes registered in server.js');
  } else {
    console.error('❌ Pix routes not found in server.js');
    allChecksPassed = false;
  }
} else {
  console.error('❌ server.js not found');
  allChecksPassed = false;
}
console.log('');

// Summary
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
if (allChecksPassed) {
  console.log('✅ All checks passed! Pix integration is set up correctly.\n');
  console.log('📋 Next Steps:');
  console.log('   1. Enable Pix in Stripe Dashboard:');
  console.log('      https://dashboard.stripe.com/settings/payment_methods');
  console.log('   2. Test the integration:');
  console.log('      npm run test:pix');
  console.log('   3. Configure webhook endpoint in Stripe:');
  console.log('      https://dashboard.stripe.com/webhooks');
  console.log('      Endpoint: https://your-domain.com/api/payments/pix/webhook');
  console.log('      Events: payment_intent.succeeded, payment_intent.payment_failed\n');
} else {
  console.log('❌ Some checks failed. Please fix the issues above.\n');
  process.exit(1);
}
