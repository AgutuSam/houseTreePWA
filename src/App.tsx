import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { MobileNav } from './components/MobileNav';
import { Home } from './pages/Home';
import { Discover } from './pages/Discover';
import { Saved } from './pages/Saved';
import { Messages } from './pages/Messages';
import { Profile } from './pages/Profile';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider } from './contexts/AuthContext';
import { AddProperty } from './pages/AddProperty';
import { ManageProperties } from './pages/ManageProperties';
import { ManagerDashboard } from './pages/ManagerDashboard';
import { PropertyDetails } from './pages/PropertyDetails';
export function App() {
  return <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header />
            <main className="flex-1 pb-16 md:pb-0">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/saved" element={<Saved />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/profile" element={<Profile />} />
                {/* Property Details Route */}
                <Route path="/property/:id" element={<PropertyDetails />} />
                {/* Property Manager Routes */}
                <Route path="/dashboard" element={<ManagerDashboard />} />
                <Route path="/add-property" element={<AddProperty />} />
                <Route path="/manage-properties" element={<ManageProperties />} />
                <Route path="/edit-property/:id" element={<AddProperty />} />
              </Routes>
            </main>
            <MobileNav />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>;
}