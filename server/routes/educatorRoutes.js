import express from 'express'

import { addCourse, educatorDashboardData, getEducatorCourses, getEnrolledStudentsData, updateRoleToEducator, getStudentProfile, getPayments, getAnalytics } from '../controllers/educatorController.js'
import { protectEducator } from '../middlewares/authMiddleware.js';
import upload from '../configs/multer.js';

const educatorRouter = express.Router()

/**
 * @swagger
 * /api/educator/update-role:
 *   get:
 *     summary: Update user role to educator
 *     tags: [Educators]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
educatorRouter.get('/update-role', updateRoleToEducator);

/**
 * @swagger
 * /api/educator/add-course:
 *   post:
 *     summary: Add a new course
 *     tags: [Educators]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - courseTitle
 *               - courseDescription
 *               - coursePrice
 *               - image
 *             properties:
 *               courseTitle:
 *                 type: string
 *               courseDescription:
 *                 type: string
 *               coursePrice:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Course created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
educatorRouter.post('/add-course', upload.single('image'), protectEducator, addCourse);

/**
 * @swagger
 * /api/educator/courses:
 *   get:
 *     summary: Get educator's courses
 *     tags: [Educators]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of educator's courses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 courses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Course'
 */
educatorRouter.get('/courses', protectEducator, getEducatorCourses);

/**
 * @swagger
 * /api/educator/dashboard:
 *   get:
 *     summary: Get educator dashboard data
 *     tags: [Educators]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 */
educatorRouter.get('/dashboard', protectEducator, educatorDashboardData);

/**
 * @swagger
 * /api/educator/enrolled-students:
 *   get:
 *     summary: Get enrolled students for educator's courses
 *     tags: [Educators]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of enrolled students
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
educatorRouter.get('/enrolled-students', protectEducator, getEnrolledStudentsData);

/**
 * @swagger
 * /api/educator/students/{id}:
 *   get:
 *     summary: Get student profile
 *     tags: [Educators]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Student profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 student:
 *                   $ref: '#/components/schemas/User'
 */
educatorRouter.get('/students/:id', protectEducator, getStudentProfile);

/**
 * @swagger
 * /api/educator/payments:
 *   get:
 *     summary: Get payment history
 *     tags: [Educators]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 payments:
 *                   type: array
 */
educatorRouter.get('/payments', protectEducator, getPayments);

/**
 * @swagger
 * /api/educator/analytics:
 *   get:
 *     summary: Get course analytics
 *     tags: [Educators]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 analytics:
 *                   type: object
 */
educatorRouter.get('/analytics', protectEducator, getAnalytics);


export default educatorRouter;