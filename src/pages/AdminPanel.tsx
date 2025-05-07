
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '@/services/adminService';
import AdminPanelContent from '@/components/admin/AdminPanelContent';
import AdminLoginForm from '@/components/admin/AdminLoginForm';

const AdminPanel = () => {
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const navigate = useNavigate();
  
  // Check admin status on load
  useEffect(() => {
    const checkAdminStatus = () => {
      // Check if user is admin and session hasn't expired
      const isAdmin = adminService.isAdmin() && adminService.checkExpiration();
      setIsAdminMode(isAdmin);
      setIsCheckingAuth(false);
      
      if (!isAdmin) {
        // Clear any stale admin state
        adminService.logoutAdmin();
      }
    };
    
    checkAdminStatus();
    
    // Set up inactivity timeout for auto-logout (15 minutes)
    let inactivityTimer: number;
    
    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = window.setTimeout(() => {
        if (adminService.isAdmin()) {
          adminService.logoutAdmin();
          setIsAdminMode(false);
          navigate('/admin-panel');
        }
      }, 15 * 60 * 1000); // 15 minutes in milliseconds
    };
    
    // Events to reset the inactivity timer
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, resetInactivityTimer);
    });
    
    // Start the timer
    resetInactivityTimer();
    
    // Cleanup function
    return () => {
      clearTimeout(inactivityTimer);
      events.forEach(event => {
        document.removeEventListener(event, resetInactivityTimer);
      });
    };
  }, [navigate]);
  
  if (isCheckingAuth) {
    return (
      <div className="container mx-auto p-8 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      {isAdminMode ? (
        <AdminPanelContent onLogout={() => setIsAdminMode(false)} />
      ) : (
        <AdminLoginForm onLoginSuccess={() => setIsAdminMode(true)} />
      )}
    </div>
  );
};

export default AdminPanel;
