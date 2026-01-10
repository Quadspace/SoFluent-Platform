import express from 'express';
import { protectEducator } from '../middlewares/authMiddleware.js';
import { protect } from '@clerk/express';

const router = express.Router();

// Connect Instagram (OAuth callback)
router.post('/connect', protect(), async (req, res) => {
	try {
		const { code } = req.body;
		const userId = req.auth.userId;

		// Exchange code for access token
		// TODO: Implement Instagram OAuth token exchange
		// const accessToken = await exchangeInstagramCode(code);

		// Store Instagram connection in database
		// TODO: Save to database adapter
		// await dbAdapter.users.updateInstagramConnection(userId, { accessToken });

		res.json({
			success: true,
			message: 'Instagram connected successfully',
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
});

// Get Instagram data for analysis
router.get('/data', protect(), async (req, res) => {
	try {
		const userId = req.auth.userId;

		// TODO: Fetch Instagram data using stored access token
		// const instagramData = await fetchInstagramData(userId);

		// Mock data for now
		const mockData = {
			photos: [],
			captions: [],
			interests: [],
			hashtags: [],
		};

		res.json({
			success: true,
			data: mockData,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
});

// Disconnect Instagram
router.post('/disconnect', protect(), async (req, res) => {
	try {
		const userId = req.auth.userId;

		// TODO: Remove Instagram connection from database
		// await dbAdapter.users.removeInstagramConnection(userId);

		res.json({
			success: true,
			message: 'Instagram disconnected successfully',
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
});

export default router;
