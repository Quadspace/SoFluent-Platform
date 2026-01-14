/**
 * Vocabulary Model
 * Smart Study Buddy - Spaced repetition system
 * Manus-compliant schema
 */

import mongoose from "mongoose";

const vocabularySchema = new mongoose.Schema({
    userId: { 
        type: String, 
        ref: 'User', 
        required: true 
    },
    
    word: { type: String, required: true },
    translation: String,
    definition: String,
    example: String,
    audioUrl: String,
    
    // Spaced Repetition (SM-2 Algorithm)
    easeFactor: { type: Number, default: 2.5 },
    interval: { type: Number, default: 1 }, // days
    repetitions: { type: Number, default: 0 },
    nextReview: { type: Date, default: Date.now },
    
    // Progress
    mastered: { type: Boolean, default: false },
    lastReviewed: Date,
    reviewCount: { type: Number, default: 0 },
    
    // Context
    source: String, // Which lesson/course it came from
    tags: [String],
    
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Vocabulary = mongoose.model('Vocabulary', vocabularySchema);

export default Vocabulary;
