import React from 'react';
import { PropertyCard } from '../components/PropertyCard';
import { FolderHeartIcon } from 'lucide-react';
// Using the same sample data structure as PropertyGrid
const savedProperties = [{
  id: 1,
  title: 'Modern Downtown Apartment',
  address: '123 Main St, Downtown',
  price: 1850,
  bedrooms: 2,
  bathrooms: 2,
  sqft: 1200,
  imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
  rating: 4.8,
  isNew: true
}, {
  id: 2,
  title: 'Luxury Condo with City Views',
  address: '456 Park Ave, Midtown',
  price: 2500,
  bedrooms: 3,
  bathrooms: 2,
  sqft: 1500,
  imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
  rating: 4.9,
  isFeatured: true
}];
export const Saved = () => {
  return <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Saved Properties
      </h1>
      {savedProperties.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedProperties.map(property => <PropertyCard key={property.id} property={property} />)}
        </div> : <div className="text-center py-12">
          <FolderHeartIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No saved properties yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Start saving properties by clicking the heart icon on listings you
            like
          </p>
        </div>}
    </div>;
};