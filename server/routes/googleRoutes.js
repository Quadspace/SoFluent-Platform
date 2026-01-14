/**
 * Google Integration Routes
 * Handles Google Classroom, Meet, Drive, Calendar, and Auth
 */

import express from 'express';
import { clerkMiddleware } from '@clerk/express';
import googleClassroomService from '../services/googleClassroom.js';
import googleMeetService from '../services/googleMeet.js';
import googleDriveService from '../services/googleDrive.js';
import googleCalendarService from '../services/googleCalendar.js';
import multer from 'multer';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

/**
 * @swagger
 * /api/google/classroom/create-course:
 *   post:
 *     summary: Create a Google Classroom course
 *     tags: [Google]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teacherEmail
 *               - courseName
 *               - description
 *             properties:
 *               teacherEmail:
 *                 type: string
 *               courseName:
 *                 type: string
 *               description:
 *                 type: string
 *               section:
 *                 type: string
 *     responses:
 *       200:
 *         description: Course created successfully
 */
router.post('/classroom/create-course', clerkMiddleware(), async (req, res) => {
  try {
    const { teacherEmail, courseName, description, section } = req.body;

    if (!teacherEmail || !courseName || !description) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: teacherEmail, courseName, description'
      });
    }

    // Set access token if provided
    if (req.body.accessToken) {
      googleClassroomService.setAccessToken(req.body.accessToken);
    }

    const result = await googleClassroomService.createCourse(
      teacherEmail,
      courseName,
      description,
      section
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
 * /api/google/classroom/enroll-student:
 *   post:
 *     summary: Enroll a student in a Google Classroom course
 *     tags: [Google]
 */
router.post('/classroom/enroll-student', clerkMiddleware(), async (req, res) => {
  try {
    const { courseId, studentEmail } = req.body;

    if (!courseId || !studentEmail) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: courseId, studentEmail'
      });
    }

    if (req.body.accessToken) {
      googleClassroomService.setAccessToken(req.body.accessToken);
    }

    const result = await googleClassroomService.enrollStudent(courseId, studentEmail);
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
 * /api/google/classroom/sync-course:
 *   post:
 *     summary: Sync So Fluent course with Google Classroom
 *     tags: [Google]
 */
router.post('/classroom/sync-course', clerkMiddleware(), async (req, res) => {
  try {
    const { course, teacherEmail } = req.body;

    if (!course || !teacherEmail) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: course, teacherEmail'
      });
    }

    if (req.body.accessToken) {
      googleClassroomService.setAccessToken(req.body.accessToken);
    }

    const result = await googleClassroomService.syncCourse(course, teacherEmail);
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
 * /api/google/meet/create:
 *   post:
 *     summary: Create a Google Meet
 *     tags: [Google]
 */
router.post('/meet/create', clerkMiddleware(), async (req, res) => {
  try {
    const { teacherEmail, title, startTime, durationMinutes, attendeeEmails, description } = req.body;

    if (!teacherEmail || !title || !startTime || !durationMinutes) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    if (req.body.accessToken) {
      googleMeetService.setAccessToken(req.body.accessToken);
    }

    const result = await googleMeetService.createMeeting(
      teacherEmail,
      title,
      new Date(startTime),
      durationMinutes,
      attendeeEmails || [],
      description
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
 * /api/google/meet/:eventId:
 *   get:
 *     summary: Get Google Meet details
 *     tags: [Google]
 */
router.get('/meet/:eventId', clerkMiddleware(), async (req, res) => {
  try {
    const { eventId } = req.params;

    if (req.query.accessToken) {
      googleMeetService.setAccessToken(req.query.accessToken);
    }

    const result = await googleMeetService.getMeetingDetails(eventId);
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
 * /api/google/drive/upload:
 *   post:
 *     summary: Upload file to Google Drive
 *     tags: [Google]
 */
router.post('/drive/upload', clerkMiddleware(), upload.single('file'), async (req, res) => {
  try {
    const { studentId, courseId } = req.body;
    const file = req.file;

    if (!studentId || !courseId || !file) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: studentId, courseId, file'
      });
    }

    if (req.body.accessToken) {
      googleDriveService.setAccessToken(req.body.accessToken);
    }

    const result = await googleDriveService.uploadStudentFile(studentId, courseId, file);
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
 * /api/google/drive/files:
 *   get:
 *     summary: Get student files from Google Drive
 *     tags: [Google]
 */
router.get('/drive/files', clerkMiddleware(), async (req, res) => {
  try {
    const { studentId, courseId } = req.query;

    if (!studentId || !courseId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: studentId, courseId'
      });
    }

    if (req.query.accessToken) {
      googleDriveService.setAccessToken(req.query.accessToken);
    }

    const result = await googleDriveService.getStudentFiles(studentId, courseId);
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
 * /api/google/calendar/schedule-class:
 *   post:
 *     summary: Schedule a class with Google Calendar
 *     tags: [Google]
 */
router.post('/calendar/schedule-class', clerkMiddleware(), async (req, res) => {
  try {
    const { teacherEmail, studentEmails, classDetails } = req.body;

    if (!teacherEmail || !studentEmails || !classDetails) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    if (req.body.accessToken) {
      googleCalendarService.setAccessToken(req.body.accessToken);
    }

    const result = await googleCalendarService.scheduleClass(
      teacherEmail,
      studentEmails,
      classDetails
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
 * /api/google/calendar/upcoming:
 *   get:
 *     summary: Get upcoming classes
 *     tags: [Google]
 */
router.get('/calendar/upcoming', clerkMiddleware(), async (req, res) => {
  try {
    const { userEmail, maxResults } = req.query;

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: 'Missing required field: userEmail'
      });
    }

    if (req.query.accessToken) {
      googleCalendarService.setAccessToken(req.query.accessToken);
    }

    const result = await googleCalendarService.getUpcomingClasses(
      userEmail,
      parseInt(maxResults) || 10
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
 * /api/google/callback:
 *   post:
 *     summary: Handle Google OAuth callback
 *     tags: [Google]
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
 *         description: OAuth tokens received successfully
 *       400:
 *         description: Invalid request
 */
router.post('/callback', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Missing authorization code'
      });
    }

    // Exchange code for tokens
    const { OAuth2Client } = await import('google-auth-library');
    const client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI || `${req.protocol}://${req.get('host')}/api/google/callback`
    );

    const { tokens } = await client.getToken(code);

    // Get user info
    client.setCredentials(tokens);
    const oauth2 = (await import('googleapis')).google.oauth2('v2');
    const userInfo = await oauth2.userinfo.get({ auth: client });

    res.json({
      success: true,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresIn: tokens.expiry_date,
      user: {
        email: userInfo.data.email,
        name: userInfo.data.name,
        picture: userInfo.data.picture
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to authenticate with Google'
    });
  }
});

/**
 * @swagger
 * /api/google/auth-url:
 *   get:
 *     summary: Get Google OAuth authorization URL
 *     tags: [Google]
 *     responses:
 *       200:
 *         description: Authorization URL generated
 */
router.get('/auth-url', (req, res) => {
  try {
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || 
      `${req.protocol}://${req.get('host')}/api/google/callback`;
    
    const scope = [
      'https://www.googleapis.com/auth/classroom.courses',
      'https://www.googleapis.com/auth/classroom.rosters',
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ].join(' ');

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${encodeURIComponent(process.env.GOOGLE_CLIENT_ID || '')}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scope)}&` +
      `access_type=offline&` +
      `prompt=consent`;

    res.json({
      success: true,
      authUrl
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
