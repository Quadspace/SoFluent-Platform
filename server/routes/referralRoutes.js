/**
 * Referral Routes
 * Learn-to-Earn Real Money System - Referral API endpoints
 */

import express from 'express';
import { clerkMiddleware } from '@clerk/express';
import referralRewardService from '../services/referralRewardService.js';
import dbAdapter from '../configs/database-adapter.js';
import User from '../models/User.js';

const router = express.Router();

/**
 * @swagger
 * /api/referrals/code:
 *   get:
 *     summary: Get user's referral code
 *     tags: [Referrals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Referral code
 */
router.get('/code', clerkMiddleware(), async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const code = await referralRewardService.getOrCreateReferralCode(userId);
    
    res.json({
      success: true,
      referralCode: code
    });
  } catch (error) {
    console.error('Error getting referral code:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get referral code'
    });
  }
});

/**
 * @swagger
 * /api/referrals/stats:
 *   get:
 *     summary: Get user's referral statistics
 *     tags: [Referrals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Referral statistics
 */
router.get('/stats', clerkMiddleware(), async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const stats = await referralRewardService.getReferralStats(userId);
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error getting referral stats:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get referral statistics'
    });
  }
});

export default router;
