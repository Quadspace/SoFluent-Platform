/**
 * Leaderboard Model
 * Top 1% Enhancement: Real-time leaderboards
 * Manus-compliant schema
 */

import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema({
    userId: { 
        type: String, 
        ref: 'User', 
        required: true 
    },
    
    // Leaderboard type
    type: {
        type: String,
        enum: ['global', 'cohort', 'friends', 'weekly', 'monthly'],
        required: true
    },
    
    // Metrics
    totalXP: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    completedLessons: { type: Number, default: 0 },
    completedMissions: { type: Number, default: 0 },
    hoursStudied: { type: Number, default: 0 },
    
    // Ranking
    rank: { type: Number },
    previousRank: { type: Number },
    
    // Period
    period: {
        type: String, // "2026-01" for monthly, "2026-W01" for weekly
        required: true
    },
    
    // Cohort/Friends specific
    cohortId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cohort' },
    friendIds: [{ type: String, ref: 'User' }],
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Index for efficient queries
leaderboardSchema.index({ type: 1, period: 1, totalXP: -1 });
leaderboardSchema.index({ userId: 1, type: 1, period: 1 });

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);

export default Leaderboard;
