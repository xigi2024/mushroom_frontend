// src/components/ProtectedRoute.js
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  useEffect(() => {
    console.log('ProtectedRoute - Auth state:', { 
      isAuthenticated, 
      loading, 
      hasToken: !!localStorage.getItem('access_token'),
      user: user ? 'User exists' : 'No user',
      timestamp: new Date().toISOString()
    });
  }, [isAuthenticated, loading, user]);

  if (loading) {
    console.log('ProtectedRoute - Loading authentication state...');
    return <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>;
  }

  if (!isAuthenticated) {
    console.log('ProtectedRoute - Not authenticated, redirecting to login');
    // Store the intended destination before redirecting
    const from = window.location.pathname;
    if (from !== '/login') {
      localStorage.setItem('redirectAfterLogin', from);
    }
    return <Navigate to="/login" state={{ from }} replace />;
  }

  console.log('ProtectedRoute - User authenticated, rendering children');
  return children;
};

export default ProtectedRoute;