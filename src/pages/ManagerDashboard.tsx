import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { propertyService } from '../services/propertyService';
import { SubscriptionPlans } from '../components/Payment/SubscriptionPlans';
import { Property } from '../types/property';
import { 
  Plus, 
  Home, 
  Eye, 
  Heart, 
  MessageSquare, 
  TrendingUp, 
  AlertCircle,
  Crown,
  Settings,
  BarChart3
} from 'lucide-react';
import { Unsubscribe } from 'firebase/firestore';

export const ManagerDashboard: React.FC = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubscriptionPlans, setShowSubscriptionPlans] = useState(false);
  const unsubscribeRef = useRef<Unsubscribe | null>(null);

  useEffect(() => {
    if (!userProfile?.uid) {
      setLoading(false);
      return;
    }

    // Subscribe to user's properties with real-time updates
    unsubscribeRef.current = propertyService.subscribeToUserProperties(
      userProfile.uid,
      (userProperties) => {
        setProperties(userProperties);
        setLoading(false);
      }
    );

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [userProfile?.uid]);

  // Check if user is a property manager
  if (!userProfile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-red-800 mb-2">Access Denied</h2>
          <p className="text-red-600">Please log in to access this page.</p>
        </div>
      </div>
    );
  }

  if (userProfile.role !== 'manager') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-red-800 mb-2">Property Managers Only</h2>
          <p className="text-red-600">Only property managers can access this dashboard.</p>
        </div>
      </div>
    );
  }

  const totalViews = properties.reduce((sum, prop) => sum + (prop.views || 0), 0);
  const totalSaves = properties.reduce((sum, prop) => sum + (prop.saves || 0), 0);
  const totalInquiries = properties.reduce((sum, prop) => sum + (prop.inquiries || 0), 0);
  const availableProperties = properties.filter(prop => prop.isAvailable).length;
  const featuredProperties = properties.filter(prop => prop.isFeatured).length;

  const currentPlan = userProfile.subscription?.plan || 'basic';
  const isSubscriptionActive = userProfile.subscription?.isActive || false;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Property Manager Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back, {userProfile.displayName}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Current Plan</p>
            <p className={`font-semibold capitalize ${
              currentPlan === 'enterprise' ? 'text-purple-600' :
              currentPlan === 'premium' ? 'text-blue-600' : 'text-gray-600'
            }`}>
              {currentPlan}
              {currentPlan !== 'basic' && <Crown className="inline w-4 h-4 ml-1" />}
            </p>
          </div>
          
          <button
            onClick={() => navigate('/add-property')}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Property</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Home className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Properties</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{properties.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Available</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{availableProperties}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalViews}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Saves</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalSaves}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <MessageSquare className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Inquiries</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalInquiries}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button
          onClick={() => navigate('/add-property')}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Plus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Add New Property</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Create a new property listing</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => navigate('/manage-properties')}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Settings className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Manage Properties</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Edit and manage your listings</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setShowSubscriptionPlans(true)}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Crown className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Upgrade Plan</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Get more features and exposure</p>
            </div>
          </div>
        </button>
      </div>

      {/* Recent Properties */}
      {properties.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Properties
            </h2>
            <button
              onClick={() => navigate('/manage-properties')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {properties.slice(0, 5).map((property) => (
              <div
                key={property.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                onClick={() => navigate(`/edit-property/${property.id}`)}
              >
                <div className="flex items-center">
                  <img
                    src={property.images?.[0] || '/placeholder-property.jpg'}
                    alt={property.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900 dark:text-white">{property.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      KES {property.price?.toLocaleString()}/month
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {property.views || 0}
                  </div>
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 mr-1" />
                    {property.saves || 0}
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    property.isAvailable 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {property.isAvailable ? 'Available' : 'Not Available'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subscription Plans Modal */}
      {showSubscriptionPlans && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Subscription Plans
                </h2>
                <button
                  onClick={() => setShowSubscriptionPlans(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>
              
              <SubscriptionPlans 
                onSubscriptionPurchased={() => {
                  setShowSubscriptionPlans(false);
                  // Refresh user profile to get updated subscription
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
