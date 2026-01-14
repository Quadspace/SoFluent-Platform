/**
 * Conversation Model
 * AI Conversation Partner - 24/7 practice sessions
 * Manus-compliant schema
 */

import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    userId: { 
        type: String, 
        ref: 'User', 
        required: true 
    },
    
    messages: [{
        role: {
            type: String,
            enum: ['user', 'assistant'],
            required: true
        },
        content: String,
        audioUrl: String, // For voice messages
        timestamp: { type: Date, default: Date.now }
    }],
    
    topic: String,
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'intermediate'
    },
    
    // Feedback
    feedback: {
        fluency: Number, // 1-10
        accuracy: Number, // 1-10
        suggestions: [String]
    },
    
    duration: { type: Number, default: 0 }, // seconds
    completed: { type: Boolean, default: false },
    
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
