import mongoose from "mongoose";

const PurchaseSchema = new mongoose.Schema({
    courseId: {type: mongoose.Schema.Types.ObjectId,ref: 'Course',required: true},
    userId: {type: String,ref: 'User',required: true, index: true},
    amount: {type: Number,required: true},
    status: {type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending', index: true},
    paymentMethod: {type: String, enum: ['stripe', 'pix', 'credit_card'], default: 'stripe'},
    // Stripe fields
    stripePaymentIntentId: {type: String, index: true},
    stripeCustomerId: {type: String},
    // Pix fields
    pixPaymentId: {type: String, index: true},
    pixQrCode: {type: String},
    pixCopyPaste: {type: String},
    pixQrCodeBase64: {type: String},
    // Payment dates
    paidAt: {type: Date},
    refundedAt: {type: Date},
},{timestamps: true});

export const Purchase = mongoose.model('Purchase', PurchaseSchema);