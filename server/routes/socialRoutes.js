/**
 * Social Feed Routes
 * Feature 3: Social Learning Feed™
 */

import express from "express";
import multer from "multer";
import { getFeed, createPost, likePost, addComment } from "../controllers/socialFeedController.js";
import { protect } from '@clerk/express';

const socialRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * /api/social/feed:
 *   get:
 *     summary: Get social learning feed
 *     tags: [Social]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Social feed posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 posts:
 *                   type: array
 */
socialRouter.get('/feed', protect(), getFeed);

/**
 * @swagger
 * /api/social/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Social]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [text, photo, video, voice]
 *               text:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
socialRouter.post('/posts', protect(), upload.single('file'), createPost);

/**
 * @swagger
 * /api/social/posts/{id}/like:
 *   post:
 *     summary: Like or unlike a post
 *     tags: [Social]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post liked/unliked
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
socialRouter.post('/posts/:id/like', protect(), likePost);

/**
 * @swagger
 * /api/social/posts/{id}/comments:
 *   post:
 *     summary: Add a comment to a post
 *     tags: [Social]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
socialRouter.post('/posts/:id/comments', protect(), addComment);

export default socialRouter;
