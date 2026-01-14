/**
 * Skill Model
 * Top 1% Enhancement: Skill trees for visual progression
 * Manus-compliant schema
 */

import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    category: {
        type: String,
        enum: ['grammar', 'vocabulary', 'pronunciation', 'conversation', 'writing', 'reading', 'listening'],
        required: true
    },
    
    // Skill tree position
    position: {
        x: { type: Number, required: true },
        y: { type: Number, required: true },
        tier: { type: Number, default: 1 } // 1 = beginner, 2 = intermediate, 3 = advanced
    },
    
    // Prerequisites
    prerequisites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill'
    }],
    
    // Requirements to unlock
    unlockRequirements: {
        xpRequired: { type: Number, default: 0 },
        lessonsCompleted: { type: Number, default: 0 },
        missionsCompleted: { type: Number, default: 0 },
        skillsRequired: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Skill'
        }]
    },
    
    // Rewards
    rewards: {
        xp: { type: Number, default: 0 },
        coins: { type: Number, default: 0 },
        badge: { type: String }
    },
    
    // Content
    lessons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson'
    }],
    
    // Icon/Image
    icon: { type: String },
    color: { type: String, default: '#E91E63' },
    
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Skill = mongoose.model('Skill', skillSchema);

export default Skill;
