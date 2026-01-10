# So Fluent Master Execution Plan
## From Strategy to Launch: Your Complete Roadmap

---

## Executive Summary

You now have comprehensive strategic plans covering:
- Fluency Fit Academy (your flagship program)
- Website and app architecture
- Red Balloon partnership strategy
- Revenue architecture to reach $100K USD/month
- Content strategy and messaging

**The Challenge:** Too much information, need clear execution steps.

**The Solution:** This Master Execution Plan consolidates everything into 3 clear phases with specific, actionable steps using the GitHub + Cursor + Manus hybrid approach to minimize costs.

**Timeline:** 8-12 weeks from start to launch  
**Cost Savings:** 60-70% compared to pure Manus development  
**Outcome:** Live platform with Fluency Fit Academy, multilingual support, mobile app, and Red Balloon partnership ready

---

## The Hybrid Approach: GitHub + Cursor + Manus

### Why This Works

**GitHub (Version Control):**
- All code stored in repositories
- Track changes and collaborate
- Easy to share with developers
- Professional workflow

**Cursor (Development - Your Credits):**
- Build and customize locally
- Iterate quickly with AI assistance
- Test before deploying
- Uses your Cursor subscription, not Manus

**Manus (Deployment & Infrastructure - Minimal Credits):**
- Deploy to production
- Set up database and authentication
- Configure backend services
- Only use when code is ready

**Cost Breakdown:**
- **Weeks 1-6 in Cursor:** ~$50-100 (your Cursor subscription)
- **Week 7-8 in Manus:** ~$100-200 (deployment and infrastructure)
- **Total:** $150-300 vs. $500-1,000+ if built entirely in Manus

---

## Phase 1: Foundation (Weeks 1-3)
### Set Up GitHub + Clone Template + Customize Branding

### Week 1: GitHub Setup & Template Selection

**Day 1-2: GitHub Repository Setup**

