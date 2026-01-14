/**
 * Student Controller
 * Handles all student-facing API endpoints
 * Designed to drive engagement, retention, and revenue
 */

import User from '../models/User.js';
import Course from '../models/Course.js';
import CourseProgress from '../models/CourseProgress.js';
import Purchase from '../models/Purchase.js';
import dbAdapter from '../configs/database-adapter.js';

/**
 * GET /api/student/dashboard
 * Get comprehensive dashboard data for logged-in student
 */
export const getStudentDashboard = async (req, res) => {
    try {
        const userId = req.auth.userId;
        
        // Get user data
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        // Get enrolled courses
        const purchases = await dbAdapter.find(Purchase, { userId: user._id });
        const enrolledCourseIds = purchases.map(p => p.courseId);
        const enrolledCourses = await dbAdapter.find(Course, { _id: { $in: enrolledCourseIds } });

        // Calculate progress
        const progressData = await calculateProgress(user._id, enrolledCourses);
        
        // Get learning path
        const learningPath = await getLearningPath(user._id, enrolledCourses);
        
        // Get daily challenge
        const dailyChallenge = await getDailyChallenge(user._id);
        
        // Get upcoming classes
        const upcomingClasses = await getUpcomingClasses(user._id);
        
        // Get recommendations
        const recommendations = await getRecommendations(user._id, enrolledCourses);
        
        // Get achievements
        const achievements = await getAchievements(user._id);
        
        // Get stats
        const stats = await getStats(user._id, enrolledCourses);

        res.json({
            success: true,
            dashboard: {
                progress: progressData,
                learningPath,
                dailyChallenge,
                upcomingClasses,
                recommendations,
                achievements,
                stats
            }
        });
    } catch (error) {
        console.error('Error fetching student dashboard:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * GET /api/student/progress
 * Get detailed progress metrics
 */
export const getStudentProgress = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const purchases = await dbAdapter.find(Purchase, { userId: user._id });
        const enrolledCourseIds = purchases.map(p => p.courseId);
        const enrolledCourses = await dbAdapter.find(Course, { _id: { $in: enrolledCourseIds } });
        
        const progress = await calculateProgress(user._id, enrolledCourses);

        res.json({
            success: true,
            progress
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

/**
 * GET /api/student/learning-path
 * Get current learning path
 */
export const getStudentLearningPath = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const purchases = await dbAdapter.find(Purchase, { userId: user._id });
        const enrolledCourseIds = purchases.map(p => p.courseId);
        const enrolledCourses = await dbAdapter.find(Course, { _id: { $in: enrolledCourseIds } });
        
        const learningPath = await getLearningPath(user._id, enrolledCourses);

        res.json({
            success: true,
            learningPath
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

/**
 * GET /api/student/recommendations
 * Get personalized content recommendations
 */
export const getStudentRecommendations = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const purchases = await dbAdapter.find(Purchase, { userId: user._id });
        const enrolledCourseIds = purchases.map(p => p.courseId);
        const enrolledCourses = await dbAdapter.find(Course, { _id: { $in: enrolledCourseIds } });
        
        const recommendations = await getRecommendations(user._id, enrolledCourses);

        res.json({
            success: true,
            recommendations
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

/**
 * GET /api/student/achievements
 * Get student achievements
 */
export const getStudentAchievements = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const achievements = await getAchievements(user._id);

        res.json({
            success: true,
            achievements
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

/**
 * POST /api/student/activity
 * Log student activity (for streak tracking)
 */
export const logStudentActivity = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { activityType, metadata } = req.body;
        
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        // Update last activity date
        const today = new Date().toDateString();
        const lastActivity = user.lastActivityDate ? new Date(user.lastActivityDate).toDateString() : null;
        
        let streak = user.streak || 0;
        if (lastActivity !== today) {
            // Check if streak should continue or reset
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toDateString();
            
            if (lastActivity === yesterdayStr) {
                // Continue streak
                streak += 1;
            } else {
                // Reset streak
                streak = 1;
            }
        }

        // Update user
        await dbAdapter.updateOne(
            User,
            { clerkId: userId },
            {
                lastActivityDate: new Date(),
                streak,
                $push: {
                    activityLog: {
                        type: activityType,
                        date: new Date(),
                        metadata: metadata || {}
                    }
                }
            }
        );

        // Check for new achievements
        const newAchievements = await checkNewAchievements(user._id, streak);

        res.json({
            success: true,
            streak,
            newAchievements
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Helper Functions

/**
 * Calculate student progress
 */
async function calculateProgress(userId, enrolledCourses) {
    // Calculate English level (based on course completion)
    let totalEnglishProgress = 0;
    let englishCourses = 0;
    
    // Calculate Fitness level (based on workout completion)
    let totalFitnessProgress = 0;
    let fitnessCourses = 0;
    
    // Calculate total hours
    let totalHours = 0;
    
    // Calculate streak
    const user = await dbAdapter.findOne(User, { _id: userId });
    const streak = user?.streak || 0;
    
    // Calculate weekly hours (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const weeklyHours = user?.weeklyHours || 0;

    for (const course of enrolledCourses) {
        const progress = await dbAdapter.findOne(CourseProgress, {
            userId,
            courseId: course._id
        });

        if (progress) {
            const completionRate = progress.lectureCompleted?.length || 0;
            const totalLectures = course.courseLectures?.length || 1;
            const courseProgress = (completionRate / totalLectures) * 100;
            
            // Estimate hours (assuming 30 min per lecture)
            totalHours += (completionRate * 0.5);
            
            // Categorize by course type
            if (course.courseTitle?.toLowerCase().includes('fitness') || 
                course.courseTitle?.toLowerCase().includes('workout')) {
                totalFitnessProgress += courseProgress;
                fitnessCourses++;
            } else {
                totalEnglishProgress += courseProgress;
                englishCourses++;
            }
        }
    }

    const englishLevel = englishCourses > 0 ? Math.round(totalEnglishProgress / englishCourses) : 0;
    const fitnessLevel = fitnessCourses > 0 ? Math.round(totalFitnessProgress / fitnessCourses) : 0;

    // Map to level names
    const englishLevelName = getEnglishLevelName(englishLevel);
    const fitnessLevelName = getFitnessLevelName(fitnessLevel);

    return {
        englishLevel,
        englishLevelName,
        fitnessLevel,
        fitnessLevelName,
        streak,
        totalHours: Math.round(totalHours * 10) / 10,
        weeklyHours: Math.round(weeklyHours * 10) / 10
    };
}

/**
 * Get learning path
 */
async function getLearningPath(userId, enrolledCourses) {
    // For now, return a default path
    // TODO: Implement AI-powered path generation based on goals, level, preferences
    
    const user = await dbAdapter.findOne(User, { _id: userId });
    const learningPathName = user?.learningPathName || 'Career Advancement Path';
    const currentWeek = user?.currentWeek || 1;
    const totalWeeks = user?.totalWeeks || 6;
    const progress = Math.round((currentWeek / totalWeeks) * 100);

    // Get next steps from enrolled courses
    const nextSteps = [];
    for (const course of enrolledCourses.slice(0, 2)) {
        const progress = await dbAdapter.findOne(CourseProgress, {
            userId,
            courseId: course._id
        });
        
        const completedLectures = progress?.lectureCompleted?.length || 0;
        const totalLectures = course.courseLectures?.length || 0;
        
        if (completedLectures < totalLectures) {
            nextSteps.push({
                id: course._id,
                title: course.courseTitle,
                duration: `${Math.round(totalLectures * 0.5)} min`,
                type: 'lesson',
                icon: '📚'
            });
        }
    }

    return {
        name: learningPathName,
        currentWeek,
        totalWeeks,
        progress,
        nextSteps: nextSteps.length > 0 ? nextSteps : [
            {
                id: 1,
                title: 'Business Email Writing',
                duration: '15 min',
                type: 'lesson',
                icon: '📧'
            },
            {
                id: 2,
                title: 'Interview Prep Session',
                duration: '30 min',
                type: 'class',
                icon: '💼'
            }
        ]
    };
}

/**
 * Get daily challenge
 */
async function getDailyChallenge(userId) {
    // For now, return a default challenge
    // TODO: Implement dynamic challenge generation based on student level
    
    const user = await dbAdapter.findOne(User, { _id: userId });
    const today = new Date().toDateString();
    const completedToday = user?.dailyChallengeCompleted === today;

    return {
        id: 1,
        title: "Record yourself saying:",
        phrase: "I'm working out to feel confident and strong.",
        completed: completedToday,
        completedCount: 18 // TODO: Get from database
    };
}

/**
 * Get upcoming classes
 */
async function getUpcomingClasses(userId) {
    // Fetch from class API
    try {
        // This would normally call the class controller
        // For now, return structured mock data
        const user = await dbAdapter.findOne(User, { _id: userId });
        
        return [
            {
                id: 1,
                title: 'Fluency Fit Beginner',
                time: 'Tomorrow 9:00 AM',
                type: 'live',
                enrolled: true
            },
            {
                id: 2,
                title: 'Business English Advanced',
                time: 'Friday 6:00 PM',
                type: 'live',
                enrolled: true
            }
        ];
    } catch (error) {
        console.error('Error fetching upcoming classes:', error);
        return [];
    }
}

/**
 * Get recommendations
 */
async function getRecommendations(userId, enrolledCourses) {
    // Get user preferences for better recommendations
    const user = await dbAdapter.findOne(User, { _id: userId });
    
    // Get all courses
    const allCourses = await dbAdapter.find(Course, {});
    const enrolledCourseIds = enrolledCourses.map(c => c._id.toString());
    
    // Filter out enrolled courses
    let recommendedCourses = allCourses
        .filter(c => !enrolledCourseIds.includes(c._id.toString()));
    
    // Personalize based on user's goal and preferences
    if (user?.goal) {
        // Filter by goal-relevant keywords
        const goalKeywords = {
            career: ['business', 'interview', 'professional', 'email', 'presentation'],
            travel: ['travel', 'tourism', 'airport', 'hotel', 'restaurant'],
            social: ['conversation', 'friends', 'social', 'dating'],
            academic: ['toefl', 'academic', 'university', 'research'],
            fun: [] // No filtering for fun
        };
        
        const keywords = goalKeywords[user.goal] || [];
        if (keywords.length > 0) {
            recommendedCourses = recommendedCourses.filter(course => {
                const title = course.courseTitle?.toLowerCase() || '';
                return keywords.some(keyword => title.includes(keyword));
            });
        }
    }
    
    // Limit to 3 recommendations
    recommendedCourses = recommendedCourses.slice(0, 3).map(course => ({
        id: course._id,
        title: course.courseTitle,
        duration: `${Math.round((course.courseLectures?.length || 0) * 0.5)} min`,
        type: 'lesson',
        reason: user?.goal ? `Perfect for your ${user.goal} goals` : 'Based on your progress',
        thumbnail: course.courseThumbnail
    }));

    // Fallback if no recommendations
    if (recommendedCourses.length === 0) {
        return [
            {
                id: 1,
                title: 'Advanced Negotiation Tactics',
                duration: '12 min',
                type: 'lesson',
                reason: 'Based on your progress',
                thumbnail: null
            },
            {
                id: 2,
                title: 'Gym Vocabulary Deep Dive',
                duration: '20 min',
                type: 'lesson',
                reason: 'You love fitness content',
                thumbnail: null
            }
        ];
    }

    return recommendedCourses;
}

/**
 * Get achievements
 */
async function getAchievements(userId) {
    const user = await dbAdapter.findOne(User, { _id: userId });
    
    const unlocked = [];
    const locked = [];

    // Check various achievements
    if (user?.streak >= 7) {
        unlocked.push({ id: 1, name: 'First Week Complete', icon: '🏆', unlocked: true });
    } else {
        locked.push({ id: 1, name: 'First Week Complete', icon: '🏆', progress: user?.streak || 0, target: 7 });
    }

    if (user?.streak >= 30) {
        unlocked.push({ id: 4, name: '30-Day Streak', icon: '🔥', unlocked: true });
    } else {
        locked.push({ id: 4, name: '30-Day Streak', icon: '🔥', progress: user?.streak || 0, target: 30 });
    }

    // Add more achievements based on user data
    unlocked.push(
        { id: 2, name: 'Perfect Attendance', icon: '⭐', unlocked: true },
        { id: 3, name: 'Homework Hero', icon: '📚', unlocked: true }
    );

    locked.push(
        { id: 5, name: 'VIP Member', icon: '👑', progress: 0, target: 1 }
    );

    return { unlocked, locked };
}

/**
 * Get stats
 */
async function getStats(userId, enrolledCourses) {
    const user = await dbAdapter.findOne(User, { _id: userId });
    
    // Count completed courses
    let coursesCompleted = 0;
    for (const course of enrolledCourses) {
        const progress = await dbAdapter.findOne(CourseProgress, {
            userId,
            courseId: course._id
        });
        if (progress) {
            const completedLectures = progress.lectureCompleted?.length || 0;
            const totalLectures = course.courseLectures?.length || 0;
            if (completedLectures === totalLectures && totalLectures > 0) {
                coursesCompleted++;
            }
        }
    }

    // Get total students count
    const totalStudents = await dbAdapter.count(User, {});
    
    // Calculate community rank (mock for now)
    const communityRank = Math.floor(Math.random() * 50) + 1;

    return {
        coursesCompleted,
        totalCourses: enrolledCourses.length,
        communityRank,
        totalStudents
    };
}

/**
 * Check for new achievements
 */
async function checkNewAchievements(userId, streak) {
    const newAchievements = [];
    
    // Check streak milestones
    if (streak === 7) {
        newAchievements.push({
            name: 'First Week Complete',
            icon: '🏆',
            message: 'You completed your first week! Keep going!'
        });
    }
    
    if (streak === 30) {
        newAchievements.push({
            name: '30-Day Streak',
            icon: '🔥',
            message: 'Incredible! 30 days in a row!'
        });
    }

    return newAchievements;
}

/**
 * Helper: Get English level name
 */
function getEnglishLevelName(level) {
    if (level < 30) return 'Beginner (A1-A2)';
    if (level < 60) return 'Intermediate (B1+)';
    if (level < 85) return 'Advanced (B2-C1)';
    return 'Fluent (C2)';
}

/**
 * Helper: Get Fitness level name
 */
function getFitnessLevelName(level) {
    if (level < 30) return 'Beginner';
    if (level < 60) return 'Advanced Beginner';
    if (level < 85) return 'Intermediate';
    return 'Advanced';
}
