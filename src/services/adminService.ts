
import { supabase } from '@/integrations/supabase/client';

// Admin service functions
export interface AdminUser {
  id: string;
  email: string;
  role: string;
  last_sign_in: string;
}

export interface AdminLog {
  id: string;
  admin_id: string;
  action: string;
  target_player: string;
  details: string;
  timestamp: string;
}

// Verify admin PIN - updated with default PIN
export const verifyAdminPIN = async (pin: string): Promise<boolean> => {
  try {
    // Default PIN check
    if (pin === "1234") {
      return true;
    }
    
    // Check against database stored PINs if any exist
    const { data, error } = await supabase
      .from('admin_settings')
      .select('value')
      .eq('key', 'admin_pin')
      .maybeSingle();
    
    if (error) {
      console.error('Error checking admin PIN:', error);
      return false;
    }
    
    // If no PIN set in database, allow default PIN
    if (!data) {
      return pin === "1234";
    }
    
    return data.value === pin;
  } catch (error) {
    console.error('Failed to verify admin PIN:', error);
    return false;
  }
};

// Get admin users
export const getAdminUsers = async (): Promise<AdminUser[]> => {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('last_sign_in', { ascending: false });
    
    if (error) {
      console.error('Error fetching admin users:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Failed to fetch admin users:', error);
    return [];
  }
};

// Get admin logs
export const getAdminLogs = async (limit: number = 50): Promise<AdminLog[]> => {
  try {
    const { data, error } = await supabase
      .from('admin_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching admin logs:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Failed to fetch admin logs:', error);
    return [];
  }
};

// Log admin action
export const logAdminAction = async (action: string, targetPlayer: string, details: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('admin_logs')
      .insert({
        admin_id: 'system', // For now, use system as admin_id
        action,
        target_player: targetPlayer,
        details,
        timestamp: new Date().toISOString()
      });
    
    if (error) {
      console.error('Error logging admin action:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to log admin action:', error);
    return false;
  }
};

// Update admin settings
export const updateAdminSetting = async (key: string, value: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('admin_settings')
      .upsert({ key, value, updated_at: new Date().toISOString() });
    
    if (error) {
      console.error('Error updating admin setting:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to update admin setting:', error);
    return false;
  }
};

export const adminService = {
  verifyAdminPIN,
  getAdminUsers,
  getAdminLogs,
  logAdminAction,
  updateAdminSetting
};

export default adminService;