**Actions:**
1. Create GitHub account (if you don't have one)
2. Create new repository: `sofluent-platform`
3. Set repository to private
4. Add README with project description

**In Cursor:**
```bash
# Clone Edemy LMS template
git clone https://github.com/Gyanthakur/Edemy-LMS.git sofluent-platform
cd sofluent-platform

# Initialize as your own repository
rm -rf .git
git init
git remote add origin https://github.com/YOUR_USERNAME/sofluent-platform.git

# First commit
git add .
git commit -m "Initial commit: Edemy LMS template"
git push -u origin main
```

**Deliverable:** GitHub repository created with Edemy LMS template

---

**Day 3-5: Environment Setup & Dependencies**

**In Cursor:**
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run dev
```

**Actions:**
1. Review existing code structure
2. Test all features locally
3. Document what works and what needs customization
4. Create project board in GitHub (Issues and Projects)

**Deliverable:** Local development environment running, project board created

---

**Day 6-7: Branding Integration Planning**

**Actions:**
1. Gather all So Fluent brand assets (logo, colors, fonts)
2. Create `/assets/branding/` folder in repository
3. Document brand guidelines (colors, typography, voice)
4. Create list of pages/components to customize

**Brand Assets Needed:**
- So Fluent logo (PNG, SVG)
- Heloisa's photos
- Brand colors (pink/magenta + dark theme)
- Fluency Fit Academy branding
- Red Balloon co-branding elements

**Deliverable:** Brand assets organized, customization checklist created

---

### Week 2: Multilingual Integration (i18next)

**Day 1-3: Install and Configure i18next**

**In Cursor:**
```bash
# Install i18next for React
npm install react-i18next i18next i18next-browser-languagedetector
```

**Actions:**
1. Create `/locales/en/` and `/locales/pt-BR/` folders
2. Set up i18next configuration
3. Create translation files for common strings
4. Test language switching

**Example Translation File (`/locales/en/common.json`):**
```json
{
  "nav": {
    "home": "Home",
    "courses": "Courses",
    "about": "About",
    "contact": "Contact"
  },
  "hero": {
    "title": "Be Yourself in English. Prosper Globally.",
    "subtitle": "Transform your career with science-backed English learning"
  }
}
```

**Example Translation File (`/locales/pt-BR/common.json`):**
```json
{
  "nav": {
    "home": "Início",
    "courses": "Cursos",
    "about": "Sobre",
    "contact": "Contato"
  },
  "hero": {
    "title": "Seja Você Mesmo em Inglês. Prospere Globalmente.",
    "subtitle": "Transforme sua carreira com aprendizado de inglês baseado em ciência"
  }
}
```

**Deliverable:** i18next configured, language switching working, 50+ strings translated

---

**Day 4-7: Translate Key Pages**

**Priority Pages to Translate:**
1. Homepage
2. Fluency Fit Academy page
3. Courses page
4. About page
5. Pricing page
6. Login/Signup flows

**Actions:**
1. Identify all user-facing text
2. Create translation keys
3. Replace hardcoded text with `{t('translation.key')}`
4. Test both languages thoroughly

**Deliverable:** All key pages fully bilingual (English/Portuguese)

---

### Week 3: Branding Customization

**Day 1-3: Visual Identity Update**

**In Cursor:**

**Actions:**
1. Replace logo in header/footer
2. Update color scheme (CSS variables)
3. Replace placeholder images with So Fluent brand images
4. Update typography (fonts)

**CSS Variables to Update:**
```css
:root {
  --primary-color: #E91E63; /* So Fluent pink */
  --secondary-color: #1A1A1A; /* Dark theme */
  --accent-color: #00BCD4; /* Accent for CTAs */
  --text-color: #333333;
  --background-color: #FFFFFF;
}
```

**Deliverable:** Platform visually matches So Fluent brand

---

**Day 4-7: Content Customization**

**Actions:**
1. Update homepage hero section with So Fluent messaging
2. Replace course examples with Fluency Fit Academy content
3. Update About page with Heloisa's story
4. Customize footer with So Fluent links and info

**Key Messaging to Integrate:**
- "Be Yourself in English. Prosper Globally."
- "Get Fit. Get Fluent. Transform Your Life."
- "Science-backed English learning that's 20-40% more effective"
- "Join 300+ ambitious Brazilians transforming their careers"

**Deliverable:** Platform content reflects So Fluent brand and messaging

---

**End of Phase 1 Checkpoint:**
- ✅ GitHub repository set up
- ✅ Local development environment running
- ✅ Multilingual support (English/Portuguese) working
- ✅ Brand identity fully integrated
- ✅ Key pages customized

**Commit to GitHub:**
```bash
git add .
git commit -m "Phase 1 complete: Branding and multilingual support"
git push origin main
```

---

## Phase 2: Feature Development (Weeks 4-6)
### Build Fluency Fit Academy + Mobile App Foundation

### Week 4: Fluency Fit Academy Section

**Day 1-3: Create Fluency Fit Landing Page**

**In Cursor:**

**Actions:**
1. Create `/pages/fluency-fit/` route
2. Design hero section (video of Heloisa working out + teaching)
3. Add "How It Works" section (4 steps)
4. Add pricing tiers (Academy, VIP, Challenges)
5. Add success stories/testimonials
6. Add FAQ section
7. Add CTA (Start Free Trial)

**Content Sections:**
- Hero: "Get Fit AND Fluent in Half the Time"
- Science section: "20-40% More Effective (Peer-Reviewed Research)"
- How It Works: Join → Workout → Practice → Transform
- Pricing: R$297/month (Academy), R$997/month (VIP)
- Success Stories: Before/after transformations
- FAQ: Common questions
- CTA: "Start Your Free 7-Day Trial"

**Deliverable:** Fluency Fit Academy landing page complete

---

**Day 4-7: Workout Schedule & Booking System**

**Actions:**
1. Create workout schedule component (shows upcoming live sessions)
2. Integrate calendar view (weekly schedule)
3. Add RSVP/booking functionality
4. Send confirmation emails after booking
5. Integrate with Zoom (generate meeting links)

**Features:**
- Weekly schedule view (Monday HIIT, Wednesday Yoga, etc.)
- Filter by type (HIIT, Yoga, Dance, Strength)
- RSVP button (adds to user's calendar)
- Reminder notifications (email + push)

**Deliverable:** Live workout schedule and booking system working

---

### Week 5: Mobile App Foundation

**Day 1-3: Set Up React Native Project**

**In Cursor:**
```bash
# Create Expo project
npx create-expo-app sofluent-app
cd sofluent-app

# Install dependencies
npm install @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
```

**Actions:**
1. Set up navigation (tabs: Home, Fluency Fit, Courses, Profile)
2. Create basic screens (placeholders)
3. Set up authentication flow (login/signup)
4. Test on iOS and Android simulators

**Deliverable:** Mobile app skeleton with navigation working

---

**Day 4-7: Integrate Fluency Fit Features**

**Actions:**
1. Create Fluency Fit tab (workout library)
2. Add workout video player
3. Add progress tracking (workouts completed, streaks)
4. Add community feed (member posts and updates)
5. Integrate with backend API

**Key Features:**
- Browse workouts by type, duration, level
- Play workout videos (with English subtitles)
- Track fitness metrics (calories, time, workouts)
- Track English metrics (words learned, conversation time)
- Gamification (badges, streaks, leaderboards)

**Deliverable:** Mobile app with Fluency Fit features working

---

### Week 6: Red Balloon Kids' Corner

**Day 1-4: Create Kids' Corner Section**

**In Cursor:**

**Actions:**
1. Create `/pages/kids-corner/` route (website)
2. Create Kids' Corner tab in mobile app
3. Add Vocabulary Quest game (basic version)
4. Add Culture Capsules (video library)
5. Add parent dashboard (view child's progress)

**Features:**
- Co-branded with Red Balloon logo
- Age-appropriate design (colorful, playful)
- Vocabulary games (matching, spelling, pronunciation)
- Video library (cultural content)
- Parent controls (time limits, content filters)

**Deliverable:** Kids' Corner MVP ready for Red Balloon pilot

---

**Day 5-7: Testing & Bug Fixes**

**Actions:**
1. Test all features on website and mobile app
2. Fix bugs and polish UI/UX
3. Test multilingual support (switch languages everywhere)
4. Test on different devices and browsers
5. Prepare for deployment

**Deliverable:** Platform ready for deployment

---

**End of Phase 2 Checkpoint:**
- ✅ Fluency Fit Academy section complete
- ✅ Mobile app foundation built
- ✅ Kids' Corner MVP ready
- ✅ All features tested and working

**Commit to GitHub:**
```bash
git add .
git commit -m "Phase 2 complete: Fluency Fit Academy and mobile app"
git push origin main
```

---

## Phase 3: Deployment & Launch (Weeks 7-8)
### Deploy to Manus + Launch Campaign

### Week 7: Deployment (Manus Credits Used Here)

**Day 1-2: Deploy Backend with Manus**

**In Manus:**

**Actions:**
1. Initialize Manus web-db-user scaffold
2. Migrate database schema
3. Set up authentication (OAuth, email/password)
4. Configure environment variables
5. Deploy backend API

**Manus Scaffold Features:**
- User authentication (login, signup, password reset)
- MySQL/TiDB database
- Backend API (Node.js + Express)
- S3 integration (for video/image storage)
- Payment processing (Stripe + Pix)

**Deliverable:** Backend deployed and running on Manus

---

**Day 3-4: Deploy Frontend**

**In Manus:**

**Actions:**
1. Build production version of website
2. Deploy to Manus hosting
3. Configure custom domain (sofluent.ai)
4. Set up SSL certificate
5. Test live website

**Deliverable:** Website live at sofluent.ai

---

**Day 5-7: Deploy Mobile App**

**In Manus:**

**Actions:**
1. Build iOS and Android apps
2. Submit to App Store and Google Play
3. Configure push notifications
4. Test app on real devices
5. Prepare for launch

**Note:** App store approval takes 1-2 weeks, so submit early

**Deliverable:** Mobile apps submitted to stores

---

### Week 8: Launch Campaign

**Day 1-2: Pre-Launch**

**Actions:**
1. Create launch content (videos, graphics, copy)
2. Set up email sequences (welcome, onboarding, nurture)
3. Prepare social media posts (Instagram, Facebook, LinkedIn)
4. Set up Facebook/Instagram ads
5. Reach out to Red Balloon for partnership announcement

**Launch Content:**
- Heloisa's story video (3-5 min)
- Fluency Fit Academy demo video (2-3 min)
- Success story testimonials (3-5 videos)
- Social media graphics (10-15 posts)
- Email templates (5-7 emails)

**Deliverable:** Launch content ready

---

**Day 3-5: Official Launch**

**Actions:**
1. Announce on social media (Instagram, Facebook, LinkedIn)
2. Send email to existing So Fluent audience
3. Launch Facebook/Instagram ads
4. Host live demo session (Zoom webinar)
5. Activate influencer partnerships

**Launch Offer:**
- Founding member discount: 50% off first 3 months (R$148.50/month)
- Limited to first 100 members
- Bonus: Free 1:1 consultation with Heloisa

**Deliverable:** Launch campaign live, first members enrolling

---

**Day 6-7: Red Balloon Partnership Outreach**

**Actions:**
1. Schedule meeting with Red Balloon Icaraí director
2. Present partnership proposal
3. Demonstrate Kids' Corner
4. Negotiate pilot program terms
5. Plan June 2026 graduation season launch

**Deliverable:** Red Balloon meeting scheduled, partnership discussions underway

---

**End of Phase 3 Checkpoint:**
- ✅ Platform deployed and live
- ✅ Mobile apps submitted to stores
- ✅ Launch campaign executed
- ✅ First members enrolled
- ✅ Red Balloon partnership initiated

---

## Simplified Priority Matrix

### MUST HAVE (Launch Blockers)
1. ✅ GitHub repository set up
2. ✅ Multilingual support (English/Portuguese)
3. ✅ Fluency Fit Academy landing page
4. ✅ User authentication (login/signup)
5. ✅ Payment processing (Stripe + Pix)
6. ✅ Live workout schedule
7. ✅ Mobile app (basic version)

### SHOULD HAVE (Launch Week 2-4)
1. ✅ Kids' Corner MVP
2. ✅ Workout video library (10+ videos)
3. ✅ Progress tracking (fitness + English metrics)
4. ✅ Community features (forums, messaging)
5. ✅ Red Balloon partnership announcement

### NICE TO HAVE (Post-Launch)
1. ⏳ Advanced gamification (badges, leaderboards)
2. ⏳ VIP Circle features (1:1 coaching, exclusive events)
3. ⏳ Corporate program portal
4. ⏳ AI-powered recommendations
5. ⏳ Integration with fitness trackers (Apple Health, Fitbit)

---

## GitHub Project Board Structure

### Columns:
1. **Backlog** - All tasks not yet started
2. **To Do** - Tasks for current week
3. **In Progress** - Currently working on
4. **Review** - Ready for testing
5. **Done** - Completed and tested

### Labels:
- `priority-high` - Must have for launch
- `priority-medium` - Should have soon
- `priority-low` - Nice to have
- `bug` - Something broken
- `enhancement` - New feature
- `design` - UI/UX work
- `content` - Text, images, videos
- `translation` - Multilingual work

### Example Issues:

**Issue #1: Set up i18next for multilingual support**
- Label: `priority-high`, `enhancement`
- Assignee: You (or developer)
- Milestone: Phase 1 - Week 2
- Description: Install i18next, create translation files, test language switching

**Issue #2: Create Fluency Fit Academy landing page**
- Label: `priority-high`, `design`, `content`
- Assignee: You (or developer)
- Milestone: Phase 2 - Week 4
- Description: Design and build Fluency Fit landing page with hero, pricing, testimonials

---

## Next Steps: What You Need to Do NOW

### Step 1: Approve This Plan
- Review this Master Execution Plan
- Confirm priorities and timeline
- Ask any questions or request changes

### Step 2: Set Up GitHub
- Create GitHub account (if needed)
- Share your GitHub username with me
- I'll help you set up the repository

### Step 3: Clone Edemy LMS in Cursor
- Open Cursor
- Clone the Edemy LMS repository
- Get local development environment running

### Step 4: Gather Brand Assets
- So Fluent logo (PNG, SVG)
- Heloisa's photos (high-resolution)
- Brand colors and fonts
- Any existing content (videos, copy, images)

### Step 5: Start Week 1
- Follow the Week 1 checklist
- Commit progress to GitHub daily
- Ask me for help when you get stuck

---

## How I Can Help

### During Cursor Development (Weeks 1-6):
- Answer technical questions
- Review your code and provide feedback
- Help troubleshoot bugs
- Provide design and UX guidance
- Create content and copy

### During Manus Deployment (Week 7):
- Guide you through Manus scaffold setup
- Help configure backend and database
- Troubleshoot deployment issues
- Test live platform

### During Launch (Week 8):
- Review launch content
- Provide marketing strategy guidance
- Help with Red Balloon partnership pitch
- Analyze early results and optimize

---

## Cost Breakdown

### Development Costs:
- **Cursor subscription:** $20-40/month (you already have this)
- **GitHub:** Free (private repositories included)
- **Manus deployment:** $100-200 (one-time setup)
- **Total Development:** $120-240

### Ongoing Costs:
- **Hosting:** $50-100/month (Manus or AWS)
- **Database:** $20-50/month
- **Video storage:** $20-50/month (S3)
- **Email service:** $10-20/month (SendGrid, Mailgun)
- **Push notifications:** $10-20/month
- **Total Monthly:** $110-240/month

### Marketing Costs (Optional):
- **Facebook/Instagram ads:** $500-2,000/month
- **Influencer partnerships:** $500-1,000/month
- **Content creation:** $300-500/month
- **Total Marketing:** $1,300-3,500/month

---

## Success Metrics

### Week 4 Checkpoint:
- ✅ Multilingual support working
- ✅ Fluency Fit page designed
- ✅ 50% of branding complete

### Week 8 Checkpoint:
- ✅ Platform deployed and live
- ✅ 20-50 founding members enrolled
- ✅ Red Balloon meeting scheduled

### Month 3 Checkpoint:
- ✅ 100+ members in Fluency Fit Academy
- ✅ R$29,700+/month recurring revenue
- ✅ Mobile apps approved and live
- ✅ Red Balloon pilot program launched

---

## Conclusion

This Master Execution Plan consolidates all your strategic work into a clear, actionable roadmap. By using the GitHub + Cursor + Manus hybrid approach, you'll save 60-70% in costs while maintaining full control over your codebase.

**The Key:** Focus on Phase 1 first. Don't try to do everything at once. Build the foundation, then add features iteratively.

**Your Advantage:** You have comprehensive strategy, clear positioning, and a unique offering (Fluency Fit Academy) that no competitor can replicate.

**Next Step:** Approve this plan, set up GitHub, and start Week 1. I'll be here to guide you every step of the way.

**Let's build this! 🚀**
