import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import NavBar from './components/NavBar';
import ErrorBoundary from './components/ErrorBoundary';
import { useAuth } from './auth/AuthContext';

const AuthPage = React.lazy(() => import('./pages/AuthPage'));
const SplashPage = React.lazy(() => import('./pages/SplashPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const ProductsPage = React.lazy(() => import('./pages/ProductsPage'));
const FeaturesPage = React.lazy(() => import('./pages/FeaturesPage'));
const FeedbackPage = React.lazy(() => import('./pages/FeedbackPage'));
const RoadmapPage = React.lazy(() => import('./pages/RoadmapPage'));
const ReportingPage = React.lazy(() => import('./pages/ReportingPage'));
const IntegrationsPage = React.lazy(() => import('./pages/IntegrationsPage'));

function App() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return (
    <ErrorBoundary>
      <Box minH="100vh" bg="gray.50">
        <NavBar />
        <React.Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <SplashPage />} />
            <Route path="/auth/*" element={<AuthPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/products/*" element={<ProductsPage />} />
            <Route path="/features/*" element={<FeaturesPage />} />
            <Route path="/feedback/*" element={<FeedbackPage />} />
            <Route path="/roadmap/*" element={<RoadmapPage />} />
            <Route path="/reporting/*" element={<ReportingPage />} />
            <Route path="/integrations/*" element={<IntegrationsPage />} />
          </Routes>
        </React.Suspense>
      </Box>
    </ErrorBoundary>
  );
}

export default App; 