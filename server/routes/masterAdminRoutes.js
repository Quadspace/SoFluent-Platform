/**
 * Master Admin Routes
 * 3-Tier Platform: Level 1 routes
 */

import express from "express";
import {
    getDashboard,
    getCohorts,
    createCohort,
    updateCohortPosition,
    getStudents,
    getTeachers,
    getFinancials
} from "../controllers/masterAdminController.js";
import { requireMasterAdmin } from "../middlewares/roleMiddleware.js";
import { protect } from '@clerk/express';

const masterAdminRouter = express.Router();

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get master admin dashboard (Master Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 dashboard:
 *                   type: object
 */
masterAdminRouter.get('/dashboard', protect(), requireMasterAdmin, getDashboard);

/**
 * @swagger
 * /api/admin/cohorts:
 *   get:
 *     summary: Get all cohorts (Master Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of cohorts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 cohorts:
 *                   type: array
 */
masterAdminRouter.get('/cohorts', protect(), requireMasterAdmin, getCohorts);

/**
 * @swagger
 * /api/admin/cohorts:
 *   post:
 *     summary: Create a new cohort (Master Admin only)
 *     tags: [Admin]
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
 *         description: Cohort created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
masterAdminRouter.post('/cohorts', protect(), requireMasterAdmin, createCohort);

/**
 * @swagger
 * /api/admin/cohorts/{id}/position:
 *   put:
 *     summary: Update cohort position (Master Admin only)
 *     tags: [Admin]
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
 *               - position
 *             properties:
 *               position:
 *                 type: number
 *     responses:
 *       200:
 *         description: Position updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
masterAdminRouter.put('/cohorts/:id/position', protect(), requireMasterAdmin, updateCohortPosition);

/**
 * @swagger
 * /api/admin/students:
 *   get:
 *     summary: Get all students (Master Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of students
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 students:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */
masterAdminRouter.get('/students', protect(), requireMasterAdmin, getStudents);

/**
 * @swagger
 * /api/admin/teachers:
 *   get:
 *     summary: Get all teachers (Master Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of teachers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 teachers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */
masterAdminRouter.get('/teachers', protect(), requireMasterAdmin, getTeachers);

/**
 * @swagger
 * /api/admin/financials:
 *   get:
 *     summary: Get financial data (Master Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Financial data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 financials:
 *                   type: object
 */
masterAdminRouter.get('/financials', protect(), requireMasterAdmin, getFinancials);

export default masterAdminRouter;
