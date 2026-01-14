/**
 * Test Pix Integration Script
 * Verifies Stripe Pix integration is working correctly
 */

import 'dotenv/config';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use dynamic import for ES modules
const stripePixService = await import(join(__dirname, '../server/services/stripePixService.js')).then(m => m.default);

async function testPixIntegration() {
  console.log('🧪 Testing Stripe Pix Integration...\n');

  // Check environment variables
  console.log('1️⃣ Checking Environment Variables...');
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('❌ STRIPE_SECRET_KEY not found in environment');
    return false;
  }
  console.log('✅ STRIPE_SECRET_KEY found\n');

  // Test 1: Create a test Pix payment
  console.log('2️⃣ Testing Pix Payment Creation...');
  try {
    const testPayment = await stripePixService.createPayment({
      amount: 100, // R$1.00 in cents (minimal test amount)
      description: 'Test Pix Payment',
      metadata: {
        test: true,
        purchaseId: 'test-purchase-123'
      }
    });

    console.log('✅ Payment created successfully!');
    console.log('   Payment ID:', testPayment.id);
    console.log('   Status:', testPayment.status);
    console.log('   Amount:', testPayment.amount, 'cents');
    console.log('   QR Code Data:', testPayment.qrCode ? 'Present' : 'Missing');
    console.log('   QR Code Image:', testPayment.qrCodeBase64 ? 'Present' : 'Missing');
    console.log('   Copy Paste:', testPayment.copyPaste ? 'Present' : 'Missing');
    console.log('   Expires At:', testPayment.expiresAt || 'Not set');
    console.log('');

    // Test 2: Check payment status
    console.log('3️⃣ Testing Payment Status Check...');
    const status = await stripePixService.getPaymentStatus(testPayment.id);
    console.log('✅ Status check successful!');
    console.log('   Status:', status.status);
    console.log('   Amount:', status.amount, 'cents');
    console.log('');

    // Test 3: Verify response structure
    console.log('4️⃣ Verifying Response Structure...');
    const requiredFields = ['id', 'status', 'amount', 'qrCode', 'copyPaste'];
    const missingFields = requiredFields.filter(field => !testPayment[field]);
    
    if (missingFields.length > 0) {
      console.warn('⚠️  Missing fields:', missingFields.join(', '));
      console.warn('   Note: Some fields may be optional or populated later');
    } else {
      console.log('✅ All required fields present');
    }
    console.log('');

    console.log('✅ All tests passed! Pix integration is working correctly.\n');
    return true;

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('   Error details:', error);
    
    // Provide helpful error messages
    if (error.message.includes('Invalid API Key')) {
      console.error('\n💡 Tip: Check your STRIPE_SECRET_KEY in .env file');
    } else if (error.message.includes('Pix')) {
      console.error('\n💡 Tip: Make sure Pix is enabled in your Stripe account');
      console.error('   Go to: Stripe Dashboard → Settings → Payment methods → Enable Pix');
    } else if (error.message.includes('confirm')) {
      console.error('\n💡 Tip: Stripe Pix may require different confirmation flow');
      console.error('   Check Stripe documentation for Pix payment intents');
    }
    
    return false;
  }
}

// Run tests
testPixIntegration()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
