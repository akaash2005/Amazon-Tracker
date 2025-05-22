import React from 'react';
import { BarChart3 } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          <h1 className="text-xl font-bold">PricePulse</h1>
        </div>
        <div className="text-sm md:text-base">
          Amazon Price Tracker
        </div>
      </div>
    </header>
  );
};

export default Header;