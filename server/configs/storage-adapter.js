/**
 * Storage Adapter Pattern - Manus-Compatible
 * 
 * This file provides an abstraction layer for file storage.
 * Supports both Cloudinary (development) and S3 (Manus production)
 * Auto-detects storage type from environment variables
 * 
 * Usage:
 *   import storageAdapter from './configs/storage-adapter.js';
 *   const result = await storageAdapter.upload(file, folder);
 * 
 * Environment Variables:
 *   - STORAGE_TYPE=s3 (or set AWS_ACCESS_KEY_ID) for S3
 *   - CLOUDINARY_NAME for Cloudinary (default)
 */

// Import Manus-compatible adapter
import storageAdapterManus from './storage-adapter-manus.js';

// Export the Manus-compatible adapter
export default storageAdapterManus;

const storageAdapter = {
  /**
   * Upload a file
   * @param {File|Buffer|string} file - File to upload (path, buffer, or file object)
   * @param {string} folder - Folder path in storage
   * @param {object} options - Additional options
   * @returns {Promise<object>} Upload result with URL and public_id
   */
  upload: async (file, folder = 'sofluent', options = {}) => {
    try {
      // Handle file path (from multer) or file object
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
    } catch (error) {
      // Log error but don't expose details in production
      if (process.env.NODE_ENV !== 'production') {
        // Silent in production
      }
      throw new Error('File upload failed');
    }
  },

  /**
   * Delete a file
   * @param {string} publicId - Public ID of the file
   * @returns {Promise<object>} Deletion result
   */
  delete: async (publicId) => {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      // Log error but don't expose details in production
      if (process.env.NODE_ENV !== 'production') {
        // Silent in production
      }
      throw new Error('File deletion failed');
    }
  },

  /**
   * Get file URL
   * @param {string} publicId - Public ID of the file
   * @param {object} options - Transformation options
   * @returns {string} File URL
   */
  getUrl: (publicId, options = {}) => {
    return cloudinary.url(publicId, options);
  }
};

/**
 * TODO: When migrating to Manus/S3, replace this adapter with:
 * 
 * import AWS from 'aws-sdk';
 * const s3 = new AWS.S3();
 * 
 * const storageAdapter = {
 *   upload: async (file, folder, options) => {
 *     const params = {
 *       Bucket: process.env.S3_BUCKET_NAME,
 *       Key: `${folder}/${filename}`,
 *       Body: file,
 *       ContentType: file.mimetype
 *     };
 *     const result = await s3.upload(params).promise();
 *     return {
 *       url: result.Location,
 *       publicId: result.Key,
 *       // ...
 *     };
 *   },
 *   delete: async (publicId) => {
 *     const params = {
 *       Bucket: process.env.S3_BUCKET_NAME,
 *       Key: publicId
 *     };
 *     return await s3.deleteObject(params).promise();
 *   },
 *   getUrl: (publicId, options) => {
 *     return s3.getSignedUrl('getObject', {
 *       Bucket: process.env.S3_BUCKET_NAME,
 *       Key: publicId,
 *       Expires: 3600
 *     });
 *   }
 * };
 */

// Connection/initialization function
storageAdapter.connect = async () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY
    });
};

export default storageAdapter;
