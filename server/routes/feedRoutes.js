/**
 * Feed Routes
 * Personalized feed content endpoints
 */

import express from "express";
import { getPersonalizedFeed } from "../controllers/feedController.js";
import { protect } from '@clerk/express';

const feedRouter = express.Router();

/**
 * @swagger
 * /api/feed/personalized:
 *   get:
 *     summary: Get personalized feed content
 *     tags: [Feed]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Personalized feed content
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 feed:
 *                   type: array
 */
feedRouter.get('/personalized', protect(), getPersonalizedFeed);

export default feedRouter;
