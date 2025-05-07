import React from 'react';
import { UserIcon, SettingsIcon, BellIcon, KeyIcon, CreditCardIcon, HelpCircleIcon, LogOutIcon } from 'lucide-react';
export const Profile = () => {
  return <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="flex items-center mb-8">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mr-4">
          <UserIcon className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            John Doe
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            john.doe@example.com
          </p>
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
          }].map((item, index) => <button key={index} className="w-full flex items-center px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <item.icon className={`h-5 w-5 mr-3 ${item.className || 'text-gray-400'}`} />
                <span className={item.className || 'text-gray-700 dark:text-gray-300'}>
                  {item.label}
                </span>
              </button>)}
          </div>
        </div>
      </div>
    </div>;
};