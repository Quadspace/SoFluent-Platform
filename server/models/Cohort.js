/**
 * Cohort Model
 * 3-Tier Platform: Cohort management for Master Admin
 * Manus-compliant schema
 */

import mongoose from "mongoose";

const cohortSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., "Fluency Fit Academy - January 2026"
    description: { type: String },
    
    // Teacher assignment
    teacherId: { 
        type: String, 
        ref: 'User', 
        required: true 
    },
    
    // Students enrolled
    students: [{ 
        type: String, 
        ref: 'User' 
    }],
    
    // Schedule
    schedule: {
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        classTimes: [{
            day: { type: String, required: true }, // 'Monday', 'Wednesday', etc.
            startTime: { type: String, required: true }, // '18:00'
            endTime: { type: String, required: true }, // '19:00'
            zoomLink: { type: String }
        }]
    },
    
    // Capacity
    capacity: {
        max: { type: Number, required: true, default: 50 },
        current: { type: Number, default: 0 }
    },
    
    // Status
    status: {
        type: String,
        enum: ['draft', 'active', 'completed', 'archived'],
        default: 'draft'
    },
    
    // Pricing
    pricing: {
        tier: {
            type: String,
            enum: ['academy', 'vip', 'corporate'],
            required: true
        },
        amount: { type: Number, required: true }
    },
    
    // Drag-and-drop positioning
    position: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 }
    },
    
    // Visual differentiation
    color: { type: String, default: '#E91E63' },
    
    // Google Classroom integration
    googleClassroomId: { type: String },
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Cohort = mongoose.model('Cohort', cohortSchema);

export default Cohort;
