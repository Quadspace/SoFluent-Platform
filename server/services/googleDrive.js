/**
 * Google Drive Service
 * Handles file storage and organization in Google Drive
 * Automatically organizes student files by course
 */

import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

class GoogleDriveService {
  constructor() {
    this.drive = null;
    this.oauth2Client = null;
    this.initializeAuth();
  }

  /**
   * Initialize OAuth2 client for Google Drive API
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
          'https://www.googleapis.com/auth/drive',
          'https://www.googleapis.com/auth/drive.file'
        ],
        process.env.GOOGLE_SUBJECT_EMAIL
      );
    }

    this.drive = google.drive({
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
   * Get or create folder structure for student/course
   * @param {string} studentId - Student ID
   * @param {string} courseId - Course ID
   * @returns {Promise<string>} Folder ID
   */
  async getOrCreateFolder(studentId, courseId) {
    try {
      const folderPath = `So Fluent/${studentId}/${courseId}`;
      const folders = folderPath.split('/');

      let parentId = 'root';
      
      for (const folderName of folders) {
        // Check if folder exists
        const existingFolders = await this.drive.files.list({
          q: `name='${folderName}' and '${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
          fields: 'files(id, name)'
        });

        if (existingFolders.data.files && existingFolders.data.files.length > 0) {
          parentId = existingFolders.data.files[0].id;
        } else {
          // Create folder
          const folder = await this.drive.files.create({
            requestBody: {
              name: folderName,
              mimeType: 'application/vnd.google-apps.folder',
              parents: [parentId]
            },
            fields: 'id'
          });
          parentId = folder.data.id;
        }
      }

      return parentId;
    } catch (error) {
      throw new Error(`Failed to create folder structure: ${error.message}`);
    }
  }

  /**
   * Upload student file to Google Drive
   * @param {string} studentId - Student ID
   * @param {string} courseId - Course ID
   * @param {Object} file - File object (from multer)
   * @returns {Promise<Object>} Uploaded file details
   */
  async uploadStudentFile(studentId, courseId, file) {
    try {
      // Get or create folder
      const folderId = await this.getOrCreateFolder(studentId, courseId);

      // Upload file
      const fileMetadata = {
        name: file.originalname,
        parents: [folderId]
      };

      const media = {
        mimeType: file.mimetype,
        body: file.buffer || require('fs').createReadStream(file.path)
      };

      const uploadedFile = await this.drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id, name, webViewLink, webContentLink, size, mimeType, createdTime'
      });

      // Make file accessible
      await this.drive.permissions.create({
        fileId: uploadedFile.data.id,
        requestBody: {
          role: 'reader',
          type: 'anyone'
        }
      });

      return {
        success: true,
        fileId: uploadedFile.data.id,
        fileName: uploadedFile.data.name,
        webViewLink: uploadedFile.data.webViewLink,
        webContentLink: uploadedFile.data.webContentLink,
        size: uploadedFile.data.size,
        mimeType: uploadedFile.data.mimeType,
        createdTime: uploadedFile.data.createdTime
      };
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  /**
   * Get student files for a course
   * @param {string} studentId - Student ID
   * @param {string} courseId - Course ID
   * @returns {Promise<Array>} List of files
   */
  async getStudentFiles(studentId, courseId) {
    try {
      const folderId = await this.getOrCreateFolder(studentId, courseId);

      const files = await this.drive.files.list({
        q: `'${folderId}' in parents and trashed=false`,
        fields: 'files(id, name, mimeType, webViewLink, webContentLink, size, createdTime, modifiedTime)',
        orderBy: 'createdTime desc'
      });

      return {
        success: true,
        files: files.data.files || []
      };
    } catch (error) {
      throw new Error(`Failed to get student files: ${error.message}`);
    }
  }

  /**
   * Delete a file from Google Drive
   * @param {string} fileId - Google Drive file ID
   * @returns {Promise<Object>} Deletion result
   */
  async deleteFile(fileId) {
    try {
      await this.drive.files.delete({
        fileId: fileId
      });

      return {
        success: true,
        message: 'File deleted successfully'
      };
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  /**
   * Share file with teacher
   * @param {string} fileId - Google Drive file ID
   * @param {string} teacherEmail - Teacher's email
   * @returns {Promise<Object>} Sharing result
   */
  async shareWithTeacher(fileId, teacherEmail) {
    try {
      await this.drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'commenter',
          type: 'user',
          emailAddress: teacherEmail
        }
      });

      return {
        success: true,
        message: 'File shared with teacher'
      };
    } catch (error) {
      throw new Error(`Failed to share file: ${error.message}`);
    }
  }

  /**
   * Get file download URL
   * @param {string} fileId - Google Drive file ID
   * @returns {Promise<string>} Download URL
   */
  async getDownloadUrl(fileId) {
    try {
      const file = await this.drive.files.get({
        fileId: fileId,
        fields: 'webContentLink, webViewLink'
      });

      return {
        success: true,
        downloadUrl: file.data.webContentLink,
        viewUrl: file.data.webViewLink
      };
    } catch (error) {
      throw new Error(`Failed to get download URL: ${error.message}`);
    }
  }
}

export default new GoogleDriveService();
