
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ManagePlayersTab } from './ManagePlayersTab';
import UserManagement from './UserManagement';
import { Users, Shield } from 'lucide-react';

export const CompactUserManagement = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-gradient-to-br from-green-600/20 to-blue-600/20 rounded-lg border border-green-500/30">
          <Users className="h-6 w-6 text-green-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">User & Player Management</h3>
          <p className="text-gray-400 text-sm">Manage players and user accounts</p>
        </div>
      </div>

      <Card className="bg-gray-900/40 backdrop-blur-xl border-gray-700/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg">Management Console</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="players" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800/50">
              <TabsTrigger value="players" className="text-xs md:text-sm">
                <Users className="h-4 w-4 mr-1 md:mr-2" />
                <span>Players</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="text-xs md:text-sm">
                <Shield className="h-4 w-4 mr-1 md:mr-2" />
                <span>Users</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="players" className="mt-4">
              <ManagePlayersTab />
            </TabsContent>
            
            <TabsContent value="users" className="mt-4">
              <UserManagement />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
