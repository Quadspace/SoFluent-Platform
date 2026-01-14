/**
 * Social Feed Controller
 * Feature 3: Social Learning Feed™
 * Manus-compliant implementation
 */

import dbAdapter from '../configs/database-adapter.js';
import storageAdapter from '../configs/storage-adapter.js';
import Post from '../models/Post.js';
import User from '../models/User.js';

/**
 * GET /api/social/feed
 * Get community feed
 */
export const getFeed = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        // Get all posts, sorted by featured first, then date
        const posts = await dbAdapter.find(Post, {
            isActive: { $ne: false }
        }, {
            sort: { featured: -1, createdAt: -1 },
            limit: 50
        });

        // Populate user info
        const postsWithUsers = await Promise.all(posts.map(async (post) => {
            const postUser = await dbAdapter.findOne(User, { _id: post.user });
            const commentsWithUsers = await Promise.all((post.comments || []).map(async (comment) => {
                const commentUser = await dbAdapter.findOne(User, { _id: comment.user });
                return {
                    ...comment.toObject(),
                    user: commentUser ? {
                        name: commentUser.name,
                        imageUrl: commentUser.imageUrl
                    } : null
                };
            }));

            return {
                ...post.toObject(),
                user: postUser ? {
                    _id: postUser._id,
                    name: postUser.name,
                    imageUrl: postUser.imageUrl,
                    level: postUser.englishLevel || 'intermediate'
                } : null,
                comments: commentsWithUsers,
                liked: post.likes?.includes(user._id.toString()) || false
            };
        }));

        res.json({
            success: true,
            posts: postsWithUsers
        });
    } catch (error) {
        console.error('Error fetching feed:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * POST /api/social/posts
 * Create a new post
 */
export const createPost = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const { type, text } = req.body;
        const content = {};

        if (type === 'text') {
            content.text = text;
        } else if (type === 'voice' && req.file) {
            // ✅ Use storage adapter - Manus compliant
            const result = await storageAdapter.upload(req.file, 'audio', {
                resource_type: 'video' // For audio files
            });
            content.audioUrl = result.url;
        } else if (type === 'photo' && req.file) {
            // ✅ Use storage adapter - Manus compliant
            const result = await storageAdapter.upload(req.file, 'images');
            content.imageUrl = result.url;
        } else if (type === 'video' && req.file) {
            // ✅ Use storage adapter - Manus compliant
            const result = await storageAdapter.upload(req.file, 'videos');
            content.videoUrl = result.url;
        }

        // ✅ Use adapter - Manus compliant
        const post = await dbAdapter.create(Post, {
            user: user._id.toString(),
            type,
            content
        });

        // Create activity for real-time feed
        const { createActivity } = await import('../middlewares/activityMiddleware.js');
        createActivity('post', {
            userId: user._id,
            userName: user.name,
            postId: post._id
        });

        // Update user's streak
        await updateStreak(user._id);

        // Award R$2 for creating post
        try {
            const contentRewardService = (await import('../services/contentRewardService.js')).default;
            await contentRewardService.handlePostCreated(user._id, post._id);
        } catch (error) {
            console.error('Error recording post creation reward:', error);
            // Don't fail post creation if reward fails
        }

        res.json({
            success: true,
            post
        });
    } catch (error) {
        console.error('Error creating post:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * POST /api/social/posts/:id/like
 * Like/unlike a post
 */
export const likePost = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        const { id } = req.params;

        const post = await dbAdapter.findOne(Post, { _id: id });
        if (!post) {
            return res.json({ success: false, message: 'Post not found' });
        }

        const likes = post.likes || [];
        const userIndex = likes.indexOf(user._id.toString());
        
        let update;
        let newLikeCount;
        if (userIndex > -1) {
            // Unlike
            update = { $pull: { likes: user._id.toString() } };
        } else {
            // Like
            update = { $push: { likes: user._id.toString() } };
        }

        await dbAdapter.updateOne(Post, { _id: id }, update);
        
        const updatedPost = await dbAdapter.findOne(Post, { _id: id });
        newLikeCount = updatedPost.likes?.length || 0;

        // Award milestone rewards if post was liked (not unliked)
        if (!(userIndex > -1)) {
            try {
                const contentRewardService = (await import('../services/contentRewardService.js')).default;
                await contentRewardService.handlePostLiked(id, newLikeCount);
            } catch (error) {
                console.error('Error recording post like milestone reward:', error);
                // Don't fail like operation if reward fails
            }
        }

        res.json({
            success: true,
            liked: !(userIndex > -1),
            likes: newLikeCount
        });
    } catch (error) {
        console.error('Error liking post:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * POST /api/social/posts/:id/comments
 * Add a comment to a post
 */
export const addComment = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        const { id } = req.params;
        const { text } = req.body;

        const post = await dbAdapter.findOne(Post, { _id: id });
        if (!post) {
            return res.json({ success: false, message: 'Post not found' });
        }

        const comments = post.comments || [];
        comments.push({
            user: user._id.toString(),
            text,
            createdAt: new Date()
        });

        await dbAdapter.updateOne(Post, { _id: id }, { comments });

        res.json({
            success: true,
            comment: comments[comments.length - 1]
        });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * Helper: Update user streak
 */
async function updateStreak(userId) {
    const user = await dbAdapter.findOne(User, { _id: userId });
    if (!user) return;

    const today = new Date().toDateString();
    const lastActivity = user.lastActivityDate ? new Date(user.lastActivityDate).toDateString() : null;
    
    let streak = user.streak || 0;
    
    if (lastActivity === today) {
        // Already active today
        return;
    } else if (lastActivity === new Date(Date.now() - 86400000).toDateString()) {
        // Active yesterday - continue streak
        streak += 1;
    } else {
        // New streak
        streak = 1;
    }

    await dbAdapter.updateOne(User, { _id: userId }, {
        streak,
        lastActivityDate: new Date()
    });
}

export default {
    getFeed,
    createPost,
    likePost,
    addComment
};
