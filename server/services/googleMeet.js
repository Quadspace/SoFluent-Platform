/**
 * Google Meet Service
 * Handles Google Meet creation and embedding
 * Creates meetings via Google Calendar API
 */

import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

class GoogleMeetService {
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
   * Create a Google Meet when teacher schedules a class
   * @param {string} teacherEmail - Teacher's email
   * @param {string} title - Meeting title
   * @param {Date} startTime - Start time
   * @param {number} durationMinutes - Duration in minutes
   * @param {Array<string>} attendeeEmails - List of attendee emails
   * @param {string} description - Meeting description (optional)
   * @returns {Promise<Object>} Meeting details with Meet URL
   */
  async createMeeting(teacherEmail, title, startTime, durationMinutes, attendeeEmails = [], description = '') {
    try {
      const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

      const event = await this.calendar.events.insert({
        calendarId: 'primary',
        conferenceDataVersion: 1,
        requestBody: {
          summary: title,
          description: description,
          start: {
            dateTime: startTime.toISOString(),
            timeZone: process.env.TIMEZONE || 'America/Sao_Paulo'
          },
          end: {
            dateTime: endTime.toISOString(),
            timeZone: process.env.TIMEZONE || 'America/Sao_Paulo'
          },
          attendees: [
            { email: teacherEmail },
            ...attendeeEmails.map(email => ({ email }))
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
          }
        }
      });

      return {
        success: true,
        meetUrl: event.data.hangoutLink,
        eventId: event.data.id,
        startTime: event.data.start.dateTime,
        endTime: event.data.end.dateTime,
        attendees: event.data.attendees || []
      };
    } catch (error) {
      console.error('Error creating Google Meet:', error);
      throw new Error(`Failed to create Google Meet: ${error.message}`);
    }
  }

  /**
   * Get meeting details for embedding
   * @param {string} eventId - Google Calendar event ID
   * @returns {Promise<Object>} Meeting details
   */
  async getMeetingDetails(eventId) {
    try {
      const event = await this.calendar.events.get({
        calendarId: 'primary',
        eventId: eventId
      });

      return {
        success: true,
        meetUrl: event.data.hangoutLink,
        title: event.data.summary,
        description: event.data.description,
        startTime: event.data.start.dateTime,
        endTime: event.data.end.dateTime,
        attendees: event.data.attendees || [],
        status: event.data.status
      };
    } catch (error) {
      throw new Error(`Failed to get meeting details: ${error.message}`);
    }
  }

  /**
   * Update meeting (change time, add attendees, etc.)
   * @param {string} eventId - Google Calendar event ID
   * @param {Object} updates - Updates to apply
   * @returns {Promise<Object>} Updated meeting
   */
  async updateMeeting(eventId, updates) {
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
        meetUrl: event.data.hangoutLink,
        event: event.data
      };
    } catch (error) {
      throw new Error(`Failed to update meeting: ${error.message}`);
    }
  }

  /**
   * Cancel/delete a meeting
   * @param {string} eventId - Google Calendar event ID
   * @returns {Promise<Object>} Deletion result
   */
  async cancelMeeting(eventId) {
    try {
      await this.calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId
      });

      return {
        success: true,
        message: 'Meeting cancelled successfully'
      };
    } catch (error) {
      throw new Error(`Failed to cancel meeting: ${error.message}`);
    }
  }

  /**
   * List upcoming meetings for a user
   * @param {string} userEmail - User's email
   * @param {number} maxResults - Maximum number of results (default: 10)
   * @returns {Promise<Array>} List of upcoming meetings
   */
  async listUpcomingMeetings(userEmail, maxResults = 10) {
    try {
      const now = new Date().toISOString();

      const events = await this.calendar.events.list({
        calendarId: 'primary',
        timeMin: now,
        maxResults: maxResults,
        singleEvents: true,
        orderBy: 'startTime',
        q: 'hangoutLink' // Only events with Google Meet links
      });

      const meetings = (events.data.items || [])
        .filter(event => event.hangoutLink)
        .map(event => ({
          eventId: event.id,
          meetUrl: event.hangoutLink,
          title: event.summary,
          startTime: event.start.dateTime,
          endTime: event.end.dateTime,
          attendees: event.attendees || []
        }));

      return {
        success: true,
        meetings: meetings
      };
    } catch (error) {
      throw new Error(`Failed to list meetings: ${error.message}`);
    }
  }

  /**
   * Generate embeddable Meet URL
   * Converts regular Meet URL to embeddable format
   * @param {string} meetUrl - Regular Google Meet URL
   * @returns {string} Embeddable URL
   */
  getEmbeddableUrl(meetUrl) {
    // Extract meeting code from URL
    const match = meetUrl.match(/meet\.google\.com\/([a-z-]+)/i);
    if (match) {
      const meetingCode = match[1];
      // Return embeddable format
      return `https://meet.google.com/${meetingCode}?authuser=0&hs=122`;
    }
    return meetUrl;
  }
}

export default new GoogleMeetService();
