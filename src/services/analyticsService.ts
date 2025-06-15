import { supabase } from '@/integrations/supabase/client';

interface AnalyticsEvent {
  event_type: 'page_visit' | 'unique_visit';
  page_path: string;
  device_type: 'mobile' | 'desktop' | 'tablet';
  user_agent: string;
  ip_address?: string;
  timestamp: string;
}

interface VisitorStats {
  totalUniqueVisits: number;
  totalPageVisits: number;
  pcUsers: number;
  mobileUsers: number;
  tabletUsers: number;
}

// Simple device detection
const getDeviceType = (): 'mobile' | 'desktop' | 'tablet' => {
  const userAgent = navigator.userAgent.toLowerCase();
  const width = window.innerWidth;
  
  if (width < 768) return 'mobile';
  if (width < 1024 && (userAgent.includes('tablet') || userAgent.includes('ipad'))) return 'tablet';
  return 'desktop';
};

// Track page visit
export const trackPageVisit = async (pagePath: string) => {
  try {
    const deviceType = getDeviceType();
    const userAgent = navigator.userAgent;
    
    // Create analytics event
    const event: AnalyticsEvent = {
      event_type: 'page_visit',
      page_path: pagePath,
      device_type: deviceType,
      user_agent: userAgent,
      timestamp: new Date().toISOString()
    };
    
    // Store in localStorage for analytics (lightweight approach)
    const existingEvents = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    existingEvents.push(event);
    
    // Keep only last 1000 events to prevent storage bloat
    if (existingEvents.length > 1000) {
      existingEvents.splice(0, existingEvents.length - 1000);
    }
    
    localStorage.setItem('analytics_events', JSON.stringify(existingEvents));
    
    // Also track unique visit if first time today
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem('last_visit_date');
    
    if (lastVisit !== today) {
      localStorage.setItem('last_visit_date', today);
      const uniqueEvent: AnalyticsEvent = {
        ...event,
        event_type: 'unique_visit'
      };
      existingEvents.push(uniqueEvent);
      localStorage.setItem('analytics_events', JSON.stringify(existingEvents));
    }
  } catch (error) {
    console.warn('Analytics tracking failed:', error);
  }
};

// Get visitor statistics
export const getVisitorStats = (): VisitorStats => {
  try {
    const events: AnalyticsEvent[] = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    
    const uniqueVisits = events.filter(e => e.event_type === 'unique_visit').length;
    const pageVisits = events.filter(e => e.event_type === 'page_visit').length;
    
    const deviceCounts = events.reduce((acc, event) => {
      acc[event.device_type] = (acc[event.device_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalUniqueVisits: uniqueVisits,
      totalPageVisits: pageVisits,
      pcUsers: deviceCounts.desktop || 0,
      mobileUsers: deviceCounts.mobile || 0,
      tabletUsers: deviceCounts.tablet || 0
    };
  } catch (error) {
    console.warn('Failed to get visitor stats:', error);
    return {
      totalUniqueVisits: 0,
      totalPageVisits: 0,
      pcUsers: 0,
      mobileUsers: 0,
      tabletUsers: 0
    };
  }
};

// Clear old analytics data (for maintenance)
export const clearOldAnalytics = () => {
  try {
    const events: AnalyticsEvent[] = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const recentEvents = events.filter(event => 
      new Date(event.timestamp) > oneWeekAgo
    );
    
    localStorage.setItem('analytics_events', JSON.stringify(recentEvents));
  } catch (error) {
    console.warn('Failed to clear old analytics:', error);
  }
};
