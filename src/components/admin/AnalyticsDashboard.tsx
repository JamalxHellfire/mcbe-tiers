
import React, { useState, useEffect } from 'react';
import StatsCard from './StatsCard';
import VisitorChart from './VisitorChart';
import RegionDistributionCard from './RegionDistributionCard';
import GameModeDistributionCard from './GameModeDistributionCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { adminService } from '@/services/adminService';
import { Users, Calendar, TrendingUp, Flag, Gamepad2 } from 'lucide-react';

const AnalyticsDashboard = () => {
  const [visitorStats, setVisitorStats] = useState<any>({
    today: 0,
    yesterday: 0,
    thisWeek: 0,
    thisMonth: 0,
    dailyData: [],
    weeklyData: [],
    monthlyData: []
  });
  
  const [playerStats, setPlayerStats] = useState<any>({
    totalPlayers: 0,
    retiredPlayers: 0,
    regionCounts: {},
    gamemodeCounts: {}
  });
  
  const [chartPeriod, setChartPeriod] = useState('daily');
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch visitor statistics
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // Fetch visitor stats
        const visitorData = await adminService.getVisitorStats();
        setVisitorStats(visitorData);
        
        // Fetch player stats
        const playerData = await adminService.getPlayerStats();
        setPlayerStats(playerData);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
    
    // Set up a refresh interval (every 5 minutes)
    const refreshInterval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(refreshInterval);
  }, []);
  
  // Determine which data to show based on selected period
  const getChartData = () => {
    switch (chartPeriod) {
      case 'daily':
        return visitorStats.dailyData;
      case 'weekly':
        return visitorStats.weeklyData;
      case 'monthly':
        return visitorStats.monthlyData;
      default:
        return visitorStats.dailyData;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Today's Visits" 
          value={visitorStats.today} 
          icon={<Calendar className="h-5 w-5" />} 
        />
        <StatsCard 
          title="This Week's Visits" 
          value={visitorStats.thisWeek} 
          icon={<TrendingUp className="h-5 w-5" />} 
        />
        <StatsCard 
          title="Total Players" 
          value={playerStats.totalPlayers} 
          icon={<Users className="h-5 w-5" />}
        />
        <StatsCard 
          title="Retired Players" 
          value={playerStats.retiredPlayers} 
          icon={<Flag className="h-5 w-5" />}
        />
      </div>
      
      <Tabs defaultValue="daily" value={chartPeriod} onValueChange={setChartPeriod}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Visitor Trends</h3>
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="daily" className="m-0">
          <VisitorChart data={getChartData()} period="daily" />
        </TabsContent>
        <TabsContent value="weekly" className="m-0">
          <VisitorChart data={getChartData()} period="weekly" />
        </TabsContent>
        <TabsContent value="monthly" className="m-0">
          <VisitorChart data={getChartData()} period="monthly" />
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RegionDistributionCard regionCounts={playerStats.regionCounts} />
        <GameModeDistributionCard gamemodeCounts={playerStats.gamemodeCounts} />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
