/**
 * Teacher Admin Routes
 * 3-Tier Platform: Level 2 routes
 */

import express from "express";
import {
    getTeacherDashboard,
    getTeacherStudents,
    getTeacherEarnings
} from "../controllers/teacherAdminController.js";
import { requireTeacher } from "../middlewares/roleMiddleware.js";
import { protect } from '@clerk/express';

const teacherAdminRouter = express.Router();

/**
 * @swagger
 * /api/teacher/dashboard:
 *   get:
 *     summary: Get teacher dashboard (Teacher or Master Admin only)
 *     tags: [Teacher]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Teacher dashboard data
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
teacherAdminRouter.get('/dashboard', protect(), requireTeacher, getTeacherDashboard);

/**
 * @swagger
 * /api/teacher/students:
 *   get:
 *     summary: Get teacher's students (Teacher or Master Admin only)
 *     tags: [Teacher]
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
teacherAdminRouter.get('/students', protect(), requireTeacher, getTeacherStudents);

/**
 * @swagger
 * /api/teacher/earnings:
 *   get:
 *     summary: Get teacher earnings (Teacher or Master Admin only)
 *     tags: [Teacher]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Earnings data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 earnings:
 *                   type: object
 */
teacherAdminRouter.get('/earnings', protect(), requireTeacher, getTeacherEarnings);

export default teacherAdminRouter;
