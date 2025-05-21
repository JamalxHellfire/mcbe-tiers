
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Users, CalendarDays, UserCheck, BarChart } from 'lucide-react';
import { adminService } from '@/services/adminService';
import VisitorChart from './VisitorChart';
import StatsCard from './StatsCard';
import RegionDistributionCard from './RegionDistributionCard';
import GameModeDistributionCard from './GameModeDistributionCard';

const AnalyticsDashboard: React.FC = () => {
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
  
  const [isLoading, setIsLoading] = useState(true);

  // Fetch analytics data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [visitorData, playerData] = await Promise.all([
          adminService.getVisitorStats(),
          adminService.getPlayerStats()
        ]);
        
        setVisitorStats(visitorData);
        setPlayerStats(playerData);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Refresh data every 5 minutes
    const intervalId = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="space-y-4">
      <Tabs defaultValue="visitors">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="visitors">Visitor Insights</TabsTrigger>
          <TabsTrigger value="players">Player Statistics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="visitors" className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="p-6 flex justify-center items-center">
                <div className="animate-pulse">Loading visitor data...</div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatsCard 
                  title="Today's Visits" 
                  value={visitorStats.today} 
                  icon={<CalendarDays className="h-8 w-8" />} 
                />
                <StatsCard 
                  title="Yesterday's Visits" 
                  value={visitorStats.yesterday} 
                  icon={<CalendarDays className="h-8 w-8" />} 
                />
                <StatsCard 
                  title="This Week" 
                  value={visitorStats.thisWeek} 
                  icon={<BarChart className="h-8 w-8" />} 
                />
                <StatsCard 
                  title="This Month" 
                  value={visitorStats.thisMonth} 
                  icon={<BarChart className="h-8 w-8" />} 
                />
              </div>
              
              <VisitorChart 
                dailyData={visitorStats.dailyData}
                weeklyData={visitorStats.weeklyData}
                monthlyData={visitorStats.monthlyData}
              />
            </>
          )}
        </TabsContent>
        
        <TabsContent value="players" className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="p-6 flex justify-center items-center">
                <div className="animate-pulse">Loading player statistics...</div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatsCard 
                  title="Total Players" 
                  value={playerStats.totalPlayers} 
                  icon={<Users className="h-8 w-8" />} 
                />
                <StatsCard 
                  title="Retired Players" 
                  value={playerStats.retiredPlayers} 
                  icon={<UserCheck className="h-8 w-8" />} 
                />
                <StatsCard 
                  title="Active Regions" 
                  value={Object.keys(playerStats.regionCounts).length} 
                  icon={<BarChart className="h-8 w-8" />} 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <RegionDistributionCard regionCounts={playerStats.regionCounts} />
                <GameModeDistributionCard gamemodeCounts={playerStats.gamemodeCounts} className="col-span-1 md:col-span-2" />
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
