import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import dbAdapter from './configs/database-adapter.js';
import storageAdapter from './configs/storage-adapter.js';
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js';
import educatorRouter from './routes/educatorRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import courseRouter from './routes/courseRoute.js';
import userRouter from './routes/userRoutes.js';
import productRouter from './routes/productRoutes.js';
import instagramRouter from './routes/instagramRoutes.js';

// initialize express 
const app = express();

// Connect to database using adapter
await dbAdapter.connect();

// Initialize storage adapter
await storageAdapter.connect();


// middleware
app.use(cors());
app.use(clerkMiddleware())


// Make adapters available to routes via app locals
app.locals.db = dbAdapter;
app.locals.storage = storageAdapter;

// Routes
app.get('/', (req,res)=>{res.send("So Fluent API is working fine!")})
app.post('/clerk', express.json(), clerkWebhooks)
app.use('/api/educator', express.json(), educatorRouter);
app.use('/api/course', express.json(), courseRouter);
app.use('/api/user', express.json(), userRouter);
app.use('/api/products', express.json(), productRouter);
app.use('/api/instagram', express.json(), instagramRouter);
app.post('/stripe', express.raw({type: 'application/json'}), stripeWebhooks);



// port
const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> {
    if (process.env.NODE_ENV !== 'production') {
        // Silent in production
    }
})