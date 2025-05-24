import axios from 'axios';
import * as cheerio from 'cheerio';

export const scrapeAmazonProduct = async (url) => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    const $ = cheerio.load(data);

    const title = $('#productTitle').text().trim();

    const priceText = $('span.a-price-whole').first().text().trim();
    if (!priceText) throw new Error('Could not extract current price');
    const price = priceText.replace(/[^\d]/g, '');

    const image = $('#imgTagWrapperId img').attr('src');

    return {
      url,
      title,
      current_price: parseFloat(price),
      image,
      currency: 'INR',
    };
  } catch (err) {
    console.error('Scraper error:', err.message);
    throw err;
  }
};
