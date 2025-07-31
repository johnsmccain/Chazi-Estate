import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { BrowsePropertiesPage } from './pages/BrowsePropertiesPage';
import { MyPropertiesPage } from './pages/MyPropertiesPage';
import { BuyFractionPage } from './pages/BuyFractionPage';
import { RentPropertyPage } from './pages/RentPropertyPage';
import { LoanPropertyPage } from './pages/LoanPropertyPage';
import { CreateDeedPage } from './pages/CreateDeedPage';
import { PropertyUploadPage } from './pages/PropertyUploadPage';
import { DeedGenerationPage } from './pages/DeedGenerationPage';
import { DeedGeneratorPage } from './pages/DeedGeneratorPage';
import { DAODashboardPage } from './pages/DAODashboardPage';
import { ExplorerPage } from './pages/ExplorerPage';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/explorer" element={<ExplorerPage />} />
            <Route path="/onboarding" element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <DashboardPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/browse" element={
              <ProtectedRoute>
                <Layout>
                  <BrowsePropertiesPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/my-properties" element={
              <ProtectedRoute>
                <Layout>
                  <MyPropertiesPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/buy-fraction" element={
              <ProtectedRoute>
                <Layout>
                  <BuyFractionPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/rent" element={
              <ProtectedRoute>
                <Layout>
                  <RentPropertyPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/loan" element={
              <ProtectedRoute>
                <Layout>
                  <LoanPropertyPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/dao" element={
              <ProtectedRoute>
                <Layout>
                  <DAODashboardPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/create-deed" element={
              <ProtectedRoute>
                <Layout>
                  <CreateDeedPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/deed-generator" element={
              <ProtectedRoute>
                <Layout>
                  <DeedGeneratorPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/upload" element={
              <ProtectedRoute>
                <Layout>
                  <PropertyUploadPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/deed/:propertyId" element={
              <ProtectedRoute>
                <Layout>
                  <DeedGenerationPage />
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;