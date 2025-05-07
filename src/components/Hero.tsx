import React from 'react';
import { SearchIcon, MapPinIcon, TrendingUpIcon } from 'lucide-react';
export const Hero = () => {
  return <div className="relative bg-gradient-to-r from-emerald-600 to-teal-500 text-white">
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Find Your Perfect Home with House Tree
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100">
            Discover properties that match your lifestyle with our AI-powered
            search
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 md:p-6 max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative flex-grow">
                <MapPinIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input type="text" placeholder="City, neighborhood, or address" className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <button className="w-full md:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                <SearchIcon className="h-5 w-5" />
                <span>Search</span>
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
              <div className="flex items-center bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full text-sm">
                <TrendingUpIcon className="h-4 w-4 mr-1" />
                <span>AI-Powered Search</span>
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">•</div>
              <div className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                Over 10,000 properties available
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};