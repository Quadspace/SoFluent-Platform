/**
 * Study Group Routes
 * Top 1% Enhancement: Study groups
 */

import express from "express";
import {
    getStudyGroups,
    createStudyGroup,
    joinStudyGroup
} from "../controllers/studyGroupController.js";
import { protect } from '@clerk/express';

const studyGroupRouter = express.Router();

/**
 * @swagger
 * /api/study-groups:
 *   get:
 *     summary: Get all study groups
 *     tags: [Study Groups]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of study groups
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 groups:
 *                   type: array
 */
studyGroupRouter.get('/', protect(), getStudyGroups);

/**
 * @swagger
 * /api/study-groups:
 *   post:
 *     summary: Create a new study group
 *     tags: [Study Groups]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Study group created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
studyGroupRouter.post('/', protect(), createStudyGroup);

/**
 * @swagger
 * /api/study-groups/{id}/join:
 *   post:
 *     summary: Join a study group
 *     tags: [Study Groups]
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
 *         description: Joined study group
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
studyGroupRouter.post('/:id/join', protect(), joinStudyGroup);

export default studyGroupRouter;
