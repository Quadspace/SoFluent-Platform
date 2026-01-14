/**
 * Withdrawal Model
 * Tracks withdrawal requests for Learn-to-Earn system
 * Manus-compliant schema
 */

import mongoose from "mongoose";

const withdrawalSchema = new mongoose.Schema({
    userId: { 
        type: String, 
        ref: 'User', 
        required: true,
        index: true
    },
    
    // Amount to withdraw (in Brazilian Reais)
    amount: { 
        type: Number, 
        required: true,
        min: 20 // Minimum withdrawal: R$20
    },
    
    // Payment method
    paymentMethod: {
        type: String,
        enum: ['pix', 'bank_transfer'],
        required: true
    },
    
    // Pix payment details
    pixKey: { 
        type: String,
        validate: {
            validator: function(v) {
                // Pix key can be CPF, CNPJ, email, phone, or random key
                if (this.paymentMethod === 'pix') {
                    return !!v;
                }
                return true;
            },
            message: 'Pix key is required for Pix withdrawals'
        }
    },
    pixKeyType: {
        type: String,
        enum: ['cpf', 'cnpj', 'email', 'phone', 'random'],
    },
    
    // Bank transfer details
    bankAccount: {
        bankCode: { type: String }, // Banco do Brasil: 001, Itaú: 341, etc.
        agency: { type: String },
        account: { type: String },
        accountType: { type: String, enum: ['checking', 'savings'] },
        accountHolderName: { type: String },
        cpf: { type: String }, // Account holder CPF
    },
    
    // Status tracking
    status: {
        type: String,
        enum: ['pending', 'approved', 'processing', 'completed', 'rejected'],
        default: 'pending',
        index: true
    },
    
    // Admin processing
    reviewedBy: { type: String, ref: 'User' }, // Admin who reviewed
    reviewedAt: { type: Date },
    approvedBy: { type: String, ref: 'User' }, // Admin who approved
    approvedAt: { type: Date },
    rejectedBy: { type: String, ref: 'User' }, // Admin who rejected
    rejectedAt: { type: Date },
    rejectionReason: { type: String },
    
    // Payment processing
    processedBy: { type: String, ref: 'User' }, // Admin who processed
    processedAt: { type: Date },
    transactionId: { type: String }, // External payment transaction ID
    paymentProvider: { type: String }, // 'stripe', 'asaas', 'mercadopago', etc.
    
    // Admin notes
    adminNotes: { type: String },
    
    // Metadata
    metadata: { type: mongoose.Schema.Types.Mixed },
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexes
withdrawalSchema.index({ userId: 1, createdAt: -1 });
withdrawalSchema.index({ status: 1, createdAt: -1 }); // For admin pending withdrawals query
withdrawalSchema.index({ transactionId: 1 }); // For payment status lookup

// Virtual for status display
withdrawalSchema.virtual('statusDisplay').get(function() {
    const statusMap = {
        pending: 'Pending Review',
        approved: 'Approved',
        processing: 'Processing Payment',
        completed: 'Completed',
        rejected: 'Rejected'
    };
    return statusMap[this.status] || this.status;
});

const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema);

export default Withdrawal;
