import React from 'react';
import { UserIcon, SettingsIcon, BellIcon, KeyIcon, CreditCardIcon, HelpCircleIcon, LogOutIcon, Heart, Home, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const { userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  if (!userProfile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <UserIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Please Log In
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            You need to be logged in to view your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="flex items-center mb-8">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mr-4">
          {userProfile.avatar ? (
            <img src={userProfile.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
          ) : (
            <UserIcon className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {userProfile.displayName || 'User'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {userProfile.email}
          </p>
          <span className={`inline-block px-2 py-1 text-xs rounded-full font-medium mt-1 ${
            userProfile.role === 'manager' 
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
              : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
          }`}>
            {userProfile.role === 'manager' ? 'Property Manager' : 'House Hunter'}
          </span>
        </div>
      </div>
      {/* Profile Sections */}
      <div className="space-y-6">
        {/* Account Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Account Settings
            </h2>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            {[{
            icon: UserIcon,
            label: 'Personal Information'
          }, {
            icon: SettingsIcon,
            label: 'Preferences'
          }, {
            icon: BellIcon,
            label: 'Notifications'
          }, {
            icon: KeyIcon,
            label: 'Password & Security'
          }].map((item, index) => <button key={index} className="w-full flex items-center px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <item.icon className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">
                  {item.label}
                </span>
              </button>)}
          </div>
        </div>
        {/* Payment & Support */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="border-t border-gray-200 dark:border-gray-700">
            {[{
            icon: CreditCardIcon,
            label: 'Payment Methods'
          }, {
            icon: HelpCircleIcon,
            label: 'Help & Support'
          }, {
            icon: LogOutIcon,
            label: 'Log Out',
            className: 'text-red-600 dark:text-red-400'
          }].map((item, index) => (
              <button 
                key={index} 
                onClick={item.label === 'Log Out' ? handleLogout : undefined}
                className="w-full flex items-center px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <item.icon className={`h-5 w-5 mr-3 ${item.className || 'text-gray-400'}`} />
                <span className={item.className || 'text-gray-700 dark:text-gray-300'}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Stats for Hunters */}
        {userProfile.role === 'hunter' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Your Activity
              </h2>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-3 divide-x divide-gray-200 dark:divide-gray-700">
                <div className="px-6 py-4 text-center">
                  <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {userProfile.savedProperties?.length || 0}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Saved</div>
                </div>
                <div className="px-6 py-4 text-center">
                  <MessageSquare className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Messages</div>
                </div>
                <div className="px-6 py-4 text-center">
                  <Home className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Inquiries</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};