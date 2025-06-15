
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MassSubmissionForm } from './MassSubmissionForm';
import { SystemLogsViewer } from './SystemLogsViewer';
import BlackBoxLogger from './BlackBoxLogger';
import { Wrench, Database, Terminal } from 'lucide-react';

export const CompactSystemTools = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-gradient-to-br from-orange-600/20 to-red-600/20 rounded-lg border border-orange-500/30">
          <Wrench className="h-6 w-6 text-orange-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">System Management</h3>
          <p className="text-gray-400 text-sm">Mass tools, logs, and system monitoring</p>
        </div>
      </div>

      <Card className="bg-gray-900/40 backdrop-blur-xl border-gray-700/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg">System Tools & Monitoring</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="mass" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
              <TabsTrigger value="mass" className="text-xs md:text-sm">
                <Database className="h-4 w-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Mass Submit</span>
                <span className="sm:hidden">Mass</span>
              </TabsTrigger>
              <TabsTrigger value="logs" className="text-xs md:text-sm">
                <Wrench className="h-4 w-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">System Logs</span>
                <span className="sm:hidden">Logs</span>
              </TabsTrigger>
              <TabsTrigger value="monitor" className="text-xs md:text-sm">
                <Terminal className="h-4 w-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Live Monitor</span>
                <span className="sm:hidden">Live</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="mass" className="mt-4">
              <MassSubmissionForm />
            </TabsContent>
            
            <TabsContent value="logs" className="mt-4">
              <SystemLogsViewer />
            </TabsContent>
            
            <TabsContent value="monitor" className="mt-4">
              <BlackBoxLogger />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
