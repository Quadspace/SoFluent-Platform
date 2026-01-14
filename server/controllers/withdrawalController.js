/**
 * Withdrawal Controller
 * Handles withdrawal API endpoints
 * Learn-to-Earn Real Money System
 */

import dbAdapter from '../configs/database-adapter.js';
import User from '../models/User.js';
import withdrawalService from '../services/withdrawalService.js';

/**
 * POST /api/withdrawals
 * Create a withdrawal request
 */
export const createWithdrawal = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { amount, paymentMethod, paymentDetails } = req.body;

    // Validate input
    if (!amount || !paymentMethod || !paymentDetails) {
      return res.status(400).json({
        success: false,
        message: 'Amount, paymentMethod, and paymentDetails are required'
      });
    }

    if (amount < withdrawalService.MIN_WITHDRAWAL) {
      return res.status(400).json({
        success: false,
        message: `Minimum withdrawal is R$${withdrawalService.MIN_WITHDRAWAL}`
      });
    }

    // Create withdrawal
    const withdrawal = await withdrawalService.createWithdrawal(
      userId,
      amount,
      paymentMethod,
      paymentDetails
    );

    res.json({
      success: true,
      withdrawal,
      message: 'Withdrawal request created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create withdrawal request'
    });
  }
};

/**
 * GET /api/withdrawals
 * Get user's withdrawal history
 */
export const getUserWithdrawals = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { status, paymentMethod, limit = 20, skip = 0 } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (paymentMethod) filters.paymentMethod = paymentMethod;

    const result = await withdrawalService.getUserWithdrawals(userId, filters, {
      limit: parseInt(limit),
      skip: parseInt(skip)
    });

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error fetching withdrawals:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch withdrawals'
    });
  }
};

/**
 * GET /api/withdrawals/pending
 * Get all pending withdrawals (admin only)
 */
export const getPendingWithdrawals = async (req, res) => {
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

    const result = await withdrawalService.getPendingWithdrawals({
      limit: parseInt(limit),
      skip: parseInt(skip)
    });

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error fetching pending withdrawals:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch pending withdrawals'
    });
  }
};

/**
 * POST /api/withdrawals/:id/approve
 * Approve a withdrawal request (admin only)
 */
export const approveWithdrawal = async (req, res) => {
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
    const withdrawal = await withdrawalService.approveWithdrawal(id, admin._id);

    res.json({
      success: true,
      withdrawal,
      message: 'Withdrawal approved successfully'
    });
  } catch (error) {
    console.error('Error approving withdrawal:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to approve withdrawal'
    });
  }
};

/**
 * POST /api/withdrawals/:id/reject
 * Reject a withdrawal request (admin only)
 */
export const rejectWithdrawal = async (req, res) => {
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

    const withdrawal = await withdrawalService.rejectWithdrawal(id, admin._id, reason);

    res.json({
      success: true,
      withdrawal,
      message: 'Withdrawal rejected'
    });
  } catch (error) {
    console.error('Error rejecting withdrawal:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to reject withdrawal'
    });
  }
};

/**
 * POST /api/withdrawals/:id/process
 * Process a withdrawal (admin only) - Actually send the payment
 */
export const processWithdrawal = async (req, res) => {
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
    const withdrawal = await withdrawalService.processWithdrawal(id, admin._id);

    res.json({
      success: true,
      withdrawal,
      message: 'Withdrawal processing initiated'
    });
  } catch (error) {
    console.error('Error processing withdrawal:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process withdrawal'
    });
  }
};
