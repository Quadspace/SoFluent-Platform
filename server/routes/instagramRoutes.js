import express from 'express';
import { protectEducator } from '../middlewares/authMiddleware.js';
import { protect } from '@clerk/express';

const router = express.Router();

/**
 * @swagger
 * /api/instagram/connect:
 *   post:
 *     summary: Connect Instagram account (OAuth callback)
 *     tags: [Instagram]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 description: OAuth authorization code
 *     responses:
 *       200:
 *         description: Instagram connected successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
// Connect Instagram (OAuth callback)
router.post('/connect', protect(), async (req, res) => {
	try {
		const { code } = req.body;
		const userId = req.auth.userId;

		// Exchange code for access token
		// Instagram OAuth 2.0 flow
		// Step 1: Exchange authorization code for access token
		const INSTAGRAM_CLIENT_ID = process.env.INSTAGRAM_CLIENT_ID;
		const INSTAGRAM_CLIENT_SECRET = process.env.INSTAGRAM_CLIENT_SECRET;
		const INSTAGRAM_REDIRECT_URI = process.env.INSTAGRAM_REDIRECT_URI || `${process.env.FRONTEND_URL}/profile`;

		if (!INSTAGRAM_CLIENT_ID || !INSTAGRAM_CLIENT_SECRET) {
			// Preview mode - simulate connection
			const User = require('../models/User.js').default;
			const dbAdapter = require('../configs/database-adapter.js').default;
			
			await dbAdapter.updateOne(
				User,
				{ clerkId: userId },
				{
					instagramConnect: true,
					instagramConnectedAt: new Date(),
					instagramAccessToken: 'preview-token' // Mock token
				}
			);

			return res.json({
				success: true,
				message: 'Instagram connected successfully (preview mode)',
			});
		}

		// Real OAuth flow
		const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				client_id: INSTAGRAM_CLIENT_ID,
				client_secret: INSTAGRAM_CLIENT_SECRET,
				grant_type: 'authorization_code',
				redirect_uri: INSTAGRAM_REDIRECT_URI,
				code: code
			})
		});

		if (!tokenResponse.ok) {
			throw new Error('Failed to exchange Instagram code');
		}

		const tokenData = await tokenResponse.json();
		const accessToken = tokenData.access_token;

		// Store Instagram connection in database
		const User = require('../models/User.js').default;
		const dbAdapter = require('../configs/database-adapter.js').default;
		
		await dbAdapter.updateOne(
			User,
			{ clerkId: userId },
			{
				instagramConnect: true,
				instagramConnectedAt: new Date(),
				instagramAccessToken: accessToken,
				instagramUserId: tokenData.user_id
			}
		);

		res.json({
			success: true,
			message: 'Instagram connected successfully',
		});
	} catch (error) {
		console.error('Error connecting Instagram:', error);
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
});

/**
 * @swagger
 * /api/instagram/data:
 *   get:
 *     summary: Get Instagram data for AI analysis
 *     tags: [Instagram]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Instagram data retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     photos:
 *                       type: array
 *                     captions:
 *                       type: array
 *                     hashtags:
 *                       type: array
 */
// Get Instagram data for analysis
router.get('/data', protect(), async (req, res) => {
	try {
		const userId = req.auth.userId;

		const User = require('../models/User.js').default;
		const dbAdapter = require('../configs/database-adapter.js').default;
		
		const user = await dbAdapter.findOne(User, { clerkId: userId });
		
		if (!user || !user.instagramConnect || !user.instagramAccessToken) {
			return res.json({
				success: false,
				message: 'Instagram not connected'
			});
		}

		// Fetch Instagram data using stored access token
		// Instagram Basic Display API endpoint
		const INSTAGRAM_ACCESS_TOKEN = user.instagramAccessToken;
		
		try {
			// Get user's media
			const mediaResponse = await fetch(
				`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,timestamp&access_token=${INSTAGRAM_ACCESS_TOKEN}`
			);

			if (!mediaResponse.ok) {
				throw new Error('Failed to fetch Instagram data');
			}

			const mediaData = await mediaResponse.json();
			
			// Process data for AI analysis
			const processedData = {
				photos: mediaData.data
					.filter(item => item.media_type === 'IMAGE' || item.media_type === 'CAROUSEL_ALBUM')
					.slice(0, 50)
					.map(item => ({
						id: item.id,
						url: item.media_url,
						caption: item.caption || '',
						timestamp: item.timestamp
					})),
				captions: mediaData.data
					.filter(item => item.caption)
					.map(item => item.caption),
				hashtags: extractHashtags(mediaData.data.map(item => item.caption || '').join(' ')),
				interests: [] // Would be analyzed by AI
			};

			res.json({
				success: true,
				data: processedData,
			});
		} catch (apiError) {
			// If API fails, return mock data for preview
			console.error('Instagram API error:', apiError);
			res.json({
				success: true,
				data: {
					photos: [],
					captions: [],
					interests: [],
					hashtags: [],
				},
			});
		}
	} catch (error) {
		console.error('Error fetching Instagram data:', error);
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
});

// Helper function to extract hashtags
function extractHashtags(text) {
	const hashtagRegex = /#(\w+)/g;
	const matches = text.match(hashtagRegex);
	return matches ? [...new Set(matches.map(tag => tag.substring(1)))] : [];
}

/**
 * @swagger
 * /api/instagram/disconnect:
 *   post:
 *     summary: Disconnect Instagram account
 *     tags: [Instagram]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Instagram disconnected successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
// Disconnect Instagram
router.post('/disconnect', protect(), async (req, res) => {
	try {
		const userId = req.auth.userId;

		const User = require('../models/User.js').default;
		const dbAdapter = require('../configs/database-adapter.js').default;

		// Remove Instagram connection from database
		await dbAdapter.updateOne(
			User,
			{ clerkId: userId },
			{
				instagramConnect: false,
				instagramAccessToken: null,
				instagramUserId: null,
				instagramDisconnectedAt: new Date()
			}
		);

		res.json({
			success: true,
			message: 'Instagram disconnected successfully',
		});
	} catch (error) {
		console.error('Error disconnecting Instagram:', error);
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
});

export default router;
