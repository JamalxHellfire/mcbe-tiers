
import React from 'react';
import { adminService } from '@/services/adminService';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { LogOut } from 'lucide-react';
import SingleSubmissionForm from '@/components/admin/SingleSubmissionForm';
import BulkSubmissionForm from '@/components/admin/BulkSubmissionForm';
import PlayerEditForm from '@/components/admin/PlayerEditForm';
import MassRegistrationForm from '@/components/admin/MassRegistrationForm';
import AdminTools from '@/components/admin/AdminTools';
import ActivityLog from '@/components/admin/ActivityLog';

interface AdminPanelContentProps {
  onLogout: () => void;
}

const AdminPanelContent: React.FC<AdminPanelContentProps> = ({ onLogout }) => {
  const handleLogout = () => {
    adminService.logoutAdmin();
    onLogout();
    toast.info('Admin session ended');
  };

  return (
    <div className="container max-w-5xl mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <Button variant="outline" onClick={handleLogout} className="gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      <Tabs defaultValue="single" className="w-full">
        <TabsList className="grid grid-cols-6">
          <TabsTrigger value="single">Single Submission</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Submission</TabsTrigger>
          <TabsTrigger value="edit">Edit Player</TabsTrigger>
          <TabsTrigger value="register">Mass Registration</TabsTrigger>
          <TabsTrigger value="tools">Admin Tools</TabsTrigger>
          <TabsTrigger value="logs">Activity Logs</TabsTrigger>
        </TabsList>

        {/* Single Result Submission Tab */}
        <TabsContent value="single">
          <SingleSubmissionForm />
        </TabsContent>

        {/* Bulk Submission Tab */}
        <TabsContent value="bulk">
          <BulkSubmissionForm />
        </TabsContent>

        {/* Player Edit Tab */}
        <TabsContent value="edit">
          <PlayerEditForm />
        </TabsContent>

        {/* Mass Registration Tab */}
        <TabsContent value="register">
          <MassRegistrationForm />
        </TabsContent>

        {/* Admin Tools Tab */}
        <TabsContent value="tools">
          <AdminTools />
        </TabsContent>

        {/* Activity Logs Tab */}
        <TabsContent value="logs">
          <ActivityLog />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanelContent;
