/**
 * Coin Routes
 * Top 1% Enhancement: Virtual currency
 */

import express from "express";
import {
    getBalance,
    earnCoins,
    spendCoins,
    getHistory
} from "../controllers/coinController.js";
import { protect } from '@clerk/express';

const coinRouter = express.Router();

/**
 * @swagger
 * /api/coins/balance:
 *   get:
 *     summary: Get coin balance
 *     tags: [Coins]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current coin balance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 balance:
 *                   type: number
 */
coinRouter.get('/balance', protect(), getBalance);

/**
 * @swagger
 * /api/coins/history:
 *   get:
 *     summary: Get coin transaction history
 *     tags: [Coins]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Transaction history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 history:
 *                   type: array
 */
coinRouter.get('/history', protect(), getHistory);

/**
 * @swagger
 * /api/coins/earn:
 *   post:
 *     summary: Earn coins
 *     tags: [Coins]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - reason
 *             properties:
 *               amount:
 *                 type: number
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Coins earned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
coinRouter.post('/earn', protect(), earnCoins);

/**
 * @swagger
 * /api/coins/spend:
 *   post:
 *     summary: Spend coins
 *     tags: [Coins]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - item
 *             properties:
 *               amount:
 *                 type: number
 *               item:
 *                 type: string
 *     responses:
 *       200:
 *         description: Coins spent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
coinRouter.post('/spend', protect(), spendCoins);

export default coinRouter;
