/**
 * Zoom Service
 * Feature 2: Workout-to-Fluency™
 * Zoom API integration for live classes
 */

import axios from 'axios';

/**
 * Get Zoom access token using JWT
 */
async function getZoomAccessToken() {
    const zoomApiKey = process.env.ZOOM_API_KEY;
    const zoomApiSecret = process.env.ZOOM_API_SECRET;
    
    if (!zoomApiKey || !zoomApiSecret) {
        // Preview mode - return mock token
        return 'preview-token';
    }

    // Generate JWT token for Zoom
    const jwt = require('jsonwebtoken');
    const payload = {
        iss: zoomApiKey,
        exp: Date.now() + 3600 * 1000 // 1 hour
    };

    return jwt.sign(payload, zoomApiSecret);
}

/**
 * Create a Zoom meeting
 */
export async function createZoomMeeting(meetingData) {
    try {
        const accessToken = await getZoomAccessToken();
        
        if (accessToken === 'preview-token') {
            // Return mock meeting data for preview
            return {
                id: 'mock-meeting-id',
                join_url: 'https://zoom.us/j/mock-meeting',
                start_url: 'https://zoom.us/s/mock-meeting',
                password: 'mock123'
            };
        }

        const response = await axios.post(
            'https://api.zoom.us/v2/users/me/meetings',
            {
                topic: meetingData.topic,
                type: 2, // Scheduled meeting
                start_time: meetingData.start_time,
                duration: meetingData.duration,
                timezone: 'America/Sao_Paulo',
                settings: {
                    host_video: true,
                    participant_video: true,
                    join_before_host: false,
                    waiting_room: true,
                    ...meetingData.settings
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error creating Zoom meeting:', error);
        // Return mock data on error
        return {
            id: 'error-meeting-id',
            join_url: 'https://zoom.us/j/error-meeting',
            start_url: 'https://zoom.us/s/error-meeting',
            password: 'error123'
        };
    }
}

/**
 * Get meeting details
 */
export async function getMeetingDetails(meetingId) {
    try {
        const accessToken = await getZoomAccessToken();
        
        if (accessToken === 'preview-token') {
            return null;
        }

        const response = await axios.get(
            `https://api.zoom.us/v2/meetings/${meetingId}`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error fetching meeting details:', error);
        return null;
    }
}

export default {
    createZoomMeeting,
    getMeetingDetails
};
