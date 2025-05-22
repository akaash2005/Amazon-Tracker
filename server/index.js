import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import { initializeDatabase } from './database.js';
import { setupProductRoutes } from './routes/productRoutes.js';
import { updateAllProductPrices } from './services/priceService.js';

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files from the Vite build directory
app.use(express.static(path.join(__dirname, '..', 'dist')));

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

// Initialize database
initializeDatabase();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
setupProductRoutes(app);

// Schedule price updates (every hour)
cron.schedule('0 * * * *', async () => {
  console.log('Running scheduled price update...');
  try {
    await updateAllProductPrices();
    console.log('Price update completed successfully');
  } catch (error) {
    console.error('Error updating prices:', error);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});