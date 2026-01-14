/**
 * Mission Controller
 * Feature 4: Real-World Mission System™
 * Manus-compliant implementation
 */

import dbAdapter from '../configs/database-adapter.js';
import storageAdapter from '../configs/storage-adapter.js';
import Mission from '../models/Mission.js';
import User from '../models/User.js';

/**
 * GET /api/missions
 * Get available missions
 */
export const getMissions = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const now = new Date();
        const missions = await dbAdapter.find(Mission, {
            isActive: true,
            startDate: { $lte: now },
            endDate: { $gte: now }
        }, {
            sort: { createdAt: -1 }
        });

        // Check which missions user has completed
        const missionsWithStatus = missions.map(mission => {
            const userSubmission = mission.submissions?.find(
                s => s.user === user._id.toString() && s.status === 'approved'
            );
            return {
                ...mission.toObject(),
                completed: !!userSubmission,
                userSubmission: userSubmission || null
            };
        });

        res.json({
            success: true,
            missions: missionsWithStatus
        });
    } catch (error) {
        console.error('Error fetching missions:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * GET /api/missions/:id
 * Get mission details
 */
export const getMission = async (req, res) => {
    try {
        const { id } = req.params;
        const mission = await dbAdapter.findOne(Mission, { _id: id });
        
        if (!mission) {
            return res.json({ success: false, message: 'Mission not found' });
        }

        res.json({
            success: true,
            mission
        });
    } catch (error) {
        console.error('Error fetching mission:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * POST /api/missions/:id/submit
 * Submit proof for a mission
 */
export const submitMission = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        const { id } = req.params;
        const { text } = req.body;

        const mission = await dbAdapter.findOne(Mission, { _id: id });
        if (!mission) {
            return res.json({ success: false, message: 'Mission not found' });
        }

        // Check if already submitted
        const existingSubmission = mission.submissions?.find(
            s => s.user === user._id.toString()
        );
        if (existingSubmission) {
            return res.json({ success: false, message: 'Already submitted' });
        }

        // Upload proof file if provided
        let proofUrl = null;
        if (req.file) {
            const result = await storageAdapter.upload(req.file, 'missions', {
                resource_type: 'auto'
            });
            proofUrl = result.url;
        }

        // Add submission
        const submissions = mission.submissions || [];
        submissions.push({
            user: user._id.toString(),
            proof: proofUrl || text || '',
            text: text || '',
            status: 'pending',
            submittedAt: new Date()
        });

        await dbAdapter.updateOne(Mission, { _id: id }, {
            submissions,
            totalSubmissions: (mission.totalSubmissions || 0) + 1
        });

        // Create activity for real-time feed
        const { createActivity } = await import('../middlewares/activityMiddleware.js');
        createActivity('mission_completed', {
            userId: user._id,
            userName: user.name,
            missionId: mission._id,
            missionName: mission.title
        });

        res.json({
            success: true,
            message: 'Mission submitted successfully'
        });
    } catch (error) {
        console.error('Error submitting mission:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * POST /api/missions (admin)
 * Create a new mission
 */
export const createMission = async (req, res) => {
    try {
        const {
            title,
            description,
            type,
            instructions,
            xpReward,
            startDate,
            endDate,
            isDaily,
            level
        } = req.body;

        const mission = await dbAdapter.create(Mission, {
            title,
            description,
            type,
            instructions,
            xpReward: xpReward || 50,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            isDaily: isDaily || false,
            level: level || 'intermediate'
        });

        res.json({
            success: true,
            mission
        });
    } catch (error) {
        console.error('Error creating mission:', error);
        res.json({ success: false, message: error.message });
    }
};

export default {
    getMissions,
    getMission,
    submitMission,
    createMission
};
