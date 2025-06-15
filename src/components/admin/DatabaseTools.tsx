
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Database, RefreshCw, Trash2, Download, Upload, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const DatabaseTools = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [backupData, setBackupData] = useState('');
  const [sqlQuery, setSqlQuery] = useState('');
  const { toast } = useToast();

  const handleRefreshCache = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.rpc('refresh_leaderboard_cache');
      if (error) throw error;
      
      toast({
        title: "Cache Refreshed",
        description: "Leaderboard cache has been refreshed successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to refresh cache: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecalculateRankings = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.rpc('recalculate_rankings');
      if (error) throw error;
      
      toast({
        title: "Rankings Recalculated",
        description: "All player rankings have been recalculated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to recalculate rankings: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    setIsLoading(true);
    try {
      const { data: players, error: playersError } = await supabase
        .from('players')
        .select('*');
      
      const { data: scores, error: scoresError } = await supabase
        .from('gamemode_scores')
        .select('*');
      
      if (playersError || scoresError) {
        throw new Error('Failed to export data');
      }
      
      const exportData = {
        players: players || [],
        gamemode_scores: scores || [],
        exported_at: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mcbe-tiers-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Data Exported",
        description: "Database backup has been downloaded successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Export Failed",
        description: `Failed to export data: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearOldLogs = async () => {
    setIsLoading(true);
    try {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      
      const { error } = await supabase
        .from('system_logs')
        .delete()
        .lt('created_at', oneWeekAgo);
      
      if (error) throw error;
      
      toast({
        title: "Logs Cleared",
        description: "Old system logs have been cleared successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to clear logs: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center space-x-2">
        <Database className="h-5 w-5 text-purple-400" />
        <h3 className="text-lg md:text-xl font-bold text-white">Database Management Tools</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {/* Cache Management */}
        <Card className="admin-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm md:text-base text-white flex items-center">
              <RefreshCw className="h-4 w-4 mr-2" />
              Cache Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={handleRefreshCache}
              disabled={isLoading}
              className="w-full admin-button bg-blue-600/20 border border-blue-500/50 text-blue-400 hover:bg-blue-600/30"
              size="sm"
            >
              Refresh Cache
            </Button>
            
            <Button
              onClick={handleRecalculateRankings}
              disabled={isLoading}
              className="w-full admin-button bg-green-600/20 border border-green-500/50 text-green-400 hover:bg-green-600/30"
              size="sm"
            >
              Recalculate Rankings
            </Button>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="admin-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm md:text-base text-white flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Data Backup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={handleExportData}
              disabled={isLoading}
              className="w-full admin-button bg-purple-600/20 border border-purple-500/50 text-purple-400 hover:bg-purple-600/30"
              size="sm"
            >
              <Download className="h-3 w-3 mr-1" />
              Export Data
            </Button>
          </CardContent>
        </Card>

        {/* System Maintenance */}
        <Card className="admin-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm md:text-base text-white flex items-center">
              <Trash2 className="h-4 w-4 mr-2" />
              Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={handleClearOldLogs}
              disabled={isLoading}
              className="w-full admin-button bg-red-600/20 border border-red-500/50 text-red-400 hover:bg-red-600/30"
              size="sm"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear Old Logs
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* SQL Query Tool */}
      <Card className="admin-card">
        <CardHeader>
          <CardTitle className="text-sm md:text-base text-white flex items-center">
            <Database className="h-4 w-4 mr-2" />
            SQL Query Tool
            <AlertTriangle className="h-3 w-3 ml-2 text-yellow-500" />
          </CardTitle>
          <p className="text-xs text-gray-400 mt-1">
            Use with caution - Direct database access
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="Enter SQL query... (SELECT statements only for safety)"
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            className="admin-input h-20 md:h-24"
            rows={3}
          />
          <Button
            disabled={isLoading || !sqlQuery.trim().toLowerCase().startsWith('select')}
            className="admin-button bg-gray-600/20 border border-gray-500/50 text-gray-400 hover:bg-gray-600/30"
            size="sm"
          >
            Execute Query
          </Button>
          {sqlQuery && !sqlQuery.trim().toLowerCase().startsWith('select') && (
            <p className="text-xs text-red-400">
              Only SELECT queries are allowed for safety
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseTools;
