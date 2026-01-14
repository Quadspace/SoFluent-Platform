/**
 * Coin Controller
 * Top 1% Enhancement: Virtual currency system
 * Manus-compliant implementation
 */

import dbAdapter from '../configs/database-adapter.js';
import CoinTransaction from '../models/Coin.js';
import User from '../models/User.js';

/**
 * GET /api/coins/balance
 * Get user's coin balance
 */
export const getBalance = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        // Get latest transaction to get current balance
        const latestTransaction = await dbAdapter.find(CoinTransaction, 
            { userId: user._id },
            { sort: { createdAt: -1 }, limit: 1 }
        );

        const balance = latestTransaction[0]?.balance || 0;

        res.json({
            success: true,
            balance
        });
    } catch (error) {
        console.error('Error fetching coin balance:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * POST /api/coins/earn
 * Earn coins (called when user completes activities)
 */
export const earnCoins = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { amount, reason, source, relatedId, relatedType } = req.body;
        
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        // Get current balance
        const latestTransaction = await dbAdapter.find(CoinTransaction,
            { userId: user._id },
            { sort: { createdAt: -1 }, limit: 1 }
        );
        const currentBalance = latestTransaction[0]?.balance || 0;
        const newBalance = currentBalance + amount;

        // Create transaction
        const transaction = await dbAdapter.create(CoinTransaction, {
            userId: user._id,
            type: 'earned',
            amount,
            reason,
            source,
            relatedId,
            relatedType,
            balance: newBalance
        });

        res.json({
            success: true,
            balance: newBalance,
            transaction
        });
    } catch (error) {
        console.error('Error earning coins:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * POST /api/coins/spend
 * Spend coins (called when user purchases rewards)
 */
export const spendCoins = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { amount, reason, relatedId, relatedType } = req.body;
        
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        // Get current balance
        const latestTransaction = await dbAdapter.find(CoinTransaction,
            { userId: user._id },
            { sort: { createdAt: -1 }, limit: 1 }
        );
        const currentBalance = latestTransaction[0]?.balance || 0;

        if (currentBalance < amount) {
            return res.json({ success: false, message: 'Insufficient coins' });
        }

        const newBalance = currentBalance - amount;

        // Create transaction
        const transaction = await dbAdapter.create(CoinTransaction, {
            userId: user._id,
            type: 'spent',
            amount: -amount,
            reason,
            source: 'purchase',
            relatedId,
            relatedType,
            balance: newBalance
        });

        res.json({
            success: true,
            balance: newBalance,
            transaction
        });
    } catch (error) {
        console.error('Error spending coins:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * GET /api/coins/history
 * Get coin transaction history
 */
export const getHistory = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const transactions = await dbAdapter.find(CoinTransaction,
            { userId: user._id },
            { sort: { createdAt: -1 }, limit: 50 }
        );

        res.json({
            success: true,
            transactions
        });
    } catch (error) {
        console.error('Error fetching coin history:', error);
        res.json({ success: false, message: error.message });
    }
};

export default {
    getBalance,
    earnCoins,
    spendCoins,
    getHistory
};
