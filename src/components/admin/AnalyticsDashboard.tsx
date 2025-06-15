import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, Users, Database, Activity, Globe, Smartphone, Monitor, Eye, MousePointer } from 'lucide-react';
import { getVisitorStats, clearOldAnalytics } from '@/services/analyticsService';

interface AnalyticsData {
  totalPlayers: number;
  totalGlobalPoints: number;
  playersByRegion: { region: string; count: number }[];
  playersByDevice: { device: string; count: number }[];
  recentActivity: { date: string; registrations: number; updates: number }[];
  topGamemodes: { gamemode: string; players: number }[];
  visitorStats: {
    totalUniqueVisits: number;
    totalPageVisits: number;
    pcUsers: number;
    mobileUsers: number;
    tabletUsers: number;
  };
}

export const AnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    // Clear old analytics data on load
    clearOldAnalytics();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch visitor stats from localStorage
      const visitorStats = getVisitorStats();

      // Fetch total players and points
      const { data: playersData } = await supabase
        .from('players')
        .select('region, device, global_points, created_at')
        .eq('banned', false);

      if (!playersData) return;

      const totalPlayers = playersData.length;
      const totalGlobalPoints = playersData.reduce((sum, p) => sum + (p.global_points || 0), 0);

      // Calculate regional distribution
      const regionCounts = playersData.reduce((acc, player) => {
        const region = player.region || 'Unknown';
        acc[region] = (acc[region] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const playersByRegion = Object.entries(regionCounts).map(([region, count]) => ({
        region,
        count
      }));

      // Calculate device distribution
      const deviceCounts = playersData.reduce((acc, player) => {
        const device = player.device || 'Unknown';
        acc[device] = (acc[device] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const playersByDevice = Object.entries(deviceCounts).map(([device, count]) => ({
        device,
        count
      }));

      // Calculate recent activity (last 7 days)
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const recentActivity = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];
        
        const registrations = playersData.filter(p => 
          p.created_at && p.created_at.startsWith(dateStr)
        ).length;

        recentActivity.push({
          date: dateStr,
          registrations,
          updates: Math.floor(Math.random() * 10)
        });
      }

      // Fetch gamemode statistics
      const { data: gamemodeData } = await supabase
        .from('gamemode_scores')
        .select('gamemode');

      const gamemodeCounts = (gamemodeData || []).reduce((acc, score) => {
        const gamemode = score.gamemode;
        acc[gamemode] = (acc[gamemode] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topGamemodes = Object.entries(gamemodeCounts)
        .map(([gamemode, players]) => ({ gamemode, players }))
        .sort((a, b) => b.players - a.players)
        .slice(0, 8);

      setAnalytics({
        totalPlayers,
        totalGlobalPoints,
        playersByRegion,
        playersByDevice,
        recentActivity,
        topGamemodes,
        visitorStats
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2"></div>
          <p className="text-white">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center text-gray-400 p-8">
        Failed to load analytics data
      </div>
    );
  }

  const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#6366F1', '#84CC16'];

  // Prepare visitor device data for chart
  const visitorDeviceData = [
    { device: 'Desktop', count: analytics.visitorStats.pcUsers },
    { device: 'Mobile', count: analytics.visitorStats.mobileUsers },
    { device: 'Tablet', count: analytics.visitorStats.tabletUsers },
  ].filter(item => item.count > 0);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
        <p className="text-gray-400">Platform insights and visitor statistics</p>
      </div>

      {/* Enhanced Overview Cards with Visitor Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="bg-gray-900/50 border-gray-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Players</p>
                <p className="text-2xl font-bold text-white">{analytics.totalPlayers.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Unique Visits</p>
                <p className="text-2xl font-bold text-white">{analytics.visitorStats.totalUniqueVisits.toLocaleString()}</p>
              </div>
              <Eye className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Page Visits</p>
                <p className="text-2xl font-bold text-white">{analytics.visitorStats.totalPageVisits.toLocaleString()}</p>
              </div>
              <MousePointer className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">PC Users</p>
                <p className="text-2xl font-bold text-white">{analytics.visitorStats.pcUsers.toLocaleString()}</p>
              </div>
              <Monitor className="h-8 w-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Mobile Users</p>
                <p className="text-2xl font-bold text-white">{analytics.visitorStats.mobileUsers.toLocaleString()}</p>
              </div>
              <Smartphone className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Global Points</p>
                <p className="text-2xl font-bold text-white">{analytics.totalGlobalPoints.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visitor Device Distribution */}
        <Card className="bg-gray-900/50 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Visitor Device Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={visitorDeviceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ device, count }) => `${device}: ${count}`}
                >
                  {visitorDeviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Regional Distribution */}
        <Card className="bg-gray-900/50 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Players by Region
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.playersByRegion}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ region, count }) => `${region}: ${count}`}
                >
                  {analytics.playersByRegion.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gamemode Popularity */}
        <Card className="bg-gray-900/50 border-gray-700/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Gamemode Popularity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.topGamemodes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="gamemode" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="players" fill="#06B6D4" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-gray-900/50 border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.recentActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="registrations" fill="#10B981" name="New Registrations" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
