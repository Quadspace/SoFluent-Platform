/**
 * Content Reward Service
 * Handles R$ rewards for content creation (posts, comments)
 * Integrates with Learn-to-Earn system
 */

import dbAdapter from '../configs/database-adapter.js';
import Post from '../models/Post.js';
import earningService from './earningService.js';

class ContentRewardService {
  /**
   * Content reward amounts (R$)
   */
  REWARDS = {
    postCreated: 2,           // R$2 for creating a post
    postGets10Likes: 5,       // R$5 when post reaches 10 likes
    postGets50Likes: 15,      // R$15 when post reaches 50 likes
    postGets100Likes: 30,     // R$30 when post reaches 100 likes
    postFeatured: 20,         // R$20 when post is featured
    commentGets5Likes: 1      // R$1 when comment gets 5 likes
  };

  /**
   * Like milestones to check
   */
  LIKE_MILESTONES = [10, 50, 100];

  /**
   * Handle post creation reward
   * @param {string} userId - User ID
   * @param {string} postId - Post ID
   * @returns {Promise<void>}
   */
  async handlePostCreated(userId, postId) {
    try {
      await earningService.recordEarning(
        userId,
        this.REWARDS.postCreated,
        'content_creation',
        postId,
        'post',
        `Ganhou R$${this.REWARDS.postCreated} por criar um post`
      );
    } catch (error) {
      // Don't fail if cap reached
    }
  }

  /**
   * Handle post like milestone rewards
   * @param {string} postId - Post ID
   * @param {number} likeCount - Current like count
   * @returns {Promise<void>}
   */
  async handlePostLiked(postId, likeCount) {
    try {
      const post = await dbAdapter.findOne(Post, { _id: postId });
      if (!post) {
        return;
      }

      const userId = post.user;

      // Check if we've hit a milestone
      if (this.LIKE_MILESTONES.includes(likeCount)) {
        let rewardAmount = 0;
        let description = '';

        if (likeCount === 10) {
          rewardAmount = this.REWARDS.postGets10Likes;
          description = `Ganhou R$${rewardAmount} porque seu post alcançou 10 curtidas`;
        } else if (likeCount === 50) {
          rewardAmount = this.REWARDS.postGets50Likes;
          description = `Ganhou R$${rewardAmount} porque seu post alcançou 50 curtidas`;
        } else if (likeCount === 100) {
          rewardAmount = this.REWARDS.postGets100Likes;
          description = `Ganhou R$${rewardAmount} porque seu post alcançou 100 curtidas`;
        }

        if (rewardAmount > 0) {
          // Check if we've already rewarded this milestone
          const existingEarning = await dbAdapter.findOne(
            (await import('../models/Earning.js')).default,
            {
              userId,
              relatedId: postId,
              relatedType: 'post',
              source: 'content_creation',
              'metadata.milestone': likeCount
            }
          );

          if (!existingEarning) {
            await earningService.recordEarning(
              userId,
              rewardAmount,
              'content_creation',
              postId,
              'post',
              description,
              { milestone: likeCount }
            );
          }
        }
      }
    } catch (error) {
      // Error recording milestone earning - non-critical
    }
  }

  /**
   * Handle post featured reward
   * @param {string} postId - Post ID
   * @returns {Promise<void>}
   */
  async handlePostFeatured(postId) {
    try {
      const post = await dbAdapter.findOne(Post, { _id: postId });
      if (!post) {
        return;
      }

      const userId = post.user;

      // Check if we've already rewarded for featuring
      const existingEarning = await dbAdapter.findOne(
        (await import('../models/Earning.js')).default,
        {
          userId,
          relatedId: postId,
          relatedType: 'post',
          source: 'content_creation',
          'metadata.featured': true
        }
      );

      if (!existingEarning) {
        await earningService.recordEarning(
          userId,
          this.REWARDS.postFeatured,
          'content_creation',
          postId,
          'post',
          `Ganhou R$${this.REWARDS.postFeatured} porque seu post foi destacado`,
          { featured: true }
        );
      }
    } catch (error) {
      // Error recording featured earning - non-critical
    }
  }

  /**
   * Handle comment like milestone reward
   * @param {string} postId - Post ID
   * @param {string} commentId - Comment ID
   * @param {number} likeCount - Current like count
   * @returns {Promise<void>}
   */
  async handleCommentLiked(postId, commentId, likeCount) {
    try {
      const post = await dbAdapter.findOne(Post, { _id: postId });
      if (!post) {
        return;
      }

      // Find comment
      const comment = post.comments?.find(c => c._id?.toString() === commentId || c.id === commentId);
      if (!comment) {
        return;
      }

      const userId = comment.user;

      // Check if comment reached 5 likes
      if (likeCount === 5) {
        // Check if we've already rewarded
        const existingEarning = await dbAdapter.findOne(
          (await import('../models/Earning.js')).default,
          {
            userId,
            relatedId: commentId,
            relatedType: 'comment',
            source: 'content_creation',
            'metadata.milestone': 5
          }
        );

        if (!existingEarning) {
          await earningService.recordEarning(
            userId,
            this.REWARDS.commentGets5Likes,
            'content_creation',
            commentId,
            'comment',
            `Ganhou R$${this.REWARDS.commentGets5Likes} porque seu comentário alcançou 5 curtidas`,
            { milestone: 5, postId }
          );
        }
      }
    } catch (error) {
      // Error recording comment milestone earning - non-critical
    }
  }
}

export default new ContentRewardService();
