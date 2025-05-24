import * as cheerio from 'cheerio';
import axios from 'axios';

export async function scrapeProductDetails(url) {
  if (!url || !url.includes("amazon.")) {
    throw new Error("Invalid Amazon product URL");
  }

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept-Language': 'en-IN,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Connection': 'keep-alive',
    'Referer': 'https://www.google.com/'
  };

  try {
    const response = await axios.get(url, { headers });

    const $ = cheerio.load(response.data);

    const title = $('#productTitle').text().trim();
    const currentPrice = $('#priceblock_ourprice, #priceblock_dealprice, #priceblock_saleprice')
      .first()
      .text()
      .trim()
      .replace(/[^\d.]/g, '');

    const image = $('#imgTagWrapperId img').attr('src');

    return {
      title: title || 'N/A',
      currentPrice: currentPrice || '0',
      image: image || '',
      url
    };

  } catch (error) {
    console.error('Scraping failed:', error.message);
    throw new Error('Failed to scrape product details from Amazon.');
  }
}
