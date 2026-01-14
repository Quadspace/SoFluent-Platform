/**
 * Career English Accelerator Controller
 * Feature 6: Career English Accelerator™
 * LinkedIn integration for career-focused learning
 * Manus-compliant implementation
 */

import dbAdapter from '../configs/database-adapter.js';
import User from '../models/User.js';
import Lesson from '../models/Lesson.js';
import axios from 'axios';
import { generateLessonFromInstagram } from '../services/openaiService.js'; // Reuse for LinkedIn

/**
 * POST /api/career/connect-linkedin
 * Connect LinkedIn account
 */
export const connectLinkedIn = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        const { code } = req.body;
        
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        // Exchange code for access token (LinkedIn OAuth)
        const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
        const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
        const LINKEDIN_REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI;

        if (!LINKEDIN_CLIENT_ID || !LINKEDIN_CLIENT_SECRET) {
            // Preview mode
            await dbAdapter.updateOne(User, { _id: user._id }, {
                linkedInConnected: true,
                linkedInAccessToken: 'preview-token',
                linkedInConnectedAt: new Date()
            });

            return res.json({
                success: true,
                message: 'LinkedIn connected (preview mode)'
            });
        }

        const tokenResponse = await axios.post(
            'https://www.linkedin.com/oauth/v2/accessToken',
            new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: LINKEDIN_REDIRECT_URI,
                client_id: LINKEDIN_CLIENT_ID,
                client_secret: LINKEDIN_CLIENT_SECRET
            })
        );

        const accessToken = tokenResponse.data.access_token;

        // Get LinkedIn profile
        const profileResponse = await axios.get(
            'https://api.linkedin.com/v2/me',
            {
                headers: { Authorization: `Bearer ${accessToken}` }
            }
        );

        await dbAdapter.updateOne(User, { _id: user._id }, {
            linkedInConnected: true,
            linkedInAccessToken: accessToken,
            linkedInProfile: profileResponse.data,
            linkedInConnectedAt: new Date()
        });

        res.json({
            success: true,
            message: 'LinkedIn connected successfully'
        });
    } catch (error) {
        console.error('Error connecting LinkedIn:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * POST /api/career/generate-lessons
 * Generate career-focused lessons from LinkedIn
 */
export const generateCareerLessons = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        
        if (!user || !user.linkedInConnected || !user.linkedInAccessToken) {
            return res.json({ success: false, message: 'LinkedIn not connected' });
        }

        // Get LinkedIn profile data
        const profileResponse = await axios.get(
            'https://api.linkedin.com/v2/me',
            {
                headers: { Authorization: `Bearer ${user.linkedInAccessToken}` }
            }
        );

        const profile = profileResponse.data;
        const jobTitle = profile.headline || '';
        const industry = profile.industryName || '';

        // Generate career-focused lessons
        const lessons = [];
        
        // Create lesson based on job title and industry
        const lessonContent = {
            title: `English for ${jobTitle || 'Your Career'}`,
            vocabulary: generateCareerVocabulary(jobTitle, industry),
            phrases: generateCareerPhrases(jobTitle),
            exercises: []
        };

        const lesson = await dbAdapter.create(Lesson, {
            userId: user._id.toString(),
            source: 'linkedin',
            originalContent: {
                jobTitle,
                industry
            },
            englishContent: lessonContent
        });

        lessons.push(lesson);

        res.json({
            success: true,
            lessons,
            count: lessons.length
        });
    } catch (error) {
        console.error('Error generating career lessons:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * GET /api/career/job-postings
 * Analyze job postings (mock for now)
 */
export const analyzeJobPostings = async (req, res) => {
    try {
        // Mock job postings analysis
        const analysis = {
            commonSkills: ['communication', 'leadership', 'problem-solving'],
            requiredEnglish: 'Advanced',
            recommendations: [
                'Focus on business vocabulary',
                'Practice interview questions',
                'Work on professional email writing'
            ]
        };

        res.json({
            success: true,
            analysis
        });
    } catch (error) {
        console.error('Error analyzing job postings:', error);
        res.json({ success: false, message: error.message });
    }
};

// Helper functions
function generateCareerVocabulary(jobTitle, industry) {
    const baseVocab = ['meeting', 'presentation', 'deadline', 'project', 'team'];
    const industryVocab = {
        'Technology': ['software', 'development', 'coding', 'algorithm'],
        'Marketing': ['campaign', 'brand', 'audience', 'strategy'],
        'Finance': ['budget', 'investment', 'revenue', 'profit']
    };
    
    return [...baseVocab, ...(industryVocab[industry] || [])];
}

function generateCareerPhrases(jobTitle) {
    return [
        'I would like to schedule a meeting',
        'Let me present my ideas',
        'I need to meet this deadline',
        'Can we discuss this project?',
        'I work well in a team'
    ];
}

export default {
    connectLinkedIn,
    generateCareerLessons,
    analyzeJobPostings
};
