/**
 * Success Story Routes
 * Feature 9: Success Story Generator™
 */

import express from "express";
import { generateSuccessStory, getSuccessStories, shareSuccessStory } from "../controllers/successStoryController.js";
import { protect } from '@clerk/express';

const successStoryRouter = express.Router();

/**
 * @swagger
 * /api/success-story/generate:
 *   post:
 *     summary: Generate a success story
 *     tags: [Success Stories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               achievements:
 *                 type: array
 *     responses:
 *       200:
 *         description: Success story generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 story:
 *                   type: object
 */
successStoryRouter.post('/generate', protect(), generateSuccessStory);

/**
 * @swagger
 * /api/success-story:
 *   get:
 *     summary: Get success stories
 *     tags: [Success Stories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of success stories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 stories:
 *                   type: array
 */
successStoryRouter.get('/', protect(), getSuccessStories);

/**
 * @swagger
 * /api/success-story/{id}/share:
 *   post:
 *     summary: Share a success story
 *     tags: [Success Stories]
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
 *             properties:
 *               platform:
 *                 type: string
 *                 enum: [facebook, twitter, linkedin]
 *     responses:
 *       200:
 *         description: Story shared
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
successStoryRouter.post('/:id/share', protect(), shareSuccessStory);

export default successStoryRouter;
