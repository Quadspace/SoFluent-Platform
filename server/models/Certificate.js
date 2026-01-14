/**
 * Certificate Model
 * System 4: Certification & Credentialing
 * Manus-compliant schema
 */

import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
    certificateId: { 
        type: String, 
        required: true, 
        unique: true 
    }, // e.g., "SF-FFA-2026-0001"
    
    userId: { 
        type: String, 
        ref: 'User', 
        required: true 
    },
    
    // Program
    program: {
        type: String,
        enum: ['fluency_fit_academy', 'business_english_professional', 'english_teaching_certification'],
        required: true
    },
    programName: { type: String, required: true }, // Display name
    
    // Requirements met
    requirements: {
        weeksCompleted: { type: Number },
        classesAttended: { type: Number },
        attendanceRate: { type: Number },
        lessonsCompleted: { type: Number },
        missionsCompleted: { type: Number },
        assessmentScore: { type: Number },
        finalProjectSubmitted: { type: Boolean }
    },
    
    // Level achieved
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        required: true
    },
    levelName: { type: String }, // e.g., "Intermediate (B1)"
    
    // Additional scores
    toeicScore: { type: Number }, // For Business English Professional
    specialization: { type: String }, // For Teaching Certification
    
    // Issuance
    issuedBy: { type: String, default: 'Heloisa Lott, Founder' },
    issuedAt: { type: Date, default: Date.now },
    
    // Verification
    verificationUrl: { type: String }, // e.g., "/verify/SF-FFA-2026-0001"
    isVerified: { type: Boolean, default: true },
    
    // LinkedIn integration
    linkedInAdded: { type: Boolean, default: false },
    linkedInAddedAt: { type: Date },
    
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexes
certificateSchema.index({ certificateId: 1 });
certificateSchema.index({ userId: 1 });
certificateSchema.index({ program: 1 });

const Certificate = mongoose.model('Certificate', certificateSchema);

export default Certificate;
