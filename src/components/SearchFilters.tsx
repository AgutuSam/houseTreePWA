import React, { useState } from 'react';
import { SlidersIcon, GridIcon, MapIcon, ChevronDownIcon, XIcon } from 'lucide-react';
const amenities = ['Swimming Pool', 'Gym', 'Parking', 'Pet Friendly', 'Furnished', 'Balcony', 'Security', 'Air Conditioning'];
const propertyTypes = ['Any', 'House', 'Apartment', 'Condo', 'Townhouse', 'Land'];
interface FiltersProps {
  filters: {
    priceRange: number[];
    bedrooms: string;
    propertyType: string;
    amenities: string[];
  };
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  viewMode: string;
  setViewMode: React.Dispatch<React.SetStateAction<string>>;
}
export const SearchFilters: React.FC<FiltersProps> = ({
  filters,
  setFilters,
  viewMode,
  setViewMode
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const handleAmenityToggle = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity) ? prev.amenities.filter(a => a !== amenity) : [...prev.amenities, amenity]
    }));
  };
  const handleBedroomChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      bedrooms: value
    }));
  };
  const handlePropertyTypeChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      propertyType: value
    }));
  };
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = parseInt(e.target.value);
    setFilters(prev => ({
      ...prev,
      priceRange: index === 0 ? [newValue, prev.priceRange[1]] : [prev.priceRange[0], newValue]
    }));
  };
  const clearFilters = () => {
    setFilters({
      priceRange: [500, 3000],
      bedrooms: 'any',
      propertyType: 'any',
      amenities: []
    });
  };
  return <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row justify-between items-center p-4">
        <div className="flex items-center mb-4 sm:mb-0">
          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors">
            <SlidersIcon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              Filters
            </span>
            <ChevronDownIcon className={`h-4 w-4 text-gray-700 dark:text-gray-300 transition-transform ${showFilters ? 'transform rotate-180' : ''}`} />
          </button>
          {filters.amenities.length > 0 && <div className="ml-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 rounded-full text-sm">
              {filters.amenities.length} selected
            </div>}
          {(filters.bedrooms !== 'any' || filters.propertyType !== 'any') && <button onClick={clearFilters} className="ml-2 px-3 py-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm flex items-center">
              <XIcon className="h-3 w-3 mr-1" />
              Clear
            </button>}
        </div>
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button onClick={() => setViewMode('grid')} className={`px-4 py-2 rounded-md transition-colors flex items-center space-x-1 ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
            <GridIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Grid</span>
          </button>
          <button onClick={() => setViewMode('map')} className={`px-4 py-2 rounded-md transition-colors flex items-center space-x-1 ${viewMode === 'map' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
            <MapIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Map</span>
          </button>
        </div>
      </div>
      {showFilters && <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Price Range */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price Range
              </h3>
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-3 text-gray-500">$</span>
                  <input type="number" value={filters.priceRange[0]} onChange={e => handlePriceChange(e, 0)} className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white" placeholder="Min" />
                </div>
                <span className="text-gray-500">-</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-3 text-gray-500">$</span>
                  <input type="number" value={filters.priceRange[1]} onChange={e => handlePriceChange(e, 1)} className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white" placeholder="Max" />
                </div>
              </div>
            </div>
            {/* Bedrooms */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bedrooms
              </h3>
              <div className="flex space-x-2">
                {['any', '1', '2', '3', '4+'].map(value => <button key={value} onClick={() => handleBedroomChange(value)} className={`px-3 py-1 rounded-md text-sm ${filters.bedrooms === value ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                    {value === 'any' ? 'Any' : value}
                  </button>)}
              </div>
            </div>
            {/* Property Type */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Property Type
              </h3>
              <select value={filters.propertyType} onChange={e => handlePropertyTypeChange(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white">
                {propertyTypes.map(type => <option key={type.toLowerCase()} value={type.toLowerCase()}>
                    {type}
                  </option>)}
              </select>
            </div>
          </div>
          {/* Amenities */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Amenities
            </h3>
            <div className="flex flex-wrap gap-2">
              {amenities.map(amenity => <button key={amenity} onClick={() => handleAmenityToggle(amenity)} className={`px-3 py-1 rounded-full text-sm transition-colors ${filters.amenities.includes(amenity) ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                  {amenity}
                </button>)}
            </div>
          </div>
        </div>}
    </div>;
};