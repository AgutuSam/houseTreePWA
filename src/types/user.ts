export type UserRole = 'hunter' | 'manager' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  phoneNumber?: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Hunter-specific fields
  savedProperties?: string[];
  searchPreferences?: SearchPreferences;
  
  // Manager-specific fields
  businessName?: string;
  businessAddress?: string;
  businessPhone?: string;
  verificationStatus?: 'pending' | 'verified' | 'rejected';
  subscription?: SubscriptionInfo;
}

export interface SearchPreferences {
  location?: string;
  priceRange?: { min: number; max: number };
  propertyTypes?: string[];
  amenities?: string[];
  bedrooms?: number;
  bathrooms?: number;
}

export interface SubscriptionInfo {
  plan: 'basic' | 'premium' | 'enterprise';
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  featuredListingsCount: number;
}
