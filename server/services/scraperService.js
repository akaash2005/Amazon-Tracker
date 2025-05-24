import axios from 'axios';
import cheerio from 'cheerio';

export async function scrapeProductDetails(url) {
  try {
    // ✅ Validate URL
    if (!/^https?:\/\/(www\.)?amazon\./.test(url)) {
      throw new Error('Enter a valid Amazon product URL.');
    }

    // ✅ Realistic headers to mimic a browser
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept-Language': 'en-IN,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Connection': 'keep-alive',
      'Referer': 'https://www.google.com/',
    };

    // ✅ Fetch HTML
    const response = await axios.get(url, { headers });

    // ✅ Check if Amazon returned a valid page
    const htmlPreview = response.data.slice(0, 1000);
    console.log("HTML Preview:\n", htmlPreview);

    const $ = cheerio.load(response.data);

    // ✅ Extract title
    const title = $('#productTitle').text().trim();

    // ✅ Try multiple selectors for price
    const priceSelectors = [
      '#priceblock_ourprice',
      '#priceblock_dealprice',
      '#priceblock_saleprice',
      '.a-price .a-offscreen',
      '.a-price .a-price-whole'
    ];

    let price = null;
    for (const selector of priceSelectors) {
      const priceText = $(selector).first().text().trim();
      if (priceText) {
        price = parseFloat(priceText.replace(/[₹$,]/g, '').replace(/\s/g, ''));
        break;
      }
    }

    // ✅ Try multiple selectors for image
    const imageUrl = $('#landingImage').attr('src') ||
                     $('#imgTagWrapperId img').attr('src') ||
                     $('img#imgBlkFront').attr('src');

    // ❌ If something failed, log it
    if (!title || !price || !imageUrl) {
      console.error('⚠️ Scraping failed. Missing fields:');
      console.error('Title:', title);
      console.error('Price:', price);
      console.error('Image URL:', imageUrl);
      return null;
    }

    // ✅ Return the scraped result
    return { title, price, imageUrl };
  } catch (error) {
    console.error('❌ Scraping error:', error.message);
    return null;
  }
}
