/**
 * Earning Controller
 * Handles R$ earning API endpoints
 * Learn-to-Earn Real Money System
 */

import dbAdapter from '../configs/database-adapter.js';
import User from '../models/User.js';
import earningService from '../services/earningService.js';

/**
 * POST /api/earnings/record
 * Record a new earning (internal use - called by other services)
 */
export const recordEarning = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { amount, source, relatedId, relatedType, description, metadata } = req.body;

    // Validate input
    if (!amount || !source) {
      return res.status(400).json({
        success: false,
        message: 'Amount and source are required'
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0'
      });
    }

    // Record earning
    const earning = await earningService.recordEarning(
      userId,
      amount,
      source,
      relatedId,
      relatedType,
      description,
      metadata
    );

    res.json({
      success: true,
      earning,
      message: earning.status === 'pending' 
        ? 'Earning recorded and pending approval'
        : 'Earning recorded and approved'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to record earning'
    });
  }
};

/**
 * GET /api/earnings
 * Get user's earnings history
 */
export const getUserEarnings = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { status, source, monthlyPeriod, limit = 20, skip = 0 } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (source) filters.source = source;
    if (monthlyPeriod) filters.monthlyPeriod = monthlyPeriod;

    const result = await earningService.getUserEarnings(userId, filters, {
      limit: parseInt(limit),
      skip: parseInt(skip)
    });

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error fetching earnings:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch earnings'
    });
  }
};

/**
 * GET /api/earnings/stats
 * Get user's earning statistics
 */
export const getEarningStats = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const stats = await earningService.getUserEarningStats(userId);

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error fetching earning stats:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch earning statistics'
    });
  }
};

/**
 * POST /api/earnings/:id/approve
 * Approve a pending earning (admin only)
 */
export const approveEarning = async (req, res) => {
  try {
    const adminId = req.auth?.userId;
    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check if user is admin
    const admin = await dbAdapter.findOne(User, { clerkId: adminId });
    if (!admin || admin.role !== 'master_admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const { id } = req.params;
    const earning = await earningService.approveEarning(id, admin._id);

    res.json({
      success: true,
      earning,
      message: 'Earning approved successfully'
    });
  } catch (error) {
    console.error('Error approving earning:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to approve earning'
    });
  }
};

/**
 * POST /api/earnings/:id/reject
 * Reject a pending earning (admin only)
 */
export const rejectEarning = async (req, res) => {
  try {
    const adminId = req.auth?.userId;
    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check if user is admin
    const admin = await dbAdapter.findOne(User, { clerkId: adminId });
    if (!admin || admin.role !== 'master_admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    const earning = await earningService.rejectEarning(id, admin._id, reason);

    res.json({
      success: true,
      earning,
      message: 'Earning rejected'
    });
  } catch (error) {
    console.error('Error rejecting earning:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to reject earning'
    });
  }
};

/**
 * GET /api/earnings/pending
 * Get all pending earnings (admin only)
 */
export const getPendingEarnings = async (req, res) => {
  try {
    const adminId = req.auth?.userId;
    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check if user is admin
    const admin = await dbAdapter.findOne(User, { clerkId: adminId });
    if (!admin || admin.role !== 'master_admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const { limit = 50, skip = 0 } = req.query;

    const Earning = (await import('../models/Earning.js')).default;
    const earnings = await dbAdapter.find(Earning, {
      status: 'pending'
    }, {
      sort: { createdAt: -1 },
      limit: parseInt(limit),
      skip: parseInt(skip)
    });

    // Populate user info
    const earningsWithUsers = await Promise.all(
      earnings.map(async (earning) => {
        const user = await dbAdapter.findOne(User, { _id: earning.userId });
        return {
          ...earning.toObject(),
          user: user ? {
            name: user.name,
            email: user.email,
            imageUrl: user.imageUrl
          } : null
        };
      })
    );

    const total = await dbAdapter.count(Earning, { status: 'pending' });

    res.json({
      success: true,
      earnings: earningsWithUsers,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: parseInt(skip) + parseInt(limit) < total
      }
    });
  } catch (error) {
    console.error('Error fetching pending earnings:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch pending earnings'
    });
  }
};
