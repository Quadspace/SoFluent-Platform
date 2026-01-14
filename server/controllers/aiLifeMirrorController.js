/**
 * AI Life Mirror Controller
 * Feature 1: AI Life Mirror™
 * Manus-compliant implementation
 */

import dbAdapter from '../configs/database-adapter.js';
import storageAdapter from '../configs/storage-adapter.js';
import Lesson from '../models/Lesson.js';
import User from '../models/User.js';
import { generateLessonFromInstagram } from '../services/openaiService.js';
import axios from 'axios';

/**
 * POST /api/ai-life-mirror/generate
 * Generate lessons from Instagram content
 */
export const generateLessons = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        
        if (!user || !user.instagramConnect || !user.instagramAccessToken) {
            return res.json({ success: false, message: 'Instagram not connected' });
        }

        // Fetch latest Instagram posts
        const mediaResponse = await axios.get(
            `https://graph.instagram.com/me/media?fields=id,caption,media_url,media_type&access_token=${user.instagramAccessToken}&limit=5`
        );

        const posts = mediaResponse.data.data || [];
        const lessons = [];

        // Generate lesson for each post
        for (const post of posts) {
            if (post.media_type === 'IMAGE' || post.media_type === 'CAROUSEL_ALBUM') {
                try {
                    const lessonContent = await generateLessonFromInstagram(userId, post);
                    
                    const lesson = await dbAdapter.create(Lesson, {
                        userId: user._id.toString(),
                        source: 'instagram',
                        originalContent: {
                            imageUrl: post.media_url,
                            caption: post.caption || '',
                            postId: post.id
                        },
                        englishContent: lessonContent
                    });

                    lessons.push(lesson);
                } catch (error) {
                    console.error('Error generating lesson for post:', error);
                }
            }
        }

        res.json({
            success: true,
            lessons,
            count: lessons.length
        });
    } catch (error) {
        console.error('Error generating lessons:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * GET /api/ai-life-mirror/lessons
 * Get user's personalized lessons
 */
export const getLessons = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const lessons = await dbAdapter.find(Lesson, {
            userId: user._id.toString(),
            source: { $in: ['instagram', 'linkedin'] }
        }, {
            sort: { createdAt: -1 },
            limit: 20
        });

        res.json({
            success: true,
            lessons
        });
    } catch (error) {
        console.error('Error fetching lessons:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * POST /api/ai-life-mirror/lessons/:id/complete
 * Mark lesson as completed
 */
export const completeLesson = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        const { id } = req.params;
        const { progress } = req.body;

        const lesson = await dbAdapter.findOne(Lesson, {
            _id: id,
            userId: user._id.toString()
        });

        if (!lesson) {
            return res.json({ success: false, message: 'Lesson not found' });
        }

        await dbAdapter.updateOne(Lesson, { _id: id }, {
            progress: progress || 100,
            completed: progress >= 100,
            completedAt: progress >= 100 ? new Date() : null
        });

        res.json({
            success: true,
            message: 'Lesson updated'
        });
    } catch (error) {
        console.error('Error completing lesson:', error);
        res.json({ success: false, message: error.message });
    }
};

export default {
    generateLessons,
    getLessons,
    completeLesson
};
