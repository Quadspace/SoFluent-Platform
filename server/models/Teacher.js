/**
 * Teacher Model
 * 3-Tier Platform: Teacher management
 * Manus-compliant schema
 */

import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
    userId: { 
        type: String, 
        ref: 'User', 
        required: true, 
        unique: true 
    },
    
    // Assigned students and cohorts
    assignedStudents: [{ 
        type: String, 
        ref: 'User' 
    }],
    assignedCohorts: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Cohort' 
    }],
    
    // Permissions
    permissions: {
        canCreateCohorts: { type: Boolean, default: false },
        canEditContent: { type: Boolean, default: true },
        canViewFinancials: { type: Boolean, default: false } // Limited to their earnings only
    },
    
    // Earnings
    earnings: {
        totalEarned: { type: Number, default: 0 },
        monthlyEarnings: [{
            month: { type: String }, // "2026-01"
            amount: { type: Number, default: 0 }
        }],
        commissionRate: { type: Number, default: 0.30 } // 30% default
    },
    
    // Schedule
    schedule: [{
        day: { type: String },
        startTime: { type: String },
        endTime: { type: String },
        cohortId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cohort' }
    }],
    
    // Performance metrics
    performance: {
        totalStudents: { type: Number, default: 0 },
        activeStudents: { type: Number, default: 0 },
        averageRating: { type: Number, default: 0 },
        totalClasses: { type: Number, default: 0 }
    },
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Teacher = mongoose.model('Teacher', teacherSchema);

export default Teacher;
