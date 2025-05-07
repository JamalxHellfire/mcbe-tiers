
// Simple service to manage admin authentication state using localStorage
export const adminService = {
  isAdmin(): boolean {
    return localStorage.getItem('isAdmin') === 'true';
  },
  
  setAdmin(value: boolean): void {
    if (value) {
      // Set an expiration time 24 hours from now
      const expiration = new Date();
      expiration.setHours(expiration.getHours() + 24);
      localStorage.setItem('adminExpiration', expiration.toISOString());
      localStorage.setItem('isAdmin', 'true');
      
      // Log admin login
      this.logAdminActivity('Admin logged in');
    } else {
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('adminExpiration');
      
      // Log admin logout
      this.logAdminActivity('Admin logged out');
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
  
  // Log admin activities (stored locally for this implementation)
  logAdminActivity(action: string): void {
    try {
      const timestamp = new Date().toISOString();
      const logEntry = { timestamp, action };
      
      // Get existing log or initialize empty array
      const existingLog = localStorage.getItem('adminActivityLog');
      const logArray = existingLog ? JSON.parse(existingLog) : [];
      
      // Add new entry and limit to latest 1000 entries
      logArray.unshift(logEntry);
      const trimmedLog = logArray.slice(0, 1000);
      
      // Save back to localStorage
      localStorage.setItem('adminActivityLog', JSON.stringify(trimmedLog));
      
      // Log to console for development
      console.log(`[Admin Activity] ${timestamp}: ${action}`);
    } catch (error) {
      console.error('Failed to log admin activity:', error);
    }
  },
  
  // Get admin activity log
  getActivityLog(): Array<{timestamp: string, action: string}> {
    try {
      const existingLog = localStorage.getItem('adminActivityLog');
      return existingLog ? JSON.parse(existingLog) : [];
    } catch (error) {
      console.error('Failed to retrieve admin activity log:', error);
      return [];
    }
  }
};

// Check for expiration on import
adminService.checkExpiration();
