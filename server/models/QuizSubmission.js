/**
 * Quiz Submission Model
 * System 1: Track quiz completions and results
 * Manus-compliant schema
 */

import mongoose from "mongoose";

const quizSubmissionSchema = new mongoose.Schema({
    quizId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Quiz', 
        required: true 
    },
    
    // User info (may be anonymous before email capture)
    email: { type: String },
    name: { type: String },
    userId: { type: String, ref: 'User' }, // If logged in
    
    // Answers
    answers: [{
        questionId: { type: String, required: true },
        answer: { type: mongoose.Schema.Types.Mixed }, // Can be string, number, or audio URL
        points: { type: Number, default: 0 }
    }],
    
    // Results
    totalScore: { type: Number, default: 0 },
    level: { type: String }, // e.g., "Intermediate"
    recommendation: { type: String }, // Recommended program
    
    // Conversion
    converted: { type: Boolean, default: false },
    convertedTo: { type: String }, // 'trial', 'academy', 'vip'
    convertedAt: { type: Date },
    
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexes
quizSubmissionSchema.index({ quizId: 1, createdAt: -1 });
quizSubmissionSchema.index({ email: 1 });

const QuizSubmission = mongoose.model('QuizSubmission', quizSubmissionSchema);

export default QuizSubmission;
