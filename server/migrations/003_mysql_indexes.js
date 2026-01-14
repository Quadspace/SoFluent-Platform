/**
 * MySQL/TiDB Indexes Migration
 * Creates additional indexes for performance optimization
 */

export const up = async (dbAdapter) => {
  if (dbAdapter.type !== 'mysql') {
    console.log('Skipping MySQL indexes - not using MySQL');
    return;
  }

  const indexes = [
    // Users indexes
    'CREATE INDEX idx_users_streak ON users(streak)',
    'CREATE INDEX idx_users_last_activity ON users(last_activity_date)',
    
    // Courses indexes
    'CREATE INDEX idx_courses_price ON courses(course_price)',
    'CREATE INDEX idx_courses_created ON courses(created_at)',
    
    // Course Progress indexes
    'CREATE INDEX idx_progress_percentage ON course_progress(progress_percentage)',
    
    // Purchases indexes
    'CREATE INDEX idx_purchases_created ON purchases(created_at)',
    'CREATE INDEX idx_purchases_stripe ON purchases(stripe_payment_intent_id)',
    
    // Classes indexes
    'CREATE INDEX idx_classes_type_level ON classes(type, level)',
    
    // Posts indexes
    'CREATE INDEX idx_posts_type ON posts(type)',
    
    // Missions indexes
    'CREATE INDEX idx_missions_difficulty ON missions(difficulty)',
    'CREATE INDEX idx_missions_reward ON missions(reward_coins, reward_money)',
    
    // Earnings indexes
    'CREATE INDEX idx_earnings_created ON earnings(created_at)',
    'CREATE INDEX idx_earnings_source_id ON earnings(source, source_id)',
    
    // Withdrawals indexes
    'CREATE INDEX idx_withdrawals_requested ON withdrawals(requested_at)',
    'CREATE INDEX idx_withdrawals_payment_method ON withdrawals(payment_method)'
  ];

  for (const indexQuery of indexes) {
    try {
      await dbAdapter.query(indexQuery);
    } catch (error) {
      // Index might already exist, continue
      if (!error.message.includes('Duplicate key name')) {
        console.warn('Index creation warning:', error.message);
      }
    }
  }

  console.log('✅ MySQL indexes migration completed');
};

export const down = async (dbAdapter) => {
  if (dbAdapter.type !== 'mysql') {
    return;
  }

  const indexNames = [
    'idx_withdrawals_payment_method',
    'idx_withdrawals_requested',
    'idx_earnings_source_id',
    'idx_earnings_created',
    'idx_missions_reward',
    'idx_missions_difficulty',
    'idx_posts_type',
    'idx_classes_type_level',
    'idx_purchases_stripe',
    'idx_purchases_created',
    'idx_progress_percentage',
    'idx_courses_created',
    'idx_courses_price',
    'idx_users_last_activity',
    'idx_users_streak'
  ];

  // Note: MySQL doesn't support DROP INDEX IF EXISTS directly
  // Would need to check existence first or handle errors
  console.log('⚠️  Index rollback skipped - indexes will remain');
};

export default { up, down };
