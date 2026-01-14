/**
 * Leaderboard Controller
 * Top 1% Enhancement: Real-time leaderboards
 * Manus-compliant implementation
 */

import dbAdapter from '../configs/database-adapter.js';
import Leaderboard from '../models/Leaderboard.js';
import User from '../models/User.js';

/**
 * GET /api/leaderboard/:type
 * Get leaderboard by type (global, cohort, friends, weekly, monthly)
 */
export const getLeaderboard = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { type } = req.params;
        const { period, cohortId } = req.query;
        
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        // Determine period
        const now = new Date();
        let targetPeriod = period;
        if (!targetPeriod) {
            if (type === 'weekly') {
                const week = Math.ceil(now.getDate() / 7);
                targetPeriod = `${now.getFullYear()}-W${String(week).padStart(2, '0')}`;
            } else if (type === 'monthly') {
                targetPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
            } else {
                targetPeriod = 'all-time';
            }
        }

        // Build query
        let filter = { type, period: targetPeriod };
        if (type === 'cohort' && cohortId) {
            filter.cohortId = cohortId;
        } else if (type === 'friends') {
            // Get user's friends (simplified - would need friend system)
            filter.userId = { $in: [user._id] }; // Placeholder
        }

        // Get leaderboard entries
        const entries = await dbAdapter.find(Leaderboard, filter, {
            sort: { totalXP: -1 },
            limit: 100
        });

        // Populate user info
        const leaderboard = await Promise.all(entries.map(async (entry, index) => {
            const entryUser = await dbAdapter.findOne(User, { _id: entry.userId });
            return {
                rank: index + 1,
                userId: entry.userId,
                name: entryUser?.name || 'Anonymous',
                imageUrl: entryUser?.imageUrl,
                totalXP: entry.totalXP,
                streak: entry.streak,
                completedLessons: entry.completedLessons,
                completedMissions: entry.completedMissions,
                hoursStudied: entry.hoursStudied,
                isCurrentUser: entry.userId === user._id.toString()
            };
        }));

        // Get current user's rank if not in top 100
        const userEntry = leaderboard.find(e => e.isCurrentUser);
        let userRank = userEntry?.rank;
        
        if (!userRank) {
            const userLeaderboard = await dbAdapter.findOne(Leaderboard, {
                userId: user._id,
                type,
                period: targetPeriod
            });
            if (userLeaderboard) {
                const entriesAbove = await dbAdapter.count(Leaderboard, {
                    ...filter,
                    totalXP: { $gt: userLeaderboard.totalXP }
                });
                userRank = entriesAbove + 1;
            }
        }

        res.json({
            success: true,
            leaderboard,
            userRank,
            type,
            period: targetPeriod
        });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * POST /api/leaderboard/update
 * Update user's leaderboard entry (called when user earns XP)
 */
export const updateLeaderboard = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { xp, type, missionCompleted, lessonCompleted, hoursStudied } = req.body;
        
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const now = new Date();
        const periods = {
            global: 'all-time',
            weekly: `${now.getFullYear()}-W${String(Math.ceil(now.getDate() / 7)).padStart(2, '0')}`,
            monthly: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
        };

        // Update all relevant leaderboards
        for (const [boardType, period] of Object.entries(periods)) {
            let entry = await dbAdapter.findOne(Leaderboard, {
                userId: user._id,
                type: boardType,
                period
            });

            if (!entry) {
                entry = await dbAdapter.create(Leaderboard, {
                    userId: user._id,
                    type: boardType,
                    period,
                    totalXP: 0,
                    streak: user.streak || 0,
                    completedLessons: 0,
                    completedMissions: 0,
                    hoursStudied: 0
                });
            }

            // Update metrics
            const updates = {};
            if (xp) updates.totalXP = (entry.totalXP || 0) + xp;
            if (missionCompleted) updates.completedMissions = (entry.completedMissions || 0) + 1;
            if (lessonCompleted) updates.completedLessons = (entry.completedLessons || 0) + 1;
            if (hoursStudied) updates.hoursStudied = (entry.hoursStudied || 0) + hoursStudied;
            updates.streak = user.streak || 0;

            await dbAdapter.updateOne(Leaderboard, { _id: entry._id }, updates);
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error updating leaderboard:', error);
        res.json({ success: false, message: error.message });
    }
};

export default {
    getLeaderboard,
    updateLeaderboard
};
