#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
require('dotenv').config();

// Read the template HTML file
const htmlPath = path.join(__dirname, 'index.html');
let htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Replace the hardcoded Firebase config with environment variables
const firebaseConfigTemplate = `
        // Firebase configuration from environment variables
        const firebaseConfig = {
          apiKey: "${process.env.VITE_FIREBASE_API_KEY || ''}",
          authDomain: "${process.env.VITE_FIREBASE_AUTH_DOMAIN || ''}",
          projectId: "${process.env.VITE_FIREBASE_PROJECT_ID || ''}",
          storageBucket: "${process.env.VITE_FIREBASE_STORAGE_BUCKET || ''}",
          messagingSenderId: "${process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || ''}",
          appId: "${process.env.VITE_FIREBASE_APP_ID || ''}",
          measurementId: "${process.env.VITE_FIREBASE_MEASUREMENT_ID || ''}"
        };`;

// Find and replace the existing Firebase config
const configRegex = /const firebaseConfig = \{[\s\S]*?\};/;
htmlContent = htmlContent.replace(configRegex, firebaseConfigTemplate.trim());

// Ensure output directory exists
const outputDir = path.join(__dirname, 'dist');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write the processed HTML to dist directory
fs.writeFileSync(path.join(outputDir, 'index.html'), htmlContent);

// Copy other static files
const staticFiles = ['image_1.jpg', 'LICENSE'];
staticFiles.forEach(file => {
  const srcPath = path.join(__dirname, file);
  const destPath = path.join(outputDir, file);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
  }
});

console.log('Build completed successfully!');