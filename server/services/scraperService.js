import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Scrapes product details from Amazon India product pages.
 * @param {string} url - Amazon.in product page URL.
 * @returns {Promise<{ title: string, price: number, imageUrl: string }>}
 */
export async function scrapeProductDetails(url) {
  try {
    if (!url.includes('amazon.in')) {
      throw new Error('Only amazon.in URLs are supported.');
    }

    const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'en-IN,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'Connection': 'keep-alive',
  'Referer': 'https://www.google.com/'
};


    const response = await axios.get(url, { headers });

    const $ = cheerio.load(response.data);
    const title = $('#productTitle').text().trim();

    const priceSelectors = [
      '#priceblock_ourprice',
      '#priceblock_dealprice',
      '.a-price .a-offscreen',
      '.a-price-whole'
    ];

    let price = null;

    for (const selector of priceSelectors) {
      const priceText = $(selector).first().text().replace(/[₹,]/g, '').trim();
      if (priceText) {
        const parsed = parseFloat(priceText);
        if (!isNaN(parsed)) {
          price = parsed;
          break;
        }
      }
    }

    const imageUrl = $('#imgTagWrapperId img').attr('src');

    if (!title || !price) {
      throw new Error('Failed to extract title or price from the product page.');
    }

    return { title, price, imageUrl };
  } catch (err) {
    console.error('❌ Error scraping product:', err.message);
    throw new Error('Failed to scrape product details.');
  }
}
""