
import { useEffect } from 'react';
import { deepSeekService } from '@/services/deepSeekService';

export function useVisitorTracking() {
  useEffect(() => {
    // Track page visit
    const trackVisit = async () => {
      try {
        await deepSeekService.logPageVisit(window.location.pathname);
        console.log('Page visit tracked:', window.location.pathname);
      } catch (error) {
        console.error('Failed to track page visit:', error);
      }
    };

    // Track initial visit
    trackVisit();

    // Track when user becomes active (clicks, moves mouse, etc.)
    let isActive = true;
    let lastActivity = Date.now();

    const trackActivity = () => {
      const now = Date.now();
      if (now - lastActivity > 30000) { // 30 seconds of inactivity
        isActive = false;
      }
      lastActivity = now;
      if (!isActive) {
        isActive = true;
        trackVisit();
      }
    };

    // Add event listeners for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, trackActivity, true);
    });

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, trackActivity, true);
      });
    };
  }, []);
}
