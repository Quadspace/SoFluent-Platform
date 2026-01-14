/**
 * Earning Service
 * Handles R$ (real money) earning logic for Learn-to-Earn system
 * Manus-compliant service layer
 */

import dbAdapter from '../configs/database-adapter.js';
import User from '../models/User.js';
import Earning from '../models/Earning.js';

class EarningService {
  /**
   * Get earning cap based on user tier
   * @param {string} tier - User tier: 'free', 'academy', 'vip'
   * @returns {number} Monthly earning cap in R$
   */
  getEarningCap(tier) {
    const caps = {
      free: 30,      // R$30/month
      academy: 150,  // R$150/month
      vip: 500       // R$500/month (unlimited)
    };
    return caps[tier] || 30;
  }

  /**
   * Get current month period string (format: "2026-01")
   * @returns {string} Current month period
   */
  getCurrentMonth() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  /**
   * Get user's monthly earnings for a specific period
   * @param {string} userId - User ID
   * @param {string} monthlyPeriod - Month period (e.g., "2026-01")
   * @returns {Promise<number>} Total earnings for the month
   */
  async getMonthlyEarnings(userId, monthlyPeriod) {
    const earnings = await dbAdapter.find(Earning, {
      userId,
      monthlyPeriod,
      status: { $in: ['approved', 'paid'] }
    }, {});

    return earnings.reduce((total, earning) => total + (earning.amount || 0), 0);
  }

  /**
   * Check if user can earn more this month (within cap)
   * @param {string} userId - User ID
   * @param {number} amount - Amount to earn
   * @returns {Promise<{canEarn: boolean, currentEarnings: number, cap: number, remaining: number}>}
   */
  async canEarn(userId, amount) {
    const user = await dbAdapter.findOne(User, { clerkId: userId });
    if (!user) {
      // Try by _id if clerkId doesn't work
      const userById = await dbAdapter.findOne(User, { _id: userId });
      if (!userById) {
        throw new Error('User not found');
      }
      return this.canEarnWithUser(userById, amount);
    }
    return this.canEarnWithUser(user, amount);
  }

  async canEarnWithUser(user, amount) {

    const tier = user.tier || 'free';
    const cap = this.getEarningCap(tier);

    // VIP has unlimited earnings
    if (cap === 500) {
      return {
        canEarn: true,
        currentEarnings: 0,
        cap: Infinity,
        remaining: Infinity
      };
    }

    const currentMonth = this.getCurrentMonth();
    const userId = user._id || user.clerkId;
    const monthlyEarnings = await this.getMonthlyEarnings(userId, currentMonth);
    const remaining = Math.max(0, cap - monthlyEarnings);

    return {
      canEarn: (monthlyEarnings + amount) <= cap,
      currentEarnings: monthlyEarnings,
      cap,
      remaining
    };
  }

  /**
   * Record a new earning
   * @param {string} userId - User ID
   * @param {number} amount - Amount to earn (R$)
   * @param {string} source - Source: 'referral', 'content_creation', 'mission', etc.
   * @param {string} relatedId - ID of related entity
   * @param {string} relatedType - Type of related entity
   * @param {string} description - Human-readable description
   * @param {Object} metadata - Additional metadata
   * @returns {Promise<Object>} Created earning record
   */
  async recordEarning(userId, amount, source, relatedId = null, relatedType = null, description = null, metadata = {}) {
    // Validate amount
    if (amount <= 0) {
      throw new Error('Earning amount must be greater than 0');
    }

    // Get user
    let user = await dbAdapter.findOne(User, { clerkId: userId });
    if (!user) {
      user = await dbAdapter.findOne(User, { _id: userId });
    }
    if (!user) {
      throw new Error('User not found');
    }
    const actualUserId = user._id || user.clerkId;

    // Check if user can earn more
    const canEarnResult = await this.canEarnWithUser(user, amount);
    if (!canEarnResult.canEarn) {
      throw new Error(
        `Monthly earning cap reached. Current: R$${canEarnResult.currentEarnings}, Cap: R$${canEarnResult.cap}, Remaining: R$${canEarnResult.remaining}`
      );
    }

    // Determine if earning needs approval
    // Referrals need admin approval, others are auto-approved
    const needsApproval = source === 'referral';
    const status = needsApproval ? 'pending' : 'approved';

    // Create earning record
    const earning = await dbAdapter.create(Earning, {
      userId: actualUserId,
      amount,
      source,
      relatedId,
      relatedType,
      status,
      tierAtTime: user.tier || 'free',
      monthlyPeriod: this.getCurrentMonth(),
      description: description || this.generateDescription(source, amount, relatedType),
      metadata
    });

    // Update user balance if approved
    if (status === 'approved') {
      await dbAdapter.updateOne(User, { _id: actualUserId }, {
        $inc: {
          realMoneyBalance: amount,
          totalEarned: amount
        }
      });
    }

    return earning;
  }

