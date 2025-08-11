import React, { useState } from 'react';
import { MapPinIcon, BedIcon, BathIcon, HeartIcon, StarIcon, Eye, User, Calendar } from 'lucide-react';
import { Property } from '../types/property';
import { useAuth } from '../contexts/AuthContext';
import { propertyService } from '../services/propertyService';
import { userService } from '../services/userService';

interface PropertyCardProps {
  property: Property;
  onClick?: () => void;
}
export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onClick
}) => {
  const { userProfile } = useAuth();
  const [isSaved, setIsSaved] = useState(
    userProfile?.savedProperties?.includes(property.id) || false
  );
  const [saving, setSaving] = useState(false);

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!userProfile) return;
    
    setSaving(true);
    try {
      if (isSaved) {
        await userService.removeSavedProperty(userProfile.uid, property.id);
        setIsSaved(false);
      } else {
        await userService.addSavedProperty(userProfile.uid, property.id);
        await propertyService.incrementSaves(property.id);
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Failed to toggle save:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCardClick = async () => {
    // Increment view count
    try {
      await propertyService.incrementViews(property.id);
    } catch (error) {
      console.error('Failed to increment views:', error);
    }
    
    onClick?.();
  };

  const formatPrice = (price: number, currency: string) => {
    return `KES ${price.toLocaleString()}`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return <div 
    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 group cursor-pointer"
    onClick={handleCardClick}
  >
      {/* Image container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {property.images?.[0] ? (
          <img 
            src={property.images[0]} 
            alt={property.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-150" 
          />
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9,22 9,12 15,12 15,22" />
              </svg>
              <p className="text-sm text-gray-500 dark:text-gray-400">No Image</p>
            </div>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {property.isFeatured && (
            <span className="px-2 py-1 bg-amber-500 text-white text-xs font-medium rounded-md">
              Featured
            </span>
          )}
          {!property.isAvailable && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-md">
              Not Available
            </span>
          )}
          {property.furnished && (
            <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-md">
              Furnished
            </span>
          )}
        </div>
        
        {/* Favorite button */}
        {userProfile && (
          <button 
            onClick={handleSaveToggle}
            disabled={saving}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
              isSaved 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-white/80 hover:bg-white text-gray-700 hover:text-red-500'
            }`}
          >
            <HeartIcon className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        )}
        
        {/* View count */}
        <div className="absolute bottom-3 left-3 flex items-center bg-black/50 text-white px-2 py-1 rounded-md text-xs">
          <Eye className="w-3 h-3 mr-1" />
          {property.views || 0}
        </div>
      </div>
      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg line-clamp-1">
              {property.title}
            </h3>
            <div className="flex items-center text-gray-500 dark:text-gray-400 mt-1">
              <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="text-sm line-clamp-1">{property.location?.address || 'Location not specified'}</span>
            </div>
          </div>
          {property.averageRating && (
            <div className="flex items-center ml-2">
              <StarIcon className="h-4 w-4 text-amber-400 fill-current" />
              <span className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                {property.averageRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Property Type & Owner */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
          <span className="capitalize">{property.propertyType}</span>
          <div className="flex items-center">
            <User className="h-3 w-3 mr-1" />
            <span>{property.ownerInfo?.verified ? '✓' : ''} {property.ownerInfo?.name || 'Owner'}</span>
          </div>
        </div>
        
        {/* Features */}
        <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center">
            <BedIcon className="h-4 w-4 mr-1 text-gray-400" />
            <span>{property.bedrooms || 0} bed{(property.bedrooms || 0) !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center">
            <BathIcon className="h-4 w-4 mr-1 text-gray-400" />
            <span>{property.bathrooms || 0} bath{(property.bathrooms || 0) !== 1 ? 's' : ''}</span>
          </div>
          {property.squareFootage && (
            <div className="flex items-center">
              <span>{property.squareFootage.toLocaleString()} sqft</span>
            </div>
          )}
        </div>

        {/* Amenities Preview */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {property.amenities.slice(0, 3).map((amenity, index) => (
                <span 
                  key={index}
                  className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded"
                >
                  {amenity}
                </span>
              ))}
              {property.amenities.length > 3 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  +{property.amenities.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Available From */}
        {property.availableFrom && (
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
            <Calendar className="h-3 w-3 mr-1" />
            <span>Available from {formatDate(property.availableFrom)}</span>
          </div>
        )}
        
        {/* Price & Action */}
        <div className="flex items-center justify-between">
          <div className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">
            {formatPrice(property.price || 0, property.currency || 'KES')}
            <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">/month</span>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
            className="px-3 py-1 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:hover:bg-emerald-800/50 text-emerald-800 dark:text-emerald-300 rounded-full text-sm font-medium transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>;
};