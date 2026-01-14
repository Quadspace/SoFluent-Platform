/**
 * Database Adapter - Manus-Compatible (MySQL/TiDB)
 * 
 * This adapter supports both MongoDB (development) and MySQL/TiDB (Manus production)
 * Auto-detects which database to use based on environment variables
 * 
 * Usage:
 *   import dbAdapter from './configs/database-adapter.js';
 *   const users = await dbAdapter.users.findAll();
 */

let connection = null;
let dbType = 'mongodb'; // 'mongodb' or 'mysql'

// Detect database type from environment
if (process.env.DB_TYPE === 'mysql' || process.env.MYSQL_HOST || process.env.DB_HOST) {
  dbType = 'mysql';
} else if (process.env.MONGODB_URI) {
  dbType = 'mongodb';
}

// MySQL connection pool
let mysqlPool = null;

// MongoDB connection
let mongooseConnection = null;

// Import models (MongoDB)
let User, Course, CourseProgress, Purchase, Class, Product;

// Database adapter interface
const dbAdapter = {
  type: dbType,

  // Connection management
  connect: async () => {
    if (dbType === 'mysql') {
      // MySQL/TiDB connection
      const mysql = await import('mysql2/promise');
      
      mysqlPool = mysql.createPool({
        host: process.env.DB_HOST || process.env.MYSQL_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || process.env.MYSQL_PORT || '3306'),
        user: process.env.DB_USER || process.env.MYSQL_USER,
        password: process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD,
        database: process.env.DB_NAME || process.env.MYSQL_DATABASE || 'sofluent',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0
      });

      // Test connection
      const testConn = await mysqlPool.getConnection();
      await testConn.ping();
      testConn.release();
      
      console.log('✅ MySQL/TiDB connected');
    } else {
      // MongoDB connection
      const mongoose = await import('mongoose');
      mongooseConnection = await mongoose.default.connect(
        `${process.env.MONGODB_URI}/SoFluent`
      );
      console.log('✅ MongoDB connected');
      
      // Import MongoDB models
      User = (await import('../models/User.js')).default;
      Course = (await import('../models/Course.js')).default;
      CourseProgress = (await import('../models/CourseProgress.js')).default;
      Purchase = (await import('../models/Purchase.js')).default;
      Class = (await import('../models/Class.js')).default;
      Product = (await import('../models/Product.js')).default;
      
      // Create indexes
      try {
        const { createIndexes } = await import('../configs/database-indexes.js');
        await createIndexes();
      } catch (error) {
        console.warn('Warning: Could not create database indexes:', error.message);
      }
    }
  },

  disconnect: async () => {
    if (dbType === 'mysql' && mysqlPool) {
      await mysqlPool.end();
    } else if (mongooseConnection) {
      await mongooseConnection.disconnect();
    }
  },

  // Generic query method (for raw SQL or MongoDB queries)
  query: async (sql, params = []) => {
    if (dbType === 'mysql') {
      if (!mysqlPool) {
        throw new Error('MySQL connection not initialized. Call connect() first.');
      }
      const [rows] = await mysqlPool.execute(sql, params);
      return rows;
    } else {
      // For MongoDB, this would need to be handled differently
      throw new Error('Raw queries not supported for MongoDB. Use adapter methods.');
    }
  },

  // User operations
  users: {
    findById: async (id, options = {}) => {
      if (dbType === 'mysql') {
        if (!mysqlPool) {
          throw new Error('MySQL connection not initialized');
        }
        const [rows] = await mysqlPool.execute(
          'SELECT * FROM users WHERE id = ? OR clerk_id = ?',
          [id, id]
        );
        return rows[0] || null;
      } else {
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
      }
    },

    findByClerkId: async (clerkId) => {
      if (dbType === 'mysql') {
        const [rows] = await mysqlPool.execute(
          'SELECT * FROM users WHERE clerk_id = ?',
          [clerkId]
        );
        return rows[0] || null;
      } else {
        return await User.findOne({ clerkId });
      }
    },

    findByEmail: async (email) => {
      if (dbType === 'mysql') {
        const [rows] = await mysqlPool.execute(
          'SELECT * FROM users WHERE email = ?',
          [email]
        );
        return rows[0] || null;
      } else {
        return await User.findOne({ email });
      }
    },

    findAll: async (filters = {}, options = {}) => {
      if (dbType === 'mysql') {
        let sql = 'SELECT * FROM users WHERE 1=1';
        const params = [];
        
        if (filters.role) {
          sql += ' AND role = ?';
          params.push(filters.role);
        }
        
        if (options.limit) {
          sql += ` LIMIT ${parseInt(options.limit)}`;
        }
        
        const [rows] = await mysqlPool.execute(sql, params);
        return rows;
      } else {
        return await User.find(filters).limit(options.limit || 100).exec();
      }
    },

    create: async (userData) => {
      if (dbType === 'mysql') {
        const [result] = await mysqlPool.execute(
          `INSERT INTO users (id, clerk_id, name, email, image_url, role, created_at, updated_at)
           VALUES (UUID(), ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            userData.clerkId,
            userData.name,
            userData.email,
            userData.imageUrl || '',
            userData.role || 'student'
          ]
        );
        const [rows] = await mysqlPool.execute(
          'SELECT * FROM users WHERE id = ?',
          [result.insertId]
        );
        return rows[0];
      } else {
        return await User.create(userData);
      }
    },

    update: async (id, updateData) => {
      if (dbType === 'mysql') {
        const fields = [];
        const values = [];
        
        Object.keys(updateData).forEach(key => {
          if (key !== 'id' && key !== '_id') {
            const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
            fields.push(`${dbKey} = ?`);
            values.push(updateData[key]);
          }
        });
        
        values.push(id);
        await mysqlPool.execute(
          `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ? OR clerk_id = ?`,
          [...values, id]
        );
        
        const [rows] = await mysqlPool.execute(
          'SELECT * FROM users WHERE id = ? OR clerk_id = ?',
          [id, id]
        );
        return rows[0] || null;
      } else {
        return await User.findByIdAndUpdate(id, updateData, { new: true });
      }
    },

    delete: async (id) => {
      if (dbType === 'mysql') {
        await mysqlPool.execute('DELETE FROM users WHERE id = ? OR clerk_id = ?', [id, id]);
        return { deleted: true };
      } else {
        return await User.findByIdAndDelete(id);
      }
    }
  },

  // Course operations
  courses: {
    findAll: async (filters = {}, options = {}) => {
      if (dbType === 'mysql') {
        let sql = 'SELECT * FROM courses WHERE 1=1';
        const params = [];
        
        if (filters.isPublished !== undefined) {
          sql += ' AND is_published = ?';
          params.push(filters.isPublished ? 1 : 0);
        }
        
        if (filters.educator) {
          sql += ' AND educator_id = ?';
          params.push(filters.educator);
        }
        
        if (options.limit) {
          sql += ` LIMIT ${parseInt(options.limit)}`;
        }
        
        const [rows] = await mysqlPool.execute(sql, params);
        return rows;
      } else {
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
      }
    },

    findById: async (id, options = {}) => {
      if (dbType === 'mysql') {
        const [rows] = await mysqlPool.execute(
          'SELECT * FROM courses WHERE id = ?',
          [id]
        );
        return rows[0] || null;
      } else {
        let query = Course.findById(id);
        if (options.populate) {
          if (typeof options.populate === 'object' && options.populate.path) {
            query = query.populate(options.populate);
          } else if (typeof options.populate === 'string') {
            query = query.populate(options.populate);
          }
        }
        return await query.exec();
      }
    },

    create: async (courseData) => {
      if (dbType === 'mysql') {
        const [result] = await mysqlPool.execute(
          `INSERT INTO courses (id, course_title, course_description, educator_id, course_price, created_at, updated_at)
           VALUES (UUID(), ?, ?, ?, ?, NOW(), NOW())`,
          [
            courseData.courseTitle,
            courseData.courseDescription || '',
            courseData.educator,
            courseData.coursePrice || 0
          ]
        );
        const [rows] = await mysqlPool.execute(
          'SELECT * FROM courses WHERE id = ?',
          [result.insertId]
        );
        return rows[0];
      } else {
        const course = await Course.create(courseData);
        await course.save();
        return course;
      }
    },

    update: async (id, updateData) => {
      if (dbType === 'mysql') {
        const fields = [];
        const values = [];
        
        Object.keys(updateData).forEach(key => {
          if (key !== 'id' && key !== '_id') {
            const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
            fields.push(`${dbKey} = ?`);
            values.push(updateData[key]);
          }
        });
        
        values.push(id);
        await mysqlPool.execute(
          `UPDATE courses SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`,
          values
        );
        
        const [rows] = await mysqlPool.execute('SELECT * FROM courses WHERE id = ?', [id]);
        return rows[0] || null;
      } else {
        return await Course.findByIdAndUpdate(id, updateData, { new: true });
      }
    },

    delete: async (id) => {
      if (dbType === 'mysql') {
        await mysqlPool.execute('DELETE FROM courses WHERE id = ?', [id]);
        return { deleted: true };
      } else {
        return await Course.findByIdAndDelete(id);
      }
    }
  },

  // Generic methods for compatibility
  findOne: async (Model, filter, options = {}) => {
    if (dbType === 'mysql') {
      // For MySQL, Model would be a table name string
      const tableName = typeof Model === 'string' ? Model : Model.modelName?.toLowerCase() + 's';
      // Build WHERE clause from filter
      const conditions = [];
      const values = [];
      Object.keys(filter).forEach(key => {
        conditions.push(`${key} = ?`);
        values.push(filter[key]);
      });
      const sql = `SELECT * FROM ${tableName} WHERE ${conditions.join(' AND ')} LIMIT 1`;
      const [rows] = await mysqlPool.execute(sql, values);
      return rows[0] || null;
    } else {
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
    }
  },

  find: async (Model, filter = {}, options = {}) => {
    if (dbType === 'mysql') {
      const tableName = typeof Model === 'string' ? Model : Model.modelName?.toLowerCase() + 's';
      let sql = `SELECT * FROM ${tableName} WHERE 1=1`;
      const params = [];
      
      Object.keys(filter).forEach(key => {
        sql += ` AND ${key} = ?`;
        params.push(filter[key]);
      });
      
      if (options.limit) {
        sql += ` LIMIT ${parseInt(options.limit)}`;
      }
      
      const [rows] = await mysqlPool.execute(sql, params);
      return rows;
    } else {
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
    }
  },

  updateOne: async (Model, filter, update, options = {}) => {
    if (dbType === 'mysql') {
      const tableName = typeof Model === 'string' ? Model : Model.modelName?.toLowerCase() + 's';
      const conditions = [];
      const values = [];
      
      Object.keys(filter).forEach(key => {
        conditions.push(`${key} = ?`);
        values.push(filter[key]);
      });
      
      const updateFields = [];
      Object.keys(update).forEach(key => {
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        updateFields.push(`${dbKey} = ?`);
        values.push(update[key]);
      });
      
      const sql = `UPDATE ${tableName} SET ${updateFields.join(', ')}, updated_at = NOW() WHERE ${conditions.join(' AND ')}`;
      await mysqlPool.execute(sql, values);
      
      // Return updated record
      const whereClause = conditions.map(() => '?').join(' AND ');
      const [rows] = await mysqlPool.execute(
        `SELECT * FROM ${tableName} WHERE ${whereClause}`,
        Object.values(filter)
      );
      return rows[0] || null;
    } else {
      return await Model.findOneAndUpdate(filter, update, { 
        new: true,
        ...options 
      });
    }
  },

  create: async (Model, data) => {
    if (dbType === 'mysql') {
      const tableName = typeof Model === 'string' ? Model : Model.modelName?.toLowerCase() + 's';
      const fields = Object.keys(data).map(key => 
        key.replace(/([A-Z])/g, '_$1').toLowerCase()
      );
      const placeholders = fields.map(() => '?').join(', ');
      const values = Object.values(data);
      
      const [result] = await mysqlPool.execute(
        `INSERT INTO ${tableName} (${fields.join(', ')}, created_at, updated_at) VALUES (${placeholders}, NOW(), NOW())`,
        values
      );
      
      const [rows] = await mysqlPool.execute(
        `SELECT * FROM ${tableName} WHERE id = ?`,
        [result.insertId]
      );
      return rows[0];
    } else {
      return await Model.create(data);
    }
  },

  count: async (Model, filter = {}) => {
    if (dbType === 'mysql') {
      const tableName = typeof Model === 'string' ? Model : Model.modelName?.toLowerCase() + 's';
      let sql = `SELECT COUNT(*) as count FROM ${tableName}`;
      const params = [];
      
      if (Object.keys(filter).length > 0) {
        const conditions = [];
        Object.keys(filter).forEach(key => {
          conditions.push(`${key} = ?`);
          params.push(filter[key]);
        });
        sql += ` WHERE ${conditions.join(' AND ')}`;
      }
      
      const [rows] = await mysqlPool.execute(sql, params);
      return rows[0].count;
    } else {
      return await Model.countDocuments(filter);
    }
  }
};

export default dbAdapter;
