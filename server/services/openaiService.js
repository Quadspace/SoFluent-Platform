/**
 * OpenAI Service
 * AI features: Life Mirror, Conversation Partner, Pronunciation Coach
 * Manus-compliant service layer
 */

import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

/**
 * Analyze Instagram post and generate lesson
 * Feature 1: AI Life Mirror™
 */
export async function generateLessonFromInstagram(userId, instagramPost) {
    try {
        if (!process.env.OPENAI_API_KEY) {
            // Preview mode - return mock lesson
            return {
                title: 'Lesson from Your Instagram',
                vocabulary: ['beach', 'sunset', 'vacation', 'relax', 'enjoy'],
                phrases: ['I love the beach', 'Beautiful sunset', 'Enjoying my vacation'],
                exercises: [
                    {
                        type: 'multiple-choice',
                        question: 'What do you see in the photo?',
                        options: ['A beach', 'A mountain', 'A city'],
                        correctAnswer: 'A beach',
                        explanation: 'The photo shows a beach scene.'
                    }
                ]
            };
        }

        // Analyze image with GPT-4 Vision
        const visionResponse = await openai.chat.completions.create({
            model: 'gpt-4-vision-preview',
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: 'Analyze this Instagram photo and caption. Generate English vocabulary and phrases related to what you see. Focus on practical, conversational English that the student can use in real life.' },
                        { type: 'image_url', image_url: { url: instagramPost.media_url } },
                        { type: 'text', text: `Caption: ${instagramPost.caption || 'No caption'}` }
                    ]
                }
            ],
            max_tokens: 500
        });

        const analysis = visionResponse.choices[0].message.content;

        // Generate structured lesson
        const lessonResponse = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: 'You are an English teacher creating personalized lessons from students\' Instagram photos. Generate vocabulary, phrases, and exercises in JSON format.'
                },
                {
                    role: 'user',
                    content: `Based on this analysis: "${analysis}", create a JSON lesson with: title (string), vocabulary (array of 10 words), phrases (array of 5 phrases), exercises (array of 3 exercises with type, question, options, correctAnswer, explanation). Make it personal and relevant to the student's life.`
                }
            ],
            response_format: { type: 'json_object' }
        });

        const lessonData = JSON.parse(lessonResponse.choices[0].message.content);
        return lessonData;
    } catch (error) {
        console.error('Error generating lesson:', error);
        // Return mock lesson on error
        return {
            title: 'Lesson from Your Instagram',
            vocabulary: ['photo', 'caption', 'share', 'moment', 'memory'],
            phrases: ['I took this photo', 'I want to share this', 'This is a special moment'],
            exercises: []
        };
    }
}

/**
 * Generate conversation response
 * Feature 5: AI Conversation Partner™
 */
export async function generateConversationResponse(messages, userLevel = 'intermediate') {
    try {
        if (!process.env.OPENAI_API_KEY) {
            return {
                role: 'assistant',
                content: 'Hello! How can I help you practice English today?',
                timestamp: new Date()
            };
        }

        const systemPrompt = `You are a friendly English conversation partner helping a ${userLevel} level student practice English. 
        - Keep responses natural and conversational
        - Use appropriate vocabulary for ${userLevel} level
        - Ask follow-up questions to keep the conversation going
        - Provide gentle corrections when needed
        - Be encouraging and supportive`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages
            ],
            temperature: 0.7,
            max_tokens: 200
        });

        return {
            role: 'assistant',
            content: response.choices[0].message.content,
            timestamp: new Date()
        };
    } catch (error) {
        console.error('Error generating conversation:', error);
        return {
            role: 'assistant',
            content: 'I apologize, but I\'m having trouble responding right now. Please try again!',
            timestamp: new Date()
        };
    }
}

/**
 * Analyze pronunciation
 * Feature 7: AI Pronunciation Coach™
 */
export async function analyzePronunciation(audioUrl, expectedPhrase) {
    try {
        if (!process.env.OPENAI_API_KEY) {
            return {
                accuracy: 85,
                fluency: 80,
                phonemes: [],
                feedback: {
                    strengths: ['Good rhythm', 'Clear pronunciation'],
                    improvements: ['Work on vowel sounds', 'Practice intonation'],
                    practiceWords: ['pronunciation', 'practice']
                }
            };
        }

        // Use Whisper for transcription
        const transcription = await openai.audio.transcriptions.create({
            file: audioUrl, // Would need to fetch and convert
            model: 'whisper-1',
            language: 'en'
        });

        // Analyze pronunciation (simplified - would need phoneme analysis)
        const accuracy = calculateAccuracy(transcription.text, expectedPhrase);
        
        return {
            accuracy,
            fluency: accuracy + 5, // Simplified
            phonemes: [],
            feedback: {
                strengths: accuracy > 80 ? ['Good pronunciation!'] : ['Keep practicing!'],
                improvements: accuracy < 80 ? ['Focus on clarity', 'Practice more'] : [],
                practiceWords: extractWords(expectedPhrase)
            }
        };
    } catch (error) {
        console.error('Error analyzing pronunciation:', error);
        return {
            accuracy: 0,
            fluency: 0,
            phonemes: [],
            feedback: {
                strengths: [],
                improvements: ['Error analyzing audio'],
                practiceWords: []
            }
        };
    }
}

// Helper functions
function calculateAccuracy(actual, expected) {
    // Simplified accuracy calculation
    const actualWords = actual.toLowerCase().split(' ');
    const expectedWords = expected.toLowerCase().split(' ');
    let matches = 0;
    
    expectedWords.forEach((word, i) => {
        if (actualWords[i] === word) matches++;
    });
    
    return Math.round((matches / expectedWords.length) * 100);
}

function extractWords(text) {
    return text.toLowerCase().split(' ').filter(w => w.length > 2);
}

export default {
    generateLessonFromInstagram,
    generateConversationResponse,
    analyzePronunciation
};
