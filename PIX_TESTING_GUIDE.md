# 🧪 Pix Integration Testing Guide

**Date:** January 10, 2026  
**Status:** Ready for Testing

---

## ✅ WHAT'S BEEN BUILT

### **Backend:**
- ✅ `server/services/stripePixService.js` - Stripe Pix service
- ✅ `server/controllers/pixController.js` - Pix payment controller
- ✅ `server/routes/pixRoutes.js` - Pix API routes
- ✅ Integrated into `server/server.js`

### **Frontend:**
- ✅ `client/src/components/payments/PixPayment.jsx` - Pix payment component
- ✅ Updated for Stripe Pix format

### **Testing:**
- ✅ `scripts/test-pix-integration.js` - Integration test script
- ✅ `scripts/verify-pix-setup.js` - Setup verification script

---

## 🧪 HOW TO TEST

### **1. Verify Setup:**
```bash
npm run verify:pix
```

This checks:
- ✅ Environment variables
- ✅ Service files exist
- ✅ Routes registered
- ✅ Frontend component exists

### **2. Test Integration:**
```bash
npm run test:pix
```

This tests:
- ✅ Payment creation
- ✅ QR code generation
- ✅ Status checking
- ✅ Response structure

### **3. Manual Testing:**

#### **Step 1: Enable Pix in Stripe**
1. Go to: https://dashboard.stripe.com/settings/payment_methods
2. Enable "Pix" payment method
3. Save changes

#### **Step 2: Test Payment Creation**
```bash
# Start server
cd server
npm run dev

# In another terminal, test API
curl -X POST http://localhost:3000/api/payments/pix/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
  -d '{
    "courseId": "test-course-id",
    "amount": 100
  }'
```

#### **Step 3: Test Frontend**
1. Navigate to a course purchase page
2. Select "Pay with Pix"
3. Verify QR code displays
4. Test copy-paste functionality

#### **Step 4: Test Webhook (Stripe CLI)**
```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/payments/pix/webhook

# Trigger test payment
stripe trigger payment_intent.succeeded
```

---

## 🔍 TROUBLESHOOTING

### **Issue: "Pix not available"**
**Solution:**
- Enable Pix in Stripe Dashboard
- Check Stripe account is in Brazil or has Pix enabled
- Verify `currency: 'brl'` is set

### **Issue: "QR code not showing"**
**Solution:**
- Check payment intent status
- Verify `next_action.pix_display_qr_code` exists
- Check browser console for errors

### **Issue: "Webhook not working"**
**Solution:**
- Verify `STRIPE_WEBHOOK_SECRET` is set
- Check webhook endpoint URL in Stripe Dashboard
- Test with Stripe CLI locally

### **Issue: "Payment status stuck on pending"**
**Solution:**
- Check polling interval (should be 5 seconds)
- Verify status endpoint is working
- Check Stripe Dashboard for actual payment status

---

## 📋 CHECKLIST

### **Before Production:**
- [ ] Pix enabled in Stripe Dashboard
- [ ] Test mode verified working
- [ ] Webhook endpoint configured
- [ ] Error handling tested
- [ ] Frontend component tested
- [ ] Status polling verified
- [ ] QR code display verified
- [ ] Copy-paste functionality tested

---

## 🎯 NEXT STEPS

1. **Run verification:** `npm run verify:pix`
2. **Run tests:** `npm run test:pix`
3. **Enable Pix in Stripe Dashboard**
4. **Test end-to-end flow**
5. **Configure webhooks**
6. **Deploy to production**

---

**Ready to test!** 🚀
