/**
 * Pronunciation Routes
 * Feature 7: AI Pronunciation Coach™
 */

import express from "express";
import multer from "multer";
import { analyzePronunciationAudio, getPronunciationRecords } from "../controllers/pronunciationController.js";
import { protect } from '@clerk/express';

const pronunciationRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * /api/pronunciation/analyze:
 *   post:
 *     summary: Analyze pronunciation from audio
 *     tags: [Pronunciation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - audio
 *               - text
 *             properties:
 *               audio:
 *                 type: string
 *                 format: binary
 *               text:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pronunciation analysis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 score:
 *                   type: number
 *                 feedback:
 *                   type: string
 */
pronunciationRouter.post('/analyze', protect(), upload.single('audio'), analyzePronunciationAudio);

/**
 * @swagger
 * /api/pronunciation/records:
 *   get:
 *     summary: Get pronunciation records
 *     tags: [Pronunciation]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pronunciation records
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 records:
 *                   type: array
 */
pronunciationRouter.get('/records', protect(), getPronunciationRecords);

export default pronunciationRouter;
