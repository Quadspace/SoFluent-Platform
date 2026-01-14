/**
 * Initial Database Schema Migration
 * Creates core tables/collections for So Fluent platform
 */

export default {
  async up(db) {
    console.log('Creating initial schema...');

    if (db.type === 'mysql') {
      // MySQL/TiDB migrations
      await db.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          clerk_id VARCHAR(255) UNIQUE NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          full_name VARCHAR(255),
          role ENUM('student', 'teacher', 'educator', 'master_admin') DEFAULT 'student',
          subscription_tier ENUM('free', 'academy', 'vip') DEFAULT 'free',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_clerk_id (clerk_id),
          INDEX idx_email (email),
          INDEX idx_role (role)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await db.query(`
        CREATE TABLE IF NOT EXISTS courses (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          instructor_id INT,
          price DECIMAL(10, 2) DEFAULT 0,
          thumbnail_url VARCHAR(500),
          status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE SET NULL,
          INDEX idx_instructor (instructor_id),
          INDEX idx_status (status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await db.query(`
        CREATE TABLE IF NOT EXISTS enrollments (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          course_id INT NOT NULL,
          enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          progress INT DEFAULT 0,
          completed_at TIMESTAMP NULL,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
          UNIQUE KEY unique_enrollment (user_id, course_id),
          INDEX idx_user (user_id),
          INDEX idx_course (course_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await db.query(`
        CREATE TABLE IF NOT EXISTS payments (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          amount DECIMAL(10, 2) NOT NULL,
          currency VARCHAR(3) DEFAULT 'BRL',
          payment_method ENUM('stripe', 'pix') NOT NULL,
          payment_id VARCHAR(255),
          status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          INDEX idx_user (user_id),
          INDEX idx_status (status),
          INDEX idx_payment_id (payment_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await db.query(`
        CREATE TABLE IF NOT EXISTS migrations (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) UNIQUE NOT NULL,
          executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
    } else if (db.type === 'mongodb') {
      // MongoDB schema validation (optional, but good practice)
      const dbInstance = db.connection.db || db.connection;
      
      // Create indexes for better performance
      await dbInstance.collection('users').createIndexes([
        { key: { clerkId: 1 }, unique: true },
        { key: { email: 1 }, unique: true },
        { key: { role: 1 } },
      ]);

      await dbInstance.collection('courses').createIndexes([
        { key: { instructorId: 1 } },
        { key: { status: 1 } },
      ]);

      await dbInstance.collection('enrollments').createIndexes([
        { key: { userId: 1, courseId: 1 }, unique: true },
        { key: { userId: 1 } },
        { key: { courseId: 1 } },
      ]);

      await dbInstance.collection('payments').createIndexes([
        { key: { userId: 1 } },
        { key: { status: 1 } },
        { key: { paymentId: 1 } },
      ]);
    }

    console.log('✅ Initial schema created');
  },

  async down(db) {
    console.log('Rolling back initial schema...');

    if (db.type === 'mysql') {
      await db.query('DROP TABLE IF EXISTS payments');
      await db.query('DROP TABLE IF EXISTS enrollments');
      await db.query('DROP TABLE IF EXISTS courses');
      await db.query('DROP TABLE IF EXISTS users');
    } else if (db.type === 'mongodb') {
      const dbInstance = db.connection.db || db.connection;
      await dbInstance.collection('payments').drop();
      await dbInstance.collection('enrollments').drop();
      await dbInstance.collection('courses').drop();
      await dbInstance.collection('users').drop();
    }

    console.log('✅ Schema rolled back');
  },
};
