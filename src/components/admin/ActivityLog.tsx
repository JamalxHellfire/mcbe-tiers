
import React, { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

const ActivityLog: React.FC = () => {
  const [activityLogs, setActivityLogs] = useState<Array<{timestamp: string, action: string}>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load activity logs
  const loadLogs = () => {
    setIsLoading(true);
    
    try {
      const logs = adminService.getActivityLog();
      setActivityLogs(logs);
    } catch (error) {
      console.error('Error loading activity logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadLogs();
  }, []);

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    try {
      return format(new Date(timestamp), 'MMM d, yyyy h:mm:ss a');
    } catch (error) {
      return timestamp;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Admin Activity Log</CardTitle>
            <CardDescription>
              Record of all admin actions and activities
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadLogs}
            disabled={isLoading}
            className="flex gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : activityLogs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No activity logs found
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="py-2 px-4 text-left font-medium">Time</th>
                  <th className="py-2 px-4 text-left font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {activityLogs.map((log, index) => (
                  <tr key={index} className="hover:bg-muted/50">
                    <td className="py-2 px-4 text-muted-foreground">
                      {formatTimestamp(log.timestamp)}
                    </td>
                    <td className="py-2 px-4">{log.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityLog;
