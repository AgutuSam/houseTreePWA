import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { MobileNav } from './components/MobileNav';
import { Home } from './pages/Home';
import { Discover } from './pages/Discover';
import { Saved } from './pages/Saved';
import { Messages } from './pages/Messages';
import { Profile } from './pages/Profile';
import { ThemeProvider } from './components/ThemeProvider';
export function App() {
  return <BrowserRouter>
      <ThemeProvider>
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
          <Header />
          <main className="flex-1 pb-16 md:pb-0">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/saved" element={<Saved />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          <MobileNav />
        </div>
      </ThemeProvider>
    </BrowserRouter>;
}