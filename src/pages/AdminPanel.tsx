
import React, { useState } from 'react';
import { SubmitResultsForm } from '@/components/admin/SubmitResultsForm';
import { ManagePlayersTab } from '@/components/admin/ManagePlayersTab';
import { MassSubmissionForm } from '@/components/admin/MassSubmissionForm';
import { SystemLogsViewer } from '@/components/admin/SystemLogsViewer';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { KnowledgeBaseUpload } from '@/components/admin/KnowledgeBaseUpload';
import DailyAnalytics from '@/components/admin/DailyAnalytics';
import DatabaseTools from '@/components/admin/DatabaseTools';
import UserManagement from '@/components/admin/UserManagement';
import BlackBoxLogger from '@/components/admin/BlackBoxLogger';
import ApplicationsManager from '@/components/admin/ApplicationsManager';
import CountryAnalytics from '@/components/admin/CountryAnalytics';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Shield, 
  LogOut, 
  UploadCloud, 
  Users, 
  Wrench, 
  BarChart3, 
  Calendar,
  Database,
  UserCheck,
  Terminal,
  UserCog,
  Globe
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import { useToast } from '@/hooks/use-toast';

type AdminTab = 'submit' | 'manage' | 'tools' | 'analytics' | 'daily' | 'database' | 'users' | 'blackbox' | 'applications' | 'country-analytics';

// Role-based tab visibility
const getVisibleTabs = (role: string): AdminTab[] => {
  switch (role) {
    case 'owner':
      return ['submit', 'manage', 'tools', 'analytics', 'daily', 'database', 'users', 'blackbox', 'applications', 'country-analytics'];
    case 'admin':
      return ['submit', 'manage', 'tools', 'analytics', 'daily', 'database', 'users', 'blackbox', 'country-analytics'];
    case 'moderator':
      return ['submit', 'manage', 'analytics', 'daily', 'blackbox'];
    case 'tester':
      return ['submit', 'manage'];
    default:
      return [];
  }
};

interface AdminPanelProps {
  userRole: string;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ userRole }) => {
  const visibleTabs = getVisibleTabs(userRole);
  const [activeTab, setActiveTab] = useState<AdminTab>(visibleTabs[0] || 'submit');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { toast } = useToast();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const sessionToken = localStorage.getItem('admin_session_token');
      if (sessionToken) {
        await adminService.adminLogout(sessionToken);
      }
      
      adminService.clearAllAuthState();
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of the admin panel.",
      });
      
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Error",
        description: "Failed to logout properly, but session has been cleared.",
        variant: "destructive"
      });
      adminService.clearAllAuthState();
      window.location.href = '/';
    } finally {
      setIsLoggingOut(false);
    }
  };

  const tabs = [
    { id: 'submit' as AdminTab, label: 'Submit', icon: UploadCloud },
    { id: 'manage' as AdminTab, label: 'Players', icon: Users },
    { id: 'tools' as AdminTab, label: 'Tools', icon: Wrench },
    { id: 'analytics' as AdminTab, label: 'Analytics', icon: BarChart3 },
    { id: 'daily' as AdminTab, label: 'Daily', icon: Calendar },
    { id: 'database' as AdminTab, label: 'Database', icon: Database },
    { id: 'users' as AdminTab, label: 'Users', icon: UserCheck },
    { id: 'blackbox' as AdminTab, label: 'Logs', icon: Terminal },
    { id: 'applications' as AdminTab, label: 'Apps', icon: UserCog },
    { id: 'country-analytics' as AdminTab, label: 'Countries', icon: Globe }
  ].filter(tab => visibleTabs.includes(tab.id));

  const renderContent = () => {
    switch (activeTab) {
      case 'submit':
        return <SubmitResultsForm />;
      case 'manage':
        return <ManagePlayersTab />;
      case 'tools':
        return userRole === 'owner' || userRole === 'admin' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Mass Submission</h3>
                <MassSubmissionForm />
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">System Monitoring</h3>
                <SystemLogsViewer />
              </div>
            </div>
            {userRole === 'owner' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Knowledge Base Management</h3>
                <KnowledgeBaseUpload />
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <Shield className="h-12 w-12 text-red-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-red-400 mb-2">Access Restricted</h3>
                <p className="text-gray-400">Your role does not have access to these tools.</p>
              </div>
            </div>
          </div>
        );
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'daily':
        return <DailyAnalytics />;
      case 'country-analytics':
        return <CountryAnalytics />;
      case 'database':
        return userRole === 'owner' || userRole === 'admin' ? <DatabaseTools /> : 
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <Shield className="h-12 w-12 text-red-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-red-400 mb-2">Access Restricted</h3>
                <p className="text-gray-400">Your role does not have access to database tools.</p>
              </div>
            </div>
          </div>;
      case 'users':
        return userRole === 'owner' || userRole === 'admin' ? <UserManagement /> : 
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <Shield className="h-12 w-12 text-red-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-red-400 mb-2">Access Restricted</h3>
                <p className="text-gray-400">Your role does not have access to user management.</p>
              </div>
            </div>
          </div>;
      case 'blackbox':
        return <BlackBoxLogger />;
      case 'applications':
        return <ApplicationsManager userRole={userRole} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0b14] via-[#0f111a] to-[#1a1b2a] text-white">
      {/* Small Top Navigation Bar */}
      <nav className="bg-gray-900/60 backdrop-blur-xl border-b border-gray-700/50 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-white">Admin</span>
            <span className="text-xs text-gray-400">({userRole})</span>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-purple-600/20 text-purple-400 border border-purple-500/30"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                )}
              >
                <tab.icon className="h-3 w-3" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Logout Button */}
          <Button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            variant="ghost" 
            size="sm"
            className="text-red-400 hover:text-red-300 hover:bg-red-600/10 px-2 py-1 h-auto text-xs"
          >
            <LogOut className="h-3 w-3 mr-1" />
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </Button>
        </div>
      </nav>

      {/* Content Area */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
