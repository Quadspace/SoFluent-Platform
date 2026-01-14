/**
 * Referral Reward Service
 * Handles R$ rewards for referrals
 * Integrates with Learn-to-Earn system
 */

import dbAdapter from '../configs/database-adapter.js';
import Referral from '../models/Referral.js';
import User from '../models/User.js';
import earningService from './earningService.js';

class ReferralRewardService {
  /**
   * Referral reward amounts (R$)
   */
  REWARDS = {
    refereeSignsUp: 10,      // R$10 when referee signs up
    refereeConverts: 50,     // R$50 when referee converts to paid
    refereeCompletes3Months: 100  // R$100 when referee completes 3 months
  };

  /**
   * Generate unique referral code for user
   * @param {string} userId - User ID
   * @returns {Promise<string>} Referral code
   */
  async generateReferralCode(userId) {
    // Use first 4 letters of name + last 4 digits of userId
    const user = await dbAdapter.findOne(User, { _id: userId });
    if (!user) {
      user = await dbAdapter.findOne(User, { clerkId: userId });
    }
    if (!user) {
      throw new Error('User not found');
    }

    const namePart = (user.name || 'USER').substring(0, 4).toUpperCase().replace(/\s/g, '');
    const idPart = userId.substring(userId.length - 4).toUpperCase();
    const code = `${namePart}${idPart}`;

    // Check if code exists, if so add random suffix
    const existing = await dbAdapter.findOne(Referral, { referralCode: code });
    if (existing) {
      return `${code}${Math.random().toString(36).substr(2, 3).toUpperCase()}`;
    }

    return code;
  }

  /**
   * Get or create referral code for user
   * @param {string} userId - User ID
   * @returns {Promise<string>} Referral code
   */
  async getOrCreateReferralCode(userId) {
    let user = await dbAdapter.findOne(User, { _id: userId });
    if (!user) {
      user = await dbAdapter.findOne(User, { clerkId: userId });
    }
    if (!user) {
      throw new Error('User not found');
    }

    // Check if user already has referral code
    if (user.referralCode) {
      return user.referralCode;
    }

    // Generate new code
    const code = await this.generateReferralCode(userId);
    
    // Update user
    await dbAdapter.updateOne(User, { _id: user._id }, {
      referralCode: code
    });

    return code;
  }

  /**
   * Handle referee sign up
   * @param {string} refereeId - Referee user ID
   * @param {string} referralCode - Referral code used
   * @returns {Promise<Object>} Referral record
   */
  async handleRefereeSignUp(refereeId, referralCode) {
    // Find referral record
    const referral = await dbAdapter.findOne(Referral, { referralCode });
    if (!referral) {
      return null; // Invalid referral code
    }

    // Update referral status
    await dbAdapter.updateOne(Referral, { _id: referral._id }, {
      refereeId,
      status: 'signed_up',
      signedUpAt: new Date()
    });

    // Update referee's referredBy
    await dbAdapter.updateOne(User, { _id: refereeId }, {
      referredBy: referral.referrerId
    });

    // Award R$10 to referrer
    try {
      await earningService.recordEarning(
        referral.referrerId,
        this.REWARDS.refereeSignsUp,
        'referral',
        refereeId,
        'user',
        `Ganhou R$${this.REWARDS.refereeSignsUp} porque ${refereeId} se inscreveu usando seu código`
      );
    } catch (error) {
      // Don't fail if earning cap reached
    }

    return referral;
  }

  /**
   * Handle referee conversion to paid
   * @param {string} refereeId - Referee user ID
   * @returns {Promise<Object>} Referral record
   */
  async handleRefereeConvert(refereeId) {
    // Find referral record
    const referral = await dbAdapter.findOne(Referral, { refereeId });
    if (!referral || referral.status === 'rewarded') {
      return null;
    }

    // Update referral status
    await dbAdapter.updateOne(Referral, { _id: referral._id }, {
      status: 'converted',
      convertedAt: new Date()
    });

    // Award R$50 to referrer
    try {
      await earningService.recordEarning(
        referral.referrerId,
        this.REWARDS.refereeConverts,
        'referral',
        refereeId,
        'user',
        `Ganhou R$${this.REWARDS.refereeConverts} porque ${refereeId} se tornou cliente`
      );
    } catch (error) {
      // Error recording referral conversion earning - non-critical
    }

    return referral;
  }

  /**
   * Handle referee completing 3 months
   * @param {string} refereeId - Referee user ID
   * @returns {Promise<Object>} Referral record
   */
  async handleRefereeCompletes3Months(refereeId) {
    // Find referral record
    const referral = await dbAdapter.findOne(Referral, { refereeId });
    if (!referral || referral.status === 'rewarded') {
      return null;
    }

    // Update referral status
    await dbAdapter.updateOne(Referral, { _id: referral._id }, {
      status: 'completed_3_months',
      completed3MonthsAt: new Date()
    });

    // Award R$100 to referrer
    try {
      await earningService.recordEarning(
        referral.referrerId,
        this.REWARDS.refereeCompletes3Months,
        'referral',
        refereeId,
        'user',
        `Ganhou R$${this.REWARDS.refereeCompletes3Months} porque ${refereeId} completou 3 meses`
      );

      // Mark as rewarded
      await dbAdapter.updateOne(Referral, { _id: referral._id }, {
        status: 'rewarded',
        rewardedAt: new Date()
      });
    } catch (error) {
      // Error recording referral 3-month earning - non-critical
    }

    return referral;
  }

  /**
   * Get user's referral stats
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Referral statistics
   */
  async getReferralStats(userId) {
    let user = await dbAdapter.findOne(User, { _id: userId });
    if (!user) {
      user = await dbAdapter.findOne(User, { clerkId: userId });
    }
    if (!user) {
      throw new Error('User not found');
    }

    const referralCode = await this.getOrCreateReferralCode(userId);

    const referrals = await dbAdapter.find(Referral, { referrerId: user._id }, {});

    const stats = {
      referralCode,
      totalReferrals: referrals.length,
      signedUp: referrals.filter(r => r.status === 'signed_up' || r.status === 'converted' || r.status === 'completed_3_months' || r.status === 'rewarded').length,
      converted: referrals.filter(r => r.status === 'converted' || r.status === 'completed_3_months' || r.status === 'rewarded').length,
      completed3Months: referrals.filter(r => r.status === 'completed_3_months' || r.status === 'rewarded').length,
      totalEarned: referrals.reduce((sum, r) => {
        let earned = 0;
        if (r.status === 'signed_up' || r.status === 'converted' || r.status === 'completed_3_months' || r.status === 'rewarded') {
          earned += this.REWARDS.refereeSignsUp;
        }
        if (r.status === 'converted' || r.status === 'completed_3_months' || r.status === 'rewarded') {
          earned += this.REWARDS.refereeConverts;
        }
        if (r.status === 'completed_3_months' || r.status === 'rewarded') {
          earned += this.REWARDS.refereeCompletes3Months;
        }
        return sum + earned;
      }, 0)
    };

    return stats;
  }
}

export default new ReferralRewardService();
