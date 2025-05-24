import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeProductDetails(url) {
  if (!url || !url.includes("amazon.")) {
    throw new Error("Invalid Amazon product URL");
  }

  try {
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept-Language': 'en-IN,en;q=0.9',
        'Referer': 'https://www.google.com/',
      },
    });

    const $ = cheerio.load(html);

    const title = $('#productTitle').text().trim() || 'Unknown Product';
    const currentPrice =
      $('#priceblock_dealprice').text().trim() ||
      $('#priceblock_ourprice').text().trim() ||
      $('#priceblock_saleprice').text().trim() ||
      $('#tp_price_block_total_price_ww').text().trim() ||
      null;

    const image =
      $('#landingImage').attr('src') ||
      $('#imgTagWrapperId img').attr('data-old-hires') ||
      $('#imgTagWrapperId img').attr('src') ||
      null;

    const currencyMatch = currentPrice && currentPrice.match(/₹|Rs\.?/);
    const currency = currencyMatch ? currencyMatch[0] : '₹';

    const numericPrice = currentPrice
      ? parseFloat(currentPrice.replace(/[^0-9.]/g, ''))
      : null;

    return {
      title,
      currentPrice: numericPrice || 0, // prevent NOT NULL error
      image: image || '',
      currency,
    };
  } catch (error) {
    console.error("Scraping failed:", error.message);
    return {
      title: 'Unknown Product',
      currentPrice: 0,       // Ensures database does not throw NOT NULL error
      image: '',
      currency: '₹',
    };
  }
}
