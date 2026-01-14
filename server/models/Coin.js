/**
 * Virtual Currency Model
 * Top 1% Enhancement: So Fluent Coins system
 * Manus-compliant schema
 */

import mongoose from "mongoose";

const coinTransactionSchema = new mongoose.Schema({
    userId: { 
        type: String, 
        ref: 'User', 
        required: true 
    },
    
    // Transaction type
    type: {
        type: String,
        enum: ['earned', 'spent', 'bonus', 'reward'],
        required: true
    },
    
    // Amount (positive for earned, negative for spent)
    amount: { type: Number, required: true },
    
    // Reason
    reason: { type: String },
    source: {
        type: String,
        enum: ['lesson', 'mission', 'challenge', 'streak', 'achievement', 'purchase', 'daily_login', 'referral'],
        required: true
    },
    
    // Related entities
    relatedId: { type: String }, // ID of lesson, mission, etc.
    relatedType: { type: String }, // 'lesson', 'mission', etc.
    
    // Balance after transaction
    balance: { type: Number, required: true },
    
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Index for efficient queries
coinTransactionSchema.index({ userId: 1, createdAt: -1 });

const CoinTransaction = mongoose.model('CoinTransaction', coinTransactionSchema);

export default CoinTransaction;
