import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { HomeIcon, SearchIcon, HeartIcon, MessageSquareIcon, UserIcon } from 'lucide-react';
export const MobileNav = () => {
  const location = useLocation();
  const navItems = [{
    path: '/',
    icon: HomeIcon,
    label: 'Home'
  }, {
    path: '/discover',
    icon: SearchIcon,
    label: 'Discover'
  }, {
    path: '/saved',
    icon: HeartIcon,
    label: 'Saved'
  }, {
    path: '/messages',
    icon: MessageSquareIcon,
    label: 'Messages'
  }, {
    path: '/profile',
    icon: UserIcon,
    label: 'Profile'
  }];
  return <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({
        path,
        icon: Icon,
        label
      }) => <NavLink key={path} to={path} className={({
        isActive
      }) => `flex flex-col items-center justify-center flex-1 h-full transition-colors ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'}`}>
            <Icon className="h-6 w-6" />
            <span className="text-xs mt-1">{label}</span>
          </NavLink>)}
      </div>
    </nav>;
};