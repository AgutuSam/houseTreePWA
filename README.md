# House Tree - Property Rental PWA

A comprehensive Progressive Web Application for property rental management in Kenya, built with React, TypeScript, Firebase, and MPESA integration.

## 🏠 Features

### User Authentication & Roles
- **House Hunters**: Search properties, save favorites, contact landlords
- **Property Managers/Landlords**: Create listings, manage properties, track analytics
- Email/Password and Google authentication
- Role-based access control

### Property Management
- **Create & Edit Listings**: Full CRUD operations for properties
- **Image Management**: Multiple photo uploads with Firebase Storage
- **Property Details**: Comprehensive property information including:
  - Location with coordinates
  - Bedrooms, bathrooms, square footage
  - Amenities and features
  - Availability dates and lease duration
  - Pricing in KES

### Search & Discovery
- **Advanced Search**: Filter by location, price, property type, bedrooms, bathrooms
- **Amenities Filtering**: Search by specific amenities
- **Popular Searches**: Quick access to common search terms
- **Sorting Options**: Price, date, rating, featured listings

### Payment Integration
- **MPESA Integration**: Secure mobile money payments
- **Subscription Plans**: Basic, Premium, and Enterprise tiers
- **Featured Listings**: Pay to boost property visibility
- **Transaction Management**: Complete payment tracking

### Progressive Web App
- **Offline Support**: Works without internet connection
- **Push Notifications**: Property alerts and updates
- **Installable**: Can be installed on mobile devices
- **Responsive Design**: Works on all screen sizes

### Real-time Data Streaming
- **Live Property Updates**: Properties update in real-time across all users
- **Real-time Search Results**: Search results update automatically when new properties match criteria
- **Live User Profile Sync**: User data syncs instantly across devices
- **Real-time Saved Properties**: Saved properties list updates immediately
- **Live Statistics**: Real-time dashboard showing current system statistics

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Firebase project setup
- MPESA developer account (Safaricom)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd houseTreePWA
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Copy `.env.example` to `.env` and configure:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# MPESA Configuration
VITE_MPESA_CONSUMER_KEY=your_mpesa_consumer_key
VITE_MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
VITE_MPESA_PASSKEY=your_mpesa_passkey
VITE_MPESA_BUSINESS_SHORTCODE=your_business_shortcode
VITE_MPESA_ENVIRONMENT=sandbox

# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

4. **Firebase Setup**
- Create a Firebase project
- Enable Authentication (Email/Password and Google)
- Set up Firestore Database
- Configure Storage for file uploads
- Update Firebase rules as needed

5. **MPESA Setup**
- Register for Safaricom Developer Portal
- Create an app and get credentials
- Configure webhook URLs for callbacks

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📱 Core Components

### Authentication System
- `AuthContext`: Global auth state management
- `LoginForm` & `RegisterForm`: User authentication UI
- Role-based user profiles with Firebase integration

### Property Management
- `PropertyForm`: Create/edit property listings
- `PropertyCard`: Display property information
- `PropertyGrid`: Paginated property listings
- `SearchBar`: Advanced search and filtering

### Payment System
- `SubscriptionPlans`: MPESA-powered subscription management
- Transaction tracking and status management
- Multiple payment methods support

### Services
- `propertyService`: Firebase CRUD operations for properties
- `userService`: User profile management
- `mpesaService`: Payment processing and integration

## 🗄️ Database Structure

### Firestore Collections

**users/**
```json
{
  "uid": "string",
  "email": "string",
  "displayName": "string",
  "role": "hunter | manager | admin",
  "savedProperties": ["propertyId1", "propertyId2"],
  "subscription": {
    "plan": "basic | premium | enterprise",
    "isActive": boolean,
    "endDate": "Date"
  }
}
```

**properties/**
```json
{
  "title": "string",
  "description": "string",
  "price": number,
  "location": {
    "address": "string",
    "city": "string",
    "coordinates": { "lat": number, "lng": number }
  },
  "propertyType": "house | apartment | duplex | studio",
  "bedrooms": number,
  "bathrooms": number,
  "amenities": ["string"],
  "images": ["url1", "url2"],
  "ownerId": "string",
  "isAvailable": boolean,
  "views": number,
  "saves": number
}
```

**transactions/**
```json
{
  "userId": "string",
  "amount": number,
  "status": "pending | completed | failed",
  "type": "subscription | featured_listing",
  "mpesaReceiptNumber": "string",
  "createdAt": "Date"
}
```

## 💳 MPESA Integration

The app integrates with Safaricom's MPESA API for payments:

- **STK Push**: Initiate payments from user's mobile
- **Payment Status**: Real-time payment verification
- **Webhooks**: Handle payment callbacks
- **Transaction Management**: Complete audit trail

### Payment Flow
1. User selects subscription/feature
2. Enters MPESA phone number
3. Receives STK push prompt
4. Completes payment on phone
5. App receives confirmation
6. Service is activated

## 🔧 Configuration

### Firebase Rules
Set up proper Firestore security rules:

```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Properties are readable by all, writable by owners
    match /properties/{propertyId} {
      allow read: if true;
      allow write: if request.auth != null && 
        (request.auth.uid == resource.data.ownerId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Transactions are private to user
    match /transactions/{transactionId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

### Storage Rules
```javascript
// Firebase Storage Rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /properties/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 🚦 Production Deployment

### Build Optimization
```bash
# Build for production
npm run build

# Files are generated in /dist folder
# Deploy to your hosting provider
```

### Environment Variables
- Set production Firebase configuration
- Update MPESA to production environment
- Configure production domain for callbacks

### PWA Considerations
- Service worker caches resources automatically
- App can be installed on mobile devices
- Offline functionality for cached content

## 🔮 Future Enhancements

### Priority Features (Not Yet Implemented)
- **Google Maps Integration**: Interactive property maps
- **In-App Messaging**: Direct communication between users
- **Push Notifications**: Real-time alerts
- **Reviews & Ratings**: Property and landlord ratings
- **Admin Dashboard**: Complete property management interface

### Advanced Features
- **Virtual Tours**: 360-degree property views
- **AI-Powered Recommendations**: Smart property suggestions
- **Multi-language Support**: Swahili and English
- **Advanced Analytics**: Detailed insights for property managers

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support or questions, please contact the development team or create an issue in the repository.
