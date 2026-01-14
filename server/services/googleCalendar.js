/**
 * Google Calendar Service
 * Handles class scheduling and calendar integration
 * Creates events with Google Meet links automatically
 */

import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

class GoogleCalendarService {
  constructor() {
    this.calendar = null;
    this.oauth2Client = null;
    this.initializeAuth();
  }

  /**
   * Initialize OAuth2 client for Google Calendar API
   */
  initializeAuth() {
    this.oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/google/callback'
    );

    // If using service account
    if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
      this.oauth2Client = new google.auth.JWT(
        serviceAccount.client_email,
        null,
        serviceAccount.private_key,
        [
          'https://www.googleapis.com/auth/calendar',
          'https://www.googleapis.com/auth/calendar.events'
        ],
        process.env.GOOGLE_SUBJECT_EMAIL
      );
    }

    this.calendar = google.calendar({
      version: 'v3',
      auth: this.oauth2Client
    });
  }

  /**
   * Set access token for user-specific operations
   */
  setAccessToken(accessToken) {
    this.oauth2Client.setCredentials({ access_token: accessToken });
  }

  /**
   * Schedule a class with Google Meet
   * @param {string} teacherEmail - Teacher's email
   * @param {Array<string>} studentEmails - List of student emails
   * @param {Object} classDetails - Class details
   * @returns {Promise<Object>} Scheduled event with Meet URL
   */
  async scheduleClass(teacherEmail, studentEmails, classDetails) {
    try {
      const event = await this.calendar.events.insert({
        calendarId: 'primary',
        conferenceDataVersion: 1,
        requestBody: {
          summary: classDetails.title,
          description: classDetails.description || '',
          start: {
            dateTime: classDetails.startTime,
            timeZone: process.env.TIMEZONE || 'America/Sao_Paulo'
          },
          end: {
            dateTime: classDetails.endTime,
            timeZone: process.env.TIMEZONE || 'America/Sao_Paulo'
          },
          attendees: [
            { email: teacherEmail, organizer: true },
            ...studentEmails.map(email => ({ email }))
          ],
          conferenceData: {
            createRequest: {
              requestId: `sofluent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              conferenceSolutionKey: {
                type: 'hangoutsMeet'
              }
            }
          },
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'email', minutes: 60 },
              { method: 'popup', minutes: 10 }
            ]
          },
          colorId: '11' // Blue color for classes
        }
      });

      return {
        success: true,
        eventId: event.data.id,
        meetUrl: event.data.hangoutLink,
        startTime: event.data.start.dateTime,
        endTime: event.data.end.dateTime,
        attendees: event.data.attendees || []
      };
    } catch (error) {
      throw new Error(`Failed to schedule class: ${error.message}`);
    }
  }

  /**
   * Get upcoming classes for a user
   * @param {string} userEmail - User's email
   * @param {number} maxResults - Maximum number of results
   * @returns {Promise<Array>} List of upcoming classes
   */
  async getUpcomingClasses(userEmail, maxResults = 10) {
    try {
      const now = new Date().toISOString();

      const events = await this.calendar.events.list({
        calendarId: 'primary',
        timeMin: now,
        maxResults: maxResults,
        singleEvents: true,
        orderBy: 'startTime',
        q: 'So Fluent' // Filter for So Fluent classes
      });

      const classes = (events.data.items || [])
        .filter(event => event.hangoutLink) // Only events with Meet links
        .map(event => ({
          eventId: event.id,
          title: event.summary,
          description: event.description,
          meetUrl: event.hangoutLink,
          startTime: event.start.dateTime,
          endTime: event.end.dateTime,
          attendees: event.attendees || [],
          organizer: event.organizer.email === userEmail
        }));

      return {
        success: true,
        classes: classes
      };
    } catch (error) {
      throw new Error(`Failed to get upcoming classes: ${error.message}`);
    }
  }

  /**
   * Update a scheduled class
   * @param {string} eventId - Calendar event ID
   * @param {Object} updates - Updates to apply
   * @returns {Promise<Object>} Updated event
   */
  async updateClass(eventId, updates) {
    try {
      // Get current event
      const currentEvent = await this.calendar.events.get({
        calendarId: 'primary',
        eventId: eventId
      });

      // Apply updates
      const updatedEvent = {
        ...currentEvent.data,
        ...updates
      };

      const event = await this.calendar.events.update({
        calendarId: 'primary',
        eventId: eventId,
        requestBody: updatedEvent
      });

      return {
        success: true,
        event: event.data
      };
    } catch (error) {
      throw new Error(`Failed to update class: ${error.message}`);
    }
  }

  /**
   * Cancel a scheduled class
   * @param {string} eventId - Calendar event ID
   * @returns {Promise<Object>} Cancellation result
   */
  async cancelClass(eventId) {
    try {
      await this.calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId
      });

      return {
        success: true,
        message: 'Class cancelled successfully'
      };
    } catch (error) {
      throw new Error(`Failed to cancel class: ${error.message}`);
    }
  }
}

export default new GoogleCalendarService();
