/**
 * Post Model
 * Social Learning Feed - Community posts
 * Manus-compliant schema
 */

import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    user: { 
        type: String, 
        ref: 'User', 
        required: true 
    },
    type: { 
        type: String, 
        enum: ['text', 'voice', 'photo', 'video'], 
        required: true 
    },
    
    content: {
        text: String,
        audioUrl: String,
        imageUrl: String,
        videoUrl: String
    },
    
    likes: [{ type: String }], // Array of user IDs
    
    comments: [{
        user: { type: String, ref: 'User' },
        text: String,
        createdAt: { type: Date, default: Date.now }
    }],
    
    featured: { type: Boolean, default: false },
    featuredBy: { type: String, ref: 'User' },
    
    // Engagement metrics
    viewCount: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },
    
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

export default Post;
