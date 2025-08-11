import React, { useState, useEffect, useRef } from 'react';
import { PropertyCard } from '../components/PropertyCard';
import { FolderHeartIcon, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { propertyService } from '../services/propertyService';
import { Property } from '../types/property';
import { Unsubscribe } from 'firebase/firestore';

export const Saved = () => {
  const { userProfile } = useAuth();
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const unsubscribeRefs = useRef<Unsubscribe[]>([]);

  useEffect(() => {
    if (!userProfile?.savedProperties?.length) {
      setLoading(false);
      return;
    }

    // Clean up previous subscriptions
    unsubscribeRefs.current.forEach(unsub => unsub());
    unsubscribeRefs.current = [];

    // Subscribe to each saved property for real-time updates
    const properties: Property[] = [];
    let loadedCount = 0;

    userProfile.savedProperties.forEach((propertyId) => {
      const unsubscribe = propertyService.subscribeToProperty(
        propertyId,
        (property) => {
          if (property) {
            const existingIndex = properties.findIndex(p => p.id === property.id);
            if (existingIndex >= 0) {
              properties[existingIndex] = property;
            } else {
              properties.push(property);
            }
          }
          
          loadedCount++;
          if (loadedCount === userProfile.savedProperties!.length) {
            setSavedProperties([...properties]);
            setLoading(false);
          }
        }
      );
      unsubscribeRefs.current.push(unsubscribe);
    });

    return () => {
      unsubscribeRefs.current.forEach(unsub => unsub());
    };
  }, [userProfile?.savedProperties]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Saved Properties
        </h1>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading saved properties...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Saved Properties
        </h1>
        {savedProperties.length > 0 && (
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Live updates enabled
          </div>
        )}
      </div>

      {savedProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedProperties.map(property => (
            <PropertyCard 
              key={property.id} 
              property={property} 
              onClick={() => {
                console.log('Saved property clicked:', property);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FolderHeartIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No saved properties yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Start saving properties by clicking the heart icon on listings you like
          </p>
        </div>
      )}
    </div>
  );
};