/**
 * Pix Payment Service
 * Brazilian instant payment integration
 * Supports multiple providers: Mercado Pago, PagSeguro, Asaas, etc.
 */

import axios from 'axios';

/**
 * Pix Payment Provider Configuration
 * Currently supports Asaas (recommended for Brazil)
 * Can be extended to support other providers
 */
class PixService {
  constructor() {
    this.provider = process.env.PIX_PROVIDER || 'asaas'; // asaas, mercadopago, pagseguro
    this.apiKey = process.env.PIX_API_KEY;
    this.apiSecret = process.env.PIX_API_SECRET;
    this.merchantId = process.env.PIX_MERCHANT_ID;
    this.baseUrl = this.getBaseUrl();
  }

  getBaseUrl() {
    switch (this.provider) {
      case 'asaas':
        return process.env.PIX_API_URL || 'https://api.asaas.com/v3';
      case 'mercadopago':
        return 'https://api.mercadopago.com';
      case 'pagseguro':
        return 'https://api.pagseguro.com';
      default:
        return process.env.PIX_API_URL || 'https://api.asaas.com/v3';
    }
  }

  /**
   * Create a Pix payment
   * @param {Object} paymentData - Payment information
   * @param {string} paymentData.customerId - Customer identifier
   * @param {number} paymentData.amount - Amount in BRL (cents)
   * @param {string} paymentData.description - Payment description
   * @param {string} paymentData.externalReference - Your internal reference (e.g., purchase ID)
   * @returns {Promise<Object>} Pix payment object with QR code
   */
  async createPayment(paymentData) {
    const { customerId, amount, description, externalReference } = paymentData;

    try {
      if (this.provider === 'asaas') {
        return await this.createAsaasPayment({
          customer: customerId,
          billingType: 'PIX',
          value: amount / 100, // Convert cents to BRL
          description,
          externalReference,
          dueDate: this.getDueDate(1), // 1 day from now
        });
      } else if (this.provider === 'mercadopago') {
        return await this.createMercadoPagoPayment(paymentData);
      } else {
        throw new Error(`Unsupported Pix provider: ${this.provider}`);
      }
    } catch (error) {
      console.error('Pix payment creation error:', error);
      throw new Error(`Failed to create Pix payment: ${error.message}`);
    }
  }

  /**
   * Create payment using Asaas provider
   */
  async createAsaasPayment(paymentData) {
    const response = await axios.post(
      `${this.baseUrl}/payments`,
      paymentData,
      {
        headers: {
          'access_token': this.apiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    // Get Pix QR code
    const pixQrCode = await this.getPixQrCode(response.data.id);

    return {
      id: response.data.id,
      status: response.data.status,
      value: response.data.value,
      dueDate: response.data.dueDate,
      qrCode: pixQrCode.qrCode,
      qrCodeBase64: pixQrCode.qrCodeBase64,
      copyPaste: pixQrCode.copyPaste,
      externalReference: response.data.externalReference,
    };
  }

  /**
   * Get Pix QR code for payment
   */
  async getPixQrCode(paymentId) {
    const response = await axios.get(
      `${this.baseUrl}/payments/${paymentId}/pixQrCode`,
      {
        headers: {
          'access_token': this.apiKey,
        },
      }
    );

    return {
      qrCode: response.data.encodedImage,
      qrCodeBase64: response.data.encodedImage,
      copyPaste: response.data.payload,
    };
  }

  /**
   * Create payment using Mercado Pago provider
   */
  async createMercadoPagoPayment(paymentData) {
    const { amount, description, externalReference } = paymentData;

    const response = await axios.post(
      `${this.baseUrl}/v1/payments`,
      {
        transaction_amount: amount / 100,
        description,
        payment_method_id: 'pix',
        external_reference: externalReference,
        notification_url: `${process.env.APP_URL}/api/payments/pix/webhook`,
      },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      id: response.data.id,
      status: response.data.status,
      value: response.data.transaction_amount * 100, // Convert to cents
      qrCode: response.data.point_of_interaction?.transaction_data?.qr_code,
      qrCodeBase64: response.data.point_of_interaction?.transaction_data?.qr_code_base64,
      copyPaste: response.data.point_of_interaction?.transaction_data?.qr_code,
      externalReference: response.data.external_reference,
    };
  }

  /**
   * Check payment status
   */
  async getPaymentStatus(paymentId) {
    try {
      if (this.provider === 'asaas') {
        const response = await axios.get(
          `${this.baseUrl}/payments/${paymentId}`,
          {
            headers: {
              'access_token': this.apiKey,
            },
          }
        );
        return {
          id: response.data.id,
          status: this.mapAsaasStatus(response.data.status),
          value: response.data.value * 100, // Convert to cents
          paidDate: response.data.paymentDate,
        };
      } else if (this.provider === 'mercadopago') {
        const response = await axios.get(
          `${this.baseUrl}/v1/payments/${paymentId}`,
          {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
            },
          }
        );
        return {
          id: response.data.id,
          status: this.mapMercadoPagoStatus(response.data.status),
          value: response.data.transaction_amount * 100,
          paidDate: response.data.date_approved,
        };
      }
    } catch (error) {
      console.error('Error checking Pix payment status:', error);
      throw new Error(`Failed to check payment status: ${error.message}`);
    }
  }

  /**
   * Map Asaas status to our status
   */
  mapAsaasStatus(status) {
    const statusMap = {
      'PENDING': 'pending',
      'CONFIRMED': 'completed',
      'RECEIVED': 'completed',
      'OVERDUE': 'failed',
      'REFUNDED': 'refunded',
    };
    return statusMap[status] || 'pending';
  }

  /**
   * Map Mercado Pago status to our status
   */
  mapMercadoPagoStatus(status) {
    const statusMap = {
      'pending': 'pending',
      'approved': 'completed',
      'rejected': 'failed',
      'refunded': 'refunded',
      'cancelled': 'failed',
    };
    return statusMap[status] || 'pending';
  }

  /**
   * Get due date (days from now)
   */
  getDueDate(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  }

  /**
   * Verify webhook signature (for security)
   */
  verifyWebhookSignature(payload, signature) {
    // Implement webhook signature verification based on provider
    // This is critical for security
    if (this.provider === 'asaas') {
      // Asaas uses token-based verification
      return signature === process.env.PIX_WEBHOOK_TOKEN;
    } else if (this.provider === 'mercadopago') {
      // Mercado Pago uses HMAC verification
      const crypto = require('crypto');
      const hash = crypto
        .createHmac('sha256', this.apiSecret)
        .update(JSON.stringify(payload))
        .digest('hex');
      return hash === signature;
    }
    return false;
  }
}

// Export singleton instance
export default new PixService();
