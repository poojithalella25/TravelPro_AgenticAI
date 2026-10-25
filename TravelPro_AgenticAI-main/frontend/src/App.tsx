import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import StatesPage from './pages/StatesPage';
import UnionTerritoriesPage from './pages/UnionTerritoriesPage';
import SmartCalendarPage from './pages/SmartCalendarPage';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import PlanningScreen from './pages/PlanningScreen';
import TripResult from './pages/TripResult';
import ProfileSettings from './pages/ProfileSettings';
import AIAgentWidget from './components/AIAgentWidget';

// Protected Route Component to guard authenticated pages
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh', 
        color: '#0f172a',
        fontWeight: 800,
        fontSize: '1.1rem' 
      }}>
        <div style={{ 
          border: '4px solid #fef08a', 
          borderTop: '4px solid #febb02', 
          borderRadius: '50%', 
          width: '40px', 
          height: '40px',
          marginRight: '12px',
          animation: 'spin 1s linear infinite'
        }} />
        Loading your session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Guest Route Component to prevent logged-in users from hitting login/register
const GuestRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh', 
        color: '#94a3b8' 
      }}>
        Loading...
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Global Header Navigation */}
            <Navbar />
            
            {/* Page Routing Container */}
            <main style={{ flex: 1 }}>
              <Routes>
                {/* Public Navigation Pages */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/states" element={<StatesPage />} />
                <Route path="/union-territories" element={<UnionTerritoriesPage />} />
                <Route path="/smart-calendar" element={<SmartCalendarPage />} />
                
                {/* Adventure Builder Pages */}
                <Route path="/create-trip" element={<CreateTrip />} />
                <Route path="/adventure-builder" element={<CreateTrip />} />
                
                {/* Guest Only Routes */}
                <Route 
                  path="/login" 
                  element={
                    <GuestRoute>
                      <LoginPage />
                    </GuestRoute>
                  } 
                />
                <Route 
                  path="/register" 
                  element={
                    <GuestRoute>
                      <RegisterPage />
                    </GuestRoute>
                  } 
                />

                {/* Protected Workspace Routes */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/saved-trips" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/planning" 
                  element={
                    <ProtectedRoute>
                      <PlanningScreen />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/trip-result" 
                  element={
                    <ProtectedRoute>
                      <TripResult />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/trip-result/:id" 
                  element={
                    <ProtectedRoute>
                      <TripResult />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/itinerary" 
                  element={
                    <ProtectedRoute>
                      <TripResult />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/itinerary/:id" 
                  element={
                    <ProtectedRoute>
                      <TripResult />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <ProfileSettings />
                    </ProtectedRoute>
                  } 
                />

                {/* Fallback Catch-All */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Persistent Global Floating AI Website Assistant */}
            <AIAgentWidget />
          </div>
        </Router>

      </AuthProvider>
    </ToastProvider>
  );
}

export default App;

