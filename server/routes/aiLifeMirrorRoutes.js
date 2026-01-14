/**
 * AI Life Mirror Routes
 * Feature 1: AI Life Mirror™
 */

import express from "express";
import { generateLessons, getLessons, completeLesson } from "../controllers/aiLifeMirrorController.js";
import { protect } from '@clerk/express';

const aiLifeMirrorRouter = express.Router();

/**
 * @swagger
 * /api/ai-life-mirror/generate:
 *   post:
 *     summary: Generate lessons from Instagram posts
 *     tags: [AI Life Mirror]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               instagramPostId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Lessons generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 lessons:
 *                   type: array
 */
aiLifeMirrorRouter.post('/generate', protect(), generateLessons);

/**
 * @swagger
 * /api/ai-life-mirror/lessons:
 *   get:
 *     summary: Get user's AI Life Mirror lessons
 *     tags: [AI Life Mirror]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of lessons
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 lessons:
 *                   type: array
 */
aiLifeMirrorRouter.get('/lessons', protect(), getLessons);

/**
 * @swagger
 * /api/ai-life-mirror/lessons/{id}/complete:
 *   post:
 *     summary: Mark lesson as complete
 *     tags: [AI Life Mirror]
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
 *         description: Lesson completed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
aiLifeMirrorRouter.post('/lessons/:id/complete', protect(), completeLesson);

export default aiLifeMirrorRouter;
