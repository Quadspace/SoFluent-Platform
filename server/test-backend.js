/**
 * Simple Backend Test Script
 * Run this to verify backend is working: node test-backend.js
 */

import 'dotenv/config';
import mongoose from 'mongoose';

async function testBackend() {
    console.log('🧪 Testing Backend Setup...\n');

    // Test 1: Environment Variables
    console.log('1. Checking Environment Variables...');
    const requiredVars = [
        'MONGODB_URI',
        'CLERK_WEBHOOK_SECRET',
        'CLOUDINARY_NAME'
    ];
    
    let missingVars = [];
    requiredVars.forEach(varName => {
        if (!process.env[varName]) {
            missingVars.push(varName);
        }
    });

    if (missingVars.length > 0) {
        console.log('   ⚠️  Missing environment variables:', missingVars.join(', '));
        console.log('   📝 Create server/.env file with required variables\n');
    } else {
        console.log('   ✅ All required environment variables set\n');
    }

    // Test 2: Database Connection
    console.log('2. Testing Database Connection...');
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/SoFluent`);
        console.log('   ✅ Database connected successfully!\n');
        await mongoose.disconnect();
    } catch (error) {
        console.log('   ❌ Database connection failed:', error.message);
        console.log('   💡 Make sure MongoDB is running or Atlas connection is correct\n');
    }

    // Test 3: Dependencies
    console.log('3. Checking Dependencies...');
    try {
        const express = await import('express');
        const clerk = await import('@clerk/express');
        console.log('   ✅ All dependencies installed\n');
    } catch (error) {
        console.log('   ❌ Missing dependencies:', error.message);
        console.log('   💡 Run: npm install\n');
    }

    console.log('📋 Next Steps:');
    console.log('   1. Set up environment variables (server/.env)');
    console.log('   2. Start backend: npm start');
    console.log('   3. Start frontend: cd ../client && npm run dev');
    console.log('   4. Test login at http://localhost:5173');
}

testBackend().catch(console.error);
