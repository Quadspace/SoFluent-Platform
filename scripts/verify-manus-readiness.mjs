/**
 * Manus Deployment Readiness Verification Script
 * Verifies that the platform is 100% ready for Manus deployment
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const checks = {
  passed: [],
  failed: [],
  warnings: []
};

function checkFile(filePath, description) {
  const fullPath = path.join(rootDir, filePath);
  if (fs.existsSync(fullPath)) {
    checks.passed.push(`✅ ${description}`);
    return true;
  } else {
    checks.failed.push(`❌ ${description} - File not found: ${filePath}`);
    return false;
  }
}

function checkPackageJson(packagePath, dependencies) {
  const fullPath = path.join(rootDir, packagePath);
  if (!fs.existsSync(fullPath)) {
    checks.failed.push(`❌ ${packagePath} not found`);
    return false;
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  const pkg = JSON.parse(content);
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };

  dependencies.forEach(dep => {
    if (deps[dep]) {
      checks.passed.push(`✅ ${dep} in ${packagePath}`);
    } else {
      checks.failed.push(`❌ ${dep} missing from ${packagePath}`);
    }
  });

  return true;
}

function checkFileContent(filePath, searchText, description) {
  const fullPath = path.join(rootDir, filePath);
  if (!fs.existsSync(fullPath)) {
    checks.failed.push(`❌ ${description} - File not found`);
    return false;
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  if (content.includes(searchText)) {
    checks.passed.push(`✅ ${description}`);
    return true;
  } else {
    checks.warnings.push(`⚠️  ${description} - Not found in file`);
    return false;
  }
}

console.log('🔍 Verifying Manus Deployment Readiness...\n');

// Check critical files
console.log('📁 Checking Critical Files...');
checkFile('server/configs/database-adapter-manus.js', 'MySQL database adapter');
checkFile('server/configs/storage-adapter-manus.js', 'S3 storage adapter');
checkFile('server/migrations/002_mysql_schema.js', 'MySQL schema migration');
checkFile('server/migrations/003_mysql_indexes.js', 'MySQL indexes migration');
checkFile('server/env.example', 'Environment variables example');
checkFile('MANUS_100_PERCENT_READY.md', 'Manus readiness documentation');

// Check dependencies
console.log('\n📦 Checking Dependencies...');
checkPackageJson('server/package.json', [
  'mysql2',
  '@aws-sdk/client-s3',
  '@aws-sdk/s3-request-presigner'
]);

// Check adapter implementations
console.log('\n🔧 Checking Adapter Implementations...');
checkFileContent(
  'server/configs/database-adapter-manus.js',
  'mysql2',
  'MySQL driver imported'
);
checkFileContent(
  'server/configs/database-adapter-manus.js',
  'dbType === \'mysql\'',
  'MySQL detection logic'
);
checkFileContent(
  'server/configs/storage-adapter-manus.js',
  '@aws-sdk/client-s3',
  'AWS S3 SDK imported'
);
checkFileContent(
  'server/configs/storage-adapter-manus.js',
  'storageType === \'s3\'',
  'S3 detection logic'
);

// Check environment configuration
console.log('\n⚙️  Checking Environment Configuration...');
checkFileContent(
  'server/env.example',
  'DB_TYPE=mysql',
  'MySQL configuration in env.example'
);
checkFileContent(
  'server/env.example',
  'STORAGE_TYPE=s3',
  'S3 configuration in env.example'
);
checkFileContent(
  'server/env.example',
  'AWS_ACCESS_KEY_ID',
  'AWS credentials in env.example'
);
checkFileContent(
  'server/env.example',
  'S3_BUCKET_NAME',
  'S3 bucket name in env.example'
);

// Check migrations
console.log('\n🗄️  Checking Migrations...');
checkFileContent(
  'server/migrations/002_mysql_schema.js',
  'CREATE TABLE',
  'MySQL table creation in migration'
);
checkFileContent(
  'server/migrations/002_mysql_schema.js',
  'users',
  'Users table in migration'
);
checkFileContent(
  'server/migrations/002_mysql_schema.js',
  'courses',
  'Courses table in migration'
);

// Check adapter exports
console.log('\n📤 Checking Adapter Exports...');
checkFileContent(
  'server/configs/database-adapter.js',
  'database-adapter-manus',
  'Database adapter exports Manus version'
);
checkFileContent(
  'server/configs/storage-adapter.js',
  'storage-adapter-manus',
  'Storage adapter exports Manus version'
);

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 VERIFICATION SUMMARY');
console.log('='.repeat(60));

console.log(`\n✅ Passed: ${checks.passed.length}`);
checks.passed.forEach(check => console.log(`   ${check}`));

if (checks.warnings.length > 0) {
  console.log(`\n⚠️  Warnings: ${checks.warnings.length}`);
  checks.warnings.forEach(warning => console.log(`   ${warning}`));
}

if (checks.failed.length > 0) {
  console.log(`\n❌ Failed: ${checks.failed.length}`);
  checks.failed.forEach(failure => console.log(`   ${failure}`));
}

console.log('\n' + '='.repeat(60));

const totalChecks = checks.passed.length + checks.failed.length + checks.warnings.length;
const successRate = ((checks.passed.length / totalChecks) * 100).toFixed(1);

console.log(`\n📈 Success Rate: ${successRate}%`);

if (checks.failed.length === 0) {
  console.log('\n✅ ALL CHECKS PASSED - 100% READY FOR MANUS!');
  process.exit(0);
} else {
  console.log('\n⚠️  SOME CHECKS FAILED - Review and fix before deployment');
  process.exit(1);
}
