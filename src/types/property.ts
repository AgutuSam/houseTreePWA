export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: 'KES' | 'USD';
  
  // Location
  location: {
    address: string;
    city: string;
    county: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  
  // Property details
  propertyType: 'house' | 'apartment' | 'duplex' | 'studio' | 'condo' | 'townhouse';
  bedrooms: number;
  bathrooms: number;
  squareFootage?: number;
  furnished: boolean;
  
  // Amenities
  amenities: string[];
  
  // Media
  images: string[];
  videos?: string[];
  virtualTourUrl?: string;
  
  // Availability
  isAvailable: boolean;
  availableFrom: Date;
  leaseDuration: number; // in months
  
  // Owner/Manager info
  ownerId: string;
  ownerInfo: {
    name: string;
    phone: string;
    email: string;
    verified: boolean;
  };
  
  // Engagement
  views: number;
  saves: number;
  inquiries: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  // Featured/Premium
  isFeatured: boolean;
  featuredUntil?: Date;
  
  // Reviews
  averageRating?: number;
  reviewCount: number;
}

export interface PropertyFilter {
  location?: string;
  priceRange?: { min: number; max: number };
  propertyTypes?: string[];
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  furnished?: boolean;
  availableFrom?: Date;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'oldest' | 'rating' | 'featured';
}

export interface PropertyInquiry {
  id: string;
  propertyId: string;
  hunterId: string;
  ownerId: string;
  message: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  requestedViewingDate?: Date;
  status: 'pending' | 'responded' | 'viewing_scheduled' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}
