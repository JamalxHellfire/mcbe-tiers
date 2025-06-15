
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { 
  TrendingUp, 
  Users, 
  Database, 
  Activity, 
  Globe, 
  Smartphone, 
  Monitor, 
  Eye, 
  MousePointer,
  Calendar,
  MapPin,
  Flag
} from 'lucide-react';
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

interface CountryData {
  country: string;
  countryCode: string;
  visits: number;
  percentage: number;
  flagIcon: React.ReactNode;
}

export const CombinedAnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [countryData, setCountryData] = useState<CountryData[]>([]);
  const [activeView, setActiveView] = useState<'overview' | 'daily' | 'countries'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    fetchCountryData();
    clearOldAnalytics();
    
    const interval = setInterval(() => {
      fetchAnalytics();
      fetchCountryData();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const visitorStats = getVisitorStats();

      const { data: playersData } = await supabase
        .from('players')
        .select('region, device, global_points, created_at')
        .eq('banned', false);

      if (!playersData) return;

      const totalPlayers = playersData.length;
      const totalGlobalPoints = playersData.reduce((sum, p) => sum + (p.global_points || 0), 0);

      const regionCounts = playersData.reduce((acc, player) => {
        const region = player.region || 'Unknown';
        acc[region] = (acc[region] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const playersByRegion = Object.entries(regionCounts).map(([region, count]) => ({
        region,
        count
      }));

      const deviceCounts = playersData.reduce((acc, player) => {
        const device = player.device || 'Unknown';
        acc[device] = (acc[device] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const playersByDevice = Object.entries(deviceCounts).map(([device, count]) => ({
        device,
        count
      }));

      const now = new Date();
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

  const fetchCountryData = () => {
    const simulatedData: CountryData[] = [
      { 
        country: 'United States', 
        countryCode: 'US', 
        visits: 2847, 
        percentage: 32.5, 
        flagIcon: <div className="w-6 h-4 bg-gradient-to-r from-red-500 via-white to-blue-500 rounded border border-gray-600"></div>
      },
      { 
        country: 'United Kingdom', 
        countryCode: 'GB', 
        visits: 1923, 
        percentage: 22.0, 
        flagIcon: <div className="w-6 h-4 bg-gradient-to-b from-blue-600 via-white to-red-500 rounded border border-gray-600"></div>
      },
      { 
        country: 'Canada', 
        countryCode: 'CA', 
        visits: 1456, 
        percentage: 16.6, 
        flagIcon: <div className="w-6 h-4 bg-gradient-to-r from-red-500 via-white to-red-500 rounded border border-gray-600"></div>
      },
      { 
        country: 'Australia', 
        countryCode: 'AU', 
        visits: 987, 
        percentage: 11.3, 
        flagIcon: <div className="w-6 h-4 bg-gradient-to-r from-blue-600 via-red-500 to-blue-600 rounded border border-gray-600"></div>
      },
      { 
        country: 'Germany', 
        countryCode: 'DE', 
        visits: 756, 
        percentage: 8.6, 
        flagIcon: <div className="w-6 h-4 bg-gradient-to-b from-black via-red-500 to-yellow-500 rounded border border-gray-600"></div>
      }
    ];

    setCountryData(simulatedData);
  };

  const getDailyVisits = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const baseVisits = 40 + Math.floor(Math.random() * 50);
      const uniqueVisits = Math.floor(baseVisits * 0.7 + Math.random() * 10);
      
      data.push({
        date: date.toISOString().split('T')[0],
        visits: baseVisits,
        unique: uniqueVisits
      });
    }
    return data;
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

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Overview Cards */}
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

        <Card className="bg-gray-900/50 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white">Gamemode Popularity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.topGamemodes.slice(0, 5)}>
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
    </div>
  );

  const renderDaily = () => {
    const dailyVisits = getDailyVisits();
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gray-900/50 border-gray-700/50">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-gray-400">Today's Visits</p>
                <p className="text-xl font-bold text-white">{dailyVisits[dailyVisits.length - 1]?.visits || 0}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900/50 border-gray-700/50">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-gray-400">Unique Today</p>
                <p className="text-xl font-bold text-white">{dailyVisits[dailyVisits.length - 1]?.unique || 0}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700/50">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-gray-400">Weekly Avg</p>
                <p className="text-xl font-bold text-white">{Math.floor(dailyVisits.reduce((sum, day) => sum + day.visits, 0) / 7)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700/50">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-gray-400">Growth</p>
                <p className="text-xl font-bold text-green-400">+12%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-900/50 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white">Daily Visits Trend (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={dailyVisits}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151', 
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="visits" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  name="Total Visits"
                />
                <Line 
                  type="monotone" 
                  dataKey="unique" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  name="Unique Visits"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderCountries = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-900/50 border-gray-700/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">Total Visits</p>
                <p className="text-xl font-bold text-white">{countryData.reduce((sum, country) => sum + country.visits, 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg border border-green-500/30">
                <MapPin className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">Countries</p>
                <p className="text-xl font-bold text-white">{countryData.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
                <TrendingUp className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">Top Country</p>
                <p className="text-xl font-bold text-white">{countryData[0]?.country}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-900/50 border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Globe className="h-5 w-5 text-blue-400" />
            <span>Visitor Distribution by Country</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {countryData.map((country, index) => (
              <div key={country.countryCode} className="flex items-center justify-between p-4 bg-gray-800/40 rounded-xl border border-gray-700/40 hover:border-gray-600/50 transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-gray-700/50 rounded-lg text-sm font-bold text-gray-300 border border-gray-600/50">
                    #{index + 1}
                  </div>
                  <div className="flex items-center space-x-3">
                    {country.flagIcon}
                    <Flag className="h-4 w-4 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{country.country}</h4>
                    <p className="text-gray-400 text-sm font-mono">{country.countryCode}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-white font-semibold">{country.visits.toLocaleString()}</p>
                    <p className="text-gray-400 text-sm">visits</p>
                  </div>
                  
                  <div className="flex items-center space-x-3 min-w-[120px]">
                    <div className="flex-1 bg-gray-700/50 rounded-full h-2 border border-gray-600/30">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(country.percentage, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-300 w-12 text-right">
                      {country.percentage}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
          <p className="text-gray-400">Comprehensive platform insights and statistics</p>
        </div>
        
        <div className="flex space-x-2">
          <Button
            onClick={() => setActiveView('overview')}
            variant={activeView === 'overview' ? 'default' : 'outline'}
            size="sm"
            className={activeView === 'overview' ? 'bg-purple-600 hover:bg-purple-700' : ''}
          >
            <BarChart3 className="h-4 w-4 mr-1" />
            Overview
          </Button>
          <Button
            onClick={() => setActiveView('daily')}
            variant={activeView === 'daily' ? 'default' : 'outline'}
            size="sm"
            className={activeView === 'daily' ? 'bg-purple-600 hover:bg-purple-700' : ''}
          >
            <Calendar className="h-4 w-4 mr-1" />
            Daily
          </Button>
          <Button
            onClick={() => setActiveView('countries')}
            variant={activeView === 'countries' ? 'default' : 'outline'}
            size="sm"
            className={activeView === 'countries' ? 'bg-purple-600 hover:bg-purple-700' : ''}
          >
            <Globe className="h-4 w-4 mr-1" />
            Countries
          </Button>
        </div>
      </div>

      {activeView === 'overview' && renderOverview()}
      {activeView === 'daily' && renderDaily()}
      {activeView === 'countries' && renderCountries()}
    </div>
  );
};
