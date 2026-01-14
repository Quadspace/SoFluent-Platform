/**
 * Database Indexes Configuration
 * Defines indexes for frequently queried fields to improve performance
 * Run this after database connection to ensure indexes exist
 */

import User from '../models/User.js';
import Course from '../models/Course.js';
import CourseProgress from '../models/CourseProgress.js';
import Purchase from '../models/Purchase.js';
import Class from '../models/Class.js';
import Post from '../models/Post.js';
import Mission from '../models/Mission.js';

export const createIndexes = async () => {
  try {
    console.log('Creating database indexes...');

    // User indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ clerkId: 1 }, { unique: true });
    await User.collection.createIndex({ role: 1 });
    await User.collection.createIndex({ createdAt: -1 });

    // Course indexes
    await Course.collection.createIndex({ educator: 1 });
    await Course.collection.createIndex({ status: 1 });
    await Course.collection.createIndex({ createdAt: -1 });
    await Course.collection.createIndex({ title: 'text', description: 'text' }); // Text search

    // CourseProgress indexes
    await CourseProgress.collection.createIndex({ userId: 1, courseId: 1 }, { unique: true });
    await CourseProgress.collection.createIndex({ userId: 1 });
    await CourseProgress.collection.createIndex({ courseId: 1 });
    await CourseProgress.collection.createIndex({ completed: 1 });

    // Purchase indexes
    await Purchase.collection.createIndex({ userId: 1 });
    await Purchase.collection.createIndex({ courseId: 1 });
    await Purchase.collection.createIndex({ status: 1 });
    await Purchase.collection.createIndex({ createdAt: -1 });
    await Purchase.collection.createIndex({ stripePaymentIntentId: 1 });

    // Class indexes
    await Class.collection.createIndex({ educator: 1 });
    await Class.collection.createIndex({ date: 1 });
    await Class.collection.createIndex({ status: 1 });

    // Post indexes (for social feed)
    await Post.collection.createIndex({ userId: 1 });
    await Post.collection.createIndex({ createdAt: -1 });
    await Post.collection.createIndex({ type: 1 });

    // Mission indexes
    await Mission.collection.createIndex({ userId: 1 });
    await Mission.collection.createIndex({ status: 1 });
    await Mission.collection.createIndex({ createdAt: -1 });

    console.log('✅ Database indexes created successfully');
  } catch (error) {
    console.error('❌ Error creating database indexes:', error);
    // Don't fail startup if indexes already exist
    if (!error.message.includes('already exists')) {
      throw error;
    }
  }
};
