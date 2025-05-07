import React from 'react';
import { MapPinIcon, BedIcon, BathIcon, HeartIcon, StarIcon } from 'lucide-react';
interface PropertyCardProps {
  property: {
    id: number;
    title: string;
    address: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    imageUrl: string;
    rating: number;
    isNew?: boolean;
    isFeatured?: boolean;
    isSustainable?: boolean;
  };
}
export const PropertyCard: React.FC<PropertyCardProps> = ({
  property
}) => {
  return <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 group">
      {/* Image container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={property.imageUrl} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {property.isNew && <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-md">
              New
            </span>}
          {property.isFeatured && <span className="px-2 py-1 bg-amber-500 text-white text-xs font-medium rounded-md">
              Featured
            </span>}
          {property.isSustainable && <span className="px-2 py-1 bg-green-600 text-white text-xs font-medium rounded-md flex items-center">
              <span className="mr-1">♻️</span> Eco
            </span>}
        </div>
        {/* Favorite button */}
        <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white text-gray-700 hover:text-rose-500 transition-colors">
          <HeartIcon className="w-5 h-5" />
        </button>
      </div>
      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white text-lg">
              {property.title}
            </h3>
            <div className="flex items-center text-gray-500 dark:text-gray-400 mt-1">
              <MapPinIcon className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.address}</span>
            </div>
          </div>
          <div className="flex items-center">
            <StarIcon className="h-4 w-4 text-amber-400" />
            <span className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              {property.rating}
            </span>
          </div>
        </div>
        {/* Features */}
        <div className="flex items-center space-x-4 mt-4 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center">
            <BedIcon className="h-4 w-4 mr-1 text-gray-400" />
            <span>
              {property.bedrooms} {property.bedrooms === 1 ? 'bed' : 'beds'}
            </span>
          </div>
          <div className="flex items-center">
            <BathIcon className="h-4 w-4 mr-1 text-gray-400" />
            <span>
              {property.bathrooms} {property.bathrooms === 1 ? 'bath' : 'baths'}
            </span>
          </div>
          <div>
            <span>{property.sqft.toLocaleString()} sqft</span>
          </div>
        </div>
        {/* Price */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-emerald-600 dark:text-emerald-400 font-medium text-lg">
            ${property.price.toLocaleString()}
            {property.price < 10000 ? '/mo' : ''}
          </div>
          <button className="px-3 py-1 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:hover:bg-emerald-800/50 text-emerald-800 dark:text-emerald-300 rounded-full text-sm font-medium transition-colors">
            View Details
          </button>
        </div>
      </div>
    </div>;
};