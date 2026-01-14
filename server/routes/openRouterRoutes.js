/**
 * OpenRouter AI Routes
 * Handles all AI features powered by OpenRouter
 */

import express from 'express';
import { clerkMiddleware } from '@clerk/express';
import openRouterService from '../services/openRouter.js';

const router = express.Router();

/**
 * @swagger
 * /api/ai/chat:
 *   post:
 *     summary: Chat with AI conversation partner
 *     tags: [AI]
 */
router.post('/chat', clerkMiddleware(), async (req, res) => {
  try {
    const { message, conversationHistory, studentLevel } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required field: message'
      });
    }

    const result = await openRouterService.chatWithAI(
      message,
      conversationHistory || [],
      studentLevel || 'intermediate'
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/ai/generate-lesson:
 *   post:
 *     summary: Generate personalized lesson from Instagram data
 *     tags: [AI]
 */
router.post('/generate-lesson', clerkMiddleware(), async (req, res) => {
  try {
    const { instagramData, studentLevel } = req.body;

    if (!instagramData || !studentLevel) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: instagramData, studentLevel'
      });
    }

    const result = await openRouterService.generatePersonalizedLesson(
      instagramData,
      studentLevel
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/ai/analyze-pronunciation:
 *   post:
 *     summary: Analyze pronunciation
 *     tags: [AI]
 */
router.post('/analyze-pronunciation', clerkMiddleware(), async (req, res) => {
  try {
    const { audioTranscript, targetPhrase } = req.body;

    if (!audioTranscript || !targetPhrase) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: audioTranscript, targetPhrase'
      });
    }

    const result = await openRouterService.analyzePronunciation(
      audioTranscript,
      targetPhrase
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/ai/review-schedule:
 *   post:
 *     summary: Generate spaced repetition review schedule
 *     tags: [AI]
 */
router.post('/review-schedule', clerkMiddleware(), async (req, res) => {
  try {
    const { vocabulary, studentProgress } = req.body;

    if (!vocabulary || !studentProgress) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: vocabulary, studentProgress'
      });
    }

    const result = await openRouterService.generateReviewSchedule(
      vocabulary,
      studentProgress
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/ai/career-lesson:
 *   post:
 *     summary: Generate career-focused English lesson
 *     tags: [AI]
 */
router.post('/career-lesson', clerkMiddleware(), async (req, res) => {
  try {
    const { linkedinData, industry } = req.body;

    if (!linkedinData || !industry) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: linkedinData, industry'
      });
    }

    const result = await openRouterService.generateCareerLesson(
      linkedinData,
      industry
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/ai/success-story:
 *   post:
 *     summary: Generate success story from student progress
 *     tags: [AI]
 */
router.post('/success-story', clerkMiddleware(), async (req, res) => {
  try {
    const { studentProgress } = req.body;

    if (!studentProgress) {
      return res.status(400).json({
        success: false,
        message: 'Missing required field: studentProgress'
      });
    }

    const result = await openRouterService.generateSuccessStory(studentProgress);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/ai/models:
 *   get:
 *     summary: Get available AI models
 *     tags: [AI]
 */
router.get('/models', clerkMiddleware(), async (req, res) => {
  try {
    const result = await openRouterService.getAvailableModels();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
