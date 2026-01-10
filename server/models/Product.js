import mongoose from "mongoose";

/**
 * Product Schema
 * 
 * Unified product model for all So Fluent offerings:
 * - Fluency Fit Academy subscriptions
 * - VIP Plans
 * - Challenges
 * - Individual Courses
 * - Workshops
 * - Kids' Corner products
 */

const productSchema = new mongoose.Schema({
    // Product Identity
    productType: {
        type: String,
        enum: ['academy', 'vip', 'challenge', 'course', 'workshop', 'kids-corner'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
        maxlength: 200
    },
    
    // Pricing
    price: {
        type: Number,
        required: true,
        default: 0
    },
    currency: {
        type: String,
        default: 'BRL'
    },
    isSubscription: {
        type: Boolean,
        default: false
    },
    subscriptionPeriod: {
        type: String,
        enum: ['monthly', 'yearly', null],
        default: null
    },
    discount: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    
    // Google Classroom Integration
    googleClassroomId: {
        type: String,
        sparse: true // Allows null but enforces uniqueness when present
    },
    googleClassroomLink: {
        type: String
    },
    syncWithClassroom: {
        type: Boolean,
        default: false
    },
    
    // Loom Integration
    loomVideos: [{
        videoId: String,
        title: String,
        description: String,
        duration: Number, // in minutes
        order: Number,
        isPreview: Boolean
    }],
    
    // Content
    thumbnail: {
        type: String
    },
    images: [{
        url: String,
        alt: String
    }],
    
    // Course Content (for non-Classroom products)
    courseContent: [{
        chapterId: String,
        chapterOrder: Number,
        chapterTitle: String,
        chapterContent: [{
            lectureId: String,
            lectureTitle: String,
            lectureDuration: Number,
            lectureUrl: String, // Can be Loom, YouTube, or other
            isPreviewFree: Boolean,
            lectureOrder: Number,
            videoType: {
                type: String,
                enum: ['loom', 'youtube', 'vimeo', 'custom'],
                default: 'loom'
            }
        }]
    }],
    
    // Metadata
    tags: [String],
    category: {
        type: String,
        enum: ['fitness', 'language', 'kids', 'business', 'general']
    },
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'all']
    },
    language: {
        type: String,
        default: 'en',
        enum: ['en', 'pt-BR', 'both']
    },
    
    // Features
    features: [{
        title: String,
        description: String,
        icon: String
    }],
    
    // Enrollment
    enrolledStudents: [{
        type: String,
        ref: 'User'
    }],
    maxEnrollments: {
        type: Number,
        default: null // null = unlimited
    },
    
    // Status
    isPublished: {
        type: Boolean,
        default: false
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    
    // Ratings & Reviews
    ratings: [{
        userId: String,
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        review: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    
    // Instructor/Educator
    instructor: {
        type: String,
        ref: 'User',
        required: true
    },
    
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    publishedAt: {
        type: Date
    }
}, {
    timestamps: true,
    minimize: false
});

// Indexes for performance
productSchema.index({ productType: 1, isPublished: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ googleClassroomId: 1 });
productSchema.index({ instructor: 1 });
productSchema.index({ category: 1, level: 1 });

// Virtual for average rating
productSchema.virtual('averageRating').get(function() {
    if (this.ratings.length === 0) return 0;
    const sum = this.ratings.reduce((acc, rating) => acc + rating.rating, 0);
    return Math.round((sum / this.ratings.length) * 10) / 10;
});

// Virtual for enrollment count
productSchema.virtual('enrollmentCount').get(function() {
    return this.enrolledStudents.length;
});

const Product = mongoose.model('Product', productSchema);

export default Product;
