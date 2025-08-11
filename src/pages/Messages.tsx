import React, { useState, useEffect } from 'react';
import { MessageCircleIcon, Send, Phone, Video, MoreVertical } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Messages = () => {
  const { userProfile } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Implement real-time messaging with Firebase
    // For now, just show empty state
    setLoading(false);
  }, []);

  if (!userProfile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <MessageCircleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Please Log In
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            You need to be logged in to view your messages.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Messages
        </h1>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
          Messaging system coming soon
        </div>
      </div>

      {/* Coming Soon Message */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
        <div className="flex items-center">
          <MessageCircleIcon className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
              In-App Messaging Coming Soon
            </h3>
            <p className="text-blue-700 dark:text-blue-300 mt-1">
              We're working on a secure messaging system that will allow {userProfile.role === 'manager' ? 'property managers and tenants' : 'house hunters and property owners'} to communicate directly within the app.
            </p>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <Send className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-sm text-blue-800 dark:text-blue-200">Instant messaging</span>
          </div>
          <div className="flex items-center">
            <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-sm text-blue-800 dark:text-blue-200">Contact sharing</span>
          </div>
          <div className="flex items-center">
            <Video className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-sm text-blue-800 dark:text-blue-200">Virtual tour scheduling</span>
          </div>
        </div>
      </div>

      {/* Temporary Contact Instructions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          How to Contact {userProfile.role === 'manager' ? 'Potential Tenants' : 'Property Owners'}
        </h3>
        
        {userProfile.role === 'manager' ? (
          <div className="space-y-3 text-gray-600 dark:text-gray-400">
            <p>• Property inquiries will be sent to your email address</p>
            <p>• Update your contact information in your property listings</p>
            <p>• Use the contact details provided in inquiry notifications</p>
            <p>• Consider providing WhatsApp or phone numbers for quick responses</p>
          </div>
        ) : (
          <div className="space-y-3 text-gray-600 dark:text-gray-400">
            <p>• Click on any property to view owner contact information</p>
            <p>• Use the phone numbers or email addresses provided in listings</p>
            <p>• Most property managers respond within a few hours</p>
            <p>• Prepare your questions about rent, deposit, and viewing times</p>
          </div>
        )}
        
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Quick Tips:</h4>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p>• Be specific about your requirements and timeline</p>
            <p>• Include your budget range in initial inquiries</p>
            <p>• Ask about viewing availability and requirements</p>
            <p>• Be professional and courteous in all communications</p>
          </div>
        </div>
      </div>
    </div>
  );
};