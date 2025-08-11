import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PropertyForm } from '../components/Property/PropertyForm';
import { useAuth } from '../contexts/AuthContext';
import { propertyService } from '../services/propertyService';
import { Property } from '../types/property';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export const AddProperty: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing && id) {
      setLoading(true);
      propertyService.getProperty(id)
        .then((prop) => {
          if (prop) {
            setProperty(prop);
          } else {
            setError('Property not found');
          }
        })
        .catch((err) => {
          setError(err.message || 'Failed to load property');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, isEditing]);

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
          <p className="text-red-600">Only property managers can add or edit property listings.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = (updatedProperty: Property) => {
    // Navigate back to manage properties page
    navigate('/manage-properties');
  };

  const handleCancel = () => {
    navigate('/manage-properties');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading property...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => navigate('/manage-properties')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={handleCancel}
            className="mr-4 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Property' : 'Add New Property'}
          </h1>
        </div>
      </div>

      {/* Property Form */}
      <PropertyForm
        property={property || undefined}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};
