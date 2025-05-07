import React from 'react';
import { PropertyCard } from './PropertyCard';
import { SmartMatch } from './SmartMatch';
// Sample property data
const properties = [{
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
}, {
  id: 3,
  title: 'Cozy Studio in Historic District',
  address: '789 Elm St, Old Town',
  price: 1200,
  bedrooms: 1,
  bathrooms: 1,
  sqft: 600,
  imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
  rating: 4.5
}, {
  id: 4,
  title: 'Eco-Friendly Family Home',
  address: '101 Green St, Suburbs',
  price: 450000,
  bedrooms: 4,
  bathrooms: 3,
  sqft: 2200,
  imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
  rating: 4.7,
  isSustainable: true
}, {
  id: 5,
  title: 'Renovated Victorian Townhouse',
  address: '202 Heritage Ave, Historic District',
  price: 375000,
  bedrooms: 3,
  bathrooms: 2.5,
  sqft: 1800,
  imageUrl: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
  rating: 4.6
}, {
  id: 6,
  title: 'Waterfront Penthouse Suite',
  address: '303 Harbor Dr, Marina District',
  price: 3200,
  bedrooms: 2,
  bathrooms: 2,
  sqft: 1400,
  imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
  rating: 5.0,
  isFeatured: true
}];
interface PropertyGridProps {
  filters: {
    priceRange: number[];
    bedrooms: string;
    propertyType: string;
    amenities: string[];
  };
}
export const PropertyGrid: React.FC<PropertyGridProps> = ({
  filters
}) => {
  // In a real app, we would filter properties based on the filters prop
  return <>
      <SmartMatch />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {properties.map(property => <PropertyCard key={property.id} property={property} />)}
      </div>
    </>;
};