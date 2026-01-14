/**
 * Stripe Payment Controller
 * Handles Stripe payment intent creation and webhook processing
 */

import Stripe from 'stripe';
import Purchase from '../models/Purchase.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import dbAdapter from '../configs/database-adapter.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Create Stripe payment intent
 * POST /api/payments/stripe/create-intent
 */
export const createPaymentIntent = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { courseId, amount } = req.body;

    // Validate input
    if (!courseId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Course ID and amount are required'
      });
    }

    // Get user
    const user = await dbAdapter.users.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create purchase record
    const purchase = await Purchase.create({
      courseId,
      userId,
      amount,
      status: 'pending',
      paymentMethod: 'stripe',
    });

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents
      currency: process.env.CURRENCY || 'usd',
      metadata: {
        purchaseId: purchase._id.toString(),
        userId: userId,
        courseId: courseId.toString(),
      },
      description: `So Fluent - Course Purchase`,
    });

    // Update purchase with Stripe payment intent ID
    await Purchase.findByIdAndUpdate(purchase._id, {
      stripePaymentIntentId: paymentIntent.id,
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Confirm payment after Stripe webhook
 */
export const confirmPayment = async (paymentIntentId, purchaseId) => {
  try {
    // Get purchase
    const purchase = await Purchase.findById(purchaseId);
    if (!purchase) {
      return false;
    }

    // Update purchase status
    purchase.status = 'completed';
    purchase.paidAt = new Date();
    await purchase.save();

    // Enroll user in course
    const user = await User.findById(purchase.userId);
    const course = await Course.findById(purchase.courseId);
    
    if (user && course) {
      // Add course to user's enrolled courses
      if (!user.enrolledCourses.includes(course._id)) {
        user.enrolledCourses.push(course._id);
        await user.save();
      }

      // Add user to course's enrolled students
      if (!course.enrolledStudents.includes(user._id)) {
        course.enrolledStudents.push(user._id);
        await course.save();
      }

      // Handle referral conversion reward
      try {
        const referralRewardService = (await import('../services/referralRewardService.js')).default;
        await referralRewardService.handleRefereeConvert(user._id);
      } catch (refError) {
        // Don't fail payment if referral processing fails
      }
    }

    return true;
  } catch (error) {
    return false;
  }
};
