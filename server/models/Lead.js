/**
 * Lead Model
 * System 1: Automated Marketing & Lead Generation
 * Manus-compliant schema
 */

import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
    // Contact info
    email: { type: String, required: true, lowercase: true },
    name: { type: String },
    phone: { type: String },
    
    // Source
    source: {
        type: String,
        enum: ['quiz', 'challenge', 'landing_page', 'webinar', 'referral', 'social', 'other'],
        required: true
    },
    sourceDetails: { type: String }, // e.g., "fluency-fit-landing-page"
    
    // Referral tracking
    referredBy: { type: String, ref: 'User' }, // Clerk ID of referrer
    referralCode: { type: String },
    
    // Lead magnet completion
    leadMagnet: {
        type: String,
        enum: ['fluency_assessment', '7_day_challenge', 'business_survival_kit', 'none']
    },
    leadMagnetCompleted: { type: Boolean, default: false },
    leadMagnetData: { type: mongoose.Schema.Types.Mixed }, // Quiz results, challenge progress, etc.
    
    // Email sequence tracking
    emailSequence: {
        sequenceName: { type: String }, // e.g., "post-quiz-nurture"
        emailsSent: { type: Number, default: 0 },
        lastEmailSent: { type: Date },
        nextEmailScheduled: { type: Date },
        completed: { type: Boolean, default: false }
    },
    
    // Conversion tracking
    status: {
        type: String,
        enum: ['lead', 'trial', 'customer', 'churned', 'unsubscribed'],
        default: 'lead'
    },
    convertedAt: { type: Date },
    convertedTo: { type: String }, // 'academy', 'vip', 'corporate'
    
    // Scoring
    leadScore: { type: Number, default: 0 }, // 0-100, based on engagement
    engagementLevel: {
        type: String,
        enum: ['cold', 'warm', 'hot'],
        default: 'cold'
    },
    
    // Tags
    tags: [String], // e.g., ['interested-in-vip', 'business-professional', 'rio-de-janeiro']
    
    // Notes
    notes: { type: String },
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexes for efficient queries
leadSchema.index({ email: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ referredBy: 1 });
leadSchema.index({ leadScore: -1 });

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;