  /**
   * Approve a pending earning (admin only)
   * @param {string} earningId - Earning ID
   * @param {string} adminId - Admin user ID
   * @returns {Promise<Object>} Updated earning record
   */
  async approveEarning(earningId, adminId) {
    const earning = await dbAdapter.findOne(Earning, { _id: earningId });
    if (!earning) {
      throw new Error('Earning not found');
    }

    if (earning.status !== 'pending') {
      throw new Error(`Earning already processed. Current status: ${earning.status}`);
    }

    // Get user to check cap
    let user = await dbAdapter.findOne(User, { _id: earning.userId });
    if (!user) {
      user = await dbAdapter.findOne(User, { clerkId: earning.userId });
    }
    if (!user) {
      throw new Error('User not found');
    }

    // Check if user can still earn (cap might have changed)
    const canEarnResult = await this.canEarnWithUser(user, earning.amount);
    if (!canEarnResult.canEarn) {
      throw new Error(
        `Cannot approve: User has reached monthly earning cap. Current: R$${canEarnResult.currentEarnings}, Cap: R$${canEarnResult.cap}`
      );
    }

    const actualUserId = user._id || user.clerkId;

    // Update earning status
    await dbAdapter.updateOne(Earning, { _id: earningId }, {
      status: 'approved',
      approvedBy: adminId,
      approvedAt: new Date()
    });

    // Update user balance
    await dbAdapter.updateOne(User, { _id: actualUserId }, {
      $inc: {
        realMoneyBalance: earning.amount,
        totalEarned: earning.amount
      }
    });

    // Reload earning to return updated version
    const updatedEarning = await dbAdapter.findOne(Earning, { _id: earningId });
    return updatedEarning;
  }

  /**
   * Reject a pending earning (admin only)
   * @param {string} earningId - Earning ID
   * @param {string} adminId - Admin user ID
   * @param {string} reason - Rejection reason
   * @returns {Promise<Object>} Updated earning record
   */
  async rejectEarning(earningId, adminId, reason) {
    const earning = await dbAdapter.findOne(Earning, { _id: earningId });
    if (!earning) {
      throw new Error('Earning not found');
    }

    if (earning.status !== 'pending') {
      throw new Error(`Earning already processed. Current status: ${earning.status}`);
    }

    // Update earning status
    await dbAdapter.updateOne(Earning, { _id: earningId }, {
      status: 'rejected',
      rejectedBy: adminId,
      rejectedAt: new Date(),
      rejectionReason: reason
    });

    const updatedEarning = await dbAdapter.findOne(Earning, { _id: earningId });
    return updatedEarning;
  }

  /**
   * Get user's earnings history
   * @param {string} userId - User ID
   * @param {Object} filters - Filters (status, source, monthlyPeriod)
   * @param {Object} pagination - Pagination options
   * @returns {Promise<Object>} Earnings list and pagination info
   */
  async getUserEarnings(userId, filters = {}, pagination = {}) {
    // Get user to find actual ID
    let user = await dbAdapter.findOne(User, { clerkId: userId });
    if (!user) {
      user = await dbAdapter.findOne(User, { _id: userId });
    }
    if (!user) {
      throw new Error('User not found');
    }
    const actualUserId = user._id || user.clerkId;

    const query = { userId: actualUserId, ...filters };
    const limit = pagination.limit || 20;
    const skip = pagination.skip || 0;

    const earnings = await dbAdapter.find(Earning, query, {
      sort: { createdAt: -1 },
      limit,
      skip
    });

    const total = await dbAdapter.count(Earning, query);

    return {
      earnings,
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + limit < total
      }
    };
  }

  /**
   * Get user's earning statistics
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Earning statistics
   */
  async getUserEarningStats(userId) {
    let user = await dbAdapter.findOne(User, { clerkId: userId });
    if (!user) {
      user = await dbAdapter.findOne(User, { _id: userId });
    }
    if (!user) {
      throw new Error('User not found');
    }
    const actualUserId = user._id || user.clerkId;

    const currentMonth = this.getCurrentMonth();
    const monthlyEarnings = await this.getMonthlyEarnings(actualUserId, currentMonth);
    const cap = this.getEarningCap(user.tier || 'free');

    // Get all-time stats
    const allEarnings = await dbAdapter.find(Earning, {
      userId: actualUserId,
      status: { $in: ['approved', 'paid'] }
    }, {});

    const totalEarned = allEarnings.reduce((sum, e) => sum + (e.amount || 0), 0);
    const earningsBySource = allEarnings.reduce((acc, e) => {
      acc[e.source] = (acc[e.source] || 0) + (e.amount || 0);
      return acc;
    }, {});

    return {
      currentBalance: user.realMoneyBalance || 0,
      pendingBalance: user.pendingWithdrawal || 0,
      totalEarned: user.totalEarned || 0,
      totalWithdrawn: user.totalWithdrawn || 0,
      monthlyEarnings,
      monthlyCap: cap,
      monthlyRemaining: Math.max(0, cap - monthlyEarnings),
      earningsBySource,
      tier: user.tier || 'free'
    };
  }

  /**
   * Generate human-readable description for earning
   * @param {string} source - Earning source
   * @param {number} amount - Amount
   * @param {string} relatedType - Related entity type
   * @returns {string} Description
   */
  generateDescription(source, amount, relatedType) {
    const descriptions = {
      referral: `Ganhou R$${amount} por indicar um amigo`,
      content_creation: `Ganhou R$${amount} por criar conteúdo`,
      mission: `Ganhou R$${amount} por completar uma missão`,
      streak: `Ganhou R$${amount} por manter uma sequência`,
      achievement: `Ganhou R$${amount} por desbloquear uma conquista`,
      daily_login: `Ganhou R$${amount} por fazer login diário`,
      challenge: `Ganhou R$${amount} por completar um desafio`
    };

    return descriptions[source] || `Ganhou R$${amount}`;
  }
}

export default new EarningService();
