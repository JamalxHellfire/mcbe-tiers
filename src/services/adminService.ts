
import { supabase } from '@/integrations/supabase/client';

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  last_sign_in?: string;
}

export interface AdminLog {
  id: string;
  admin_id: string;
  action: string;
  target_player?: string;
  details?: string;
  timestamp: string;
}

export interface AdminSettings {
  key: string;
  value: string;
}

export const adminService = {
  // Check admin login with default PIN
  async checkAdminLogin(pin: string): Promise<boolean> {
    try {
      // Default PIN is 1234
      const defaultPin = '1234';
      
      if (pin === defaultPin) {
        console.log('Admin login successful with default PIN');
        return true;
      }
      
      console.log('Invalid PIN provided');
      return false;
    } catch (error) {
      console.error('Error checking admin login:', error);
      return false;
    }
  },

  // Get admin users (mock data for now)
  async getAdminUsers(): Promise<AdminUser[]> {
    try {
      // Return mock admin users since we don't have the admin_users table
      const mockUsers: AdminUser[] = [
        {
          id: '1',
          email: 'admin@mcbetiers.com',
          role: 'Super Admin',
          last_sign_in: new Date().toISOString()
        }
      ];
      
      return mockUsers;
    } catch (error) {
      console.error('Error fetching admin users:', error);
      return [];
    }
  },

  // Get admin logs (mock data for now)
  async getAdminLogs(): Promise<AdminLog[]> {
    try {
      // Return mock admin logs since we don't have the admin_logs table
      const mockLogs: AdminLog[] = [
        {
          id: '1',
          admin_id: '1',
          action: 'Login',
          details: 'Admin logged in successfully',
          timestamp: new Date().toISOString()
        }
      ];
      
      return mockLogs;
    } catch (error) {
      console.error('Error fetching admin logs:', error);
      return [];
    }
  },

  // Add admin log (mock implementation)
  async addAdminLog(logData: Omit<AdminLog, 'id' | 'timestamp'>): Promise<void> {
    try {
      console.log('Mock admin log added:', logData);
      // In a real implementation, this would insert into admin_logs table
    } catch (error) {
      console.error('Error adding admin log:', error);
      throw error;
    }
  }
};
