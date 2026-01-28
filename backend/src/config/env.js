require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'ecommerce_clothing',
  DB_PORT: process.env.DB_PORT || 3306,
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'your_secret_key',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  
  // Upload
  UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 5242880
};