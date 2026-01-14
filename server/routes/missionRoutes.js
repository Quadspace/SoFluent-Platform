/**
 * Mission Routes
 * Feature 4: Real-World Mission System™
 */

import express from "express";
import multer from "multer";
import { getMissions, getMission, submitMission, createMission } from "../controllers/missionController.js";
import { protect } from '@clerk/express';

const missionRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * /api/missions:
 *   get:
 *     summary: Get all missions
 *     tags: [Missions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of missions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 missions:
 *                   type: array
 */
missionRouter.get('/', protect(), getMissions);

/**
 * @swagger
 * /api/missions/{id}:
 *   get:
 *     summary: Get mission by ID
 *     tags: [Missions]
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
 *         description: Mission details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 mission:
 *                   type: object
 */
missionRouter.get('/:id', protect(), getMission);

/**
 * @swagger
 * /api/missions/{id}/submit:
 *   post:
 *     summary: Submit mission proof
 *     tags: [Missions]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               proof:
 *                 type: string
 *                 format: binary
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mission submitted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
missionRouter.post('/:id/submit', protect(), upload.single('proof'), submitMission);

/**
 * @swagger
 * /api/missions:
 *   post:
 *     summary: Create a new mission (Admin only)
 *     tags: [Missions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               reward:
 *                 type: number
 *     responses:
 *       200:
 *         description: Mission created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
missionRouter.post('/', protect(), createMission); // Admin only (add middleware later)

export default missionRouter;
