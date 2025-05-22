import React from 'react';
import { ExternalLink, AlertTriangle } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const getPriceChangeClass = (priceChange: number | null): string => {
    if (!priceChange) return 'text-gray-600';
    return priceChange < 0 ? 'text-green-600' : priceChange > 0 ? 'text-red-600' : 'text-gray-600';
  };

  const getPriceChangeIcon = (priceChange: number | null): string => {
    if (!priceChange) return '';
    return priceChange < 0 ? '↓' : priceChange > 0 ? '↑' : '';
  };

  return (
    <section className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4 flex-shrink-0">
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.title} 
                className="w-full h-auto object-contain aspect-square border rounded-md"
              />
            ) : (
              <div className="w-full aspect-square bg-gray-200 flex items-center justify-center rounded-md">
                <AlertTriangle className="text-gray-400" size={32} />
              </div>
            )}
          </div>
          <div className="md:w-3/4">
            <h2 className="text-xl font-semibold mb-2 line-clamp-2">{product.title}</h2>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold">{formatPrice(product.currentPrice)}</span>
              {product.priceChange !== null && (
                <span className={`text-sm font-medium ${getPriceChangeClass(product.priceChange)}`}>
                  {getPriceChangeIcon(product.priceChange)} {formatPrice(Math.abs(product.priceChange))}
                </span>
              )}
            </div>
            
            <div className="mb-4">
              <div className="text-sm text-gray-500 mb-1">Last checked: {new Date(product.lastChecked).toLocaleString()}</div>
              {product.highestPrice && product.lowestPrice && (
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">Highest:</span> 
                    <span className="ml-1 font-medium">{formatPrice(product.highestPrice)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Lowest:</span> 
                    <span className="ml-1 font-medium">{formatPrice(product.lowestPrice)}</span>
                  </div>
                </div>
              )}
            </div>
            
            <a 
              href={product.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
            >
              View on Amazon <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCard;