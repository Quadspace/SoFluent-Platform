/**
 * User Skill Progress Model
 * Top 1% Enhancement: Track user's skill tree progress
 * Manus-compliant schema
 */

import mongoose from "mongoose";

const userSkillSchema = new mongoose.Schema({
    userId: { 
        type: String, 
        ref: 'User', 
        required: true 
    },
    skillId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Skill', 
        required: true 
    },
    
    // Progress
    status: {
        type: String,
        enum: ['locked', 'unlocked', 'in-progress', 'completed'],
        default: 'locked'
    },
    
    // Progress tracking
    progress: { type: Number, default: 0 }, // 0-100
    lessonsCompleted: { type: Number, default: 0 },
    totalLessons: { type: Number, default: 0 },
    
    // Dates
    unlockedAt: { type: Date },
    completedAt: { type: Date },
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Compound index for efficient queries
userSkillSchema.index({ userId: 1, skillId: 1 }, { unique: true });

const UserSkill = mongoose.model('UserSkill', userSkillSchema);

export default UserSkill;
