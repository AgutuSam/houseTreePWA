import React, { useState, useEffect, useRef } from 'react';
import { Hero } from '../components/Hero';
import { PropertyGrid } from '../components/Property/PropertyGrid';
import { propertyService } from '../services/propertyService';
import { Property } from '../types/property';
import { PropertyCard } from '../components/PropertyCard';
import { FirebaseStatus } from '../components/Admin/FirebaseStatus';
import { Unsubscribe } from 'firebase/firestore';
import InstallPrompt from '../components/InstallPrompt';

export const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const unsubscribeRef = useRef<Unsubscribe | null>(null);

  useEffect(() => {
    // Subscribe to featured properties with real-time updates
    unsubscribeRef.current = propertyService.subscribeToFeaturedProperties(
      (properties) => {
        setFeaturedProperties(properties);
        setLoading(false);
      },
      6
    );

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  return (
    <>
      <InstallPrompt />
      <Hero />
      <div className="container mx-auto px-4 py-8">
        {/* Firebase Real-time Status */}
        <FirebaseStatus />
        
        {/* Featured Properties Section */}
        {featuredProperties.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Featured Properties
              </h2>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <div className="w-2 h-2 bg-amber-500 rounded-full mr-2 animate-pulse"></div>
                Live updates
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onClick={() => {
                    console.log('Featured property clicked:', property);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Properties Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Latest Properties
            </h2>
          </div>
          <PropertyGrid 
            onPropertyClick={(property) => {
              console.log('Property clicked:', property);
            }}
          />
        </div>
      </div>
    </>
  );
};