import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();
  
  useEffect(() => {
    // Check for authentication token
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);
  
  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location.pathname }}
        replace
      />
    );
  }
  
  // Render the protected component
  return element;
};

export default PrivateRoute; 