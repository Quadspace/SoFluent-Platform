/**
 * Referral Model
 * System 1: Referral Program Tracking
 * Manus-compliant schema
 */

import mongoose from "mongoose";

const referralSchema = new mongoose.Schema({
    referrerId: { 
        type: String, 
        ref: 'User', 
        required: true 
    },
    refereeId: { 
        type: String, 
        ref: 'User' 
    }, // May be null if not yet signed up
    
    // Referral code
    referralCode: { 
        type: String, 
        required: true, 
        unique: true 
    },
    
    // Status
    status: {
        type: String,
        enum: ['pending', 'signed_up', 'trial_started', 'converted', 'completed_3_months', 'rewarded'],
        default: 'pending'
    },
    
    // Rewards
    rewards: {
        creditEarned: { type: Number, default: 0 }, // R$50 credit
        freeMonthsEarned: { type: Number, default: 0 },
        lifetimeVip: { type: Boolean, default: false }
    },
    
    // Dates
    signedUpAt: { type: Date },
    convertedAt: { type: Date },
    completed3MonthsAt: { type: Date },
    rewardedAt: { type: Date },
    
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexes
referralSchema.index({ referrerId: 1, status: 1 });
referralSchema.index({ referralCode: 1 });

const Referral = mongoose.model('Referral', referralSchema);

export default Referral;
