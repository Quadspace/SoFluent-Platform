/**
 * Class Routes
 * Handles class scheduling and RSVPs
 */

import express from "express";
import {
    getUpcomingClasses,
    rsvpToClass,
    cancelRsvp,
    scheduleClass
} from "../controllers/classController.js";
import { protect } from '@clerk/express';

const classRouter = express.Router();

/**
 * @swagger
 * /api/classes/upcoming:
 *   get:
 *     summary: Get upcoming classes
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of upcoming classes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 classes:
 *                   type: array
 */
classRouter.get('/upcoming', protect(), getUpcomingClasses);

/**
 * @swagger
 * /api/classes/schedule:
 *   post:
 *     summary: Schedule a new class
 *     tags: [Classes]
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
 *               - date
 *             properties:
 *               title:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Class scheduled
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
classRouter.post('/schedule', protect(), scheduleClass);

/**
 * @swagger
 * /api/classes/{id}/rsvp:
 *   post:
 *     summary: RSVP to a class
 *     tags: [Classes]
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
 *         description: RSVP successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
classRouter.post('/:id/rsvp', protect(), rsvpToClass);

/**
 * @swagger
 * /api/classes/{id}/cancel:
 *   post:
 *     summary: Cancel RSVP to a class
 *     tags: [Classes]
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
 *         description: RSVP cancelled
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
classRouter.post('/:id/cancel', protect(), cancelRsvp);

export default classRouter;
