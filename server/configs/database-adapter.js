/**
 * Database Adapter Pattern - Manus-Compatible
 * 
 * This file provides an abstraction layer for database operations.
 * Supports both MongoDB (development) and MySQL/TiDB (Manus production)
 * Auto-detects database type from environment variables
 * 
 * Usage:
 *   import dbAdapter from './configs/database-adapter.js';
 *   const users = await dbAdapter.users.findAll();
 * 
 * Environment Variables:
 *   - DB_TYPE=mysql (or set DB_HOST) for MySQL/TiDB
 *   - MONGODB_URI for MongoDB (default)
 */

// Import Manus-compatible adapter
import dbAdapterManus from './database-adapter-manus.js';

// Export the Manus-compatible adapter
export default dbAdapterManus;

// Database adapter interface
const dbAdapter = {
  // User operations
  users: {
    findById: async (id, options = {}) => {
      let query = User.findById(id);
      if (options.populate) {
        if (typeof options.populate === 'string') {
          query = query.populate(options.populate);
        } else if (Array.isArray(options.populate)) {
          options.populate.forEach(pop => {
            query = query.populate(pop);
          });
        }
      }
      return await query.exec();
    },
    findByIds: async (ids, fields = null) => {
      const query = User.find({ _id: { $in: ids } });
      if (fields) {
        query.select(fields);
      }
      return await query.exec();
    },
    findByEmail: async (email) => {
      return await User.findOne({ email });
    },
    create: async (userData) => {
      return await User.create(userData);
    },
    update: async (id, updateData) => {
      return await User.findByIdAndUpdate(id, updateData, { new: true });
    },
    save: async (user) => {
      return await user.save();
    },
    delete: async (id) => {
      return await User.findByIdAndDelete(id);
    }
  },

  // Course operations
  courses: {
    findAll: async (filters = {}, options = {}) => {
      let query = Course.find(filters);
      if (options.select) {
        query = query.select(options.select);
      }
      if (options.populate) {
      if (typeof options.populate === 'object' && options.populate.path) {
        query = query.populate(options.populate);
      } else if (typeof options.populate === 'string') {
        query = query.populate(options.populate);
      }
      }
      return await query.exec();
    },
    findById: async (id, options = {}) => {
      let query = Course.findById(id);
      if (options.populate) {
        if (typeof options.populate === 'object' && options.populate.path) {
          query = query.populate(options.populate);
        } else if (typeof options.populate === 'string') {
          query = query.populate(options.populate);
        }
      }
      return await query.exec();
    },
    findByEducator: async (educatorId) => {
      return await Course.find({ educator: educatorId });
    },
    findByIds: async (ids) => {
      return await Course.find({ _id: { $in: ids } });
    },
    create: async (courseData) => {
      const course = await Course.create(courseData);
      await course.save();
      return course;
    },
    update: async (id, updateData) => {
      return await Course.findByIdAndUpdate(id, updateData, { new: true });
    },
    save: async (course) => {
      return await course.save();
    },
    delete: async (id) => {
      return await Course.findByIdAndDelete(id);
    }
  },

  // Course Progress operations
  courseProgress: {
    findByUserAndCourse: async (userId, courseId) => {
      return await CourseProgress.findOne({ userId, courseId });
    },
    create: async (progressData) => {
      return await CourseProgress.create(progressData);
    },
    update: async (id, updateData) => {
      return await CourseProgress.findByIdAndUpdate(id, updateData, { new: true });
    },
    save: async (progress) => {
      return await progress.save();
    }
  },

  // Purchase operations
  purchases: {
    findByUser: async (userId) => {
      return await Purchase.find({ userId });
    },
    findByCourse: async (courseId) => {
      return await Purchase.find({ courseId });
    },
    findById: async (id) => {
      return await Purchase.findById(id);
    },
    findByCourseIds: async (courseIds, status = null) => {
      const filter = { courseId: { $in: courseIds } };
      if (status) filter.status = status;
      return await Purchase.find(filter)
        .populate('userId', 'name imageUrl')
        .populate('courseId', 'courseTitle');
    },
    create: async (purchaseData) => {
      return await Purchase.create(purchaseData);
    },
    update: async (id, updateData) => {
      return await Purchase.findByIdAndUpdate(id, updateData, { new: true });
    }
  },

  // Class operations (for live class scheduling)
  classes: {
    findAll: async (filters = {}, options = {}) => {
      let query = Class.find(filters);
      if (options.select) {
        query = query.select(options.select);
      }
      if (options.populate) {
        if (typeof options.populate === 'object' && options.populate.path) {
          query = query.populate(options.populate);
        } else if (typeof options.populate === 'string') {
          query = query.populate(options.populate);
        }
      }
      if (options.sort) {
        query = query.sort(options.sort);
      }
      return await query.exec();
    },
    findById: async (id, options = {}) => {
      let query = Class.findById(id);
      if (options.populate) {
        if (typeof options.populate === 'object' && options.populate.path) {
          query = query.populate(options.populate);
        } else if (typeof options.populate === 'string') {
          query = query.populate(options.populate);
        }
      }
      return await query.exec();
    },
    create: async (classData) => {
      return await Class.create(classData);
    },
    update: async (id, updateData) => {
      return await Class.findByIdAndUpdate(id, updateData, { new: true });
    },
    save: async (classItem) => {
      return await classItem.save();
    },
    delete: async (id) => {
      return await Class.findByIdAndDelete(id);
    }
  },

  // Product operations (for unified product management)
  products: {
    findAll: async (filters = {}, options = {}) => {
      const Product = (await import('../models/Product.js')).default;
      let query = Product.find(filters);
      if (options.select) {
        query = query.select(options.select);
      }
      if (options.populate) {
        if (typeof options.populate === 'object' && options.populate.path) {
          query = query.populate(options.populate);
        } else if (typeof options.populate === 'string') {
          query = query.populate(options.populate);
        }
      }
      return await query.exec();
    },
    findById: async (id, options = {}) => {
      const Product = (await import('../models/Product.js')).default;
      let query = Product.findById(id);
      if (options.populate) {
        if (typeof options.populate === 'object' && options.populate.path) {
          query = query.populate(options.populate);
        } else if (typeof options.populate === 'string') {
          query = query.populate(options.populate);
        }
      }
      return await query.exec();
    },
    findBySlug: async (slug) => {
      const Product = (await import('../models/Product.js')).default;
      return await Product.findOne({ slug });
    },
    create: async (productData) => {
      const Product = (await import('../models/Product.js')).default;
      return await Product.create(productData);
    },
    update: async (id, updateData) => {
      const Product = (await import('../models/Product.js')).default;
      return await Product.findByIdAndUpdate(id, updateData, { new: true });
    },
    delete: async (id) => {
      const Product = (await import('../models/Product.js')).default;
      return await Product.findByIdAndDelete(id);
    }
  },

  // Generic methods for new features (Manus-compliant)
  // These methods work with any Mongoose model
  findOne: async (Model, filter, options = {}) => {
    let query = Model.findOne(filter);
    if (options.populate) {
      if (typeof options.populate === 'string') {
        query = query.populate(options.populate);
      } else if (Array.isArray(options.populate)) {
        options.populate.forEach(pop => {
          query = query.populate(pop);
        });
      }
    }
    return await query.exec();
  },

  find: async (Model, filter = {}, options = {}) => {
    let query = Model.find(filter);
    if (options.select) {
      query = query.select(options.select);
    }
    if (options.populate) {
      if (typeof options.populate === 'object' && options.populate.path) {
        query = query.populate(options.populate);
      } else if (typeof options.populate === 'string') {
        query = query.populate(options.populate);
      } else if (Array.isArray(options.populate)) {
        options.populate.forEach(pop => {
          query = query.populate(pop);
        });
      }
    }
    if (options.sort) {
      query = query.sort(options.sort);
    }
    if (options.limit) {
      query = query.limit(options.limit);
    }
    return await query.exec();
  },

  updateOne: async (Model, filter, update, options = {}) => {
    return await Model.findOneAndUpdate(filter, update, { 
      new: true,
      ...options 
    });
  },

  create: async (Model, data) => {
    return await Model.create(data);
  },

  count: async (Model, filter = {}) => {
    return await Model.countDocuments(filter);
  },

  // Connection management
  connect: async () => {
    const mongoose = await import('mongoose');
    mongoose.default.connection.on('connected', () => {
      // Log only in development
      if (process.env.NODE_ENV !== 'production') {
        // Silent in production
      }
    });
    await mongoose.default.connect(`${process.env.MONGODB_URI}/SoFluent`);
    
    // Create indexes after connection
    try {
      const { createIndexes } = await import('../configs/database-indexes.js');
      await createIndexes();
    } catch (error) {
      console.warn('Warning: Could not create database indexes:', error.message);
      // Don't fail startup if indexes already exist
    }
  }
};

/**
 * TODO: When migrating to Manus/MySQL, replace this adapter with:
 * 
 * import mysql from 'mysql2/promise';
 * 
 * const dbAdapter = {
 *   users: {
 *     findById: async (id) => {
 *       const [rows] = await connection.execute('SELECT * FROM users WHERE id = ?', [id]);
 *       return rows[0];
 *     },
 *     // ... etc
 *   }
 * }
 */

export default dbAdapter;
