/**
 * Student Routes
 * All student-facing API endpoints
 */

import express from "express";
import {
    getStudentDashboard,
    getStudentProgress,
    getStudentLearningPath,
    getStudentRecommendations,
    getStudentAchievements,
    logStudentActivity
} from "../controllers/studentController.js";
import { saveOnboarding } from "../controllers/onboardingController.js";

const studentRouter = express.Router();

/**
 * @swagger
 * /api/student/dashboard:
 *   get:
 *     summary: Get student dashboard data
 *     tags: [Students]
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
studentRouter.get('/dashboard', getStudentDashboard);

/**
 * @swagger
 * /api/student/progress:
 *   get:
 *     summary: Get student learning progress
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Progress data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 progress:
 *                   type: object
 */
studentRouter.get('/progress', getStudentProgress);

/**
 * @swagger
 * /api/student/learning-path:
 *   get:
 *     summary: Get personalized learning path
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Learning path recommendations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 learningPath:
 *                   type: array
 */
studentRouter.get('/learning-path', getStudentLearningPath);

/**
 * @swagger
 * /api/student/recommendations:
 *   get:
 *     summary: Get course recommendations
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recommended courses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 recommendations:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Course'
 */
studentRouter.get('/recommendations', getStudentRecommendations);

/**
 * @swagger
 * /api/student/achievements:
 *   get:
 *     summary: Get student achievements
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Student achievements
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 achievements:
 *                   type: array
 */
studentRouter.get('/achievements', getStudentAchievements);

/**
 * @swagger
 * /api/student/activity:
 *   post:
 *     summary: Log student activity
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - activityType
 *             properties:
 *               activityType:
 *                 type: string
 *               metadata:
 *                 type: object
 *     responses:
 *       200:
 *         description: Activity logged
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
studentRouter.post('/activity', logStudentActivity);

/**
 * @swagger
 * /api/student/onboarding:
 *   post:
 *     summary: Save onboarding data
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               goals:
 *                 type: array
 *               level:
 *                 type: string
 *     responses:
 *       200:
 *         description: Onboarding saved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
// Onboarding
studentRouter.post('/onboarding', saveOnboarding);

export default studentRouter;
