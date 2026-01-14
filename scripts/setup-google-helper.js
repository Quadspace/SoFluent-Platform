/**
 * Google Setup Helper Script
 * Interactive script to help configure Google Workspace integration
 */

import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`)
};

async function main() {
  console.log('\n🚀 Google Workspace Setup Helper');
  console.log('═'.repeat(60));
  console.log('This script will help you configure Google Workspace integration.');
  console.log('Follow the prompts to set up your credentials.\n');

  const config = {};

  // Google OAuth Credentials
  log.info('Step 1: Google OAuth Credentials');
  log.info('Get these from: console.cloud.google.com → APIs & Services → Credentials');
  console.log('');
  
  config.GOOGLE_CLIENT_ID = await question('Google Client ID: ');
  config.GOOGLE_CLIENT_SECRET = await question('Google Client Secret: ');
  config.GOOGLE_REDIRECT_URI = await question('Redirect URI [https://sofluent.ai/api/google/callback]: ') || 'https://sofluent.ai/api/google/callback';
  config.GOOGLE_SUBJECT_EMAIL = await question('Admin Email (for service account): ');

  // Service Account Key
  log.info('\nStep 2: Service Account Key');
  log.info('Download JSON from: console.cloud.google.com → APIs & Services → Credentials → Service Accounts');
  console.log('');
  
  const keyPath = await question('Path to service account JSON file (or press Enter to skip): ');
  
  if (keyPath && fs.existsSync(keyPath)) {
    try {
      const keyContent = fs.readFileSync(keyPath, 'utf-8');
      const keyJson = JSON.parse(keyContent);
      config.GOOGLE_SERVICE_ACCOUNT_KEY = JSON.stringify(keyJson);
      log.success('Service account key loaded');
    } catch (error) {
      log.error(`Error reading service account key: ${error.message}`);
      const keyJson = await question('Paste service account JSON (as single line): ');
      config.GOOGLE_SERVICE_ACCOUNT_KEY = keyJson;
    }
  } else {
    log.warning('Skipping service account key (you can add it manually later)');
  }

  // OpenRouter
  log.info('\nStep 3: OpenRouter AI');
  log.info('Get API key from: openrouter.ai → Dashboard → API Keys');
  console.log('');
  
  config.OPENROUTER_API_KEY = await question('OpenRouter API Key: ');

  // Timezone
  config.TIMEZONE = await question('Timezone [America/Sao_Paulo]: ') || 'America/Sao_Paulo';

  // Generate .env content
  const envContent = `# Google Workspace Integration
GOOGLE_CLIENT_ID=${config.GOOGLE_CLIENT_ID}
GOOGLE_CLIENT_SECRET=${config.GOOGLE_CLIENT_SECRET}
GOOGLE_REDIRECT_URI=${config.GOOGLE_REDIRECT_URI}
GOOGLE_SERVICE_ACCOUNT_KEY=${config.GOOGLE_SERVICE_ACCOUNT_KEY || '{}'}
GOOGLE_SUBJECT_EMAIL=${config.GOOGLE_SUBJECT_EMAIL}

# OpenRouter AI Integration
OPENROUTER_API_KEY=${config.OPENROUTER_API_KEY}

# Timezone
TIMEZONE=${config.TIMEZONE}
`;

  // Write to .env file
  const envPath = path.join(rootDir, 'server', '.env');
  const envExamplePath = path.join(rootDir, 'server', 'env.example');
  
  let existingEnv = '';
  if (fs.existsSync(envPath)) {
    existingEnv = fs.readFileSync(envPath, 'utf-8');
  } else if (fs.existsSync(envExamplePath)) {
    existingEnv = fs.readFileSync(envExamplePath, 'utf-8');
  }

  // Merge with existing env (don't overwrite other vars)
  const lines = existingEnv.split('\n');
  const googleLines = envContent.split('\n');
  
  // Remove old Google/OpenRouter lines
  const filteredLines = lines.filter(line => 
    !line.startsWith('GOOGLE_') && 
    !line.startsWith('OPENROUTER_') &&
    !line.startsWith('TIMEZONE=')
  );
  
  // Add new lines
  const newEnv = [...filteredLines, ...googleLines].join('\n');

  // Ask for confirmation
  console.log('\n📝 Generated .env configuration:');
  console.log('─'.repeat(60));
  console.log(envContent);
  console.log('─'.repeat(60));
  
  const confirm = await question('\nWrite to server/.env? (y/n): ');
  
  if (confirm.toLowerCase() === 'y') {
    fs.writeFileSync(envPath, newEnv);
    log.success(`Configuration saved to ${envPath}`);
    
    console.log('\n✅ Setup complete!');
    console.log('\nNext steps:');
    console.log('1. Run: node scripts/verify-google-setup.js');
    console.log('2. Start server: cd server && npm run dev');
    console.log('3. Test integration');
  } else {
    log.warning('Configuration not saved. Copy the output above to your .env file manually.');
  }

  rl.close();
}

main().catch(error => {
  log.error(`\nFatal error: ${error.message}`);
  rl.close();
  process.exit(1);
});
