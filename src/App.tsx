import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import BatchDetails from './pages/BatchDetails';

// Pages
import Dashboard from './pages/Dashboard';
import Reception from './pages/Reception';
import Production from './pages/Production';
import Moulage from './pages/Moulage';
import Decoration from './pages/Decoration';
import Emballage from './pages/Emballage';
import Distribution from './pages/Distribution';
import Historique from './pages/Historique';
import Admin from './pages/Admin';

const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/lot/:data" element={<BatchDetails />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="reception" element={<Reception />} />
              <Route path="production" element={<Production />} />
              <Route path="moulage" element={<Moulage />} />
              <Route path="decoration" element={<Decoration />} />
              <Route path="emballage" element={<Emballage />} />
              <Route path="distribution" element={<Distribution />} />
              <Route path="historique" element={<Historique />} />
              <Route path="admin" element={<Admin />} />
            </Route>
          </Routes>
          <Toaster position="top-right" />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;