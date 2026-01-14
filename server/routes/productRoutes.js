import express from 'express';
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    syncGoogleClassroom,
    enrollInProduct,
    getUserProducts
} from '../controllers/productController.js';
import { protectEducator } from '../middlewares/authMiddleware.js';
import upload from '../configs/multer.js';

const productRouter = express.Router();

/**
 * @swagger
 * /api/products/all:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 products:
 *                   type: array
 */
productRouter.get('/all', getAllProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 product:
 *                   type: object
 */
productRouter.get('/:id', getProductById);

/**
 * @swagger
 * /api/products/user/enrolled:
 *   get:
 *     summary: Get user's enrolled products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's enrolled products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 products:
 *                   type: array
 */
// Protected routes (require authentication)
productRouter.get('/user/enrolled', getUserProducts);

/**
 * @swagger
 * /api/products/{id}/enroll:
 *   post:
 *     summary: Enroll in a product
 *     tags: [Products]
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
 *         description: Enrollment successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
productRouter.post('/:id/enroll', enrollInProduct);

/**
 * @swagger
 * /api/products/create:
 *   post:
 *     summary: Create a new product (Educator only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
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
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Product created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
// Educator routes (require educator role)
productRouter.post('/create', upload.single('thumbnail'), protectEducator, createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product (Educator only)
 *     tags: [Products]
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Product updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
productRouter.put('/:id', upload.single('thumbnail'), protectEducator, updateProduct);

/**
 * @swagger
 * /api/products/{id}/sync-classroom:
 *   post:
 *     summary: Sync with Google Classroom (Educator only)
 *     tags: [Products]
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
 *         description: Sync completed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
productRouter.post('/:id/sync-classroom', protectEducator, syncGoogleClassroom);

export default productRouter;
