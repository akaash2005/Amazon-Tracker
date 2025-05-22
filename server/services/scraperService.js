
import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Scrapes product details from Amazon India product pages.
 * @param {string} url - Amazon.in product page URL.
 * @returns {Promise<{ title: string, price: number, imageUrl: string } | null>}
 */
export async function scrapeProductDetails(url) {
  try {
    if (!url.includes('amazon.in')) {
      throw new Error('Only amazon.in URLs are supported.');
    }

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept-Language': 'en-IN,en;q=0.9',
    };

    const response = await axios.get(url, { headers });
    const $ = cheerio.load(response.data);

    const title = $('#productTitle').text().trim();

    let price = null;
    const priceSelectors = [
      '#priceblock_ourprice',
      '#priceblock_dealprice',
      '.a-price .a-offscreen',
      '.a-price-whole'
    ];

    for (const selector of priceSelectors) {
      const raw = $(selector).first().text().replace(/[^\d.]/g, '');
      if (raw) {
        price = parseFloat(raw);
        break;
      }
    }

    const imageUrl = $('#landingImage').attr('src') || $('#imgBlkFront').attr('src') || null;

    if (!title || !price || !imageUrl) {
      console.warn('Missing critical product data.');
      return null;
    }

    return {
      title,
      price,
      imageUrl
    };
  } catch (err) {
    console.error('Error scraping product from Amazon.in:', err.message);
    return null;
  }
}
