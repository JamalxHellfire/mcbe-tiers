
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageVisit } from '@/services/analyticsService';

export function useAnalytics() {
  const location = useLocation();

  useEffect(() => {
    // Track page visit on route change
    trackPageVisit(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    // Track initial page load
    trackPageVisit(window.location.pathname);
  }, []);
}
