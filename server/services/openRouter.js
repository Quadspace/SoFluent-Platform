/**
 * OpenRouter AI Service
 * Cost-effective AI integration using OpenRouter
 * Supports 200+ AI models with 70-90% cost savings
 */

import axios from 'axios';

class OpenRouterService {
  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY;
    this.baseUrl = 'https://openrouter.ai/api/v1';
    
    if (!this.apiKey) {
      // OpenRouter API key not configured - AI features will be disabled
    }
  }

  /**
   * Make a request to OpenRouter API
   * @param {string} model - Model identifier (e.g., 'anthropic/claude-3.5-sonnet')
   * @param {Array} messages - Conversation messages
   * @param {Object} options - Additional options (temperature, max_tokens, etc.)
   * @returns {Promise<Object>} AI response with usage and cost
   */
  async chat(model, messages, options = {}) {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key not configured');
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: model,
          messages: messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.max_tokens || 2000,
          ...options
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'HTTP-Referer': process.env.FRONTEND_URL || 'https://sofluent.ai',
            'X-Title': 'So Fluent',
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30 second timeout
        }
      );

      const usage = response.data.usage;
      const cost = this.calculateCost(usage, model);

      return {
        success: true,
        content: response.data.choices[0].message.content,
        model: model,
        usage: {
          promptTokens: usage.prompt_tokens,
          completionTokens: usage.completion_tokens,
          totalTokens: usage.prompt_tokens + usage.completion_tokens
        },
        cost: cost
      };
    } catch (error) {
      throw new Error(`OpenRouter API error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Generate personalized lesson from Instagram data (AI Life Mirror)
   * @param {Object} instagramData - Student's Instagram posts, photos, interests
   * @param {string} studentLevel - Student's English level (beginner, intermediate, advanced)
   * @returns {Promise<Object>} Generated lesson content
   */
  async generatePersonalizedLesson(instagramData, studentLevel) {
    const messages = [
      {
        role: 'system',
        content: `You are an expert English teacher creating personalized lessons based on students' Instagram content. 
        Create engaging, practical lessons that connect to the student's real life and interests.
        Format your response as JSON with: title, description, vocabulary (array), exercises (array), and practiceTips (array).`
      },
      {
        role: 'user',
        content: `Create a 15-minute English lesson for a ${studentLevel} student based on their Instagram interests:
        
        Posts: ${JSON.stringify(instagramData.posts || [])}
        Photos: ${JSON.stringify(instagramData.photos || [])}
        Interests: ${JSON.stringify(instagramData.interests || [])}
        Recent Activity: ${JSON.stringify(instagramData.recentActivity || [])}
        
        Make it practical, fun, and relevant to their life!`
      }
    ];

    // Use Claude 3.5 Sonnet for quality lesson generation ($0.003/1K tokens)
    return await this.chat('anthropic/claude-3.5-sonnet', messages, {
      temperature: 0.8,
      max_tokens: 2000
    });
  }

  /**
   * AI Conversation Partner - Practice English 24/7
   * @param {string} studentMessage - Student's message
   * @param {Array} conversationHistory - Previous messages
   * @param {string} studentLevel - Student's English level
   * @returns {Promise<Object>} AI response
   */
  async chatWithAI(studentMessage, conversationHistory = [], studentLevel = 'intermediate') {
    const messages = [
      {
        role: 'system',
        content: `You are a friendly, encouraging English conversation partner for a ${studentLevel} student.
        - Correct mistakes gently and naturally
        - Ask follow-up questions to keep the conversation going
        - Use appropriate vocabulary for their level
        - Be supportive and positive
        - Keep responses conversational (2-3 sentences max)`
      },
      ...conversationHistory,
      {
        role: 'user',
        content: studentMessage
      }
    ];

    // Use Gemini Pro for chat (cheap: $0.0004/1K tokens)
    return await this.chat('google/gemini-pro', messages, {
      temperature: 0.7,
      max_tokens: 500
    });
  }

  /**
   * AI Pronunciation Coach - Analyze speech
   * @param {string} audioTranscript - Transcribed audio
   * @param {string} targetPhrase - What student should say
   * @returns {Promise<Object>} Pronunciation feedback
   */
  async analyzePronunciation(audioTranscript, targetPhrase) {
    const messages = [
      {
        role: 'system',
        content: `You are a pronunciation coach. Analyze the student's speech and provide specific, actionable feedback.
        Format your response as JSON with: accuracy (0-100), feedback (string), mistakes (array), and tips (array).`
      },
      {
        role: 'user',
        content: `Target phrase: "${targetPhrase}"
        Student said: "${audioTranscript}"

        Provide detailed feedback on:
        - Pronunciation accuracy
        - Intonation and stress
        - Fluency
        - Specific mistakes
        - Improvement tips`
      }
    ];

    // Use GPT-4 Turbo for quality pronunciation analysis ($0.006/1K tokens)
    return await this.chat('openai/gpt-4-turbo', messages, {
      temperature: 0.3,
      max_tokens: 1000
    });
  }

  /**
   * Smart Study Buddy - Generate spaced repetition schedule
   * @param {Array} vocabulary - Words to review
   * @param {Object} studentProgress - Student's progress data
   * @returns {Promise<Object>} Review schedule
   */
  async generateReviewSchedule(vocabulary, studentProgress) {
    const messages = [
      {
        role: 'system',
        content: `You are a smart study buddy using spaced repetition. Create an optimal review schedule.
        Format as JSON with: wordsToReview (array), nextReviewDate (date), and difficulty (easy/medium/hard).`
      },
      {
        role: 'user',
        content: `Vocabulary: ${JSON.stringify(vocabulary)}
        Student Progress: ${JSON.stringify(studentProgress)}
        
        Predict when the student will forget each word and create a review schedule.`
      }
    ];

    // Use Claude 3.5 for smart scheduling ($0.003/1K tokens)
    return await this.chat('anthropic/claude-3.5-sonnet', messages, {
      temperature: 0.5,
      max_tokens: 1500
    });
  }

  /**
   * Career English Accelerator - Generate industry-specific lessons
   * @param {Object} linkedinData - Student's LinkedIn profile data
   * @param {string} industry - Target industry
   * @returns {Promise<Object>} Career-focused lesson
   */
  async generateCareerLesson(linkedinData, industry) {
    const messages = [
      {
        role: 'system',
        content: `You are a career English coach. Create industry-specific English lessons.
        Format as JSON with: title, industryVocabulary (array), scenarios (array), and practiceExercises (array).`
      },
      {
        role: 'user',
        content: `LinkedIn Profile: ${JSON.stringify(linkedinData)}
        Target Industry: ${industry}
        
        Create a practical English lesson for this industry with real-world scenarios.`
      }
    ];

    // Use Claude 3.5 for quality career content ($0.003/1K tokens)
    return await this.chat('anthropic/claude-3.5-sonnet', messages, {
      temperature: 0.7,
      max_tokens: 2000
    });
  }

  /**
   * Success Story Generator - Create shareable progress stories
   * @param {Object} studentProgress - Student's progress data
   * @returns {Promise<Object>} Success story content
   */
  async generateSuccessStory(studentProgress) {
    const messages = [
      {
        role: 'system',
        content: `You are a storyteller creating inspiring success stories. Make it shareable and motivating.
        Format as JSON with: title, story (string), achievements (array), and quote (string).`
      },
      {
        role: 'user',
        content: `Student Progress: ${JSON.stringify(studentProgress)}
        
        Create an inspiring success story highlighting their journey and achievements.`
      }
    ];

    // Use GPT-4 Turbo for engaging stories ($0.006/1K tokens)
    return await this.chat('openai/gpt-4-turbo', messages, {
      temperature: 0.8,
      max_tokens: 1500
    });
  }

  /**
   * Smart model routing based on task complexity
   * @param {string} task - Task description
   * @param {string} complexity - 'simple', 'medium', or 'complex'
   * @returns {Promise<Object>} AI response with model used
   */
  async routeRequest(task, complexity = 'medium') {
    const models = {
      simple: 'google/gemini-pro', // $0.0004/1K tokens - Cheap for simple tasks
      medium: 'anthropic/claude-3.5-sonnet', // $0.003/1K tokens - Balanced
      complex: 'openai/gpt-4-turbo' // $0.006/1K tokens - Best quality
    };

    const model = models[complexity] || models.medium;

    return await this.chat(model, [
      {
        role: 'user',
        content: task
      }
    ]);
  }

  /**
   * Calculate cost based on usage and model
   * @param {Object} usage - Token usage from API
   * @param {string} model - Model identifier
   * @returns {number} Cost in USD
   */
  calculateCost(usage, model) {
    // Pricing per 1K tokens (input + output average)
    const pricing = {
      'google/gemini-pro': 0.0004,
      'anthropic/claude-3.5-sonnet': 0.003,
      'openai/gpt-4-turbo': 0.006,
      'openai/gpt-4': 0.03,
      'anthropic/claude-3-opus': 0.015,
      'meta-llama/llama-3-70b-instruct': 0.0007
    };

    const costPer1K = pricing[model] || 0.003; // Default to Claude pricing
    const totalTokens = usage.prompt_tokens + usage.completion_tokens;
    const cost = (totalTokens / 1000) * costPer1K;

    return parseFloat(cost.toFixed(6)); // Round to 6 decimal places
  }

  /**
   * Get available models (for admin dashboard)
   * @returns {Promise<Array>} List of available models
   */
  async getAvailableModels() {
    try {
      const response = await axios.get(
        `${this.baseUrl}/models`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'HTTP-Referer': process.env.FRONTEND_URL || 'https://sofluent.ai',
            'X-Title': 'So Fluent'
          }
        }
      );

      return {
        success: true,
        models: response.data.data || []
      };
    } catch (error) {
      return {
        success: false,
        models: []
      };
    }
  }
}

export default new OpenRouterService();
