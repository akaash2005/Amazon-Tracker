import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import PriceHistoryChart from './PriceHistoryChart';
import ProductCard from './ProductCard';
import { getProductData, trackProduct } from '../services/api';
import { Product, PriceHistory } from '../types';
import toast from 'react-hot-toast';

const PriceTracker: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);

  const isValidAmazonUrl = (url: string): boolean => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.hostname.includes('amazon');
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidAmazonUrl(url)) {
      toast.error('Please enter a valid Amazon product URL');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await trackProduct(url);
      setProduct(result.product);
      setPriceHistory(result.priceHistory || []);
      toast.success('Product is now being tracked!');
    } catch (error) {
      toast.error('Failed to track product. Please try again.');
      console.error('Error tracking product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchProductData = async () => {
      if (product?.id) {
        try {
          const data = await getProductData(product.id);
          setProduct(data.product);
          setPriceHistory(data.priceHistory);
        } catch (error) {
          console.error('Error fetching product data:', error);
        }
      }
    };
    
    // Initial fetch
    if (product?.id) {
      fetchProductData();
    }
    
    // Setup polling every 30 seconds (simulating the backend updates)
    const interval = setInterval(() => {
      if (product?.id) {
        fetchProductData();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [product?.id]);

  return (
    <div className="space-y-8">
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Track a new product</h2>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter Amazon product URL"
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !url}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Track'}
          </button>
        </form>
      </section>

      {product && (
        <>
          <ProductCard product={product} />
          
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Price History</h2>
            <div className="h-80">
              {priceHistory.length > 0 ? (
                <PriceHistoryChart priceHistory={priceHistory} />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No price history available yet. Check back soon!
                </div>
              )}
            </div>
          </section>
        </>
      )}
      
      {!product && !isLoading && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">No products tracked yet</h2>
          <p className="text-gray-600 mb-4">
            Enter an Amazon product URL above to start tracking its price.
          </p>
          <div className="p-8 border border-dashed rounded-lg border-gray-300">
            <div className="text-gray-400">Price history graph will appear here</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceTracker;