/**
 * Database Migration Runner
 * Handles database schema migrations and versioning
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dbAdapter from '../configs/database-adapter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsDir = path.join(__dirname, 'migrations');

/**
 * Get all migration files
 */
export const getMigrations = () => {
  if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir, { recursive: true });
    return [];
  }

  const files = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.js'))
    .sort();

  return files.map(file => ({
    name: file,
    path: path.join(migrationsDir, file),
  }));
};

/**
 * Get current migration version
 */
export const getCurrentVersion = async () => {
  try {
    // Create migrations table if it doesn't exist
    await dbAdapter.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const result = await dbAdapter.query(`
      SELECT name FROM migrations ORDER BY executed_at DESC LIMIT 1
    `);

    return result.length > 0 ? result[0].name : null;
  } catch (error) {
    // If using MongoDB, use different approach
    if (dbAdapter.type === 'mongodb') {
      const Migration = dbAdapter.models?.Migration;
      if (Migration) {
        const lastMigration = await Migration.findOne().sort({ executedAt: -1 });
        return lastMigration ? lastMigration.name : null;
      }
    }
    return null;
  }
};

/**
 * Mark migration as executed
 */
export const markExecuted = async (migrationName) => {
  try {
    if (dbAdapter.type === 'mysql') {
      await dbAdapter.query(`
        INSERT INTO migrations (name) VALUES (?)
      `, [migrationName]);
    } else if (dbAdapter.type === 'mongodb') {
      const Migration = dbAdapter.models?.Migration;
      if (Migration) {
        await Migration.create({
          name: migrationName,
          executedAt: new Date(),
        });
      }
    }
  } catch (error) {
    console.error(`Error marking migration as executed: ${error.message}`);
  }
};

/**
 * Run all pending migrations
 */
export const runMigrations = async () => {
  try {
    const migrations = getMigrations();
    const currentVersion = await getCurrentVersion();
    
    const pendingMigrations = currentVersion
      ? migrations.filter(m => m.name > currentVersion)
      : migrations;

    if (pendingMigrations.length === 0) {
      console.log('✅ No pending migrations');
      return;
    }

    console.log(`📦 Running ${pendingMigrations.length} migration(s)...`);

    for (const migration of pendingMigrations) {
      try {
        console.log(`  → Running: ${migration.name}`);
        
        const migrationModule = await import(`file://${migration.path}`);
        const { up, down } = migrationModule.default || migrationModule;

        if (!up) {
          throw new Error(`Migration ${migration.name} missing 'up' function`);
        }

        await up(dbAdapter);
        await markExecuted(migration.name);
        
        console.log(`  ✅ Completed: ${migration.name}`);
      } catch (error) {
        console.error(`  ❌ Failed: ${migration.name}`, error);
        throw error;
      }
    }

    console.log('✅ All migrations completed');
  } catch (error) {
    console.error('❌ Migration error:', error);
    throw error;
  }
};

/**
 * Rollback last migration
 */
export const rollbackLast = async () => {
  try {
    const currentVersion = await getCurrentVersion();
    if (!currentVersion) {
      console.log('No migrations to rollback');
      return;
    }

    const migrations = getMigrations();
    const lastMigration = migrations.find(m => m.name === currentVersion);

    if (!lastMigration) {
      console.log('Migration file not found');
      return;
    }

    console.log(`🔄 Rolling back: ${lastMigration.name}`);

    const migrationModule = await import(`file://${lastMigration.path}`);
    const { down } = migrationModule.default || migrationModule;

    if (!down) {
      throw new Error(`Migration ${lastMigration.name} missing 'down' function`);
    }

    await down(dbAdapter);
    
    // Remove from migrations table
    if (dbAdapter.type === 'mysql') {
      await dbAdapter.query(`DELETE FROM migrations WHERE name = ?`, [currentVersion]);
    } else if (dbAdapter.type === 'mongodb') {
      const Migration = dbAdapter.models?.Migration;
      if (Migration) {
        await Migration.deleteOne({ name: currentVersion });
      }
    }

    console.log(`✅ Rolled back: ${lastMigration.name}`);
  } catch (error) {
    console.error('❌ Rollback error:', error);
    throw error;
  }
};

export default {
  runMigrations,
  rollbackLast,
  getCurrentVersion,
  getMigrations,
};
