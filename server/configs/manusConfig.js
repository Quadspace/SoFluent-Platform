/**
 * Manus Configuration Helper
 * Provides utilities for working with Manus-managed secrets and configuration
 */

/**
 * Get a secret from environment variables (managed by Manus in production)
 * @param {string} secretName - Name of the secret
 * @param {string} defaultValue - Default value if secret not found (for development)
 * @returns {string|undefined} Secret value or default
 */
export const getManusSecret = (secretName, defaultValue = undefined) => {
  const value = process.env[secretName];
  
  if (!value && process.env.NODE_ENV === 'production') {
    console.warn(`⚠️  Manus Secret "${secretName}" not found. Please configure it in Manus Secret Manager.`);
  }
  
  return value || defaultValue;
};

/**
 * Verify required secrets are configured
 * @param {string[]} requiredSecrets - Array of required secret names
 * @returns {Object} { isValid: boolean, missing: string[] }
 */
export const verifySecrets = (requiredSecrets) => {
  const missing = [];
  
  requiredSecrets.forEach(secretName => {
    if (!process.env[secretName]) {
      missing.push(secretName);
    }
  });
  
  return {
    isValid: missing.length === 0,
    missing,
  };
};

/**
 * Get Stripe configuration from Manus secrets
 */
export const getStripeConfig = () => {
  return {
    secretKey: getManusSecret('STRIPE_SECRET_KEY'),
    publishableKey: getManusSecret('STRIPE_PUBLISHABLE_KEY'),
    webhookSecret: getManusSecret('STRIPE_WEBHOOK_SECRET'),
  };
};

/**
 * Get Clerk configuration from Manus secrets
 */
export const getClerkConfig = () => {
  return {
    secretKey: getManusSecret('CLERK_SECRET_KEY'),
    webhookSecret: getManusSecret('CLERK_WEBHOOK_SECRET'),
  };
};

/**
 * Get Pix configuration from Manus secrets
 */
export const getPixConfig = () => {
  return {
    apiKey: getManusSecret('PIX_API_KEY'),
    apiSecret: getManusSecret('PIX_API_SECRET'),
    merchantId: getManusSecret('PIX_MERCHANT_ID'),
  };
};

/**
 * Get Email service configuration from Manus secrets
 */
export const getEmailConfig = () => {
  return {
    apiKey: getManusSecret('EMAIL_SERVICE_API_KEY'),
    service: process.env.EMAIL_SERVICE || 'sendgrid',
    fromEmail: process.env.EMAIL_FROM || 'noreply@sofluent.ai',
  };
};

/**
 * Verify all critical secrets are configured
 * Called on server startup
 */
export const verifyCriticalSecrets = () => {
  const criticalSecrets = [
    'CLERK_SECRET_KEY',
    'STRIPE_SECRET_KEY',
  ];
  
  const verification = verifySecrets(criticalSecrets);
  
  if (!verification.isValid) {
    console.warn('⚠️  Missing critical secrets:', verification.missing);
    console.warn('Please configure these secrets in Manus Secret Manager or .env file.');
    
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing critical secrets: ${verification.missing.join(', ')}`);
    } else {
      console.warn('⚠️  Running in development mode. Some features may not work.');
      console.warn('⚠️  Backend will start but authentication/payments may fail.\n');
    }
  } else {
    console.log('✅ All critical secrets configured');
  }
  
  return verification;
};

export default {
  getManusSecret,
  verifySecrets,
  getStripeConfig,
  getClerkConfig,
  getPixConfig,
  getEmailConfig,
  verifyCriticalSecrets,
};
