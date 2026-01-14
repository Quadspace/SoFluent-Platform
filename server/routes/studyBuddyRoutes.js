/**
 * Study Buddy Routes
 * Feature 8: Smart Study Buddy™
 */

import express from "express";
import { getWordsForReview, submitReview, addWord, getStats } from "../controllers/studyBuddyController.js";
import { protect } from '@clerk/express';

const studyBuddyRouter = express.Router();

/**
 * @swagger
 * /api/study-buddy/review:
 *   get:
 *     summary: Get words for review
 *     tags: [Study Buddy]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Words ready for review
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 words:
 *                   type: array
 */
studyBuddyRouter.get('/review', protect(), getWordsForReview);

/**
 * @swagger
 * /api/study-buddy/review:
 *   post:
 *     summary: Submit word review
 *     tags: [Study Buddy]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - wordId
 *               - correct
 *             properties:
 *               wordId:
 *                 type: string
 *               correct:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Review submitted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
studyBuddyRouter.post('/review', protect(), submitReview);

/**
 * @swagger
 * /api/study-buddy/add-word:
 *   post:
 *     summary: Add a new word to study
 *     tags: [Study Buddy]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - word
 *               - translation
 *             properties:
 *               word:
 *                 type: string
 *               translation:
 *                 type: string
 *     responses:
 *       200:
 *         description: Word added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
studyBuddyRouter.post('/add-word', protect(), addWord);

/**
 * @swagger
 * /api/study-buddy/stats:
 *   get:
 *     summary: Get study statistics
 *     tags: [Study Buddy]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Study statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 stats:
 *                   type: object
 */
studyBuddyRouter.get('/stats', protect(), getStats);

export default studyBuddyRouter;
