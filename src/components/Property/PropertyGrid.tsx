import React, { useState, useEffect, useRef } from 'react';
import { Property } from '../../types/property';
import { PropertyCard } from '../PropertyCard';
import { propertyService } from '../../services/propertyService';
import { PropertyFilter } from '../../types/property';
import { Loader2, AlertCircle } from 'lucide-react';
import { Unsubscribe } from 'firebase/firestore';

interface PropertyGridProps {
  searchQuery?: string;
  filters?: PropertyFilter;
  onPropertyClick?: (property: Property) => void;
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({
  searchQuery,
  filters,
  onPropertyClick
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const unsubscribeRef = useRef<Unsubscribe | null>(null);

  useEffect(() => {
    setLoading(true);
    setError('');

    // Clean up previous subscription
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    if (searchQuery && searchQuery.trim()) {
      // For search queries, we'll use the search function (not real-time for now)
      const performSearch = async () => {
        try {
          const results = await propertyService.searchProperties(searchQuery.trim());
          setProperties(results);
        } catch (error: any) {
          setError(error.message || 'Failed to search properties');
        } finally {
          setLoading(false);
        }
      };
      performSearch();
    } else {
      // Use real-time listener for filtered properties
      unsubscribeRef.current = propertyService.subscribeToProperties(
        (newProperties) => {
          setProperties(newProperties);
          setLoading(false);
        },
        filters,
        50 // Increased limit for better initial load
      );
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [searchQuery, filters]);

  if (loading && properties.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading properties...</span>
      </div>
    );
  }

  if (error && properties.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <AlertCircle className="w-8 h-8 text-red-500 mr-2" />
        <span className="text-red-600">{error}</span>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 dark:text-gray-400 text-lg mb-4">
          No properties found
        </div>
        <div className="text-gray-400 dark:text-gray-500 text-sm">
          Try adjusting your search criteria or filters
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex justify-between items-center">
        <div className="text-gray-700 dark:text-gray-300">
          <span className="font-medium">{properties.length}</span> 
          {searchQuery ? ` results for "${searchQuery}"` : ' properties found'}
        </div>
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onClick={() => onPropertyClick?.(property)}
          />
        ))}
      </div>

      {/* Real-time updates indicator */}
      {!searchQuery && (
        <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center justify-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Live updates enabled
          </div>
        </div>
      )}
    </div>
  );
};
