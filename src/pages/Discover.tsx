import React, { useState } from 'react';
import { SearchIcon } from 'lucide-react';
import { SearchBar } from '../components/Search/SearchBar';
import { PropertyGrid } from '../components/Property/PropertyGrid';
import { PropertyFilter } from '../types/property';

export const Discover = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<PropertyFilter>({});
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (query: string, searchFilters: PropertyFilter) => {
    setSearchQuery(query);
    setFilters(searchFilters);
    setIsSearching(true);
  };

  const handlePopularSearch = (tag: string) => {
    if (tag === 'Apartments') {
      setFilters({ propertyTypes: ['apartment'] });
    } else if (tag === 'Houses') {
      setFilters({ propertyTypes: ['house'] });
    } else if (tag === 'Bedsitters') {
      setFilters({ propertyTypes: ['studio'] });
    } else if (tag === 'Maisonettes') {
      setFilters({ propertyTypes: ['duplex'] });
    } else if (tag === 'Bungalows') {
      setFilters({ propertyTypes: ['house'], bedrooms: 3 });
    } else if (tag === 'Furnished') {
      setFilters({ furnished: true });
    } else if (tag === 'Parking') {
      setFilters({ amenities: ['Parking'] });
    } else if (tag === 'Security') {
      setFilters({ amenities: ['Security'] });
    } else if (['Westlands', 'Karen', 'Kilimani', 'South B'].includes(tag)) {
      setSearchQuery(tag);
    }
    setIsSearching(true);
  };

  const handleRecentSearch = (search: string) => {
    setSearchQuery(search);
    setFilters({});
    setIsSearching(true);
  };

  // Popular search tags based on common Kenyan property searches
  const popularTags = [
    'Apartments', 
    'Houses', 
    'Bedsitters',
    'Maisonettes',
    'Bungalows',
    'Furnished',
    'Parking',
    'Security',
    'Westlands',
    'Karen',
    'Kilimani',
    'South B'
  ];

  // These would ideally come from user's search history in Firebase
  const recentSearches = [
    'Westlands Apartments', 
    '2 Bedroom Houses in Karen', 
    'Bedsitters in CBD',
    'Furnished Apartments Kilimani',
    'Houses with Parking Kileleshwa'
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Discover Properties
        </h1>
      </div>

      <SearchBar onSearch={handleSearch} />

      {isSearching ? (
        <PropertyGrid 
          searchQuery={searchQuery} 
          filters={filters} 
          onPropertyClick={(property) => {
            // TODO: Navigate to property detail page
            console.log('Property clicked:', property);
          }}
        />
      ) : (
        <>
          {/* Popular Searches */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Popular Searches
            </h2>
            <div className="flex flex-wrap gap-2">
              {popularTags.map(tag => (
                <button 
                  key={tag} 
                  onClick={() => handlePopularSearch(tag)}
                  className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm hover:bg-emerald-100 dark:hover:bg-emerald-800 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Recent Searches */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Searches
            </h2>
            <div className="space-y-4">
              {recentSearches.map(search => (
                <button 
                  key={search} 
                  onClick={() => handleRecentSearch(search)}
                  className="w-full flex items-center justify-between p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center">
                    <SearchIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {search}
                    </span>
                  </div>
                  <div className="h-5 w-5 text-gray-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Default Property Grid - Show all properties */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              All Properties
            </h2>
            <PropertyGrid 
              onPropertyClick={(property) => {
                // TODO: Navigate to property detail page
                console.log('Property clicked:', property);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};