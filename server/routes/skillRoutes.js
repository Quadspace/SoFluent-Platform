/**
 * Skill Routes
 * Top 1% Enhancement: Skill trees
 */

import express from "express";
import {
    getSkillTree,
    unlockSkill
} from "../controllers/skillController.js";
import { protect } from '@clerk/express';

const skillRouter = express.Router();

/**
 * @swagger
 * /api/skills:
 *   get:
 *     summary: Get user's skill tree
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Skill tree data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 skillTree:
 *                   type: object
 */
skillRouter.get('/', protect(), getSkillTree);

/**
 * @swagger
 * /api/skills/{id}/unlock:
 *   post:
 *     summary: Unlock a skill
 *     tags: [Skills]
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
 *         description: Skill unlocked
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
skillRouter.post('/:id/unlock', protect(), unlockSkill);

export default skillRouter;
