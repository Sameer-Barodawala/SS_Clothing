// ============================================
// OPTION 1: Quick Node.js Script (RECOMMENDED)
// File: backend/fix-admin.js
// ============================================

const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixAdmin() {
  console.log('🔧 Fixing admin account...\n');

  // Generate fresh password hash
  const password = 'admin123';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  
  console.log('Generated password hash for: admin123');
  console.log('Hash:', hash);
  console.log('');

  // Test the hash
  const testMatch = await bcrypt.compare(password, hash);
  console.log('✅ Hash verification test:', testMatch ? 'PASSED' : 'FAILED');
  console.log('');

  // Connect to database
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ecommerce_clothing'
  });

  console.log('📊 Connected to database\n');

  try {
    // Check if admin exists
    const [existing] = await connection.execute(
      'SELECT id, email, role FROM users WHERE email = ?',
      ['admin@example.com']
    );

    if (existing.length > 0) {
      console.log('Found existing admin:', existing[0]);
      console.log('Updating password...\n');
      
      // Update existing admin
      await connection.execute(
        'UPDATE users SET password_hash = ? WHERE email = ?',
        [hash, 'admin@example.com']
      );
    } else {
      console.log('No admin found, creating new one...\n');
      
      // Create new admin
      await connection.execute(
        `INSERT INTO users (email, password_hash, first_name, last_name, role, created_at) 
         VALUES (?, ?, ?, ?, ?, NOW())`,
        ['admin@example.com', hash, 'Admin', 'User', 'admin']
      );
    }

    // Verify the admin account
    const [result] = await connection.execute(
      'SELECT id, email, role, password_hash FROM users WHERE email = ?',
      ['admin@example.com']
    );

    console.log('✅ Admin account configured successfully!');
    console.log('📧 Email:', result[0].email);
    console.log('🔑 Role:', result[0].role);
    console.log('🆔 ID:', result[0].id);
    console.log('');

    // Test password match
    const finalTest = await bcrypt.compare('admin123', result[0].password_hash);
    console.log('🔐 Password verification:', finalTest ? '✅ WORKING' : '❌ FAILED');
    console.log('');
    
    console.log('=' .repeat(50));
    console.log('✨ Setup complete! Use these credentials:');
    console.log('📧 Email: admin@example.com');
    console.log('🔑 Password: admin123');
    console.log('=' .repeat(50));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

fixAdmin().catch(console.error);

// ============================================
// OPTION 2: Direct SQL Script
// ============================================

/*
-- Run this in MySQL Workbench or command line:

USE ecommerce_clothing;

-- Delete old admin if exists
DELETE FROM users WHERE email = 'admin@example.com';

-- Create new admin
-- Password: admin123
INSERT INTO users (email, password_hash, first_name, last_name, role, created_at) 
VALUES (
  'admin@example.com',
  '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa',
  'Admin',
  'User',
  'admin',
  NOW()
);

-- Verify
SELECT id, email, role FROM users WHERE email = 'admin@example.com';
*/

// ============================================
// OPTION 3: Test Current Password
// File: backend/test-current-password.js
// ============================================

/*
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function testCurrentPassword() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ecommerce_clothing'
  });

  const [rows] = await connection.execute(
    'SELECT email, password_hash FROM users WHERE email = ?',
    ['admin@example.com']
  );

  if (rows.length === 0) {
    console.log('❌ Admin user not found!');
    return;
  }

  const user = rows[0];
  console.log('Found user:', user.email);
  console.log('Password hash:', user.password_hash);
  console.log('');

  // Test with admin123
  const test1 = await bcrypt.compare('admin123', user.password_hash);
  console.log('Testing password "admin123":', test1 ? '✅ MATCH' : '❌ NO MATCH');

  // Test with Admin123
  const test2 = await bcrypt.compare('Admin123', user.password_hash);
  console.log('Testing password "Admin123":', test2 ? '✅ MATCH' : '❌ NO MATCH');

  // Test with password
  const test3 = await bcrypt.compare('password', user.password_hash);
  console.log('Testing password "password":', test3 ? '✅ MATCH' : '❌ NO MATCH');

  await connection.end();
}

testCurrentPassword().catch(console.error);
*/