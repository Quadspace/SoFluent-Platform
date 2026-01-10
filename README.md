# So Fluent Platform

**Be Yourself in English. Prosper Globally.**

A comprehensive learning management system for So Fluent, featuring:
- 🏋️ **Fluency Fit Academy** - Science-backed English learning through fitness
- 🌍 **Multilingual Support** - English and Portuguese (Brazil)
- 📱 **Mobile App** - iOS and Android apps for on-the-go learning
- 👶 **Kids' Corner** - Red Balloon partnership for children's English learning
- 💳 **Payment Integration** - Stripe and Pix support for Brazilian market

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git
- GitHub account

### Installation

See [SETUP.md](./SETUP.md) for detailed setup instructions.

**Quick Start:**
```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install

# Set up environment variables (see SETUP.md)
# Create server/.env and client/.env files

# Start backend server
npm start

# Start frontend (in new terminal)
cd client
npm run dev
```

## 📋 Project Status

### Phase 1: Foundation (Weeks 1-3) - ✅ COMPLETE
- [x] Execution plan documented
- [x] GitHub repository initialized
- [x] Edemy LMS template cloned and integrated
- [x] Project structure set up
- [x] Branding folder structure created
- [x] Multilingual support (i18next) - English/Portuguese
- [x] Branding customization - So Fluent colors & messaging

### Phase 2: Feature Development (Weeks 4-6) - ✅ COMPLETE
- [x] Fluency Fit Academy landing page
- [x] Workout schedule & booking system
- [x] Kids' Corner MVP (Red Balloon partnership)
- [x] All pages fully bilingual
- [ ] Mobile app foundation (optional for initial launch)

### Phase 3: Deployment & Launch (Weeks 7-8) - 🚀 READY
- [x] Critical fixes completed
- [x] Database adapters integrated
- [x] Storage adapters integrated
- [x] Code cleaned and optimized
- [ ] Backend deployment (Manus) - **Ready to deploy**
- [ ] Frontend deployment (Manus) - **Ready to deploy**

## 🎨 Brand Guidelines

### Colors
- **Primary:** `#E91E63` (So Fluent Pink)
- **Secondary:** `#1A1A1A` (Dark Theme)
- **Accent:** `#00BCD4` (CTA Accent)

### Key Messaging
- "Be Yourself in English. Prosper Globally."
- "Get Fit. Get Fluent. Transform Your Life."
- "Science-backed English learning that's 20-40% more effective"

## 📚 Documentation

- **[Quick Start Guide](./QUICK_START.md)** - 🚀 **Start here!** Get running in 5 minutes
- **[Authentication Setup](./AUTHENTICATION_SETUP.md)** - 🔐 **Critical:** How to set up login/signup
- **[Backend Setup](./BACKEND_SETUP.md)** - ⚙️ Backend server setup and testing
- **[Master Execution Plan](./So%20Fluent%20Master%20Execution%20Plan.md)** - Complete roadmap
- **[Manus Deployment Guide](./MANUS_DEPLOYMENT.md)** - Deployment to Manus preparation
- **[Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)** - Pre-deployment checklist
- **[Brand Assets](./assets/branding/)** - Brand guidelines

## 🏗️ Project Structure

```
sofluent-platform/
├── client/          # React frontend (Vite + Tailwind CSS)
├── server/          # Node.js backend (Express + MongoDB)
│   ├── configs/     # Configuration files
│   │   ├── database-adapter.js  # DB abstraction (MongoDB → MySQL ready)
│   │   └── storage-adapter.js   # Storage abstraction (Cloudinary → S3 ready)
│   └── ...
├── assets/          # Brand assets and resources
│   └── branding/    # So Fluent brand guidelines
└── docs/            # Documentation files
```

**⚠️ Note:** This project will be deployed to Manus (MySQL/TiDB + S3). Adapter patterns are in place for easy migration.

## 🤝 Contributing

This is a private repository for So Fluent platform development.

## 📄 License

Proprietary - So Fluent Platform

---

**Built with ❤️ for ambitious Brazilians transforming their careers**
