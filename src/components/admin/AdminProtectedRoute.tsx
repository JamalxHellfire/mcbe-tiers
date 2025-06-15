
import React, { useState, useEffect } from 'react';
import { AdminAuth } from './AdminAuth';
import { adminService } from '@/services/adminService';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const sessionToken = localStorage.getItem('admin_session_token');
      
      if (!sessionToken) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const isValid = await adminService.verifyAdminSession(sessionToken);
        setIsAuthenticated(isValid);
      } catch (error) {
        console.error('Session verification error:', error);
        setIsAuthenticated(false);
        localStorage.removeItem('admin_session_token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0b14] via-[#0f111a] to-[#1a1b2a] flex items-center justify-center">
        <div className="text-white text-lg">Verifying access...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminAuth onAuthSuccess={handleAuthSuccess} />;
  }

  return <>{children}</>;
};
