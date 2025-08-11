import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeIcon, 
  SearchIcon, 
  HeartIcon, 
  MessageSquareIcon, 
  UserIcon, 
  PlusSquare, 
  BarChart3,
  Settings,
  Building
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const MobileNav = () => {
  const { userProfile } = useAuth();
  
  // Property Manager Navigation
  const managerNavItems = [
    {
      path: '/',
      icon: HomeIcon,
      label: 'Home'
    },
    {
      path: '/discover',
      icon: SearchIcon,
      label: 'Discover'
    },
    {
      path: '/dashboard',
      icon: BarChart3,
      label: 'Dashboard'
    },
    {
      path: '/manage-properties',
      icon: Building,
      label: 'Properties'
    },
    {
      path: '/add-property',
      icon: PlusSquare,
      label: 'Add'
    }
  ];

  // House Hunter Navigation
  const hunterNavItems = [
    {
      path: '/',
      icon: HomeIcon,
      label: 'Home'
    },
    {
      path: '/discover',
      icon: SearchIcon,
      label: 'Discover'
    },
    {
      path: '/saved',
      icon: HeartIcon,
      label: 'Saved'
    },
    {
      path: '/messages',
      icon: MessageSquareIcon,
      label: 'Messages'
    },
    {
      path: '/profile',
      icon: UserIcon,
      label: 'Profile'
    }
  ];

  // Use appropriate navigation based on user role
  const navItems = userProfile?.role === 'manager' ? managerNavItems : hunterNavItems;
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink 
            key={path} 
            to={path} 
            className={({ isActive }) => 
              `flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive 
                  ? 'text-emerald-600 dark:text-emerald-400' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs mt-1 font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
      
      {/* Role indicator */}
      {userProfile && (
        <div className="absolute top-0 right-2 transform -translate-y-1/2">
          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
            userProfile.role === 'manager' 
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
              : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
          }`}>
            {userProfile.role === 'manager' ? 'Manager' : 'Hunter'}
          </span>
        </div>
      )}
    </nav>
  );
};