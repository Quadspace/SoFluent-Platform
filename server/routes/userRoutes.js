import express from "express";
import { addUserRating, getUserCourseProgress, getUserData, purchaseCourse, updateUserCourseProgress, userEnrolledCourses, requestPasswordReset, resetPassword } from "../controllers/userController.js";

const userRouter = express.Router();

/**
 * @swagger
 * /api/user/data:
 *   get:
 *     summary: Get current user data
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   $ref: '#/components/schemas/User'
 */
userRouter.get('/data', getUserData);

/**
 * @swagger
 * /api/user/enrolled-courses:
 *   get:
 *     summary: Get user's enrolled courses
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Enrolled courses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 enrolledCourses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Course'
 */
userRouter.get('/enrolled-courses', userEnrolledCourses);

/**
 * @swagger
 * /api/user/purchase:
 *   post:
 *     summary: Purchase a course
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *             properties:
 *               courseId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Purchase initiated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
userRouter.post('/purchase', purchaseCourse);

/**
 * @swagger
 * /api/user/update-course-progress:
 *   post:
 *     summary: Update course progress
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - progress
 *             properties:
 *               courseId:
 *                 type: string
 *               progress:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *     responses:
 *       200:
 *         description: Progress updated successfully
 */
userRouter.post('/update-course-progress', updateUserCourseProgress);

/**
 * @swagger
 * /api/user/get-course-progress:
 *   post:
 *     summary: Get course progress
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *             properties:
 *               courseId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Course progress retrieved successfully
 */
userRouter.post('/get-course-progress', getUserCourseProgress);

/**
 * @swagger
 * /api/user/add-rating:
 *   post:
 *     summary: Add rating to a course
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - rating
 *             properties:
 *               courseId:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rating added successfully
 */
userRouter.post('/add-rating', addUserRating);

/**
 * @swagger
 * /api/user/password-reset:
 *   post:
 *     summary: Request password reset
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Password reset email sent (if account exists)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
userRouter.post('/password-reset', requestPasswordReset);

/**
 * @swagger
 * /api/user/reset-password:
 *   post:
 *     summary: Reset password with token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
userRouter.post('/reset-password', resetPassword);

export default userRouter;