import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { ParkingProvider } from './context/ParkingContext';

import { DemoBanner } from './components/common/DemoBanner';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ScrollToTop } from './components/common/ScrollToTop';

import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { SpaceDetailPage } from './pages/SpaceDetailPage';
import { BookingFlowPage } from './pages/BookingFlowPage';
import { AuthPage } from './pages/AuthPage';
import { DriverDashboardPage } from './pages/DriverDashboardPage';
import { OwnerDashboardPage } from './pages/OwnerDashboardPage';
import { CreateListingPage } from './pages/CreateListingPage';
import { SafetyPage } from './pages/SafetyPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <ParkingProvider>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen text-navy-900 bg-surface-subtle font-sans">
              <DemoBanner />
              <Navbar />
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/explore" element={<ExplorePage />} />
                  <Route path="/space/:id" element={<SpaceDetailPage />} />
                  <Route path="/book/:id" element={<BookingFlowPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/dashboard/driver" element={<DriverDashboardPage />} />
                  <Route path="/dashboard/owner" element={<OwnerDashboardPage />} />
                  <Route path="/list-space" element={<CreateListingPage />} />
                  <Route path="/safety" element={<SafetyPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
              <Footer />
            </div>
          </ParkingProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;
