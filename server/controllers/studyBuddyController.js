/**
 * Study Buddy Controller
 * Feature 8: Smart Study Buddy™
 * Spaced repetition system (SM-2 algorithm)
 * Manus-compliant implementation
 */

import dbAdapter from '../configs/database-adapter.js';
import Vocabulary from '../models/Vocabulary.js';
import User from '../models/User.js';

/**
 * SM-2 Algorithm for spaced repetition
 */
function calculateNextReview(quality, easeFactor, interval, repetitions) {
    // Quality: 0-5 (0=complete blackout, 5=perfect recall)
    if (quality < 3) {
        // Failed - reset
        return {
            easeFactor: easeFactor,
            interval: 1,
            repetitions: 0,
            nextReview: new Date(Date.now() + 86400000) // 1 day
        };
    }

    // Calculate new ease factor
    let newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    newEaseFactor = Math.max(1.3, newEaseFactor);

    // Calculate new interval
    let newInterval;
    if (repetitions === 0) {
        newInterval = 1;
    } else if (repetitions === 1) {
        newInterval = 6;
    } else {
        newInterval = Math.round(interval * newEaseFactor);
    }

    const nextReview = new Date(Date.now() + newInterval * 86400000);

    return {
        easeFactor: newEaseFactor,
        interval: newInterval,
        repetitions: repetitions + 1,
        nextReview
    };
}

/**
 * GET /api/study-buddy/review
 * Get words due for review
 */
export const getWordsForReview = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const now = new Date();
        const words = await dbAdapter.find(Vocabulary, {
            userId: user._id.toString(),
            mastered: false,
            $or: [
                { nextReview: { $lte: now } },
                { nextReview: { $exists: false } }
            ]
        }, {
            sort: { nextReview: 1 },
            limit: 20
        });

        res.json({
            success: true,
            words,
            count: words.length
        });
    } catch (error) {
        console.error('Error fetching words for review:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * POST /api/study-buddy/review
 * Submit review result
 */
export const submitReview = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        const { wordId, quality } = req.body; // quality: 0-5
        
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const word = await dbAdapter.findOne(Vocabulary, {
            _id: wordId,
            userId: user._id.toString()
        });

        if (!word) {
            return res.json({ success: false, message: 'Word not found' });
        }

        // Calculate next review using SM-2
        const reviewResult = calculateNextReview(
            quality,
            word.easeFactor || 2.5,
            word.interval || 1,
            word.repetitions || 0
        );

        await dbAdapter.updateOne(Vocabulary, { _id: wordId }, {
            easeFactor: reviewResult.easeFactor,
            interval: reviewResult.interval,
            repetitions: reviewResult.repetitions,
            nextReview: reviewResult.nextReview,
            lastReviewed: new Date(),
            reviewCount: (word.reviewCount || 0) + 1,
            mastered: reviewResult.repetitions >= 5 && quality >= 4
        });

        res.json({
            success: true,
            nextReview: reviewResult.nextReview,
            mastered: reviewResult.repetitions >= 5 && quality >= 4
        });
    } catch (error) {
        console.error('Error submitting review:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * POST /api/study-buddy/add-word
 * Add a new word to study
 */
export const addWord = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        const { word, translation, definition, example, source } = req.body;
        
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const vocabulary = await dbAdapter.create(Vocabulary, {
            userId: user._id.toString(),
            word,
            translation,
            definition,
            example,
            source: source || 'manual',
            easeFactor: 2.5,
            interval: 1,
            repetitions: 0,
            nextReview: new Date()
        });

        res.json({
            success: true,
            vocabulary
        });
    } catch (error) {
        console.error('Error adding word:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * GET /api/study-buddy/stats
 * Get study statistics
 */
export const getStats = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const user = await dbAdapter.findOne(User, { clerkId: userId });
        
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const allWords = await dbAdapter.find(Vocabulary, {
            userId: user._id.toString()
        });

        const mastered = allWords.filter(w => w.mastered).length;
        const dueForReview = allWords.filter(w => {
            if (w.mastered) return false;
            const nextReview = w.nextReview ? new Date(w.nextReview) : new Date(0);
            return nextReview <= new Date();
        }).length;

        res.json({
            success: true,
            stats: {
                totalWords: allWords.length,
                mastered,
                learning: allWords.length - mastered,
                dueForReview
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.json({ success: false, message: error.message });
    }
};

export default {
    getWordsForReview,
    submitReview,
    addWord,
    getStats
};
