/**
 * Mission Model
 * Real-World Mission System - Daily challenges
 * Manus-compliant schema
 */

import mongoose from "mongoose";

const missionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: {
        type: String,
        enum: ['photo', 'video', 'audio', 'text', 'location'],
        required: true
    },
    
    // Mission details
    instructions: { type: String, required: true },
    exampleProof: String, // URL to example
    xpReward: { type: Number, default: 50 },
    
    // Timing
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isDaily: { type: Boolean, default: true },
    
    // Difficulty
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'intermediate'
    },
    
    // Submissions
    submissions: [{
        user: { type: String, ref: 'User' },
        proof: {
            type: String, // URL to proof (photo/video/audio)
            required: true
        },
        text: String, // Optional text submission
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        },
        reviewedBy: { type: String, ref: 'User' },
        reviewedAt: Date,
        submittedAt: { type: Date, default: Date.now }
    }],
    
    // Stats
    completionCount: { type: Number, default: 0 },
    totalSubmissions: { type: Number, default: 0 },
    
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Mission = mongoose.model('Mission', missionSchema);

export default Mission;
