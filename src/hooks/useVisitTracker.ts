
import { useEffect } from 'react';
import { adminService } from '@/services/adminService';

// This hook will be used to track page visits on the public pages
export function useVisitTracker() {
  useEffect(() => {
    // Record a visit when the page loads
    // We don't need to do anything with the result
    adminService.recordVisit().catch(err => {
      // Just log any errors, don't interrupt the user experience
      console.error('Failed to record visit:', err);
    });
  }, []);
  
  return null;
}
