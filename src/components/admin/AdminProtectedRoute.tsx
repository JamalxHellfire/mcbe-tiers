
import React, { useState, useEffect } from 'react';
import { AdminAuth } from './AdminAuth';
import { adminService } from '@/services/adminService';

interface AdminProtectedRouteProps {
  children: (userRole: string) => React.ReactNode;
}

export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        console.log('AdminProtectedRoute: Checking access...');
        
        // First check local storage for existing session
        const sessionToken = localStorage.getItem('admin_session_token');
        const storedRole = localStorage.getItem('admin_role');
        
        console.log('Stored session token:', !!sessionToken);
        console.log('Stored role:', storedRole);
        
        if (sessionToken && storedRole) {
          console.log('Found existing session, verifying...');
          const isValid = await adminService.verifyAdminSession(sessionToken);
          if (isValid) {
            console.log('Session valid, setting role:', storedRole);
            setUserRole(storedRole);
            setIsLoading(false);
            return;
          } else {
            console.log('Session invalid, clearing storage');
            adminService.clearAllAuthState();
          }
        }
        
        // Check IP-based access as fallback
        console.log('Checking IP-based access...');
        const result = await adminService.checkAdminAccess();
        if (result.hasAccess && result.role) {
          console.log('IP-based access granted, role:', result.role);
          setUserRole(result.role);
          
          // Create session for this access
          const newSessionToken = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          localStorage.setItem('admin_session_token', newSessionToken);
          localStorage.setItem('admin_role', result.role);
        } else {
          console.log('No access granted');
          setUserRole(null);
        }
      } catch (error) {
        console.error('Access check error:', error);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, []);

  const handleAuthSuccess = async () => {
    console.log('Auth success callback triggered');
    
    // Small delay to ensure database update is complete
    setTimeout(async () => {
      try {
        const result = await adminService.checkAdminAccess();
        if (result.hasAccess && result.role) {
          console.log('Setting user role after auth success:', result.role);
          setUserRole(result.role);
        }
      } catch (error) {
        console.error('Error in auth success callback:', error);
      }
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0b14] via-[#0f111a] to-[#1a1b2a] flex items-center justify-center">
        <div className="text-white text-lg">Verifying access...</div>
      </div>
    );
  }

  if (!userRole) {
    return <AdminAuth onAuthSuccess={handleAuthSuccess} />;
  }

  console.log('AdminProtectedRoute: Rendering admin panel with role:', userRole);
  return <>{children(userRole)}</>;
};
