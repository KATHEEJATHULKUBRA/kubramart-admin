// Password hash generator for Kubra Market Admin
// This utility helps create properly hashed passwords for seeding admin users

import crypto from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(crypto.scrypt);

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const buf = await scryptAsync(password, salt, 64);
  const hashedPassword = `${buf.toString('hex')}.${salt}`;
  return hashedPassword;
}

async function main() {
  if (process.argv.length < 3) {
    console.log('Usage: node generate-password.js [password]');
    console.log('Example: node generate-password.js admin123');
    process.exit(1);
  }

  const password = process.argv[2];
  const hashedPassword = await hashPassword(password);
  
  console.log('\n===== Password Hash Result =====');
  console.log(`Input Password: ${password}`);
  console.log(`Hashed Password: ${hashedPassword}`);
  console.log('\nUse this hashed password string in your storage.ts file for the admin user.');
}

main().catch(console.error);