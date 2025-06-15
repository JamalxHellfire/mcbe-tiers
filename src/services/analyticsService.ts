
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsEvent {
  event_type: 'page_visit' | 'unique_visit' | 'login' | 'action';
  page_path: string;
  device_type: 'mobile' | 'desktop' | 'tablet';
  user_agent: string;
  ip_address?: string;
  timestamp: string;
  country?: string;
  country_code?: string;
}

interface VisitorStats {
  totalUniqueVisits: number;
  totalPageVisits: number;
  pcUsers: number;
  mobileUsers: number;
  tabletUsers: number;
}

interface DailyStats {
  date: string;
  visits: number;
  unique_visitors: number;
  page_views: number;
}

interface CountryStats {
  country: string;
  countryCode: string;
  visits: number;
  percentage: number;
  flag: string;
}

// Simple device detection
const getDeviceType = (): 'mobile' | 'desktop' | 'tablet' => {
  const userAgent = navigator.userAgent.toLowerCase();
  const width = window.innerWidth;
  
  if (width < 768) return 'mobile';
  if (width < 1024 && (userAgent.includes('tablet') || userAgent.includes('ipad'))) return 'tablet';
  return 'desktop';
};

// Get country from IP (simplified - in real app you'd use a geolocation service)
const getCountryFromIP = (): { country: string; countryCode: string; flag: string } => {
  // This is a simplified implementation - in production you'd use a real IP geolocation service
  const countries = [
    { country: 'United States', countryCode: 'US', flag: '🇺🇸' },
    { country: 'United Kingdom', countryCode: 'GB', flag: '🇬🇧' },
    { country: 'Canada', countryCode: 'CA', flag: '🇨🇦' },
    { country: 'Australia', countryCode: 'AU', flag: '🇦🇺' },
    { country: 'Germany', countryCode: 'DE', flag: '🇩🇪' },
    { country: 'France', countryCode: 'FR', flag: '🇫🇷' },
    { country: 'Netherlands', countryCode: 'NL', flag: '🇳🇱' },
    { country: 'Sweden', countryCode: 'SE', flag: '🇸🇪' }
  ];
  
  return countries[Math.floor(Math.random() * countries.length)];
};

// Track page visit
export const trackPageVisit = async (pagePath: string) => {
  try {
    const deviceType = getDeviceType();
    const userAgent = navigator.userAgent;
    const locationData = getCountryFromIP();
    
    // Create analytics event
    const event: AnalyticsEvent = {
      event_type: 'page_visit',
      page_path: pagePath,
      device_type: deviceType,
      user_agent: userAgent,
      timestamp: new Date().toISOString(),
      country: locationData.country,
      country_code: locationData.countryCode
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

// Get daily analytics data
export const getDailyAnalytics = (days: number = 30): DailyStats[] => {
  try {
    const events: AnalyticsEvent[] = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    const dailyData: { [key: string]: DailyStats } = {};
    
    // Initialize last N days
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dailyData[dateStr] = {
        date: dateStr,
        visits: 0,
        unique_visitors: 0,
        page_views: 0
      };
    }
    
    // Process events
    events.forEach(event => {
      const eventDate = event.timestamp.split('T')[0];
      if (dailyData[eventDate]) {
        if (event.event_type === 'page_visit') {
          dailyData[eventDate].visits++;
          dailyData[eventDate].page_views++;
        } else if (event.event_type === 'unique_visit') {
          dailyData[eventDate].unique_visitors++;
        }
      }
    });
    
    return Object.values(dailyData).sort((a, b) => a.date.localeCompare(b.date));
  } catch (error) {
    console.warn('Failed to get daily analytics:', error);
    return [];
  }
};

// Get country analytics data
export const getCountryAnalytics = (): CountryStats[] => {
  try {
    const events: AnalyticsEvent[] = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    const countryData: { [key: string]: { visits: number; country: string; flag: string } } = {};
    
    // Process events to count by country
    events.forEach(event => {
      if (event.country_code && event.country) {
        if (!countryData[event.country_code]) {
          countryData[event.country_code] = {
            visits: 0,
            country: event.country,
            flag: getFlagForCountryCode(event.country_code)
          };
        }
        countryData[event.country_code].visits++;
      }
    });
    
    const totalVisits = Object.values(countryData).reduce((sum, country) => sum + country.visits, 0);
    
    // Convert to array and calculate percentages
    return Object.entries(countryData)
      .map(([countryCode, data]) => ({
        country: data.country,
        countryCode,
        visits: data.visits,
        percentage: totalVisits > 0 ? (data.visits / totalVisits) * 100 : 0,
        flag: data.flag
      }))
      .sort((a, b) => b.visits - a.visits);
  } catch (error) {
    console.warn('Failed to get country analytics:', error);
    return [];
  }
};

// Helper function to get flag emoji for country code
const getFlagForCountryCode = (countryCode: string): string => {
  const flags: { [key: string]: string } = {
    'US': '🇺🇸',
    'GB': '🇬🇧',
    'CA': '🇨🇦',
    'AU': '🇦🇺',
    'DE': '🇩🇪',
    'FR': '🇫🇷',
    'NL': '🇳🇱',
    'SE': '🇸🇪'
  };
  return flags[countryCode] || '🌍';
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

// Track admin actions
export const trackAdminAction = (action: string, details?: any) => {
  try {
    const deviceType = getDeviceType();
    const userAgent = navigator.userAgent;
    const locationData = getCountryFromIP();
    
    const event: AnalyticsEvent = {
      event_type: 'action',
      page_path: '/admin',
      device_type: deviceType,
      user_agent: userAgent,
      timestamp: new Date().toISOString(),
      country: locationData.country,
      country_code: locationData.countryCode
    };
    
    const existingEvents = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    existingEvents.push(event);
    localStorage.setItem('analytics_events', JSON.stringify(existingEvents));
  } catch (error) {
    console.warn('Failed to track admin action:', error);
  }
};
