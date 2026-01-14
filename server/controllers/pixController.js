/**
 * Pix Payment Controller
 * Handles Pix payment creation, status checks, and webhooks
 */

// Use Stripe Pix instead of separate provider
import stripePixService from '../services/stripePixService.js';
import Purchase from '../models/Purchase.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import dbAdapter from '../configs/database-adapter.js';
import emailService from '../services/emailService.js';

/**
 * Create a Pix payment
 * POST /api/payments/pix/create
 */
export const createPixPayment = async (req, res) => {
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

    // Get user and course
    const user = await dbAdapter.users.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const course = await dbAdapter.courses.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Create purchase record
    const purchase = await Purchase.create({
      courseId,
      userId,
      amount,
      status: 'pending',
      paymentMethod: 'pix',
    });

    // Create Pix payment using Stripe
    const pixPayment = await stripePixService.createPayment({
      amount: amount, // Amount in cents
      description: `So Fluent - ${course.courseTitle || 'Course'}`,
      metadata: {
        purchaseId: purchase._id.toString(),
        userId: user._id,
        courseId: courseId
      }
    });

    // Update purchase with Stripe PaymentIntent ID
    await Purchase.findByIdAndUpdate(purchase._id, {
      pixPaymentId: pixPayment.id, // Stripe PaymentIntent ID
      stripePaymentIntentId: pixPayment.id, // Also store as Stripe ID
      pixQrCode: pixPayment.qrCode,
      pixCopyPaste: pixPayment.copyPaste,
      pixQrCodeBase64: pixPayment.qrCodeBase64,
    });

    res.json({
      success: true,
      payment: {
        id: pixPayment.id,
        purchaseId: purchase._id,
        amount: pixPayment.amount,
        qrCode: pixPayment.qrCode,
        qrCodeBase64: pixPayment.qrCodeBase64,
        copyPaste: pixPayment.copyPaste,
        status: pixPayment.status,
        expiresAt: pixPayment.expiresAt,
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create Pix payment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Check Pix payment status
 * GET /api/payments/pix/status/:paymentId
 */
export const checkPixStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Get payment status from provider
    const paymentStatus = await stripePixService.getPaymentStatus(paymentId);

    // Find purchase by Pix payment ID
    const purchase = await Purchase.findOne({ pixPaymentId: paymentId });

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: 'Purchase not found'
      });
    }

    // Update purchase status if payment is completed
    if (paymentStatus.status === 'completed' && purchase.status !== 'completed') {
      purchase.status = 'completed';
      purchase.paidAt = paymentStatus.paidDate || new Date();
      await purchase.save();

      // Enroll user in course
      const user = await User.findById(purchase.userId);
      const course = await Course.findById(purchase.courseId);
      
      if (user && course) {
        if (!user.enrolledCourses.includes(course._id)) {
          user.enrolledCourses.push(course._id);
          await user.save();
        }
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

        // Send emails
        try {
          await emailService.sendPaymentConfirmationEmail(user, {
            amount: purchase.amount || course.price || 0,
            currency: purchase.currency || 'BRL',
            paymentMethod: 'pix',
            paymentId: paymentId || purchase.pixPaymentId,
          });
          await emailService.sendCourseEnrollmentEmail(user, course);
        } catch (emailError) {
          // Failed to send emails - non-critical, continue
        }
      }
    }

    res.json({
      success: true,
      status: paymentStatus.status,
      purchase: {
        id: purchase._id,
        status: purchase.status,
        amount: purchase.amount,
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to check payment status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Pix webhook handler
 * POST /api/payments/pix/webhook
 */
export const pixWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-signature'] || req.headers['x-asaas-signature'];
    const payload = req.body;

    // Verify webhook signature (Stripe)
    const event = stripePixService.verifyWebhookSignature(payload, signature);
    if (!event) {
      return res.status(401).json({
        success: false,
        message: 'Invalid webhook signature'
      });
    }

    // Handle Stripe webhook event
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const paymentId = paymentIntent.id;
      const externalReference = paymentIntent.metadata?.purchaseId;

      if (!paymentId || !externalReference) {
        return res.status(400).json({
          success: false,
          message: 'Missing payment information'
        });
      }

      // Find purchase by ID from metadata
      const purchase = await Purchase.findById(externalReference || paymentIntent.metadata?.purchaseId);

      if (!purchase) {
        return res.status(404).json({
          success: false,
          message: 'Purchase not found'
        });
      }

      // Update purchase status
      purchase.status = 'completed';
      purchase.paidAt = paymentIntent.charges?.data[0]?.created 
        ? new Date(paymentIntent.charges.data[0].created * 1000)
        : new Date();
      await purchase.save();

      // Enroll user in course
      const user = await User.findById(purchase.userId);
      const course = await Course.findById(purchase.courseId);
      
      if (user && course) {
        if (!user.enrolledCourses.includes(course._id)) {
          user.enrolledCourses.push(course._id);
          await user.save();
        }
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

        // Send emails
        try {
          await emailService.sendPaymentConfirmationEmail(user, {
            amount: purchase.amount || course.price || 0,
            currency: purchase.currency || 'BRL',
            paymentMethod: 'pix',
            paymentId: paymentId || purchase.pixPaymentId,
          });
          await emailService.sendCourseEnrollmentEmail(user, course);
        } catch (emailError) {
          // Failed to send emails - non-critical, continue
        }
      }
    }

    res.json({ success: true, received: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed'
    });
  }
};
