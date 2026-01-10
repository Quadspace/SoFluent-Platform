# So Fluent Platform - Setup Guide

## 🚀 Quick Start

Follow these steps to get your So Fluent platform running locally.

### Prerequisites

- **Node.js** 18+ and npm
- **MongoDB** (local or MongoDB Atlas)
- **Git** for version control
- Accounts for:
  - Clerk (authentication)
  - Cloudinary (media storage)
  - Stripe (payments)

---

## Step 1: Install Dependencies

### Frontend (Client)
```bash
cd client
npm install
```

### Backend (Server)
```bash
cd server
npm install
```

---

## Step 2: Environment Variables

### Server Environment Variables

Create `server/.env` file:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
CURRENCY=USD
```

### Client Environment Variables

Create `client/.env` file:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:3000
```

---

## Step 3: Set Up Services

### MongoDB Setup

**Option A: Local MongoDB**
1. Install MongoDB locally
2. Start MongoDB service
3. Use `mongodb://localhost:27017` in `.env`

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Use connection string in `.env`

### Clerk Authentication Setup

1. Create account at [Clerk](https://clerk.com)
2. Create a new application
3. Copy **Publishable Key** → `client/.env`
4. Copy **Webhook Secret** → `server/.env`
5. Configure webhook URL: `http://localhost:3000/clerk`

### Cloudinary Setup (Media Storage)

1. Create account at [Cloudinary](https://cloudinary.com)
2. Go to Dashboard → Settings
3. Copy:
   - Cloud name → `CLOUDINARY_NAME`
   - API Key → `CLOUDINARY_API_KEY`
   - API Secret → `CLOUDINARY_SECRET_KEY`

### Stripe Setup (Payments)

1. Create account at [Stripe](https://stripe.com)
2. Go to Developers → API Keys
3. Copy **Secret Key** → `STRIPE_SECRET_KEY`
4. Set up webhook endpoint: `http://localhost:3000/stripe`
5. Copy **Webhook Secret** → `STRIPE_WEBHOOK_SECRET`

---

## Step 4: Run the Application

### Start Backend Server
```bash
cd server
npm start
# or for development with auto-reload:
npm run server
```

Server will run on `http://localhost:3000`

### Start Frontend Client
```bash
cd client
npm run dev
```

Frontend will run on `http://localhost:5173` (Vite default)

---

## Step 5: Verify Installation

1. ✅ Backend API: Visit `http://localhost:3000` → Should see "So Fluent API is working fine!"
2. ✅ Frontend: Visit `http://localhost:5173` → Should see the homepage
3. ✅ Database: Check MongoDB connection in server logs
4. ✅ Authentication: Try signing up/logging in

---

## 🎨 Next Steps: Branding & Customization

After setup is complete, proceed with Phase 1 customization:

1. **Week 1**: Branding integration planning
2. **Week 2**: Multilingual support (i18next)
3. **Week 3**: Visual identity update

See [So Fluent Master Execution Plan.md](./So%20Fluent%20Master%20Execution%20Plan.md) for details.

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string format
- Verify network access (for Atlas)

### Clerk Authentication Issues
- Verify publishable key is correct
- Check webhook configuration
- Ensure CORS is enabled

### Port Already in Use
- Change `PORT` in `server/.env`
- Update `VITE_API_URL` in `client/.env` accordingly

---

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com)
- [Clerk Documentation](https://clerk.com/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Stripe Documentation](https://stripe.com/docs)

---

**Need Help?** Refer to the execution plan or reach out for assistance!
