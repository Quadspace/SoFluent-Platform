/**
 * Feed Controller
 * Handles personalized feed content for students
 */

import User from '../models/User.js';
import Course from '../models/Course.js';
import CourseProgress from '../models/CourseProgress.js';
import Post from '../models/Post.js';
import { Purchase } from '../models/Purchase.js';
import dbAdapter from '../configs/database-adapter.js';

/**
 * GET /api/feed/personalized
 * Get personalized feed content for student
 */
export const getPersonalizedFeed = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        // Get enrolled courses
        const purchases = await dbAdapter.find(Purchase, { userId: user._id });
        const enrolledCourseIds = purchases.map(p => p.courseId);
        const enrolledCourses = await dbAdapter.find(Course, { _id: { $in: enrolledCourseIds } });

        // Generate personalized feed items
        const feedItems = await generateFeedItems(user._id, user, enrolledCourses);

        res.json({
            success: true,
            feed: feedItems
        });
    } catch (error) {
        console.error('Error fetching personalized feed:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * Generate personalized feed items
 */
async function generateFeedItems(userId, user, enrolledCourses) {
    const feedItems = [];

    // 1. Daily Challenge (always first)
    const today = new Date().toDateString();
    const challengeCompleted = user.dailyChallengeCompleted === today;
    
    feedItems.push({
        id: `challenge-${today}`,
        type: 'challenge',
        title: "Today's Challenge",
        description: "Record yourself saying:",
        phrase: "I'm working out to feel confident and strong.",
        completed: challengeCompleted,
        completedCount: 18, // TODO: Get from database
        timestamp: 'Today',
        author: 'So Fluent'
    });

    // 2. Recommended Lessons (based on goal and progress)
    const recommendations = await getRecommendations(userId, enrolledCourses, user);
    recommendations.slice(0, 2).forEach(rec => {
        feedItems.push({
            id: `recommendation-${rec.id}`,
            type: 'lesson',
            title: rec.title,
            description: rec.reason,
            duration: rec.duration,
            level: user.englishLevel || 'intermediate',
            thumbnail: rec.thumbnail,
            timestamp: '2h ago',
            author: 'So Fluent',
            likes: Math.floor(Math.random() * 100) + 10,
            comments: Math.floor(Math.random() * 20) + 2
        });
    });

    // 3. Community Posts (from database)
    const communityPosts = await dbAdapter.find(Post, {}, {
        sort: { featured: -1, createdAt: -1 },
        limit: 3
    });

    for (const post of communityPosts) {
        const postUser = await dbAdapter.findOne(User, { _id: post.user });
        feedItems.push({
            id: post._id.toString(),
            type: 'community',
            title: post.content?.text ? post.content.text.substring(0, 50) + '...' : 'Student Post',
            description: post.content?.text || '',
            image: post.content?.imageUrl || null,
            audioUrl: post.content?.audioUrl || null,
            videoUrl: post.content?.videoUrl || null,
            author: postUser?.name || 'Student',
            authorImage: postUser?.imageUrl || null,
            timestamp: formatTimestamp(post.createdAt),
            likes: post.likes?.length || 0,
            comments: post.comments?.length || 0,
            featured: post.featured || false,
            postType: post.type
        });
    }

    // 4. More Lessons (from enrolled courses)
    for (const course of enrolledCourses.slice(0, 2)) {
        const progress = await dbAdapter.findOne(CourseProgress, {
            userId,
            courseId: course._id
        });
        
        const completedLectures = progress?.lectureCompleted?.length || 0;
        const totalLectures = course.courseLectures?.length || 0;
        
        if (completedLectures < totalLectures) {
            feedItems.push({
                id: `course-${course._id}`,
                type: 'lesson',
                title: course.courseTitle,
                description: `Continue learning: ${completedLectures}/${totalLectures} lessons completed`,
                duration: `${Math.round((totalLectures - completedLectures) * 0.5)} min remaining`,
                level: course.courseLevel || 'intermediate',
                thumbnail: course.courseThumbnail,
                timestamp: '1d ago',
                author: course.educatorName || 'So Fluent',
                likes: Math.floor(Math.random() * 50) + 5,
                comments: Math.floor(Math.random() * 10) + 1,
                courseId: course._id.toString()
            });
        }
    }

    // 5. Instagram-based lessons (if connected)
    if (user.instagramConnect) {
        feedItems.push({
            id: 'instagram-lesson-1',
            type: 'lesson',
            title: 'Lesson from YOUR Instagram',
            description: 'We noticed you love the beach! Let\'s learn English vocabulary for your next beach day.',
            image: null, // Would be user's Instagram photo
            duration: '10 min',
            level: user.englishLevel || 'intermediate',
            timestamp: '5h ago',
            author: 'So Fluent AI',
            likes: 234,
            comments: 12,
            reason: 'From your Instagram'
        });
    }

    // Sort by timestamp (newest first)
    return feedItems;
}

/**
 * Get recommendations (reused from studentController)
 */
async function getRecommendations(userId, enrolledCourses, user) {
    const allCourses = await dbAdapter.find(Course, {});
    const enrolledCourseIds = enrolledCourses.map(c => c._id.toString());
    
    let recommendedCourses = allCourses
        .filter(c => !enrolledCourseIds.includes(c._id.toString()));
    
    // Personalize based on user's goal
    if (user?.goal) {
        const goalKeywords = {
            career: ['business', 'interview', 'professional', 'email', 'presentation'],
            travel: ['travel', 'tourism', 'airport', 'hotel', 'restaurant'],
            social: ['conversation', 'friends', 'social', 'dating'],
            academic: ['toefl', 'academic', 'university', 'research'],
            fun: []
        };
        
        const keywords = goalKeywords[user.goal] || [];
        if (keywords.length > 0) {
            recommendedCourses = recommendedCourses.filter(course => {
                const title = course.courseTitle?.toLowerCase() || '';
                return keywords.some(keyword => title.includes(keyword));
            });
        }
    }
    
    return recommendedCourses.slice(0, 3).map(course => ({
        id: course._id,
        title: course.courseTitle,
        duration: `${Math.round((course.courseLectures?.length || 0) * 0.5)} min`,
        reason: user?.goal ? `Perfect for your ${user.goal} goals` : 'Based on your progress',
        thumbnail: course.courseThumbnail
    }));
}

/**
 * Format timestamp to relative time
 */
function formatTimestamp(date) {
    if (!date) return 'Recently';
    const now = new Date();
    const postDate = new Date(date);
    const diffMs = now - postDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return postDate.toLocaleDateString();
}

export default {
    getPersonalizedFeed
};
