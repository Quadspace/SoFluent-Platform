import Product from '../models/Product.js';
import dbAdapter from '../configs/database-adapter.js';
import storageAdapter from '../configs/storage-adapter.js';
import googleClassroom from '../configs/google-classroom.js';
import loomService from '../configs/loom-integration.js';

/**
 * Product Controller
 * 
 * Manages all So Fluent products:
 * - Academy subscriptions
 * - VIP plans
 * - Challenges
 * - Courses
 * - Workshops
 * - Kids' Corner products
 */

// Get all products (with filters)
export const getAllProducts = async (req, res) => {
    try {
        const {
            productType,
            category,
            level,
            isPublished,
            isFeatured,
            search,
            limit = 20,
            skip = 0
        } = req.query;

        // Build filter
        const filter = {};
        if (productType) filter.productType = productType;
        if (category) filter.category = category;
        if (level) filter.level = level;
        if (isPublished !== undefined) filter.isPublished = isPublished === 'true';
        if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        // Use adapter for database queries
        const products = await Product.find(filter)
            .select('-courseContent -enrolledStudents')
            .populate('instructor', 'name imageUrl')
            .limit(parseInt(limit))
            .skip(parseInt(skip))
            .sort({ createdAt: -1 });

        const total = await Product.countDocuments(filter);

        res.json({
            success: true,
            products,
            total,
            limit: parseInt(limit),
            skip: parseInt(skip)
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get product by ID or slug
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Try to find by slug first, then by ID
        let product = await Product.findOne({ slug: id })
            .populate('instructor', 'name imageUrl email')
            .populate('enrolledStudents', 'name imageUrl');

        if (!product) {
            product = await Product.findById(id)
                .populate('instructor', 'name imageUrl email')
                .populate('enrolledStudents', 'name imageUrl');
        }

        if (!product) {
            return res.json({ success: false, message: 'Product not found' });
        }

        res.json({ success: true, product });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Create new product
export const createProduct = async (req, res) => {
    try {
        const instructorId = req.auth.userId;
        const productData = req.body;

        // Validate Loom videos if provided
        if (productData.loomVideos && Array.isArray(productData.loomVideos)) {
            for (const video of productData.loomVideos) {
                if (video.videoId && !loomService.isValidLoomUrl(video.videoId)) {
                    return res.json({
                        success: false,
                        message: `Invalid Loom video URL: ${video.videoId}`
                    });
                }
            }
        }

        // Set instructor
        productData.instructor = instructorId;

        // Generate slug if not provided
        if (!productData.slug) {
            productData.slug = productData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }

        // Handle thumbnail upload if provided
        if (req.file) {
            const uploadResult = await storageAdapter.upload(req.file, 'products');
            productData.thumbnail = uploadResult.url;
        }

        // Create product
        const product = await Product.create(productData);

        res.json({ success: true, product, message: 'Product created successfully' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Update product
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const instructorId = req.auth.userId;
        const updateData = req.body;

        // Check if product exists and user is instructor
        const product = await Product.findById(id);
        if (!product) {
            return res.json({ success: false, message: 'Product not found' });
        }

        if (product.instructor.toString() !== instructorId) {
            return res.json({ success: false, message: 'Unauthorized' });
        }

        // Validate Loom videos if provided
        if (updateData.loomVideos && Array.isArray(updateData.loomVideos)) {
            for (const video of updateData.loomVideos) {
                if (video.videoId && !loomService.isValidLoomUrl(video.videoId)) {
                    return res.json({
                        success: false,
                        message: `Invalid Loom video URL: ${video.videoId}`
                    });
                }
            }
        }

        // Handle thumbnail upload if provided
        if (req.file) {
            const uploadResult = await storageAdapter.upload(req.file, 'products');
            updateData.thumbnail = uploadResult.url;
        }

        // Update product
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { ...updateData, updatedAt: new Date() },
            { new: true }
        );

        res.json({ success: true, product: updatedProduct, message: 'Product updated successfully' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Sync with Google Classroom
export const syncGoogleClassroom = async (req, res) => {
    try {
        const { id } = req.params;
        const { googleClassroomId } = req.body;

        const product = await Product.findById(id);
        if (!product) {
            return res.json({ success: false, message: 'Product not found' });
        }

        // Get course data from Google Classroom
        const classroomResult = await googleClassroom.getCourse(googleClassroomId);
        if (!classroomResult.success) {
            return res.json({ success: false, message: classroomResult.error });
        }

        // Get enrolled students
        const studentsResult = await googleClassroom.getEnrolledStudents(googleClassroomId);
        
        // Update product with Classroom data
        product.googleClassroomId = googleClassroomId;
        product.googleClassroomLink = classroomResult.course.alternateLink;
        product.syncWithClassroom = true;

        await product.save();

        res.json({
            success: true,
            product,
            classroomData: {
                course: classroomResult.course,
                students: studentsResult.students || []
            },
            message: 'Synced with Google Classroom successfully'
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Enroll user in product
export const enrollInProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.auth.userId;

        const product = await Product.findById(id);
        if (!product) {
            return res.json({ success: false, message: 'Product not found' });
        }

        // Check if already enrolled
        if (product.enrolledStudents.includes(userId)) {
            return res.json({ success: false, message: 'Already enrolled' });
        }

        // Check max enrollments
        if (product.maxEnrollments && product.enrolledStudents.length >= product.maxEnrollments) {
            return res.json({ success: false, message: 'Product is full' });
        }

        // Add to enrolled students
        product.enrolledStudents.push(userId);
        await product.save();

        // Sync with Google Classroom if enabled
        if (product.syncWithClassroom && product.googleClassroomId) {
            // Get user email from database
            const user = await dbAdapter.users.findById(userId);
            if (user && user.email) {
                await googleClassroom.syncEnrollment(product.googleClassroomId, user.email);
            }
        }

        res.json({ success: true, message: 'Enrolled successfully', product });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get user's enrolled products
export const getUserProducts = async (req, res) => {
    try {
        const userId = req.auth.userId;

        const products = await Product.find({ enrolledStudents: userId })
            .select('-courseContent')
            .populate('instructor', 'name imageUrl')
            .sort({ createdAt: -1 });

        res.json({ success: true, products });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
