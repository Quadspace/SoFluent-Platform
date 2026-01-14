/**
 * Conversation Controller
 * Feature 5: AI Conversation Partner™
 * Manus-compliant implementation
 */

import dbAdapter from '../configs/database-adapter.js';
import storageAdapter from '../configs/storage-adapter.js';
import Conversation from '../models/Conversation.js';
import User from '../models/User.js';
import { generateConversationResponse } from '../services/openaiService.js';

/**
 * POST /api/conversation/start
 * Start a new conversation session
 */
export const startConversation = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        const { topic, level } = req.body;
        
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const conversation = await dbAdapter.create(Conversation, {
            userId: user._id.toString(),
            topic: topic || 'General conversation',
            level: level || user.englishLevel || 'intermediate',
            messages: []
        });

        res.json({
            success: true,
            conversation
        });
    } catch (error) {
        console.error('Error starting conversation:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * POST /api/conversation/:id/message
 * Send a message in conversation
 */
export const sendMessage = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        const { id } = req.params;
        const { content, audioUrl } = req.body;

        const conversation = await dbAdapter.findOne(Conversation, {
            _id: id,
            userId: user._id.toString()
        });

        if (!conversation) {
            return res.json({ success: false, message: 'Conversation not found' });
        }

        // Add user message
        const messages = conversation.messages || [];
        messages.push({
            role: 'user',
            content: content || '',
            audioUrl: audioUrl || null,
            timestamp: new Date()
        });

        // Generate AI response
        const aiResponse = await generateConversationResponse(messages, conversation.level);
        messages.push(aiResponse);

        // Update conversation
        await dbAdapter.updateOne(Conversation, { _id: id }, {
            messages,
            duration: (conversation.duration || 0) + 30 // Estimate
        });

        res.json({
            success: true,
            message: aiResponse,
            conversation
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * GET /api/conversation/:id
 * Get conversation details
 */
export const getConversation = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { id } = req.params;

        const conversation = await dbAdapter.findOne(Conversation, {
            _id: id,
            userId: userId
        });

        if (!conversation) {
            return res.json({ success: false, message: 'Conversation not found' });
        }

        res.json({
            success: true,
            conversation
        });
    } catch (error) {
        console.error('Error fetching conversation:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * GET /api/conversation
 * Get user's conversations
 */
export const getConversations = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const conversations = await dbAdapter.find(Conversation, {
            userId: user._id.toString()
        }, {
            sort: { createdAt: -1 },
            limit: 20
        });

        res.json({
            success: true,
            conversations
        });
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.json({ success: false, message: error.message });
    }
};

export default {
    startConversation,
    sendMessage,
    getConversation,
    getConversations
};
