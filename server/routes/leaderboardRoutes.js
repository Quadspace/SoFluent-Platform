/**
 * Leaderboard Routes
 * Top 1% Enhancement: Real-time leaderboards
 */

import express from "express";
import {
    getLeaderboard,
    updateLeaderboard
} from "../controllers/leaderboardController.js";
import { protect } from '@clerk/express';

const leaderboardRouter = express.Router();

/**
 * @swagger
 * /api/leaderboard/{type}:
 *   get:
 *     summary: Get leaderboard by type
 *     tags: [Leaderboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [points, streaks, achievements]
 *     responses:
 *       200:
 *         description: Leaderboard data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 leaderboard:
 *                   type: array
 */
leaderboardRouter.get('/:type', protect(), getLeaderboard);

/**
 * @swagger
 * /api/leaderboard/update:
 *   post:
 *     summary: Update leaderboard scores
 *     tags: [Leaderboard]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - points
 *             properties:
 *               type:
 *                 type: string
 *               points:
 *                 type: number
 *     responses:
 *       200:
 *         description: Leaderboard updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
leaderboardRouter.post('/update', protect(), updateLeaderboard);

export default leaderboardRouter;
