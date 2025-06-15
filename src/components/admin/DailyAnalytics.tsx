
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Calendar, TrendingUp, Users, Globe } from 'lucide-react';
import { getVisitorStats } from '@/services/analyticsService';

const DailyAnalytics = () => {
  const stats = getVisitorStats();
  
  // Mock data for daily visits - in a real app, this would come from your analytics service
  const dailyVisits = [
    { date: '2025-06-09', visits: 45, unique: 32 },
    { date: '2025-06-10', visits: 52, unique: 38 },
    { date: '2025-06-11', visits: 61, unique: 45 },
    { date: '2025-06-12', visits: 38, unique: 28 },
    { date: '2025-06-13', visits: 67, unique: 51 },
    { date: '2025-06-14', visits: 73, unique: 58 },
    { date: '2025-06-15', visits: 89, unique: 67 },
  ];

  const deviceData = [
    { name: 'Mobile', value: stats.mobileUsers, color: '#8884d8' },
    { name: 'Desktop', value: stats.pcUsers, color: '#82ca9d' },
    { name: 'Tablet', value: stats.tabletUsers, color: '#ffc658' },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center space-x-2">
        <Calendar className="h-5 w-5 text-purple-400" />
        <h3 className="text-lg md:text-xl font-bold text-white">Daily Analytics Dashboard</h3>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="admin-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs md:text-sm text-gray-400 flex items-center">
              <Users className="h-3 w-3 md:h-4 md:w-4 mr-1" />
              Total Visits
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-lg md:text-2xl font-bold text-white">{stats.totalPageVisits}</div>
          </CardContent>
        </Card>

        <Card className="admin-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs md:text-sm text-gray-400 flex items-center">
              <TrendingUp className="h-3 w-3 md:h-4 md:w-4 mr-1" />
              Unique Visitors
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-lg md:text-2xl font-bold text-white">{stats.totalUniqueVisits}</div>
          </CardContent>
        </Card>

        <Card className="admin-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs md:text-sm text-gray-400 flex items-center">
              <Globe className="h-3 w-3 md:h-4 md:w-4 mr-1" />
              Mobile Users
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-lg md:text-2xl font-bold text-white">{stats.mobileUsers}</div>
          </CardContent>
        </Card>

        <Card className="admin-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs md:text-sm text-gray-400 flex items-center">
              <Globe className="h-3 w-3 md:h-4 md:w-4 mr-1" />
              Desktop Users
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-lg md:text-2xl font-bold text-white">{stats.pcUsers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Daily Visits Chart */}
        <Card className="admin-card">
          <CardHeader>
            <CardTitle className="text-sm md:text-base text-white">Daily Visits Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 md:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyVisits}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9CA3AF"
                    fontSize={10}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis stroke="#9CA3AF" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                    labelStyle={{ color: '#F3F4F6' }}
                  />
                  <Line type="monotone" dataKey="visits" stroke="#8B5CF6" strokeWidth={2} />
                  <Line type="monotone" dataKey="unique" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Device Distribution */}
        <Card className="admin-card">
          <CardHeader>
            <CardTitle className="text-sm md:text-base text-white">Device Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 md:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DailyAnalytics;
