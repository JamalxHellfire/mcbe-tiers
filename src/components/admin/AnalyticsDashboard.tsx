
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, MessageSquare, Activity, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export function AnalyticsDashboard() {
  // Fetch system logs
  const { data: systemLogs = [], isLoading: logsLoading } = useQuery({
    queryKey: ['systemLogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch visitor analytics
  const { data: visitorData, isLoading: visitorsLoading } = useQuery({
    queryKey: ['visitorAnalytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_logs')
        .select('*')
        .eq('log_type', 'page_visit')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Calculate visitor stats
  const totalVisits = visitorData?.length || 0;
  const uniquePages = new Set(visitorData?.map(log => log.log_data?.path) || []).size;
  const recentVisits = visitorData?.filter(log => {
    const logTime = new Date(log.created_at);
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return logTime > oneHourAgo;
  }).length || 0;

  // Group visits by page
  const pageVisits = {};
  visitorData?.forEach(log => {
    const path = log.log_data?.path || 'Unknown';
    pageVisits[path] = (pageVisits[path] || 0) + 1;
  });

  // Get chat logs
  const chatLogs = systemLogs.filter(log => 
    log.log_type === 'chat_message' || 
    log.log_type === 'chat_error' ||
    log.log_type === 'knowledge_base'
  );

  // Get error logs
  const errorLogs = systemLogs.filter(log => 
    log.log_type === 'error' || 
    log.log_type === 'chat_error'
  );

  if (logsLoading || visitorsLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/10 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-white/10 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-dark-surface border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Total Visits</CardTitle>
            <Eye className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalVisits}</div>
            <p className="text-xs text-white/60">Page visits tracked</p>
          </CardContent>
        </Card>

        <Card className="bg-dark-surface border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Recent Visits</CardTitle>
            <Activity className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{recentVisits}</div>
            <p className="text-xs text-white/60">In the last hour</p>
          </CardContent>
        </Card>

        <Card className="bg-dark-surface border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Unique Pages</CardTitle>
            <Users className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{uniquePages}</div>
            <p className="text-xs text-white/60">Different pages visited</p>
          </CardContent>
        </Card>

        <Card className="bg-dark-surface border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Chat Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{chatLogs.length}</div>
            <p className="text-xs text-white/60">Total chat interactions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Page Visits */}
        <Card className="bg-dark-surface border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Page Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {Object.entries(pageVisits)
                  .sort(([,a], [,b]) => b - a)
                  .map(([path, count]) => (
                    <div key={path} className="flex justify-between items-center p-2 rounded bg-white/5">
                      <span className="text-white/80 text-sm">{path}</span>
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                        {count}
                      </Badge>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-dark-surface border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {systemLogs.slice(0, 20).map((log) => (
                  <div key={log.id} className="p-2 rounded bg-white/5">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            log.log_type === 'error' ? 'border-red-500 text-red-400' :
                            log.log_type === 'chat_message' ? 'border-blue-500 text-blue-400' :
                            log.log_type === 'page_visit' ? 'border-green-500 text-green-400' :
                            'border-white/30 text-white/70'
                          }`}
                        >
                          {log.log_type}
                        </Badge>
                        <p className="text-white/80 text-sm mt-1">{log.message}</p>
                        {log.log_data && (
                          <p className="text-white/60 text-xs mt-1">
                            {typeof log.log_data === 'string' ? log.log_data : JSON.stringify(log.log_data).slice(0, 100)}
                          </p>
                        )}
                      </div>
                      <span className="text-white/60 text-xs">
                        {new Date(log.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
