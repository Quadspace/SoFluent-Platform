/**
 * Create Admin User Script
 * 
 * This script creates a master admin user in the database.
 * 
 * Usage:
 *   node scripts/create-admin-user.js <clerk-user-id> <email>
 * 
 * Example:
 *   node scripts/create-admin-user.js user_2abc123 admin@sofluent.ai
 * 
 * Note: The user must already exist in Clerk first.
 * This script just updates the database role to 'master_admin'.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../server/.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sofluent';

// User Schema (simplified)
const UserSchema = new mongoose.Schema({
  _id: String,
  clerkId: String,
  email: String,
  name: String,
  role: {
    type: String,
    enum: ['student', 'teacher', 'educator', 'master_admin'],
    default: 'student'
  },
  imageUrl: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { _id: false });

const User = mongoose.model('User', UserSchema);

async function createAdminUser(clerkUserId, email) {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if user exists
    let user = await User.findOne({ clerkId: clerkUserId });
    
    if (!user) {
      // Create new user
      console.log(`Creating new admin user: ${email}`);
      user = new User({
        _id: clerkUserId,
        clerkId: clerkUserId,
        email: email,
        name: 'Admin User',
        role: 'master_admin'
      });
    } else {
      // Update existing user to admin
      console.log(`Updating existing user to admin: ${email}`);
      user.role = 'master_admin';
      user.updatedAt = new Date();
    }

    await user.save();
    console.log('✅ Admin user created/updated successfully!');
    console.log(`   Clerk ID: ${clerkUserId}`);
    console.log(`   Email: ${email}`);
    console.log(`   Role: master_admin`);
    console.log('\n📝 Next Steps:');
    console.log('   1. Make sure this Clerk user ID matches your Clerk account');
    console.log('   2. Log in with this Clerk account');
    console.log('   3. Access /admin/dashboard to verify admin access');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

// Get command line arguments
const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('❌ Usage: node scripts/create-admin-user.js <clerk-user-id> <email>');
  console.error('\nExample:');
  console.error('  node scripts/create-admin-user.js user_2abc123 admin@sofluent.ai');
  console.error('\nNote: The user must already exist in Clerk first.');
  console.error('Get the Clerk User ID from your Clerk dashboard.');
  process.exit(1);
}

const [clerkUserId, email] = args;

createAdminUser(clerkUserId, email);
