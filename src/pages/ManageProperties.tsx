import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { propertyService } from '../services/propertyService';
import { Property } from '../types/property';
import { PropertyCard } from '../components/PropertyCard';
import { Plus, Edit, Trash2, Eye, Heart, MessageSquare, AlertCircle, Loader2 } from 'lucide-react';
import { Unsubscribe } from 'firebase/firestore';

export const ManageProperties: React.FC = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
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
          <p className="text-red-600">Only property managers can manage property listings.</p>
        </div>
      </div>
    );
  }

  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return;
    }

    setDeleting(propertyId);
    try {
      await propertyService.deleteProperty(propertyId);
      // Property will be removed automatically due to real-time listener
    } catch (error: any) {
      alert('Failed to delete property: ' + error.message);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading your properties...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Properties
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your property listings
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

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {properties.reduce((sum, prop) => sum + (prop.views || 0), 0)}
              </p>
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
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {properties.reduce((sum, prop) => sum + (prop.saves || 0), 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <MessageSquare className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Inquiries</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {properties.reduce((sum, prop) => sum + (prop.inquiries || 0), 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <Plus className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Properties</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {properties.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      {properties.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Your Properties
            </h2>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Live updates enabled
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div key={property.id} className="relative">
                <PropertyCard
                  property={property}
                  onClick={() => navigate(`/edit-property/${property.id}`)}
                />
                
                {/* Management Overlay */}
                <div className="absolute top-3 right-3 flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/edit-property/${property.id}`);
                    }}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors"
                    title="Edit Property"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProperty(property.id);
                    }}
                    disabled={deleting === property.id}
                    className="p-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-full shadow-lg transition-colors"
                    title="Delete Property"
                  >
                    {deleting === property.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Status Badge */}
                <div className="absolute bottom-3 right-3">
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
      ) : (
        <div className="text-center py-12">
          <Plus className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No properties yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Get started by adding your first property listing
          </p>
          <button
            onClick={() => navigate('/add-property')}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Your First Property</span>
          </button>
        </div>
      )}
    </div>
  );
};
