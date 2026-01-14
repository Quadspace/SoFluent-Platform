/**
 * Reward Routes
 * Top 1% Enhancement: Rewards shop
 */

import express from "express";
import {
    getRewards,
    purchaseReward
} from "../controllers/rewardController.js";
import { protect } from '@clerk/express';

const rewardRouter = express.Router();

/**
 * @swagger
 * /api/rewards:
 *   get:
 *     summary: Get available rewards
 *     tags: [Rewards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of rewards
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 rewards:
 *                   type: array
 */
rewardRouter.get('/', protect(), getRewards);

/**
 * @swagger
 * /api/rewards/{id}/purchase:
 *   post:
 *     summary: Purchase a reward
 *     tags: [Rewards]
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
 *         description: Reward purchased
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
rewardRouter.post('/:id/purchase', protect(), purchaseReward);

export default rewardRouter;
