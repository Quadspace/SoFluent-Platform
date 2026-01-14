import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { validateEnv } from './utils/envValidator.js';
import { verifyCriticalSecrets } from './configs/manusConfig.js';

// Validate environment variables on startup
validateEnv();

// Verify Manus secrets are configured
verifyCriticalSecrets();
import dbAdapter from './configs/database-adapter.js';
import storageAdapter from './configs/storage-adapter.js';
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js';
import educatorRouter from './routes/educatorRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import { rateLimiters } from './middlewares/rateLimiter.js';
import { sanitizeBody } from './middlewares/validationMiddleware.js';
import { securityHeaders } from './middlewares/securityHeaders.js';
import courseRouter from './routes/courseRoute.js';
import userRouter from './routes/userRoutes.js';
import studentRouter from './routes/studentRoutes.js';
import classRouter from './routes/classRoutes.js';
import feedRouter from './routes/feedRoutes.js';
import socialRouter from './routes/socialRoutes.js';
import missionRouter from './routes/missionRoutes.js';
import aiLifeMirrorRouter from './routes/aiLifeMirrorRoutes.js';
import careerRouter from './routes/careerRoutes.js';
import conversationRouter from './routes/conversationRoutes.js';
import pronunciationRouter from './routes/pronunciationRoutes.js';
import studyBuddyRouter from './routes/studyBuddyRoutes.js';
import successStoryRouter from './routes/successStoryRoutes.js';
import masterAdminRouter from './routes/masterAdminRoutes.js';
import teacherAdminRouter from './routes/teacherAdminRoutes.js';
import leaderboardRouter from './routes/leaderboardRoutes.js';
import studyGroupRouter from './routes/studyGroupRoutes.js';
import skillRouter from './routes/skillRoutes.js';
import coinRouter from './routes/coinRoutes.js';
import rewardRouter from './routes/rewardRoutes.js';
import realtimeRouter from './routes/realtimeRoutes.js';
import productRouter from './routes/productRoutes.js';
import instagramRouter from './routes/instagramRoutes.js';
import pixRouter from './routes/pixRoutes.js';
import stripeRouter from './routes/stripeRoutes.js';
import healthRouter from './routes/health.js';
import googleRouter from './routes/googleRoutes.js';
import openRouterRoutes from './routes/openRouterRoutes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './configs/swagger.js';

// initialize express 
const app = express();

// Connect to database using adapter
try {
  await dbAdapter.connect();
  console.log('✅ Database connected');
} catch (error) {
  console.error('❌ Database connection failed:', error.message);
  if (process.env.NODE_ENV === 'production') {
    throw error;
  } else {
    console.warn('⚠️  Continuing without database. Some features will not work.');
  }
}

// Run database migrations
if (process.env.RUN_MIGRATIONS !== 'false') {
  try {
    const migrationRunner = await import('./migrations/migrationRunner.js');
    await migrationRunner.default.runMigrations();
  } catch (error) {
    console.error('Migration error:', error.message);
    // Don't crash server if migrations fail in development
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
  }
}

// Initialize storage adapter
try {
  await storageAdapter.connect();
  console.log('✅ Storage adapter connected');
} catch (error) {
  console.error('❌ Storage adapter connection failed:', error.message);
  if (process.env.NODE_ENV === 'production') {
    throw error;
  } else {
    console.warn('⚠️  Continuing without storage. File uploads will not work.');
  }
}


// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGINS?.split(',') || ['https://sofluent.ai']
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

// middleware
app.use(securityHeaders); // Security headers (must be first)
app.use(cors(corsOptions));

// Clerk middleware - only apply if CLERK_SECRET_KEY is set
if (process.env.CLERK_SECRET_KEY) {
  app.use(clerkMiddleware());
} else {
  console.warn('⚠️  CLERK_SECRET_KEY not set - Clerk authentication disabled');
  // Mock auth middleware for development
  app.use((req, res, next) => {
    req.auth = req.auth || { userId: null };
    next();
  });
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(sanitizeBody); // Sanitize all request bodies

// Apply rate limiting
app.use('/api', rateLimiters.api);
app.use('/api/user', rateLimiters.auth); // Stricter limits for auth endpoints

// API Documentation (Swagger)
if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_API_DOCS === 'true') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'So Fluent API Documentation',
  }));
}


// Make adapters available to routes via app locals
app.locals.db = dbAdapter;
app.locals.storage = storageAdapter;

// Routes
app.get('/', (req,res)=>{res.send("So Fluent API is working fine!")})
app.use('/health', healthRouter); // Health check endpoints
app.post('/clerk', express.json(), clerkWebhooks)
app.use('/api/educator', express.json(), educatorRouter);
app.use('/api/course', express.json(), courseRouter);
app.use('/api/user', express.json(), userRouter);
app.use('/api/student', express.json(), studentRouter);
app.use('/api/classes', express.json(), classRouter);
app.use('/api/feed', express.json(), feedRouter);
app.use('/api/social', express.json(), socialRouter);
app.use('/api/missions', express.json(), missionRouter);
app.use('/api/ai-life-mirror', express.json(), aiLifeMirrorRouter);
app.use('/api/career', express.json(), careerRouter);
app.use('/api/conversation', express.json(), conversationRouter);
app.use('/api/pronunciation', express.json(), pronunciationRouter);
app.use('/api/study-buddy', express.json(), studyBuddyRouter);
app.use('/api/success-story', express.json(), successStoryRouter);
app.use('/api/admin', express.json(), masterAdminRouter);
app.use('/api/teacher', express.json(), teacherAdminRouter);
app.use('/api/leaderboard', express.json(), leaderboardRouter);
app.use('/api/study-groups', express.json(), studyGroupRouter);
app.use('/api/skills', express.json(), skillRouter);
app.use('/api/coins', express.json(), coinRouter);
app.use('/api/rewards', express.json(), rewardRouter);
app.use('/api/earnings', express.json(), (await import('./routes/earningRoutes.js')).default);
app.use('/api/withdrawals', express.json(), (await import('./routes/withdrawalRoutes.js')).default);
app.use('/api/referrals', express.json(), (await import('./routes/referralRoutes.js')).default);
app.use('/api/realtime', realtimeRouter);
app.use('/api/products', express.json(), productRouter);
app.use('/api/instagram', express.json(), instagramRouter);
app.use('/api/payments/pix', pixRouter);
app.use('/api/payments/stripe', stripeRouter);
app.use('/api/google', googleRouter);
app.use('/api/ai', openRouterRoutes);
app.post('/stripe', express.raw({type: 'application/json'}), stripeWebhooks);

// Error handling middleware (must be last)
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
app.use(notFoundHandler); // 404 handler
app.use(errorHandler); // Global error handler

// port
const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> {
    console.log(`✅ Server running on port ${PORT}`);
    if (process.env.NODE_ENV !== 'production') {
        console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    }
})