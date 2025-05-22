
import { supabase } from '@/integrations/supabase/client';

// Simple service to manage admin authentication state using localStorage
export const adminService = {
  isAdmin(): boolean {
    return localStorage.getItem('isAdmin') === 'true' && this.checkExpiration();
  },
  
  setAdmin(value: boolean): void {
    if (value) {
      // Set an expiration time 24 hours from now
      const expiration = new Date();
      expiration.setHours(expiration.getHours() + 24);
      localStorage.setItem('adminExpiration', expiration.toISOString());
      localStorage.setItem('isAdmin', 'true');
    } else {
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('adminExpiration');
    }
  },
  
  checkExpiration(): boolean {
    const expirationStr = localStorage.getItem('adminExpiration');
    if (!expirationStr) {
      return false;
    }
    
    const expiration = new Date(expirationStr);
    const now = new Date();
    
    if (now > expiration) {
      // Session expired, clear admin state
      this.setAdmin(false);
      return false;
    }
    
    return true;
  },
  
  logoutAdmin(): void {
    this.setAdmin(false);
  },

  verifyAdminPIN(pin: string): Promise<boolean> {
    // Use hardcoded PIN value as requested (1234)
    return Promise.resolve(pin === '1234');
  }
};

// Check for expiration on import
adminService.checkExpiration();
