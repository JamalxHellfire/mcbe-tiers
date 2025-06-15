
import { supabase } from '@/integrations/supabase/client';

export interface AdminLoginResult {
  success: boolean;
  sessionToken?: string;
  adminId?: string;
  error?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  role: string;
  lastLogin?: string;
}

// Fixed admin login with new password
export const adminLogin = async (pin: string): Promise<AdminLoginResult> => {
  try {
    // Check if PIN is the correct admin PIN
    if (pin === "$$mcbevtl789db$$") {
      // Generate a mock session token
      const sessionToken = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      return {
        success: true,
        sessionToken,
        adminId: 'admin-1'
      };
    }
    
    return {
      success: false,
      error: 'Invalid PIN'
    };
  } catch (error) {
    console.error('Admin login error:', error);
    return {
      success: false,
      error: 'Login failed'
    };
  }
};

export const verifyAdminSession = async (sessionToken: string): Promise<boolean> => {
  try {
    // Simple session validation for mock admin
    return sessionToken.startsWith('admin_');
  } catch (error) {
    console.error('Session verification error:', error);
    return false;
  }
};

export const adminLogout = async (sessionToken: string): Promise<boolean> => {
  try {
    // Mock logout - always successful
    return true;
  } catch (error) {
    console.error('Admin logout error:', error);
    return false;
  }
};

export const getAdminUser = async (sessionToken: string): Promise<AdminUser | null> => {
  try {
    if (sessionToken.startsWith('admin_')) {
      return {
        id: 'admin-1',
        username: 'admin',
        role: 'administrator',
        lastLogin: new Date().toISOString()
      };
    }
    return null;
  } catch (error) {
    console.error('Get admin user error:', error);
    return null;
  }
};

export const adminService = {
  adminLogin,
  verifyAdminSession,
  adminLogout,
  getAdminUser
};

export default adminService;
