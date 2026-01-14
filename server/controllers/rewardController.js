/**
 * Reward Controller
 * Top 1% Enhancement: Rewards shop
 * Manus-compliant implementation
 */

import dbAdapter from '../configs/database-adapter.js';
import Reward from '../models/Reward.js';
import User from '../models/User.js';
import { spendCoins } from './coinController.js';

/**
 * GET /api/rewards
 * Get all available rewards
 */
export const getRewards = async (req, res) => {
    try {
        const { category, rarity } = req.query;
        
        let filter = { isAvailable: true };
        if (category) filter.category = category;
        if (rarity) filter.rarity = rarity;

        const rewards = await dbAdapter.find(Reward, filter, {
            sort: { rarity: 1, coinCost: 1 }
        });

        res.json({
            success: true,
            rewards
        });
    } catch (error) {
        console.error('Error fetching rewards:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * POST /api/rewards/:id/purchase
 * Purchase a reward
 */
export const purchaseReward = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { id } = req.params;
        
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const reward = await dbAdapter.findOne(Reward, { _id: id });
        if (!reward || !reward.isAvailable) {
            return res.json({ success: false, message: 'Reward not available' });
        }

        if (reward.stock !== null && reward.sold >= reward.stock) {
            return res.json({ success: false, message: 'Out of stock' });
        }

        // Spend coins
        const coinResult = await spendCoins({
            auth: { userId },
            body: {
                amount: reward.coinCost,
                reason: `Purchased ${reward.name}`,
                relatedId: id,
                relatedType: 'reward'
            }
        }, res);

        if (!coinResult.success) {
            return res.json({ success: false, message: coinResult.message || 'Insufficient coins' });
        }

        // Update reward stock
        await dbAdapter.updateOne(Reward, { _id: id }, {
            $inc: { sold: 1 }
        });

        // TODO: Grant reward to user (add to user's rewards collection)

        res.json({
            success: true,
            reward,
            balance: coinResult.balance
        });
    } catch (error) {
        console.error('Error purchasing reward:', error);
        res.json({ success: false, message: error.message });
    }
};

export default {
    getRewards,
    purchaseReward
};
