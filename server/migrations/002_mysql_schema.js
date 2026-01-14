/**
 * MySQL/TiDB Schema Migration
 * Creates all tables needed for So Fluent platform
 * Compatible with Manus MySQL/TiDB database
 */

export const up = async (dbAdapter) => {
  if (dbAdapter.type !== 'mysql') {
    console.log('Skipping MySQL migration - not using MySQL');
    return;
  }

  const queries = [
    // Users table
    `CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      clerk_id VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(500),
      role ENUM('master_admin', 'teacher', 'student', 'educator') DEFAULT 'student',
      enrolled_courses JSON,
      streak INT DEFAULT 0,
      last_activity_date DATETIME,
      weekly_hours INT DEFAULT 0,
      daily_challenge_completed VARCHAR(50),
      learning_path_name VARCHAR(255) DEFAULT 'Career Advancement Path',
      current_week INT DEFAULT 1,
      total_weeks INT DEFAULT 6,
      activity_log JSON,
      achievements JSON,
      goal VARCHAR(255),
      learning_style VARCHAR(100),
      study_time VARCHAR(100),
      onboarding_completed BOOLEAN DEFAULT FALSE,
      onboarding_completed_at DATETIME,
      instagram_connect BOOLEAN DEFAULT FALSE,
      instagram_access_token TEXT,
      instagram_user_id VARCHAR(255),
      instagram_connected_at DATETIME,
      instagram_disconnected_at DATETIME,
      coins INT DEFAULT 0,
      total_earnings DECIMAL(10, 2) DEFAULT 0.00,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_clerk_id (clerk_id),
      INDEX idx_email (email),
      INDEX idx_role (role)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    // Courses table
    `CREATE TABLE IF NOT EXISTS courses (
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      course_title VARCHAR(255) NOT NULL,
      course_description TEXT,
      course_thumbnail VARCHAR(500),
      course_price DECIMAL(10, 2) DEFAULT 0.00,
      discount INT DEFAULT 0,
      educator_id VARCHAR(36),
      course_content JSON,
      course_ratings JSON,
      enrolled_students JSON,
      is_published BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_educator (educator_id),
      INDEX idx_published (is_published),
      FOREIGN KEY (educator_id) REFERENCES users(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    // Course Progress table
    `CREATE TABLE IF NOT EXISTS course_progress (
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      user_id VARCHAR(36) NOT NULL,
      course_id VARCHAR(36) NOT NULL,
      progress_percentage INT DEFAULT 0,
      completed_lectures JSON,
      last_accessed_at DATETIME,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY unique_user_course (user_id, course_id),
      INDEX idx_user (user_id),
      INDEX idx_course (course_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    // Purchases table
    `CREATE TABLE IF NOT EXISTS purchases (
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      user_id VARCHAR(36) NOT NULL,
      course_id VARCHAR(36) NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      currency VARCHAR(3) DEFAULT 'BRL',
      payment_method VARCHAR(50),
      status VARCHAR(50) DEFAULT 'pending',
      stripe_payment_intent_id VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_user (user_id),
      INDEX idx_course (course_id),
      INDEX idx_status (status),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    // Classes table (for live classes)
    `CREATE TABLE IF NOT EXISTS classes (
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      title VARCHAR(255) NOT NULL,
      instructor_id VARCHAR(36),
      date DATETIME NOT NULL,
      duration INT NOT NULL,
      type VARCHAR(100),
      level VARCHAR(50),
      max_participants INT,
      current_participants INT DEFAULT 0,
      zoom_link VARCHAR(500),
      zoom_meeting_id VARCHAR(255),
      recording_url VARCHAR(500),
      participants JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_instructor (instructor_id),
      INDEX idx_date (date),
      FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    // Products table
    `CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      currency VARCHAR(3) DEFAULT 'BRL',
      type VARCHAR(100),
      features JSON,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_slug (slug),
      INDEX idx_type (type),
      INDEX idx_active (is_active)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    // Posts table (for social feed)
    `CREATE TABLE IF NOT EXISTS posts (
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      user_id VARCHAR(36) NOT NULL,
      type VARCHAR(50) NOT NULL,
      content JSON,
      likes JSON,
      comments JSON,
      featured BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_user (user_id),
      INDEX idx_featured (featured),
      INDEX idx_created (created_at),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    // Missions table
    `CREATE TABLE IF NOT EXISTS missions (
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      title VARCHAR(255) NOT NULL,
      description TEXT,
      type VARCHAR(100),
      difficulty VARCHAR(50),
      reward_coins INT DEFAULT 0,
      reward_money DECIMAL(10, 2) DEFAULT 0.00,
      is_daily BOOLEAN DEFAULT FALSE,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_type (type),
      INDEX idx_daily (is_daily),
      INDEX idx_active (is_active)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    // User Missions (submissions)
    `CREATE TABLE IF NOT EXISTS user_missions (
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      user_id VARCHAR(36) NOT NULL,
      mission_id VARCHAR(36) NOT NULL,
      status VARCHAR(50) DEFAULT 'pending',
      submission_data JSON,
      submitted_at DATETIME,
      reviewed_at DATETIME,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY unique_user_mission (user_id, mission_id),
      INDEX idx_user (user_id),
      INDEX idx_mission (mission_id),
      INDEX idx_status (status),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (mission_id) REFERENCES missions(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    // Earnings table
    `CREATE TABLE IF NOT EXISTS earnings (
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      user_id VARCHAR(36) NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      currency VARCHAR(3) DEFAULT 'BRL',
      source VARCHAR(100),
      source_id VARCHAR(36),
      status VARCHAR(50) DEFAULT 'pending',
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_user (user_id),
      INDEX idx_status (status),
      INDEX idx_source (source),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    // Withdrawals table
    `CREATE TABLE IF NOT EXISTS withdrawals (
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      user_id VARCHAR(36) NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      currency VARCHAR(3) DEFAULT 'BRL',
      status VARCHAR(50) DEFAULT 'pending',
      payment_method VARCHAR(100),
      payment_details JSON,
      requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      processed_at DATETIME,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_user (user_id),
      INDEX idx_status (status),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
  ];

  for (const query of queries) {
    try {
      await dbAdapter.query(query);
    } catch (error) {
      console.error('Migration error:', error.message);
      // Continue with other tables even if one fails
    }
  }

  console.log('✅ MySQL schema migration completed');
};

export const down = async (dbAdapter) => {
  if (dbAdapter.type !== 'mysql') {
    return;
  }

  const tables = [
    'user_missions',
    'withdrawals',
    'earnings',
    'missions',
    'posts',
    'products',
    'classes',
    'purchases',
    'course_progress',
    'courses',
    'users'
  ];

  for (const table of tables) {
    try {
      await dbAdapter.query(`DROP TABLE IF EXISTS ${table}`);
    } catch (error) {
      console.error(`Error dropping table ${table}:`, error.message);
    }
  }

  console.log('✅ MySQL schema rollback completed');
};

export default { up, down };
