# 🔐 Manus Secrets Configuration Guide

**Date:** January 10, 2026  
**Purpose:** Guide for configuring secrets through Manus Secret Manager

---

## 📋 Overview

All sensitive API keys and secrets for So Fluent Platform should be managed through **Manus Secret Manager** for production deployments. This ensures secure, centralized secret management.

---

## 🔑 Required Secrets for Manus

### Authentication & User Management

| Secret Name | Description | Example |
|------------|-------------|---------|
| `CLERK_SECRET_KEY` | Clerk authentication secret key | `sk_test_...` or `sk_live_...` |
| `CLERK_WEBHOOK_SECRET` | Clerk webhook signing secret | `whsec_...` |

### Payment Processing

| Secret Name | Description | Example |
|------------|-------------|---------|
| `STRIPE_SECRET_KEY` | Stripe API secret key | `sk_test_...` or `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | `whsec_...` |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (for client) | `pk_test_...` or `pk_live_...` |
| `PIX_API_KEY` | Pix payment provider API key | Varies by provider |
| `PIX_API_SECRET` | Pix payment provider API secret | Varies by provider |
| `PIX_MERCHANT_ID` | Pix merchant identifier | Varies by provider |

### Email Service

| Secret Name | Description | Example |
|------------|-------------|---------|
| `EMAIL_SERVICE_API_KEY` | Email service API key (SendGrid/SES/Mailgun) | Varies by provider |

**Note:** Also set `EMAIL_SERVICE` environment variable:
- `sendgrid` (default)
- `ses` (AWS SES)
- `mailgun`

### AI & Third-Party Services

| Secret Name | Description | Example |
|------------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI API key for AI features | `sk-...` |
| `ZOOM_API_KEY` | Zoom API key for live classes | Varies |
| `ZOOM_API_SECRET` | Zoom API secret | Varies |
| `ZOOM_ACCOUNT_ID` | Zoom account ID | Varies |
| `GOOGLE_CLASSROOM_CLIENT_ID` | Google OAuth client ID | Varies |
| `GOOGLE_CLASSROOM_CLIENT_SECRET` | Google OAuth client secret | Varies |
| `INSTAGRAM_CLIENT_ID` | Instagram OAuth client ID | Varies |
| `INSTAGRAM_CLIENT_SECRET` | Instagram OAuth client secret | Varies |
| `LINKEDIN_CLIENT_ID` | LinkedIn OAuth client ID | Varies |
| `LINKEDIN_CLIENT_SECRET` | LinkedIn OAuth client secret | Varies |

### Monitoring & Error Tracking

| Secret Name | Description | Example |
|------------|-------------|---------|
| `SENTRY_DSN` | Sentry error tracking DSN | `https://...@sentry.io/...` |

---

## 🚀 Setting Secrets in Manus

### Via Manus Dashboard

1. Navigate to your project in Manus dashboard
2. Go to **Settings** → **Secrets**
3. Click **Add Secret**
4. Enter the secret name and value
5. Click **Save**

### Via Manus CLI

```bash
# Set a single secret
manus secrets set CLERK_SECRET_KEY "sk_live_your_key_here"

# Set multiple secrets from a file
manus secrets set-file .env.production

# List all secrets
manus secrets list

# Get a secret value
manus secrets get CLERK_SECRET_KEY
```

### Via Environment Variables

Manus automatically injects secrets as environment variables. The application code reads them using `process.env.SECRET_NAME`.

---

## 🔄 Secret Rotation

### Best Practices

1. **Rotate secrets regularly** (every 90 days recommended)
2. **Use different secrets for staging/production**
3. **Never commit secrets to version control**
4. **Use Manus Secret Manager** for all sensitive values

### Rotating a Secret

1. Generate new secret value
2. Update in Manus Secret Manager
3. Restart application (Manus handles this automatically)
4. Verify application works with new secret
5. Revoke old secret after verification

---

## 📝 Environment-Specific Configuration

### Development (Local)

Use `.env` file (not committed to git):
```bash
cp server/env.example server/.env
# Fill in your local development keys
```

### Staging/Production (Manus)

All secrets managed through Manus Secret Manager. No `.env` file needed.

---

## ✅ Verification Checklist

After setting up secrets in Manus, verify:

- [ ] Clerk authentication works
- [ ] Stripe payments process correctly
- [ ] Pix payments process correctly
- [ ] Email sending works (test welcome email)
- [ ] OpenAI API calls succeed
- [ ] Zoom integration works (if enabled)
- [ ] Webhooks receive and verify correctly
- [ ] Sentry error tracking captures errors

---

## 🔍 Troubleshooting

### Secret Not Found

**Error:** `CLERK_SECRET_KEY is not defined`

**Solution:**
1. Verify secret is set in Manus: `manus secrets list`
2. Check secret name matches exactly (case-sensitive)
3. Restart application after adding secret

### Webhook Verification Fails

**Error:** `Invalid webhook signature`

**Solution:**
1. Verify `CLERK_WEBHOOK_SECRET` matches Clerk dashboard
2. Verify `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
3. Check webhook URL is correct in provider dashboard

### Email Not Sending

**Error:** `Email service not configured`

**Solution:**
1. Verify `EMAIL_SERVICE_API_KEY` is set
2. Check `EMAIL_SERVICE` matches your provider (sendgrid/ses/mailgun)
3. Verify API key has correct permissions
4. Check email service logs in provider dashboard

---

## 📚 Additional Resources

- [Manus Documentation](https://docs.manus.ai)
- [Stripe API Keys](https://dashboard.stripe.com/apikeys)
- [Clerk API Keys](https://dashboard.clerk.com)
- [SendGrid API Keys](https://app.sendgrid.com/settings/api_keys)

---

**Last Updated:** January 10, 2026
