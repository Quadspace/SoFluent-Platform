/**
 * Environment Variable Validator
 * Validates required environment variables on startup
 * Fails fast if critical variables are missing
 */

const requiredEnvVars = {
  production: [
    'MONGODB_URI',
    'CLERK_SECRET_KEY',
    'STRIPE_SECRET_KEY',
    // Note: Pix payments use Stripe natively - no separate PIX_API_KEY needed
  ],
  development: [
    'MONGODB_URI',
  ],
  test: [
    'MONGODB_URI',
  ]
};

const optionalEnvVars = [
  'CLOUDINARY_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_SECRET_KEY',
  'SENTRY_DSN',
  'OPENAI_API_KEY',
  'ZOOM_API_KEY',
  'EMAIL_SERVICE_API_KEY',
];

export const validateEnv = () => {
  const env = process.env.NODE_ENV || 'development';
  const required = requiredEnvVars[env] || requiredEnvVars.development;
  const missing = [];
  const warnings = [];

  // Check required variables
  for (const varName of required) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  // Check optional but recommended variables
  for (const varName of optionalEnvVars) {
    if (!process.env[varName]) {
      warnings.push(varName);
    }
  }

  // Fail fast if critical variables are missing (only in production)
  if (missing.length > 0) {
    console.error('\n❌ Missing required environment variables:');
    missing.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('\nPlease set these variables in your .env file.');
    console.error('See server/env.example for reference.\n');
    
    // Only exit in production - allow development to continue with warnings
    if (env === 'production') {
      process.exit(1);
    } else {
      console.warn('⚠️  Continuing in development mode. Some features may not work.\n');
    }
  }

  // Warn about missing optional variables
  if (warnings.length > 0 && env === 'production') {
    console.warn('\n⚠️  Missing optional environment variables:');
    warnings.forEach(varName => {
      console.warn(`   - ${varName}`);
    });
    console.warn('Some features may not work without these variables.\n');
  }

  // Validate format of critical variables
  if (process.env.MONGODB_URI && !process.env.MONGODB_URI.startsWith('mongodb')) {
    console.error('❌ MONGODB_URI must start with "mongodb://" or "mongodb+srv://"');
    process.exit(1);
  }

  if (process.env.CLERK_SECRET_KEY && !process.env.CLERK_SECRET_KEY.startsWith('sk_')) {
    console.error('❌ CLERK_SECRET_KEY must start with "sk_"');
    process.exit(1);
  }

  if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
    console.error('❌ STRIPE_SECRET_KEY must start with "sk_"');
    process.exit(1);
  }

  console.log('✅ Environment variables validated successfully');
};
