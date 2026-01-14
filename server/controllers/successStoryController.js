/**
 * Success Story Controller
 * Feature 9: Success Story Generator™
 * Manus-compliant implementation
 */

import dbAdapter from '../configs/database-adapter.js';
import storageAdapter from '../configs/storage-adapter.js';
import SuccessStory from '../models/SuccessStory.js';
import User from '../models/User.js';
import CourseProgress from '../models/CourseProgress.js';
import { Purchase } from '../models/Purchase.js';

/**
 * POST /api/success-story/generate
 * Generate success story video
 */
export const generateSuccessStory = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        const { template, music } = req.body;
        
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        // Calculate stats
        const purchases = await dbAdapter.find(Purchase, { userId: user._id });
        const coursesCompleted = purchases.length;
        
        const now = new Date();
        const daysActive = user.createdAt 
            ? Math.floor((now - new Date(user.createdAt)) / (1000 * 60 * 60 * 24))
            : 0;

        const stats = {
            daysActive,
            hoursStudied: user.weeklyHours * 4 || 0, // Estimate
            coursesCompleted,
            vocabularyLearned: 0, // Would need Vocabulary model count
            streak: user.streak || 0,
            levelProgress: 50 // Would calculate from level
        };

        // Generate video (mock for now - would use Remotion/FFmpeg)
        const videoUrl = await generateVideo(stats, template, music);
        const thumbnailUrl = videoUrl.replace('.mp4', '.jpg'); // Mock

        // Create success story
        const successStory = await dbAdapter.create(SuccessStory, {
            userId: user._id.toString(),
            stats,
            videoUrl,
            thumbnailUrl,
            template: template || 'journey',
            music: music || 'default',
            shareText: generateShareText(stats)
        });

        res.json({
            success: true,
            successStory
        });
    } catch (error) {
        console.error('Error generating success story:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * GET /api/success-story
 * Get user's success stories
 */
export const getSuccessStories = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const stories = await dbAdapter.find(SuccessStory, {
            userId: user._id.toString()
        }, {
            sort: { createdAt: -1 }
        });

        res.json({
            success: true,
            stories
        });
    } catch (error) {
        console.error('Error fetching success stories:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * POST /api/success-story/:id/share
 * Share success story
 */
export const shareSuccessStory = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { id } = req.params;
        const { platforms } = req.body; // ['instagram', 'linkedin', 'twitter']

        const story = await dbAdapter.findOne(SuccessStory, {
            _id: id,
            userId: userId
        });

        if (!story) {
            return res.json({ success: false, message: 'Story not found' });
        }

        await dbAdapter.updateOne(SuccessStory, { _id: id }, {
            shared: true,
            shareCount: (story.shareCount || 0) + 1,
            platforms: platforms || []
        });

        res.json({
            success: true,
            message: 'Story shared successfully'
        });
    } catch (error) {
        console.error('Error sharing story:', error);
        res.json({ success: false, message: error.message });
    }
};

// Helper functions
async function generateVideo(stats, template, music) {
    // Mock video generation - would use Remotion or FFmpeg
    return `https://storage.example.com/success-stories/${Date.now()}.mp4`;
}

function generateShareText(stats) {
    return `🎉 ${stats.daysActive} days of English learning! ${stats.coursesCompleted} courses completed, ${stats.streak}-day streak! Join me on So Fluent! #SoFluent #EnglishLearning`;
}

export default {
    generateSuccessStory,
    getSuccessStories,
    shareSuccessStory
};
