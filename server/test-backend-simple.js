/**
 * Simple Backend Test Script
 * Tests if backend is running and responding
 */

import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

async function testBackend() {
  console.log('🧪 Testing Backend...\n');
  console.log(`Backend URL: ${BACKEND_URL}\n`);

  const tests = [
    {
      name: 'Root endpoint',
      url: `${BACKEND_URL}/`,
      method: 'GET',
    },
    {
      name: 'Health check',
      url: `${BACKEND_URL}/health`,
      method: 'GET',
    },
    {
      name: 'Health detailed',
      url: `${BACKEND_URL}/health/detailed`,
      method: 'GET',
    },
    {
      name: 'Courses list',
      url: `${BACKEND_URL}/api/course`,
      method: 'GET',
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const response = await axios({
        method: test.method,
        url: test.url,
        timeout: 5000,
        validateStatus: () => true, // Don't throw on any status
      });

      if (response.status >= 200 && response.status < 500) {
        console.log(`✅ ${test.name}: ${response.status} ${response.statusText}`);
        passed++;
      } else {
        console.log(`❌ ${test.name}: ${response.status} ${response.statusText}`);
        console.log(`   Response: ${JSON.stringify(response.data).substring(0, 100)}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ${error.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

  if (failed === 0) {
    console.log('✅ All tests passed! Backend is working correctly.');
    process.exit(0);
  } else {
    console.log('❌ Some tests failed. Check backend logs for details.');
    process.exit(1);
  }
}

testBackend().catch(error => {
  console.error('Test error:', error);
  process.exit(1);
});
