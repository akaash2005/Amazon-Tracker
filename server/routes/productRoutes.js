import express from 'express';
import { scrapeAmazonProduct } from '../services/scraperService.js';
import { createProduct } from '../database.js';

const router = express.Router();

router.post('/track', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'Missing product URL' });
    }

    const scrapedData = await scrapeAmazonProduct(url);

    if (!scrapedData.current_price) {
      return res.status(500).json({ error: 'Price not found. Cannot save product.' });
    }

    const product = await createProduct(scrapedData);

    res.status(201).json(product);
  } catch (err) {
    console.error('Error tracking product:', err.message);
    res.status(500).json({ error: 'Failed to track product' });
  }
});

export default router;
