import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { RainbowKitWalletProvider } from './contexts/RainbowKitWalletContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoadingSpinner } from './components/LoadingSpinner';
// import { PerformanceMonitor } from './components/PerformanceMonitor';
import { registerServiceWorker } from './utils/serviceWorker';
import { preloader } from './utils/preloader';

// Lazy load all pages for better performance
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const BrowsePropertiesPage = lazy(() => import('./pages/BrowsePropertiesPage'));
const MyPropertiesPage = lazy(() => import('./pages/MyPropertiesPage'));
const BuyFractionPage = lazy(() => import('./pages/BuyFractionPage'));
const RentPropertyPage = lazy(() => import('./pages/RentPropertyPage'));
const LoanPropertyPage = lazy(() => import('./pages/LoanPropertyPage'));
const CreateDeedPage = lazy(() => import('./pages/CreateDeedPage'));
const PropertyUploadPage = lazy(() => import('./pages/PropertyUploadPage'));
const DeedGenerationPage = lazy(() => import('./pages/DeedGenerationPage'));
const DeedGeneratorPage = lazy(() => import('./pages/DeedGeneratorPage'));
const DAODashboardPage = lazy(() => import('./pages/DAODashboardPage'));
const ExplorerPage = lazy(() => import('./pages/ExplorerPage'));
const WalletTestPage = lazy(() => import('./pages/WalletTestPage'));
const BackendTestPage = lazy(() => import('./pages/BackendTestPage'));
const WalletDebugPage = lazy(() => import('./pages/WalletDebugPage'));
const RainbowKitWalletTestPage = lazy(() => import('./pages/RainbowKitWalletTestPage'));

function App() {
  // Register service worker for offline support and caching
  useEffect(() => {
    // Only register service worker in production or when explicitly enabled
    if (import.meta.env.PROD) {
      registerServiceWorker();
    }
    
    // Preload critical resources with delay to avoid blocking
    setTimeout(() => {
      preloader.preloadCriticalResources();
    }, 1000);
  }, []);

  return (
    <AuthProvider>
      <RainbowKitWalletProvider>
        <Router>
          <div className="min-h-screen bg-linear-to-br from-slate-900 via-gray-900 to-indigo-900">
          <Suspense fallback={<LoadingSpinner />}>
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
            <Route path="/buy-fraction/:id" element={
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
                      <Route path="/wallet-test" element={
                        <ProtectedRoute>
                          <Layout>
                            <WalletTestPage />
                          </Layout>
                        </ProtectedRoute>
                      } />
                      <Route path="/backend-test" element={
                        <ProtectedRoute>
                          <Layout>
                            <BackendTestPage />
                          </Layout>
                        </ProtectedRoute>
                      } />
                      <Route path="/wallet-debug" element={
                        <ProtectedRoute>
                          <Layout>
                            <WalletDebugPage />
                          </Layout>
                        </ProtectedRoute>
                      } />
                      <Route path="/rainbowkit-test" element={
                        <ProtectedRoute>
                          <Layout>
                            <RainbowKitWalletTestPage />
                          </Layout>
                        </ProtectedRoute>
                      } />
          </Routes>
          </Suspense>
          {/* Temporarily disabled for debugging */}
          {/* <PerformanceMonitor /> */}
          </div>
        </Router>
      </RainbowKitWalletProvider>
    </AuthProvider>
  );
}

export default App;