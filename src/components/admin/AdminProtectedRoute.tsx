
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
        const result = await adminService.checkAdminAccess();
        if (result.hasAccess && result.role) {
          setUserRole(result.role);
          // Set session token for compatibility
          localStorage.setItem('admin_session_token', `admin_${Date.now()}`);
          localStorage.setItem('admin_role', result.role);
        } else {
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

  const handleAuthSuccess = () => {
    // Re-check access after successful auth
    adminService.checkAdminAccess().then((result) => {
      if (result.hasAccess && result.role) {
        setUserRole(result.role);
      }
    });
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

  return <>{children(userRole)}</>;
};
