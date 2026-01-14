/**
 * Onboarding Controller
 * Handles student onboarding and learning path generation
 */

import User from '../models/User.js';
import dbAdapter from '../configs/database-adapter.js';

/**
 * POST /api/student/onboarding
 * Save onboarding data and generate learning path
 */
export const saveOnboarding = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const {
            goal,
            englishLevel,
            learningStyle,
            fitnessLevel,
            studyTime,
            instagramConnect
        } = req.body;

        // Find user
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        // Generate learning path name based on goal
        const learningPathNames = {
            career: 'Career Advancement Path',
            travel: 'Travel & Tourism Path',
            social: 'Social Connections Path',
            academic: 'Academic Success Path',
            fun: 'Personal Growth Path'
        };

        const learningPathName = learningPathNames[goal] || 'Career Advancement Path';

        // Calculate initial weeks based on level
        const weeksByLevel = {
            beginner: 12,
            intermediate: 8,
            advanced: 6,
            fluent: 4
        };

        const totalWeeks = weeksByLevel[englishLevel] || 8;

        // Update user with onboarding data
        await dbAdapter.updateOne(
            User,
            { clerkId: userId },
            {
                goal,
                englishLevel,
                learningStyle,
                fitnessLevel,
                studyTime,
                instagramConnect,
                learningPathName,
                totalWeeks,
                currentWeek: 1,
                onboardingCompleted: true,
                onboardingCompletedAt: new Date()
            }
        );

        // Generate initial learning path recommendations
        const learningPath = await generateLearningPath({
            goal,
            englishLevel,
            learningStyle,
            fitnessLevel,
            studyTime
        });

        res.json({
            success: true,
            message: 'Onboarding completed successfully',
            learningPath
        });
    } catch (error) {
        console.error('Error saving onboarding:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * Generate personalized learning path based on onboarding data
 */
async function generateLearningPath({ goal, englishLevel, learningStyle, fitnessLevel, studyTime }) {
    // This is a simplified version - in production, this would use AI
    // to generate a truly personalized path based on the student's goals and level

    const pathTemplates = {
        career: {
            name: 'Career Advancement Path',
            description: 'Master business English for interviews, presentations, and professional growth',
            focus: ['Business English', 'Interview Prep', 'Email Writing', 'Networking']
        },
        travel: {
            name: 'Travel & Tourism Path',
            description: 'Build confidence for travel conversations and tourism situations',
            focus: ['Travel Vocabulary', 'Airport English', 'Hotel Conversations', 'Restaurant English']
        },
        social: {
            name: 'Social Connections Path',
            description: 'Make friends and build relationships in English',
            focus: ['Conversation Skills', 'Making Friends', 'Dating English', 'Social Situations']
        },
        academic: {
            name: 'Academic Success Path',
            description: 'Excel in TOEFL, university, and academic English',
            focus: ['TOEFL Prep', 'Academic Writing', 'Research Skills', 'Presentation Skills']
        },
        fun: {
            name: 'Personal Growth Path',
            description: 'Enjoy learning English at your own pace',
            focus: ['General English', 'Conversation Practice', 'Cultural Understanding', 'Fun Activities']
        }
    };

    const template = pathTemplates[goal] || pathTemplates.career;

    return {
        name: template.name,
        description: template.description,
        focus: template.focus,
        currentWeek: 1,
        totalWeeks: 8,
        progress: 0
    };
}

export default { saveOnboarding };
