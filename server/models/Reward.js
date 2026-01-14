/**
 * Reward Model
 * Top 1% Enhancement: Rewards shop items
 * Manus-compliant schema
 */

import mongoose from "mongoose";

const rewardSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    
    // Cost
    coinCost: { type: Number, required: true },
    
    // Reward type
    type: {
        type: String,
        enum: ['badge', 'theme', 'avatar', 'course_access', 'premium_feature', 'discount', 'physical'],
        required: true
    },
    
    // Reward value
    value: { type: mongoose.Schema.Types.Mixed }, // Can be badge ID, theme name, discount %, etc.
    
    // Availability
    isAvailable: { type: Boolean, default: true },
    stock: { type: Number }, // null = unlimited
    sold: { type: Number, default: 0 },
    
    // Rarity
    rarity: {
        type: String,
        enum: ['common', 'rare', 'epic', 'legendary'],
        default: 'common'
    },
    
    // Image/Icon
    imageUrl: { type: String },
    icon: { type: String },
    
    // Category
    category: {
        type: String,
        enum: ['cosmetics', 'features', 'courses', 'discounts', 'physical'],
        required: true
    },
    
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Reward = mongoose.model('Reward', rewardSchema);

export default Reward;
