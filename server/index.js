import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeDatabase } from './database.js';
import { setupProductRoutes } from './routes/productRoutes.js';
import { updateAllProductPrices } from './services/priceService.js';

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend
app.use(express.static(path.join(__dirname, '..', 'dist')));

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

// Initialize database and routes
initializeDatabase();
setupProductRoutes(app);

// Schedule price updates every hour
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
