import React from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import PriceTracker from './components/PriceTracker';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <PriceTracker />
      </main>
      <footer className="bg-white py-6 border-t">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© {new Date().getFullYear()} PricePulse - Amazon Price Tracker</p>
        </div>
      </footer>
    </div>
  );
}

export default App;