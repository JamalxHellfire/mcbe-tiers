
import { supabase } from '@/integrations/supabase/client';
import { SiteVisit } from '@/types/visits';
import { format, subDays, isToday, isYesterday, startOfDay, startOfWeek, startOfMonth } from 'date-fns';

// Admin authentication
export const adminService = {
  // Verify PIN for admin access
  async verifyPin(pin: string) {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .single();
      
      if (error) {
        console.error('Error checking admin pin:', error);
        return { success: false };
      }
      
      // Simple check - in production, this should be hashed
      return { success: pin === '1234' };
    } catch (err) {
      console.error('Unexpected error during pin verification:', err);
      return { success: false };
    }
  },
  
  // Record a visit to the website
  async recordVisit(): Promise<void> {
    try {
      // Create a visit record with current timestamp
      const visit: SiteVisit = {
        timestamp: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from('site_visits')
        .insert(visit);
      
      if (error) {
        console.error('Error recording visit:', error);
      }
    } catch (err) {
      console.error('Failed to record visit:', err);
    }
  },
  
  // Get today's visits
  async getTodayVisits(): Promise<number> {
    try {
      const today = new Date();
      const startOfToday = startOfDay(today).toISOString();
      
      const { data, error, count } = await supabase
        .from('site_visits')
        .select('*', { count: 'exact' })
        .gte('timestamp', startOfToday);
      
      if (error) {
        console.error('Error fetching today visits:', error);
        return 0;
      }
      
      return count || 0;
    } catch (err) {
      console.error('Failed to get today visits:', err);
      return 0;
    }
  },
  
  // Get visits for different time periods
  async getVisitsByPeriod(period: 'daily' | 'weekly' | 'monthly'): Promise<any[]> {
    try {
      let visits: any[] = [];
      const now = new Date();
      let startDate: Date;
      
      if (period === 'daily') {
        startDate = subDays(now, 7); // Last 7 days
      } else if (period === 'weekly') {
        startDate = subDays(now, 28); // Last 4 weeks
      } else {
        startDate = subDays(now, 180); // Last 6 months
      }
      
      const { data, error } = await supabase
        .from('site_visits')
        .select('*')
        .gte('timestamp', startDate.toISOString())
        .order('timestamp', { ascending: true });
      
      if (error) {
        console.error(`Error fetching ${period} visits:`, error);
        return [];
      }
      
      if (!data) return [];
      
      // Process data into appropriate format based on period
      if (period === 'daily') {
        // Group by day
        const visitsByDay = data.reduce((acc: any, visit: any) => {
          const date = format(new Date(visit.timestamp), 'yyyy-MM-dd');
          if (!acc[date]) acc[date] = 0;
          acc[date]++;
          return acc;
        }, {});
        
        // Convert to array format for charts
        visits = Object.entries(visitsByDay).map(([date, count]) => ({
          date: format(new Date(date), 'MMM dd'),
          visits: count,
        }));
      } else if (period === 'weekly') {
        // Group by week
        const visitsByWeek = data.reduce((acc: any, visit: any) => {
          const date = format(startOfWeek(new Date(visit.timestamp)), 'yyyy-MM-dd');
          if (!acc[date]) acc[date] = 0;
          acc[date]++;
          return acc;
        }, {});
        
        // Convert to array format for charts
        visits = Object.entries(visitsByWeek).map(([date, count]) => ({
          date: `Week of ${format(new Date(date), 'MMM dd')}`,
          visits: count,
        }));
      } else {
        // Group by month
        const visitsByMonth = data.reduce((acc: any, visit: any) => {
          const date = format(startOfMonth(new Date(visit.timestamp)), 'yyyy-MM');
          if (!acc[date]) acc[date] = 0;
          acc[date]++;
          return acc;
        }, {});
        
        // Convert to array format for charts
        visits = Object.entries(visitsByMonth).map(([date, count]) => ({
          date: format(new Date(date), 'MMM yyyy'),
          visits: count,
        }));
      }
      
      return visits;
    } catch (err) {
      console.error(`Failed to get ${period} visits:`, err);
      return [];
    }
  },
  
  // Get statistics about players
  async getPlayerStatistics() {
    try {
      // Get total players
      const { count: totalPlayers } = await supabase
        .from('players')
        .select('*', { count: 'exact' });
      
      // Get retired players
      const { count: retiredPlayers } = await supabase
        .from('players')
        .select('*', { count: 'exact' })
        .eq('tier_number', 'Retired');
      
      // Get players by region
      const { data: regionData } = await supabase
        .from('players')
        .select('region')
        .not('region', 'is', null);
      
      const regionCounts: Record<string, number> = {};
      if (regionData) {
        regionData.forEach((player: any) => {
          const region = player.region || 'Unknown';
          regionCounts[region] = (regionCounts[region] || 0) + 1;
        });
      }
      
      // Get players by gamemode
      const { data: gamemodeData } = await supabase
        .from('gamemode_scores')
        .select('gamemode');
      
      const gamemodeCounts: Record<string, number> = {};
      if (gamemodeData) {
        gamemodeData.forEach((score: any) => {
          const gamemode = score.gamemode || 'Unknown';
          gamemodeCounts[gamemode] = (gamemodeCounts[gamemode] || 0) + 1;
        });
      }
      
      return {
        totalPlayers: totalPlayers || 0,
        retiredPlayers: retiredPlayers || 0,
        regionDistribution: regionCounts,
        gamemodeDistribution: gamemodeCounts
      };
    } catch (err) {
      console.error('Failed to get player statistics:', err);
      return {
        totalPlayers: 0,
        retiredPlayers: 0,
        regionDistribution: {},
        gamemodeDistribution: {}
      };
    }
  }
};
