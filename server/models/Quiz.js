/**
 * Quiz Model
 * System 1: Lead Magnet - Fluency Assessment Quiz
 * Manus-compliant schema
 */

import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., "Fluency Assessment"
    description: { type: String },
    
    // Questions
    questions: [{
        id: { type: String, required: true },
        type: {
            type: String,
            enum: ['multiple_choice', 'voice_recording', 'text', 'matching'],
            required: true
        },
        question: { type: String, required: true },
        options: [String], // For multiple choice
        correctAnswer: { type: String }, // For scoring
        points: { type: Number, default: 1 },
        category: {
            type: String,
            enum: ['vocabulary', 'grammar', 'pronunciation', 'confidence', 'listening', 'reading']
        }
    }],
    
    // Scoring
    scoring: {
        totalPoints: { type: Number },
        levels: [{
            minScore: { type: Number },
            maxScore: { type: Number },
            level: { type: String }, // e.g., "Beginner", "Intermediate", "Advanced"
            description: { type: String },
            recommendation: { type: String } // Recommended program
        }]
    },
    
    // Settings
    isActive: { type: Boolean, default: true },
    requiresEmail: { type: Boolean, default: true },
    showResults: { type: Boolean, default: true },
    
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;
