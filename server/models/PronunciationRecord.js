/**
 * Pronunciation Record Model
 * AI Pronunciation Coach - Real-time feedback
 * Manus-compliant schema
 */

import mongoose from "mongoose";

const pronunciationRecordSchema = new mongoose.Schema({
    userId: { 
        type: String, 
        ref: 'User', 
        required: true 
    },
    
    phrase: { type: String, required: true },
    audioUrl: { type: String, required: true },
    
    // AI Analysis
    accuracy: { type: Number, default: 0 }, // 0-100
    fluency: { type: Number, default: 0 }, // 0-100
    phonemes: [{
        phoneme: String,
        accuracy: Number,
        expected: String,
        actual: String
    }],
    
    // Feedback
    feedback: {
        strengths: [String],
        improvements: [String],
        practiceWords: [String]
    },
    
    attempts: { type: Number, default: 1 },
    bestScore: { type: Number, default: 0 },
    
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const PronunciationRecord = mongoose.model('PronunciationRecord', pronunciationRecordSchema);

export default PronunciationRecord;
