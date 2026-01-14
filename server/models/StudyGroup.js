/**
 * Study Group Model
 * Top 1% Enhancement: Study groups and communities
 * Manus-compliant schema
 */

import mongoose from "mongoose";

const studyGroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    
    // Creator
    creatorId: { 
        type: String, 
        ref: 'User', 
        required: true 
    },
    
    // Members
    members: [{ 
        type: String, 
        ref: 'User' 
    }],
    
    // Settings
    isPublic: { type: Boolean, default: true },
    maxMembers: { type: Number, default: 50 },
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'all'],
        default: 'all'
    },
    
    // Group challenges
    activeChallenge: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mission'
    },
    
    // Stats
    stats: {
        totalXP: { type: Number, default: 0 },
        completedChallenges: { type: Number, default: 0 },
        studySessions: { type: Number, default: 0 }
    },
    
    // Tags
    tags: [String],
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const StudyGroup = mongoose.model('StudyGroup', studyGroupSchema);

export default StudyGroup;
