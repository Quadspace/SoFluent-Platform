/**
 * Study Group Controller
 * Top 1% Enhancement: Study groups and communities
 * Manus-compliant implementation
 */

import dbAdapter from '../configs/database-adapter.js';
import StudyGroup from '../models/StudyGroup.js';
import User from '../models/User.js';

/**
 * GET /api/study-groups
 * Get all study groups (public or user's groups)
 */
export const getStudyGroups = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const { search, level } = req.query;
        
        let filter = { isPublic: true };
        if (level && level !== 'all') {
            filter.level = level;
        }
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const groups = await dbAdapter.find(StudyGroup, filter, {
            sort: { 'stats.totalXP': -1 },
            limit: 50
        });

        // Populate creator and member count
        const groupsWithDetails = await Promise.all(groups.map(async (group) => {
            const creator = await dbAdapter.findOne(User, { _id: group.creatorId });
            return {
                ...group.toObject(),
                creator: creator ? {
                    name: creator.name,
                    imageUrl: creator.imageUrl
                } : null,
                memberCount: group.members?.length || 0
            };
        }));

        res.json({
            success: true,
            groups: groupsWithDetails
        });
    } catch (error) {
        console.error('Error fetching study groups:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * POST /api/study-groups
 * Create a new study group
 */
export const createStudyGroup = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { name, description, isPublic, maxMembers, level, tags } = req.body;
        
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const group = await dbAdapter.create(StudyGroup, {
            name,
            description,
            creatorId: user._id,
            members: [user._id],
            isPublic: isPublic !== false,
            maxMembers: maxMembers || 50,
            level: level || 'all',
            tags: tags || [],
            stats: {
                totalXP: 0,
                completedChallenges: 0,
                studySessions: 0
            }
        });

        res.json({
            success: true,
            group
        });
    } catch (error) {
        console.error('Error creating study group:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * POST /api/study-groups/:id/join
 * Join a study group
 */
export const joinStudyGroup = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { id } = req.params;
        
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const group = await dbAdapter.findOne(StudyGroup, { _id: id });
        if (!group) {
            return res.json({ success: false, message: 'Group not found' });
        }

        if (group.members.includes(user._id)) {
            return res.json({ success: false, message: 'Already a member' });
        }

        if (group.members.length >= group.maxMembers) {
            return res.json({ success: false, message: 'Group is full' });
        }

        await dbAdapter.updateOne(StudyGroup, { _id: id }, {
            $push: { members: user._id }
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Error joining study group:', error);
        res.json({ success: false, message: error.message });
    }
};

export default {
    getStudyGroups,
    createStudyGroup,
    joinStudyGroup
};
