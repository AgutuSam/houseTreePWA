import React from 'react';
import { SearchIcon } from 'lucide-react';
export const Discover = () => {
  return <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Discover
        </h1>
      </div>
      {/* Search Bar */}
      <div className="relative mb-6">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input type="text" placeholder="Search by location, property type, or keywords" className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
      </div>
      {/* Popular Searches */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Popular Searches
        </h2>
        <div className="flex flex-wrap gap-2">
          {['Apartments', 'Houses', 'Pet Friendly', 'With Garden', 'City Center'].map(tag => <button key={tag} className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              {tag}
            </button>)}
        </div>
      </div>
      {/* Recent Searches */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Searches
        </h2>
        <div className="space-y-4">
          {['Downtown Apartments', '2 Bedroom Houses in Suburbs', 'Luxury Condos'].map(search => <button key={search} className="w-full flex items-center justify-between p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center">
                <SearchIcon className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">
                  {search}
                </span>
              </div>
              <div className="h-5 w-5 text-gray-400" />
            </button>)}
        </div>
      </div>
    </div>;
};