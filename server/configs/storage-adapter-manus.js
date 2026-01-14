/**
 * Storage Adapter - Manus-Compatible (S3)
 * 
 * This adapter supports both Cloudinary (development) and S3 (Manus production)
 * Auto-detects which storage to use based on environment variables
 * 
 * Usage:
 *   import storageAdapter from './configs/storage-adapter.js';
 *   const result = await storageAdapter.upload(file, folder);
 */

import { v2 as cloudinary } from 'cloudinary';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';
import path from 'path';

let storageType = 'cloudinary'; // 'cloudinary' or 's3'
let s3Client = null;
let s3Bucket = null;

// Detect storage type from environment
if (process.env.STORAGE_TYPE === 's3' || process.env.AWS_ACCESS_KEY_ID || process.env.S3_BUCKET_NAME) {
  storageType = 's3';
} else if (process.env.CLOUDINARY_NAME) {
  storageType = 'cloudinary';
}

const storageAdapter = {
  type: storageType,

  /**
   * Connect to storage service
   */
  connect: async () => {
    if (storageType === 's3') {
      // Initialize S3 client
      s3Client = new S3Client({
        region: process.env.AWS_REGION || process.env.S3_REGION || 'us-east-1',
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.S3_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || process.env.S3_SECRET_ACCESS_KEY,
        },
      });

      s3Bucket = process.env.S3_BUCKET_NAME || process.env.AWS_S3_BUCKET || 'sofluent-media';
      
      console.log('✅ S3 storage connected');
    } else {
      // Initialize Cloudinary
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY
      });
      
      console.log('✅ Cloudinary storage connected');
    }
  },

  /**
   * Upload a file
   * @param {File|Buffer|string} file - File to upload (path, buffer, or file object)
   * @param {string} folder - Folder path in storage
   * @param {object} options - Additional options
   * @returns {Promise<object>} Upload result with URL and public_id/key
   */
  upload: async (file, folder = 'sofluent', options = {}) => {
    try {
      if (storageType === 's3') {
        // S3 upload
        const fileBuffer = file.buffer || (file.path ? await import('fs').then(fs => fs.promises.readFile(file.path)) : file);
        const fileName = file.originalname || file.name || `file-${Date.now()}`;
        const fileExtension = path.extname(fileName);
        const uniqueFileName = `${folder}/${crypto.randomUUID()}${fileExtension}`;
        const contentType = file.mimetype || options.contentType || 'application/octet-stream';

        const command = new PutObjectCommand({
          Bucket: s3Bucket,
          Key: uniqueFileName,
          Body: fileBuffer,
          ContentType: contentType,
          ...options.metadata && { Metadata: options.metadata }
        });

        await s3Client.send(command);

        // Generate public URL or signed URL
        const url = options.public ? 
          `https://${s3Bucket}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${uniqueFileName}` :
          await getSignedUrl(s3Client, new GetObjectCommand({
            Bucket: s3Bucket,
            Key: uniqueFileName
          }), { expiresIn: 3600 });

        return {
          url: url,
          publicId: uniqueFileName,
          key: uniqueFileName,
          bucket: s3Bucket,
          format: fileExtension.replace('.', ''),
          // S3 doesn't provide dimensions by default
          width: options.width || null,
          height: options.height || null
        };
      } else {
        // Cloudinary upload
        const filePath = file.path || file;
        
        const result = await cloudinary.uploader.upload(filePath, {
          folder: folder,
          resource_type: 'auto',
          ...options
        });

        return {
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format
        };
      }
    } catch (error) {
      console.error('Storage upload error:', error.message);
      throw new Error(`File upload failed: ${error.message}`);
    }
  },

  /**
   * Delete a file
   * @param {string} publicId - Public ID or S3 key of the file
   * @returns {Promise<object>} Deletion result
   */
  delete: async (publicId) => {
    try {
      if (storageType === 's3') {
        const command = new DeleteObjectCommand({
          Bucket: s3Bucket,
          Key: publicId
        });

        await s3Client.send(command);
        return { result: 'ok' };
      } else {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
      }
    } catch (error) {
      console.error('Storage delete error:', error.message);
      throw new Error(`File deletion failed: ${error.message}`);
    }
  },

  /**
   * Get file URL (synchronous for Cloudinary, async wrapper for S3)
   * @param {string} publicId - Public ID or S3 key of the file
   * @param {object} options - Transformation options
   * @returns {string|Promise<string>} File URL
   */
  getUrl: async (publicId, options = {}) => {
    if (storageType === 's3') {
      // For S3, prefer getSignedUrl for async operation
      if (options.public) {
        // Public bucket URL
        return `https://${s3Bucket}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${publicId}`;
      }
      // Return signed URL
      return await storageAdapter.getSignedUrl(publicId, options.expiresIn || 3600);
    } else {
      return cloudinary.url(publicId, options);
    }
  },

  /**
   * Get signed URL (S3 only)
   * @param {string} key - S3 key
   * @param {number} expiresIn - Expiration in seconds (default: 3600)
   * @returns {Promise<string>} Signed URL
   */
  getSignedUrl: async (key, expiresIn = 3600) => {
    if (storageType === 's3' && s3Client && s3Bucket) {
      const command = new GetObjectCommand({
        Bucket: s3Bucket,
        Key: key
      });
      return await getSignedUrl(s3Client, command, { expiresIn });
    }
    throw new Error('getSignedUrl only available for S3 storage');
  },

  /**
   * Upload from buffer (useful for S3)
   * @param {Buffer} buffer - File buffer
   * @param {string} fileName - File name
   * @param {string} folder - Folder path
   * @param {object} options - Additional options
   * @returns {Promise<object>} Upload result
   */
  uploadBuffer: async (buffer, fileName, folder = 'sofluent', options = {}) => {
    const fileObject = {
      buffer: buffer,
      originalname: fileName,
      mimetype: options.contentType || 'application/octet-stream'
    };
    return await storageAdapter.upload(fileObject, folder, options);
  }
};

export default storageAdapter;
