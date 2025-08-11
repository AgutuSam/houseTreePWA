import React from 'react';
import { SparklesIcon, ChevronRightIcon } from 'lucide-react';
// Sample AI-matched properties
const aiMatchedProperties = [{
  id: 101,
  title: 'Sunny Loft with Home Office',
  imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  price: 2100,
  matchScore: 98,
  matchReason: 'Natural light, workspace, close to your office'
}, {
  id: 102,
  title: 'Garden View Apartment',
  imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  price: 1750,
  matchScore: 95,
  matchReason: 'Green space, quiet neighborhood, pet-friendly'
}, {
  id: 103,
  title: 'Modern High-Rise Studio',
  imageUrl: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  price: 1600,
  matchScore: 92,
  matchReason: 'City views, amenities, close to restaurants'
}];
export const SmartMatch = () => {
  return <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <SparklesIcon className="h-5 w-5 text-amber-500 mr-2" />
          <h2 className="text-lg font-medium text-gray-800 dark:text-white">
            AI Smart Match™
          </h2>
        </div>
        <button className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm font-medium flex items-center">
          View all matches
          <ChevronRightIcon className="h-4 w-4 ml-1" />
        </button>
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Properties tailored to your preferences based on your browsing history
        and preferences.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {aiMatchedProperties.map(property => <div key={property.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700 group">
            <div className="relative aspect-[3/2] overflow-hidden">
              <img src={property.imageUrl} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-150" />
              <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold rounded-full px-2 py-1 flex items-center">
                <SparklesIcon className="h-3 w-3 mr-1" />
                {property.matchScore}% Match
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900 dark:text-white">
                {property.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {property.matchReason}
              </p>
              <div className="mt-3 flex justify-between items-center">
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  ${property.price}/mo
                </span>
                <button className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium">
                  View
                </button>
              </div>
            </div>
          </div>)}
      </div>
    </div>;
};