/**
 * Pronunciation Controller
 * Feature 7: AI Pronunciation Coach™
 * Manus-compliant implementation
 */

import dbAdapter from '../configs/database-adapter.js';
import storageAdapter from '../configs/storage-adapter.js';
import PronunciationRecord from '../models/PronunciationRecord.js';
import User from '../models/User.js';
import { analyzePronunciation } from '../services/openaiService.js';

/**
 * POST /api/pronunciation/analyze
 * Analyze pronunciation from audio
 */
export const analyzePronunciationAudio = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        const { phrase } = req.body;
        
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        if (!req.file) {
            return res.json({ success: false, message: 'No audio file provided' });
        }

        // Upload audio
        const result = await storageAdapter.upload(req.file, 'pronunciation', {
            resource_type: 'video' // For audio files
        });

        // Analyze pronunciation
        const analysis = await analyzePronunciation(result.url, phrase);

        // Save record
        const record = await dbAdapter.create(PronunciationRecord, {
            userId: user._id.toString(),
            phrase,
            audioUrl: result.url,
            accuracy: analysis.accuracy,
            fluency: analysis.fluency,
            phonemes: analysis.phonemes || [],
            feedback: analysis.feedback,
            attempts: 1,
            bestScore: analysis.accuracy
        });

        res.json({
            success: true,
            record,
            analysis
        });
    } catch (error) {
        console.error('Error analyzing pronunciation:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * GET /api/pronunciation/records
 * Get user's pronunciation records
 */
export const getPronunciationRecords = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const records = await dbAdapter.find(PronunciationRecord, {
            userId: user._id.toString()
        }, {
            sort: { createdAt: -1 },
            limit: 50
        });

        res.json({
            success: true,
            records
        });
    } catch (error) {
        console.error('Error fetching pronunciation records:', error);
        res.json({ success: false, message: error.message });
    }
};

export default {
    analyzePronunciationAudio,
    getPronunciationRecords
};
