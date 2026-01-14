/**
 * Career Routes
 * Feature 6: Career English Accelerator™
 */

import express from "express";
import { connectLinkedIn, generateCareerLessons, analyzeJobPostings } from "../controllers/careerController.js";
import { protect } from '@clerk/express';

const careerRouter = express.Router();

/**
 * @swagger
 * /api/career/connect-linkedin:
 *   post:
 *     summary: Connect LinkedIn account
 *     tags: [Career]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accessToken
 *             properties:
 *               accessToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: LinkedIn connected
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
careerRouter.post('/connect-linkedin', protect(), connectLinkedIn);

/**
 * @swagger
 * /api/career/generate-lessons:
 *   post:
 *     summary: Generate career-focused lessons
 *     tags: [Career]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jobTitle:
 *                 type: string
 *               industry:
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
careerRouter.post('/generate-lessons', protect(), generateCareerLessons);

/**
 * @swagger
 * /api/career/job-postings:
 *   get:
 *     summary: Analyze job postings
 *     tags: [Career]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Job postings analysis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 postings:
 *                   type: array
 */
careerRouter.get('/job-postings', protect(), analyzeJobPostings);

export default careerRouter;
