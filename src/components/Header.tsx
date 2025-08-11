import React, { useState } from 'react';
import { HomeIcon, SearchIcon, HeartIcon, UserIcon, MenuIcon, XIcon, MoonIcon, SunIcon, LogOut, Settings } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './Auth/AuthModal';
export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { currentUser, userProfile, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      setUserMenuOpen(false);
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };
  return <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-1">
              <img 
                src="/assets/logo/logo.jpeg" 
                alt="House Tree" 
                className="h-8 w-8 rounded object-cover"
              />
            </div>
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/discover" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium">
              Discover
            </a>
            {userProfile?.role === 'manager' ? (
              <>
                <a href="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium">
                  Dashboard
                </a>
                <a href="/manage-properties" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium">
                  My Properties
                </a>
                <a href="/add-property" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium">
                  Add Property
                </a>
              </>
            ) : (
              <>
                <a href="/saved" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium">
                  Saved
                </a>
                <a href="/messages" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium">
                  Messages
                </a>
              </>
            )}
          </nav>
          {/* Right Side Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
              {theme === 'dark' ? <SunIcon className="h-5 w-5 text-gray-300" /> : <MoonIcon className="h-5 w-5 text-gray-600" />}
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <HeartIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
            
            {currentUser ? (
              <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-medium transition-colors"
                >
                  <UserIcon className="h-4 w-4" />
                  <span>{userProfile?.displayName || 'User'}</span>
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{userProfile?.displayName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{userProfile?.email}</p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 capitalize">{userProfile?.role}</p>
                    </div>
                    
                    {userProfile?.role === 'manager' && (
                      <>
                        <button 
                          onClick={() => window.location.href = '/dashboard'}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                        >
                          <div className="h-4 w-4 mr-2">📊</div>
                          Dashboard
                        </button>
                        <button 
                          onClick={() => window.location.href = '/add-property'}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                        >
                          <div className="h-4 w-4 mr-2">➕</div>
                          Add Property
                        </button>
                        <button 
                          onClick={() => window.location.href = '/manage-properties'}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                        >
                          <div className="h-4 w-4 mr-2">🏠</div>
                          Manage Properties
                        </button>
                        <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                      </>
                    )}
                    
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-medium transition-colors"
              >
                <UserIcon className="h-4 w-4" />
                <span>Sign In</span>
              </button>
            )}
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
              <a href="/discover" className="px-2 py-1 text-gray-600 dark:text-gray-300 font-medium">
                Discover Properties
              </a>
              
              {userProfile?.role === 'manager' ? (
                <>
                  <a href="/dashboard" className="px-2 py-1 text-gray-600 dark:text-gray-300 font-medium">
                    📊 Dashboard
                  </a>
                  <a href="/manage-properties" className="px-2 py-1 text-gray-600 dark:text-gray-300 font-medium">
                    🏠 My Properties
                  </a>
                  <a href="/add-property" className="px-2 py-1 text-gray-600 dark:text-gray-300 font-medium">
                    ➕ Add Property
                  </a>
                </>
              ) : (
                <>
                  <a href="/saved" className="px-2 py-1 text-gray-600 dark:text-gray-300 font-medium">
                    ❤️ Saved Properties
                  </a>
                  <a href="/messages" className="px-2 py-1 text-gray-600 dark:text-gray-300 font-medium">
                    💬 Messages
                  </a>
                  <a href="/profile" className="px-2 py-1 text-gray-600 dark:text-gray-300 font-medium">
                    👤 Profile
                  </a>
                </>
              )}
              
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
                {currentUser ? (
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => setAuthModalOpen(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-medium transition-colors"
                  >
                    <UserIcon className="h-4 w-4" />
                    <span>Sign In</span>
                  </button>
                )}
              </div>
            </nav>
          </div>}
      </div>
      
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </header>;
};