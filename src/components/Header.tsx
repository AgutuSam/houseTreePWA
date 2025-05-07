import React, { useState } from 'react';
import { HomeIcon, SearchIcon, HeartIcon, UserIcon, MenuIcon, XIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from './ThemeProvider';
export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {
    theme,
    toggleTheme
  } = useTheme();
  return <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-1">
              <HomeIcon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              <span className="font-bold text-xl text-gray-800 dark:text-white">
                House Tree
              </span>
            </div>
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium">
              Discover
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium">
              Saved
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium">
              Messages
            </a>
          </nav>
          {/* Right Side Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
              {theme === 'dark' ? <SunIcon className="h-5 w-5 text-gray-300" /> : <MoonIcon className="h-5 w-5 text-gray-600" />}
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <HeartIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-medium transition-colors">
              <UserIcon className="h-4 w-4" />
              <span>Sign In</span>
            </button>
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              {mobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col space-y-4">
              <a href="#" className="px-2 py-1 text-gray-600 dark:text-gray-300 font-medium">
                Discover
              </a>
              <a href="#" className="px-2 py-1 text-gray-600 dark:text-gray-300 font-medium">
                Saved
              </a>
              <a href="#" className="px-2 py-1 text-gray-600 dark:text-gray-300 font-medium">
                Messages
              </a>
              <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2">
                  {theme === 'dark' ? <>
                      <SunIcon className="h-5 w-5 text-gray-300" />
                      <span className="text-gray-300">Light mode</span>
                    </> : <>
                      <MoonIcon className="h-5 w-5 text-gray-600" />
                      <span className="text-gray-600">Dark mode</span>
                    </>}
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-medium transition-colors">
                  <UserIcon className="h-4 w-4" />
                  <span>Sign In</span>
                </button>
              </div>
            </nav>
          </div>}
      </div>
    </header>;
};