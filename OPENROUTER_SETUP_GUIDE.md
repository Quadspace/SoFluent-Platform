# 🤖 OpenRouter AI Setup Guide - 10 Minutes

**Goal:** Set up OpenRouter for cost-effective AI features  
**Cost Savings:** 81% vs direct API calls  
**Time:** 10 minutes

---

## 🎯 STEP 1: CREATE OPENROUTER ACCOUNT (2 minutes)

### **1.1 Sign Up**
1. Go to [openrouter.ai](https://openrouter.ai)
2. Click **"Sign Up"**
3. Sign up with:
   - Email address
   - Password
   - Or use Google/GitHub OAuth

### **1.2 Verify Email**
1. Check your email
2. Click verification link
3. Account activated!

**✅ Step 1 Complete!**

---

## 🔑 STEP 2: GET API KEY (2 minutes)

### **2.1 Go to Dashboard**
1. After login, you'll see the dashboard
2. Click **"API Keys"** in sidebar (or go to [openrouter.ai/keys](https://openrouter.ai/keys))

### **2.2 Create API Key**
1. Click **"Create Key"**
2. **Name:** `So Fluent Production`
3. **Permissions:** Full access (default)
4. Click **"Create"**

### **2.3 Copy API Key**
- **Important:** Copy the key immediately - you won't see it again!
- Format: `sk-or-v1-...`
- Save it securely

**✅ Step 2 Complete!**

---

## 💳 STEP 3: SET UP BILLING (3 minutes)

### **3.1 Add Payment Method**
1. Go to **"Billing"** → **"Payment Methods"**
2. Click **"Add Payment Method"**
3. Enter:
   - Credit card details
   - Billing address
4. Click **"Save"**

### **3.2 Set Spending Limit**
1. Go to **"Billing"** → **"Spending Limits"**
2. **Monthly Limit:** `$5,000` (recommended)
3. **Auto-recharge:** Enable (optional)
4. Click **"Save"**

**Why $5,000?**
- 10,000 students × $0.50/month average = $5,000/month
- Adjust based on your student count

**✅ Step 3 Complete!**

---

## 📝 STEP 4: CONFIGURE ENVIRONMENT (1 minute)

### **4.1 Update server/.env**
```bash
OPENROUTER_API_KEY=sk-or-v1-your_actual_key_here
```

### **4.2 Verify**
```bash
# Test API key
curl -X POST https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"google/gemini-pro","messages":[{"role":"user","content":"Hello!"}]}'
```

**Expected:** JSON response with AI message

**✅ Step 4 Complete!**

---

## 🎯 STEP 5: TEST INTEGRATION (2 minutes)

### **5.1 Test Backend**
```bash
# Start server
cd server
npm run dev

# Test AI chat endpoint
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"message":"Hello! How are you?","studentLevel":"intermediate"}'
```

**Expected:** AI response in JSON

### **5.2 Test Frontend**
1. Open `http://localhost:5173`
2. Navigate to AI Chat page
3. Send a message
4. Should receive AI response

**✅ Step 5 Complete!**

---

## 💰 COST OPTIMIZATION TIPS

### **Model Selection:**
- **Simple tasks:** `google/gemini-pro` ($0.0004/1K tokens)
- **Medium tasks:** `anthropic/claude-3.5-sonnet` ($0.003/1K tokens)
- **Complex tasks:** `openai/gpt-4-turbo` ($0.006/1K tokens)

### **Cost Monitoring:**
1. Go to OpenRouter Dashboard → **"Usage"**
2. Monitor daily/weekly costs
3. Set up alerts if needed

### **Expected Costs:**
- **Per student:** $2-5/month
- **10,000 students:** $3,000/month
- **Savings vs Direct:** $13,000/month (81%)

---

## 🎉 SETUP COMPLETE!

**You now have:**
- ✅ OpenRouter account created
- ✅ API key configured
- ✅ Billing set up
- ✅ Integration tested

**Next Steps:**
1. Test AI features
2. Monitor costs
3. Optimize model selection

---

## 🆘 TROUBLESHOOTING

### **Issue: "Invalid API key"**
**Fix:** Check `.env` file has correct key (starts with `sk-or-v1-`)

### **Issue: "Insufficient credits"**
**Fix:** Add payment method and credits

### **Issue: "Rate limit exceeded"**
**Fix:** Upgrade plan or reduce request frequency

---

**Setup Time:** ~10 minutes  
**Difficulty:** Very Easy  
**Status:** ✅ Ready to use!
