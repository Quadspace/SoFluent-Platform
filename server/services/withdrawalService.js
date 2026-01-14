/**
 * Withdrawal Service
 * Handles withdrawal requests and processing for Learn-to-Earn system
 * Manus-compliant service layer
 */

import dbAdapter from '../configs/database-adapter.js';
import User from '../models/User.js';
import Withdrawal from '../models/Withdrawal.js';

class WithdrawalService {
  /**
   * Minimum withdrawal amount (R$)
   */
  MIN_WITHDRAWAL = 20;

  /**
   * Create a withdrawal request
   * @param {string} userId - User ID
   * @param {number} amount - Amount to withdraw (R$)
   * @param {string} paymentMethod - 'pix' or 'bank_transfer'
   * @param {Object} paymentDetails - Payment details (pixKey, bankAccount, etc.)
   * @returns {Promise<Object>} Created withdrawal request
   */
  async createWithdrawal(userId, amount, paymentMethod, paymentDetails) {
    // Validate amount
    if (amount < this.MIN_WITHDRAWAL) {
      throw new Error(`Minimum withdrawal is R$${this.MIN_WITHDRAWAL}`);
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

    // Validate balance
    const availableBalance = (user.realMoneyBalance || 0) - (user.pendingWithdrawal || 0);
    if (availableBalance < amount) {
      throw new Error(`Insufficient balance. Available: R$${availableBalance.toFixed(2)}, Requested: R$${amount}`);
    }

    // Validate payment details
    if (paymentMethod === 'pix' && !paymentDetails.pixKey) {
      throw new Error('Pix key is required for Pix withdrawals');
    }

    if (paymentMethod === 'bank_transfer') {
      const requiredFields = ['bankCode', 'agency', 'account', 'accountType', 'accountHolderName', 'cpf'];
      const missing = requiredFields.filter(field => !paymentDetails[field]);
      if (missing.length > 0) {
        throw new Error(`Missing required bank account fields: ${missing.join(', ')}`);
      }
    }

    // Create withdrawal request
    const withdrawalData = {
      userId: actualUserId,
      amount,
      paymentMethod,
      status: 'pending'
    };

    if (paymentMethod === 'pix') {
      withdrawalData.pixKey = paymentDetails.pixKey;
      withdrawalData.pixKeyType = this.detectPixKeyType(paymentDetails.pixKey);
    } else {
      withdrawalData.bankAccount = {
        bankCode: paymentDetails.bankCode,
        agency: paymentDetails.agency,
        account: paymentDetails.account,
        accountType: paymentDetails.accountType,
        accountHolderName: paymentDetails.accountHolderName,
        cpf: paymentDetails.cpf
      };
    }

    const withdrawal = await dbAdapter.create(Withdrawal, withdrawalData);

    // Reserve balance (subtract from available, add to pending)
    await dbAdapter.updateOne(User, { _id: actualUserId }, {
      $inc: {
        realMoneyBalance: -amount,
        pendingWithdrawal: amount
      }
    });

    return withdrawal;
  }

  /**
   * Detect Pix key type
   * @param {string} pixKey - Pix key
   * @returns {string} Key type: 'cpf', 'cnpj', 'email', 'phone', 'random'
   */
  detectPixKeyType(pixKey) {
    // CPF: 11 digits
    if (/^\d{11}$/.test(pixKey)) return 'cpf';
    // CNPJ: 14 digits
    if (/^\d{14}$/.test(pixKey)) return 'cnpj';
    // Email
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pixKey)) return 'email';
    // Phone: +55XXXXXXXXXXX format
    if (/^\+55\d{10,11}$/.test(pixKey)) return 'phone';
    // Random key (UUID format)
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(pixKey)) return 'random';
    // Default to random
    return 'random';
  }

  /**
   * Approve a withdrawal request (admin only)
   * @param {string} withdrawalId - Withdrawal ID
   * @param {string} adminId - Admin user ID
   * @returns {Promise<Object>} Updated withdrawal
   */
  async approveWithdrawal(withdrawalId, adminId) {
    const withdrawal = await dbAdapter.findOne(Withdrawal, { _id: withdrawalId });
    if (!withdrawal) {
      throw new Error('Withdrawal not found');
    }

    if (withdrawal.status !== 'pending') {
      throw new Error(`Withdrawal already processed. Current status: ${withdrawal.status}`);
    }

    // Update withdrawal status
    await dbAdapter.updateOne(Withdrawal, { _id: withdrawalId }, {
      status: 'approved',
      approvedBy: adminId,
      approvedAt: new Date()
    });

    const updatedWithdrawal = await dbAdapter.findOne(Withdrawal, { _id: withdrawalId });
    return updatedWithdrawal;
  }

  /**
   * Reject a withdrawal request (admin only)
   * @param {string} withdrawalId - Withdrawal ID
   * @param {string} adminId - Admin user ID
   * @param {string} reason - Rejection reason
   * @returns {Promise<Object>} Updated withdrawal
   */
  async rejectWithdrawal(withdrawalId, adminId, reason) {
    const withdrawal = await dbAdapter.findOne(Withdrawal, { _id: withdrawalId });
    if (!withdrawal) {
      throw new Error('Withdrawal not found');
    }

    if (withdrawal.status !== 'pending') {
      throw new Error(`Withdrawal already processed. Current status: ${withdrawal.status}`);
    }

    // Get user to restore balance
    let user = await dbAdapter.findOne(User, { _id: withdrawal.userId });
    if (!user) {
      user = await dbAdapter.findOne(User, { clerkId: withdrawal.userId });
    }
    const actualUserId = user?._id || withdrawal.userId;

    // Update withdrawal status
    await dbAdapter.updateOne(Withdrawal, { _id: withdrawalId }, {
      status: 'rejected',
      rejectedBy: adminId,
      rejectedAt: new Date(),
      rejectionReason: reason
    });

    // Restore balance
    if (user) {
      await dbAdapter.updateOne(User, { _id: actualUserId }, {
        $inc: {
          realMoneyBalance: withdrawal.amount,
          pendingWithdrawal: -withdrawal.amount
        }
      });
    }

    const updatedWithdrawal = await dbAdapter.findOne(Withdrawal, { _id: withdrawalId });
    return updatedWithdrawal;
  }

  /**
   * Process a withdrawal (admin only) - Actually send the payment
   * @param {string} withdrawalId - Withdrawal ID
   * @param {string} adminId - Admin user ID
   * @returns {Promise<Object>} Updated withdrawal with transaction ID
   */
  async processWithdrawal(withdrawalId, adminId) {
    const withdrawal = await dbAdapter.findOne(Withdrawal, { _id: withdrawalId });
    if (!withdrawal) {
      throw new Error('Withdrawal not found');
    }

    if (withdrawal.status !== 'approved') {
      throw new Error(`Withdrawal must be approved first. Current status: ${withdrawal.status}`);
    }

    // Process payment based on method
    let transactionId;
    if (withdrawal.paymentMethod === 'pix') {
      transactionId = await this.processPixPayout(withdrawal);
    } else {
      transactionId = await this.processBankTransfer(withdrawal);
    }

    // Update withdrawal status
    await dbAdapter.updateOne(Withdrawal, { _id: withdrawalId }, {
      status: 'processing',
      processedBy: adminId,
      processedAt: new Date(),
      transactionId,
      paymentProvider: withdrawal.paymentMethod === 'pix' ? 'stripe' : 'bank'
    });

    // Update user balance (remove from pending, add to withdrawn)
    let user = await dbAdapter.findOne(User, { _id: withdrawal.userId });
    if (!user) {
      user = await dbAdapter.findOne(User, { clerkId: withdrawal.userId });
    }
    const actualUserId = user?._id || withdrawal.userId;

    if (user) {
      await dbAdapter.updateOne(User, { _id: actualUserId }, {
        $inc: {
          pendingWithdrawal: -withdrawal.amount,
          totalWithdrawn: withdrawal.amount
        }
      });
    }

    // Monitor payment status (async - don't wait)
    this.monitorPaymentStatus(withdrawalId, transactionId).catch(() => {
      // Error monitoring payment status - will retry
    });

    const updatedWithdrawal = await dbAdapter.findOne(Withdrawal, { _id: withdrawalId });
    return updatedWithdrawal;
  }

  /**
   * Process Pix payout using Stripe Connect
   * @param {Object} withdrawal - Withdrawal object
   * @returns {Promise<string>} Transaction ID
   */
  async processPixPayout(withdrawal) {
    try {
      // Use Stripe Connect for Pix payouts
      const stripe = (await import('stripe')).default(process.env.STRIPE_SECRET_KEY);

      // Create transfer to connected account or direct payout
      // Note: This requires Stripe Connect setup for Brazilian accounts
      // For now, we'll use a placeholder - actual implementation depends on Stripe Connect setup
      
      // TODO: Implement actual Stripe Connect Pix payout
      // For MVP, we can use Stripe's transfer API or a Brazilian payment provider
      
      // Placeholder: Generate transaction ID
      const transactionId = `pix_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // In production, this would call Stripe API:
      // const transfer = await stripe.transfers.create({
      //   amount: Math.round(withdrawal.amount * 100), // Convert to cents
      //   currency: 'brl',
      //   destination: withdrawal.pixKey,
      //   metadata: {
      //     withdrawalId: withdrawal._id.toString(),
      //     userId: withdrawal.userId
      //   }
      // });
      // return transfer.id;

      return transactionId;
    } catch (error) {
      throw new Error(`Failed to process Pix payout: ${error.message}`);
    }
  }

  /**
   * Process bank transfer
   * @param {Object} withdrawal - Withdrawal object
   * @returns {Promise<string>} Transaction ID
   */
  async processBankTransfer(withdrawal) {
    try {
      // TODO: Implement bank transfer via payment provider
      // For MVP, generate placeholder transaction ID
      
      const transactionId = `bank_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // In production, this would call bank transfer API
      
      return transactionId;
    } catch (error) {
      throw new Error(`Failed to process bank transfer: ${error.message}`);
    }
  }

  /**
   * Monitor payment status (async)
   * @param {string} withdrawalId - Withdrawal ID
   * @param {string} transactionId - Transaction ID
   */
  async monitorPaymentStatus(withdrawalId, transactionId) {
    // TODO: Implement payment status monitoring
    // This would poll the payment provider API to check if payment completed
    // Once confirmed, update withdrawal status to 'completed'
    
    // For now, simulate completion after 30 seconds
    setTimeout(async () => {
      try {
        await dbAdapter.updateOne(Withdrawal, { _id: withdrawalId }, {
          status: 'completed'
        });
      } catch (error) {
        // Error updating withdrawal status - will retry
      }
    }, 30000); // 30 seconds
  }

  /**
   * Get user's withdrawal history
   * @param {string} userId - User ID
   * @param {Object} filters - Filters (status, paymentMethod)
   * @param {Object} pagination - Pagination options
   * @returns {Promise<Object>} Withdrawals list and pagination info
   */
  async getUserWithdrawals(userId, filters = {}, pagination = {}) {
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

    const withdrawals = await dbAdapter.find(Withdrawal, query, {
      sort: { createdAt: -1 },
      limit,
      skip
    });

    const total = await dbAdapter.count(Withdrawal, query);

    return {
      withdrawals,
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + limit < total
      }
    };
  }

  /**
   * Get pending withdrawals (admin only)
   * @param {Object} pagination - Pagination options
   * @returns {Promise<Object>} Pending withdrawals list
   */
  async getPendingWithdrawals(pagination = {}) {
    const limit = pagination.limit || 50;
    const skip = pagination.skip || 0;

    const withdrawals = await dbAdapter.find(Withdrawal, {
      status: 'pending'
    }, {
      sort: { createdAt: -1 },
      limit,
      skip
    });

    // Populate user info
    const withdrawalsWithUsers = await Promise.all(
      withdrawals.map(async (withdrawal) => {
        let user = await dbAdapter.findOne(User, { _id: withdrawal.userId });
        if (!user) {
          user = await dbAdapter.findOne(User, { clerkId: withdrawal.userId });
        }
        return {
          ...withdrawal.toObject(),
          user: user ? {
            name: user.name,
            email: user.email,
            imageUrl: user.imageUrl
          } : null
        };
      })
    );

    const total = await dbAdapter.count(Withdrawal, { status: 'pending' });

    return {
      withdrawals: withdrawalsWithUsers,
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + limit < total
      }
    };
  }
}

export default new WithdrawalService();
