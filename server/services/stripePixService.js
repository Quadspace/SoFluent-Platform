/**
 * Stripe Pix Service
 * Uses Stripe's native Pix payment support (via EBANX)
 * Much simpler than separate providers!
 */

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class StripePixService {
  /**
   * Create a Pix payment using Stripe
   * @param {Object} paymentData - Payment information
   * @param {number} paymentData.amount - Amount in cents (BRL)
   * @param {string} paymentData.description - Payment description
   * @param {string} paymentData.metadata - Additional metadata (purchaseId, etc.)
   * @returns {Promise<Object>} Pix payment object with QR code
   */
  async createPayment(paymentData) {
    const { amount, description, metadata } = paymentData;

    try {
      // Create PaymentIntent with Pix as payment method
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount, // Amount in cents
        currency: 'brl', // Brazilian Real
        payment_method_types: ['pix'],
        description: description || 'So Fluent Payment',
        metadata: metadata || {}
      });

      // For Pix, we need to confirm the payment intent to get the QR code
      // Stripe Pix requires confirmation before showing QR code
      let confirmedIntent;
      try {
        confirmedIntent = await stripe.paymentIntents.confirm(paymentIntent.id);
      } catch (confirmError) {
        // If confirmation fails, try retrieving the payment intent
        // Some Stripe accounts may have Pix QR code available without confirmation
        confirmedIntent = await stripe.paymentIntents.retrieve(paymentIntent.id);
      }
      
      const pixDetails = confirmedIntent.next_action?.pix_display_qr_code;

      // Stripe Pix QR code format
      const qrCodeData = pixDetails?.qr_code_data;
      const qrCodeImage = pixDetails?.qr_code_image_url || pixDetails?.qr_code;

      return {
        id: confirmedIntent.id,
        status: this.mapStripeStatus(confirmedIntent.status),
        amount: confirmedIntent.amount,
        qrCode: qrCodeData,
        qrCodeBase64: qrCodeImage, // Can be URL or base64 string
        copyPaste: qrCodeData,
        expiresAt: pixDetails?.expires_at ? new Date(pixDetails.expires_at * 1000) : null,
        clientSecret: confirmedIntent.client_secret
      };
    } catch (error) {
      throw new Error(`Failed to create Pix payment: ${error.message}`);
    }
  }

  /**
   * Get payment status
   * @param {string} paymentIntentId - Stripe PaymentIntent ID
   * @returns {Promise<Object>} Payment status
   */
  async getPaymentStatus(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      return {
        id: paymentIntent.id,
        status: this.mapStripeStatus(paymentIntent.status),
        amount: paymentIntent.amount,
        paidAt: paymentIntent.charges?.data[0]?.created 
          ? new Date(paymentIntent.charges.data[0].created * 1000)
          : null
      };
    } catch (error) {
      throw new Error(`Failed to check payment status: ${error.message}`);
    }
  }

  /**
   * Map Stripe status to our status
   */
  mapStripeStatus(status) {
    const statusMap = {
      'requires_payment_method': 'pending',
      'requires_confirmation': 'pending',
      'requires_action': 'pending',
      'processing': 'processing',
      'succeeded': 'completed',
      'canceled': 'failed',
      'requires_capture': 'pending'
    };
    return statusMap[status] || 'pending';
  }

  /**
   * Verify webhook signature (Stripe webhooks)
   */
  verifyWebhookSignature(payload, signature) {
    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      return event;
    } catch (error) {
      return null;
    }
  }
}

export default new StripePixService();
