import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPinIcon } from 'lucide-react';
// Sample property data (same as in PropertyGrid)
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
  isNew: true,
  lat: 40.7128,
  lng: -74.006
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
  isFeatured: true,
  lat: 40.7218,
  lng: -73.996
}, {
  id: 3,
  title: 'Cozy Studio in Historic District',
  address: '789 Elm St, Old Town',
  price: 1200,
  bedrooms: 1,
  bathrooms: 1,
  sqft: 600,
  imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
  rating: 4.5,
  lat: 40.7048,
  lng: -74.009
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
  isSustainable: true,
  lat: 40.73,
  lng: -73.995
}, {
  id: 5,
  title: 'Renovated Victorian Townhouse',
  address: '202 Heritage Ave, Historic District',
  price: 375000,
  bedrooms: 3,
  bathrooms: 2.5,
  sqft: 1800,
  imageUrl: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
  rating: 4.6,
  lat: 40.718,
  lng: -74.015
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
  isFeatured: true,
  lat: 40.725,
  lng: -74.02
}];
interface MapViewProps {
  filters: {
    priceRange: number[];
    bedrooms: string;
    propertyType: string;
    amenities: string[];
  };
}
export const MapView: React.FC<MapViewProps> = ({
  filters
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!mapContainerRef.current) return;
    // Initialize map if it doesn't exist
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([40.7128, -74.006], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
    }
    // Add markers for properties
    properties.forEach(property => {
      // Create custom icon for price tag
      const priceIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div class="bg-emerald-600 text-white px-2 py-1 rounded-lg shadow-md text-sm font-medium">
            $${property.price < 10000 ? property.price : Math.floor(property.price / 1000) + 'K'}
          </div>
        `,
        iconSize: [60, 30],
        iconAnchor: [30, 15]
      });
      const marker = L.marker([property.lat, property.lng], {
        icon: priceIcon
      }).addTo(mapRef.current!);
      // Popup content
      marker.bindPopup(`
        <div class="property-popup">
          <img src="${property.imageUrl}" alt="${property.title}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 4px;" />
          <h3 class="font-medium text-gray-900 mt-2">${property.title}</h3>
          <p class="text-sm text-gray-500">${property.address}</p>
          <div class="flex justify-between items-center mt-2">
            <div class="text-emerald-600 font-medium">$${property.price.toLocaleString()}${property.price < 10000 ? '/mo' : ''}</div>
            <div class="text-sm text-gray-600">${property.bedrooms} bd | ${property.bathrooms} ba</div>
          </div>
        </div>
      `);
    });
    // Clean up on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);
  return <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
      <div ref={mapContainerRef} className="w-full h-[600px]"></div>
    </div>;
};