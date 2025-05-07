import React, { useState } from 'react';
import { Hero } from '../components/Hero';
import { SearchFilters } from '../components/SearchFilters';
import { PropertyGrid } from '../components/PropertyGrid';
import { MapView } from '../components/MapView';
export const Home = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    priceRange: [500, 3000],
    bedrooms: 'any',
    propertyType: 'any',
    amenities: []
  });
  return <>
      <Hero />
      <div className="container mx-auto px-4 py-8">
        <SearchFilters filters={filters} setFilters={setFilters} viewMode={viewMode} setViewMode={setViewMode} />
        <div className="mt-6">
          {viewMode === 'grid' ? <PropertyGrid filters={filters} /> : <MapView filters={filters} />}
        </div>
      </div>
    </>;
};