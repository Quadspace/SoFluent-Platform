/**
 * Earning Model
 * Tracks R$ (real money) earnings for Learn-to-Earn system
 * Manus-compliant schema
 */

import mongoose from "mongoose";

const earningSchema = new mongoose.Schema({
    userId: { 
        type: String, 
        ref: 'User', 
        required: true,
        index: true
    },
    
    // Amount earned (in Brazilian Reais)
    amount: { 
        type: Number, 
        required: true,
        min: 0
    },
    
    // Source of earning
    source: {
        type: String,
        enum: ['referral', 'content_creation', 'mission', 'streak', 'achievement', 'daily_login', 'challenge'],
        required: true
    },
    
    // Related entities
    relatedId: { type: String }, // ID of related entity (referral, post, mission, etc.)
    relatedType: { type: String }, // Type: 'user', 'post', 'mission', 'achievement', etc.
    
    // Status tracking
    status: {
        type: String,
        enum: ['pending', 'approved', 'paid'],
        default: 'pending'
    },
    
    // Tier tracking (for cap enforcement)
    tierAtTime: {
        type: String,
        enum: ['free', 'academy', 'vip'],
        required: true
    },
    
    // Monthly period tracking (format: "2026-01")
    monthlyPeriod: {
        type: String,
        required: true,
        index: true
    },
    
    // Approval tracking
    approvedBy: { type: String, ref: 'User' }, // Admin who approved
    approvedAt: { type: Date },
    
    // Payment tracking
    paidAt: { type: Date },
    withdrawalId: { type: String, ref: 'Withdrawal' }, // If paid via withdrawal
    
    // Metadata
    description: { type: String }, // Human-readable description
    metadata: { type: mongoose.Schema.Types.Mixed }, // Additional data
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Compound indexes for efficient queries
earningSchema.index({ userId: 1, monthlyPeriod: 1 });
earningSchema.index({ userId: 1, status: 1 });
earningSchema.index({ status: 1, createdAt: -1 }); // For admin pending earnings query
earningSchema.index({ source: 1, createdAt: -1 }); // For analytics

// Virtual for total monthly earnings (calculated)
earningSchema.virtual('isApproved').get(function() {
    return this.status === 'approved' || this.status === 'paid';
});

const Earning = mongoose.model('Earning', earningSchema);

export default Earning;
