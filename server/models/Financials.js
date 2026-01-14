/**
 * Financials Model
 * 3-Tier Platform: Financial tracking for Master Admin
 * Manus-compliant schema
 */

import mongoose from "mongoose";

const financialsSchema = new mongoose.Schema({
    month: { type: String, required: true, unique: true }, // "2026-01"
    
    // Revenue breakdown
    revenue: {
        total: { type: Number, default: 0 },
        byTier: {
            academy: { type: Number, default: 0 },
            vip: { type: Number, default: 0 },
            corporate: { type: Number, default: 0 }
        },
        byTeacher: [{
            teacherId: { type: String, ref: 'User' },
            amount: { type: Number, default: 0 }
        }]
    },
    
    // Expense breakdown
    expenses: {
        total: { type: Number, default: 0 },
        breakdown: {
            teacherCommissions: { type: Number, default: 0 },
            aiCosts: { type: Number, default: 0 },
            infrastructure: { type: Number, default: 0 },
            marketing: { type: Number, default: 0 },
            other: { type: Number, default: 0 }
        }
    },
    
    // Profit
    profit: {
        gross: { type: Number, default: 0 },
        net: { type: Number, default: 0 },
        margin: { type: Number, default: 0 } // Percentage
    },
    
    // Student metrics
    students: {
        new: { type: Number, default: 0 },
        churned: { type: Number, default: 0 },
        active: { type: Number, default: 0 },
        total: { type: Number, default: 0 }
    },
    
    // Key metrics
    mrr: { type: Number, default: 0 }, // Monthly Recurring Revenue
    arr: { type: Number, default: 0 }, // Annual Recurring Revenue
    ltv: { type: Number, default: 0 }, // Lifetime Value
    cac: { type: Number, default: 0 }, // Customer Acquisition Cost
    
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Financials = mongoose.model('Financials', financialsSchema);

export default Financials;
