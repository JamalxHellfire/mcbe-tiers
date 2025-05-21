import { supabase } from '@/integrations/supabase/client';
import { GameMode } from '@/services/playerService';

// Type definitions for site_visits table
interface SiteVisit {
  id?: string;
  timestamp: string;
}

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
    // Set hardcoded PIN to 1234 as requested
    return Promise.resolve(pin === '1234');
  },
  
  // Analytics functions
  recordVisit(): Promise<boolean> {
    try {
      // Record a visit in the database - create the table if it doesn't exist first
      const visit: SiteVisit = { timestamp: new Date().toISOString() };
      
      return new Promise((resolve, reject) => {
        // Try to insert into site_visits table
        supabase
          .from('site_visits')
          .insert(visit)
          .then(({ error }) => {
            if (error) {
              console.error('Error recording visit:', error);
              // If table doesn't exist yet, we'll resolve as false but not throw an error
              // In a production environment, you'd need to create the table first
              resolve(false);
            } else {
              resolve(true);
            }
          })
          .catch(err => {
            console.error('Failed to record visit:', err);
            resolve(false);
          });
      });
    } catch (error) {
      console.error('Failed to record visit:', error);
      return Promise.resolve(false);
    }
  },
  
  getVisitorStats(): Promise<any> {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString();
    const lastWeekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    
    return new Promise((resolve) => {
      // Try to fetch site visits
      supabase
        .from('site_visits')
        .select('timestamp')
        .gte('timestamp', monthStart)
        .then(({ data, error }) => {
          if (error) {
            console.error('Error fetching visits:', error);
            // Return empty data if table doesn't exist or other error
            resolve({
              today: 0,
              yesterday: 0,
              thisWeek: 0,
              thisMonth: 0,
              dailyData: [],
              weeklyData: [],
              monthlyData: []
            });
          } else {
            // Process the visit data
            const visits = data || [];
            const dailyData = this.processVisitsDaily(visits);
            const weeklyData = this.processVisitsWeekly(visits);
            const monthlyData = this.processVisitsMonthly(visits);
            
            const todayVisits = visits.filter(v => v.timestamp >= today).length || 0;
            const yesterdayVisits = visits.filter(v => v.timestamp >= yesterday && v.timestamp < today).length || 0;
            const weekVisits = visits.filter(v => v.timestamp >= lastWeekStart).length || 0;
            const monthVisits = visits.length || 0;
            
            resolve({
              today: todayVisits,
              yesterday: yesterdayVisits,
              thisWeek: weekVisits,
              thisMonth: monthVisits,
              dailyData,
              weeklyData,
              monthlyData
            });
          }
        })
        .catch(err => {
          console.error('Failed to get visitor stats:', err);
          resolve({
            today: 0,
            yesterday: 0,
            thisWeek: 0,
            thisMonth: 0,
            dailyData: [],
            weeklyData: [],
            monthlyData: []
          });
        });
    });
  },
  
  processVisitsDaily(visits: any[]): any[] {
    // Group visits by day for the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();
    
    return last7Days.map(day => {
      const count = visits.filter(v => v.timestamp.startsWith(day)).length;
      return {
        date: day,
        visits: count
      };
    });
  },
  
  processVisitsWeekly(visits: any[]): any[] {
    // Group visits by week for the last 4 weeks
    const result = [];
    const now = new Date();
    
    for (let i = 0; i < 4; i++) {
      const weekEnd = new Date(now);
      weekEnd.setDate(now.getDate() - (i * 7));
      
      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekEnd.getDate() - 6);
      
      const weekVisits = visits.filter(v => {
        const visitDate = new Date(v.timestamp);
        return visitDate >= weekStart && visitDate <= weekEnd;
      }).length;
      
      result.unshift({
        week: `Week ${i+1}`,
        visits: weekVisits,
        start: weekStart.toISOString().split('T')[0],
        end: weekEnd.toISOString().split('T')[0]
      });
    }
    
    return result;
  },
  
  processVisitsMonthly(visits: any[]): any[] {
    // Group visits by month for the last 6 months
    const result = [];
    const now = new Date();
    
    for (let i = 0; i < 6; i++) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
      
      const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
      const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      
      const monthVisits = visits.filter(v => {
        const visitDate = new Date(v.timestamp);
        return visitDate >= monthStart && visitDate <= monthEnd;
      }).length;
      
      const monthName = month.toLocaleString('default', { month: 'short' });
      
      result.unshift({
        month: monthName,
        visits: monthVisits,
        key: monthKey
      });
    }
    
    return result;
  },
  
  getPlayerStats(): Promise<any> {
    return Promise.all([
      // Get total player count
      supabase.from('players').select('count').eq('banned', false).single(),
      // Get player count by region
      supabase.from('players').select('region').eq('banned', false),
      // Get gamemode scores count
      supabase.from('gamemode_scores').select('gamemode, internal_tier')
    ]).then(([totalResult, regionResult, gamemodeResult]) => {
      // Process total players
      const totalPlayers = totalResult.data?.count || 0;
      
      // Process regions
      const regionCounts: Record<string, number> = {};
      if (regionResult.data) {
        regionResult.data.forEach(player => {
          const region = player.region || 'Unknown';
          regionCounts[region] = (regionCounts[region] || 0) + 1;
        });
      }
      
      // Process gamemodes
      const gamemodeCounts: Record<string, number> = {};
      if (gamemodeResult.data) {
        gamemodeResult.data.forEach(score => {
          const gamemode = score.gamemode;
          gamemodeCounts[gamemode] = (gamemodeCounts[gamemode] || 0) + 1;
        });
      }
      
      // Count retired players
      const retiredCount = gamemodeResult.data?.filter(score => score.internal_tier === 'Retired').length || 0;
      
      return {
        totalPlayers,
        retiredPlayers: retiredCount,
        regionCounts,
        gamemodeCounts
      };
    }).catch(error => {
      console.error('Error fetching player stats:', error);
      return {
        totalPlayers: 0,
        retiredPlayers: 0,
        regionCounts: {},
        gamemodeCounts: {}
      };
    });
  }
};

// Check for expiration on import
adminService.checkExpiration();
