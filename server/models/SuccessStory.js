/**
 * Success Story Model
 * Success Story Generator - Shareable journey videos
 * Manus-compliant schema
 */

import mongoose from "mongoose";

const successStorySchema = new mongoose.Schema({
    userId: { 
        type: String, 
        ref: 'User', 
        required: true 
    },
    
    // Stats
    stats: {
        daysActive: Number,
        hoursStudied: Number,
        coursesCompleted: Number,
        vocabularyLearned: Number,
        streak: Number,
        levelProgress: Number
    },
    
    // Generated Content
    videoUrl: String,
    thumbnailUrl: String,
    shareText: String,
    
    // Customization
    template: {
        type: String,
        enum: ['motivational', 'achievement', 'journey', 'transformation'],
        default: 'journey'
    },
    music: String, // Music track name
    
    // Sharing
    shared: { type: Boolean, default: false },
    shareCount: { type: Number, default: 0 },
    platforms: [String], // ['instagram', 'linkedin', 'twitter']
    
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const SuccessStory = mongoose.model('SuccessStory', successStorySchema);

export default SuccessStory;
