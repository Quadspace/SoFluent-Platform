/**
 * Conversation Routes
 * Feature 5: AI Conversation Partner™
 */

import express from "express";
import { startConversation, sendMessage, getConversation, getConversations } from "../controllers/conversationController.js";
import { protect } from '@clerk/express';

const conversationRouter = express.Router();

/**
 * @swagger
 * /api/conversation/start:
 *   post:
 *     summary: Start a new AI conversation
 *     tags: [Conversation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               topic:
 *                 type: string
 *               difficulty:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *     responses:
 *       200:
 *         description: Conversation started
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 conversationId:
 *                   type: string
 */
conversationRouter.post('/start', protect(), startConversation);

/**
 * @swagger
 * /api/conversation:
 *   get:
 *     summary: Get all user conversations
 *     tags: [Conversation]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of conversations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 conversations:
 *                   type: array
 */
conversationRouter.get('/', protect(), getConversations);

/**
 * @swagger
 * /api/conversation/{id}:
 *   get:
 *     summary: Get conversation by ID
 *     tags: [Conversation]
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
 *         description: Conversation details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 conversation:
 *                   type: object
 */
conversationRouter.get('/:id', protect(), getConversation);

/**
 * @swagger
 * /api/conversation/{id}/message:
 *   post:
 *     summary: Send a message in conversation
 *     tags: [Conversation]
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
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 response:
 *                   type: string
 */
conversationRouter.post('/:id/message', protect(), sendMessage);

export default conversationRouter;
