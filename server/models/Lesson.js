/**
 * Lesson Model
 * AI Life Mirror - Personalized lessons from Instagram/LinkedIn
 * Manus-compliant schema
 */

import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
    userId: { 
        type: String, 
        ref: 'User', 
        required: true 
    },
    source: { 
        type: String, 
        enum: ['instagram', 'linkedin', 'manual'], 
        required: true 
    },
    
    originalContent: {
        imageUrl: String,
        caption: String,
        jobTitle: String,
        industry: String,
        postId: String // Instagram/LinkedIn post ID
    },
    
    englishContent: {
        title: { type: String, required: true },
        vocabulary: [String],
        phrases: [String],
        exercises: [{
            type: { 
                type: String, 
                enum: ['multiple-choice', 'fill-blank', 'translation', 'speaking'] 
            },
            question: String,
            options: [String],
            correctAnswer: String,
            explanation: String
        }]
    },
    
    completed: { type: Boolean, default: false },
    completedAt: Date,
    progress: { type: Number, default: 0 }, // 0-100
    
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Lesson = mongoose.model('Lesson', lessonSchema);

export default Lesson;
