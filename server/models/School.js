/**
 * School Model
 * System 2: White-Label B2B Platform
 * Manus-compliant schema
 */

import mongoose from "mongoose";

const schoolSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., "Red Balloon"
    
    // Multi-tenant identifiers
    subdomain: { type: String, required: true, unique: true }, // e.g., "redballoon"
    customDomain: { type: String }, // e.g., "redballoon-english.com.br"
    
    // Branding
    branding: {
        logo: { type: String },
        primaryColor: { type: String, default: '#E91E63' },
        secondaryColor: { type: String, default: '#1A1A1A' },
        accentColor: { type: String, default: '#D4AF37' },
        font: { type: String, default: 'Helvetica Neue' }
    },
    
    // Subscription
    subscription: {
        tier: {
            type: String,
            enum: ['starter', 'professional', 'enterprise'],
            required: true
        },
        price: { type: Number, required: true },
        studentsLimit: { type: Number },
        teachersLimit: { type: Number },
        status: {
            type: String,
            enum: ['trial', 'active', 'cancelled', 'suspended'],
            default: 'trial'
        },
        startDate: { type: Date },
        endDate: { type: Date }
    },
    
    // Settings
    settings: {
        features: [{ type: String }], // Which features are enabled
        integrations: [{ type: String }], // Which integrations are active
        customizations: { type: mongoose.Schema.Types.Mixed } // School-specific settings
    },
    
    // Contact
    contact: {
        name: { type: String },
        email: { type: String },
        phone: { type: String }
    },
    
    // Stats
    stats: {
        students: { type: Number, default: 0 },
        teachers: { type: Number, default: 0 },
        retention: { type: Number, default: 0 },
        nps: { type: Number, default: 0 }
    },
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexes
schoolSchema.index({ subdomain: 1 });
schoolSchema.index({ subscription: { status: 1 } });

const School = mongoose.model('School', schoolSchema);

export default School;
