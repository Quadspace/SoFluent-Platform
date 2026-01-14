/**
 * Marketplace Listing Model
 * System 5: Community Marketplace
 * Manus-compliant schema
 */

import mongoose from "mongoose";

const marketplaceListingSchema = new mongoose.Schema({
    userId: { 
        type: String, 
        ref: 'User', 
        required: true 
    },
    
    // Listing type
    type: {
        type: String,
        enum: ['student_service', 'teacher_course', 'freelance_service', 'job'],
        required: true
    },
    
    // Service details
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String }, // e.g., "conversation_practice", "tutoring", "translation"
    
    // Pricing
    pricing: {
        type: {
            type: String,
            enum: ['fixed', 'hourly', 'per_word', 'monthly'],
            required: true
        },
        amount: { type: Number, required: true },
        currency: { type: String, default: 'BRL' }
    },
    
    // For courses
    courseDetails: {
        lessons: { type: Number },
        duration: { type: String }, // e.g., "4 hours"
        level: { type: String }
    },
    
    // For jobs
    jobDetails: {
        company: { type: String },
        location: { type: String },
        salary: { type: String },
        requirements: { type: String }
    },
    
    // Status
    status: {
        type: String,
        enum: ['draft', 'active', 'paused', 'sold_out', 'expired'],
        default: 'draft'
    },
    
    // Stats
    stats: {
        views: { type: Number, default: 0 },
        bookings: { type: Number, default: 0 },
        reviews: { type: Number, default: 0 },
        rating: { type: Number, default: 0 }
    },
    
    // Images/media
    images: [{ type: String }],
    videoUrl: { type: String },
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexes
marketplaceListingSchema.index({ userId: 1, status: 1 });
marketplaceListingSchema.index({ type: 1, status: 1 });
marketplaceListingSchema.index({ category: 1 });

const MarketplaceListing = mongoose.model('MarketplaceListing', marketplaceListingSchema);

export default MarketplaceListing;
