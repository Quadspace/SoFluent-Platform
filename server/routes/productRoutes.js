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

// Public routes
productRouter.get('/all', getAllProducts);
productRouter.get('/:id', getProductById);

// Protected routes (require authentication)
productRouter.get('/user/enrolled', getUserProducts);
productRouter.post('/:id/enroll', enrollInProduct);

// Educator routes (require educator role)
productRouter.post('/create', upload.single('thumbnail'), protectEducator, createProduct);
productRouter.put('/:id', upload.single('thumbnail'), protectEducator, updateProduct);
productRouter.post('/:id/sync-classroom', protectEducator, syncGoogleClassroom);

export default productRouter;
