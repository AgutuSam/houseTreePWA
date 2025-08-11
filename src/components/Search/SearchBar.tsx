import React, { useState } from 'react';
import { Search, MapPin, Filter, X } from 'lucide-react';
import { PropertyFilter } from '../../types/property';

interface SearchBarProps {
  onSearch: (query: string, filters: PropertyFilter) => void;
  initialFilters?: PropertyFilter;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, initialFilters }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<PropertyFilter>(initialFilters || {});

  const propertyTypes = [
    'house', 'apartment', 'duplex', 'studio', 'condo', 'townhouse'
  ];

  // Common amenities in Kenyan properties
  const amenities = [
    'Parking', 'Security', 'Water Supply', 'Electricity Backup', 'Garden', 'Balcony',
    'Swimming Pool', 'Gym', 'Internet', 'DSTV Ready', 'Laundry',
    'Pet Friendly', 'Lift/Elevator', 'CCTV', 'Backup Generator'
  ];

  const handleSearch = () => {
    onSearch(searchQuery, filters);
  };

  const handleFilterChange = (key: keyof PropertyFilter, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.priceRange?.min || filters.priceRange?.max) count++;
    if (filters.propertyTypes?.length) count++;
    if (filters.bedrooms) count++;
    if (filters.bathrooms) count++;
    if (filters.amenities?.length) count++;
    if (filters.furnished !== undefined) count++;
    return count;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-6">
      {/* Main Search Bar */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by location, property name..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center space-x-2 px-4 py-3 border rounded-lg transition-colors ${
            showFilters || getActiveFiltersCount() > 0
              ? 'bg-blue-600 text-white border-blue-600'
              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <Filter className="w-5 h-5" />
          <span>Filters</span>
          {getActiveFiltersCount() > 0 && (
            <span className="bg-white text-blue-600 text-xs rounded-full px-2 py-1 font-medium">
              {getActiveFiltersCount()}
            </span>
          )}
        </button>
        
        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Search
        </button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price Range (KES)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min (e.g., 10000)"
                  value={filters.priceRange?.min || ''}
                  onChange={(e) => handleFilterChange('priceRange', {
                    ...filters.priceRange,
                    min: e.target.value ? parseInt(e.target.value) : undefined
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                />
                <input
                  type="number"
                  placeholder="Max (e.g., 100000)"
                  value={filters.priceRange?.max || ''}
                  onChange={(e) => handleFilterChange('priceRange', {
                    ...filters.priceRange,
                    max: e.target.value ? parseInt(e.target.value) : undefined
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                />
              </div>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Property Type
              </label>
              <select
                multiple
                value={filters.propertyTypes || []}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, option => option.value);
                  handleFilterChange('propertyTypes', selected);
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
              >
                {propertyTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Bedrooms & Bathrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bedrooms
              </label>
              <select
                value={filters.bedrooms || ''}
                onChange={(e) => handleFilterChange('bedrooms', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bathrooms
              </label>
              <select
                value={filters.bathrooms || ''}
                onChange={(e) => handleFilterChange('bathrooms', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
          </div>

          {/* Additional Filters */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Furnished */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Furnished
              </label>
              <select
                value={filters.furnished === undefined ? '' : filters.furnished ? 'true' : 'false'}
                onChange={(e) => {
                  if (e.target.value === '') {
                    handleFilterChange('furnished', undefined);
                  } else {
                    handleFilterChange('furnished', e.target.value === 'true');
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
              >
                <option value="">Any</option>
                <option value="true">Furnished</option>
                <option value="false">Unfurnished</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy || 'newest'}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="featured">Featured First</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Amenities */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amenities
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {amenities.map(amenity => (
                <label key={amenity} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={(filters.amenities || []).includes(amenity)}
                    onChange={(e) => {
                      const currentAmenities = filters.amenities || [];
                      if (e.target.checked) {
                        handleFilterChange('amenities', [...currentAmenities, amenity]);
                      } else {
                        handleFilterChange('amenities', currentAmenities.filter(a => a !== amenity));
                      }
                    }}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Filter Actions */}
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Clear all filters
            </button>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? 's' : ''} applied
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
