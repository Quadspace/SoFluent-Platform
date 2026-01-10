// This file is deprecated - use database-adapter.js instead
// Kept for backward compatibility during migration
import mongoose from "mongoose";

const connectDB = async ()=>{
    if (process.env.NODE_ENV !== 'production') {
        mongoose.connection.on('connected', () => {
            // Silent in production
        })
    }
    await mongoose.connect(`${process.env.MONGODB_URI}/SoFluent`)
}

export default connectDB;