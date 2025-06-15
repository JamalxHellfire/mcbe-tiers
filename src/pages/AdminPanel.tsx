
import React, { useState } from 'react';
import { useAdminPanel } from '@/hooks/useAdminPanel';
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
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  UploadCloud, 
  Users, 
  Wrench, 
  Settings, 
  Shield, 
  LogOut, 
  BarChart3, 
  Menu, 
  X, 
  Calendar,
  Database,
  UserCheck,
  Terminal
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

type AdminTab = 'submit' | 'manage' | 'tools' | 'analytics' | 'daily' | 'database' | 'users' | 'blackbox';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('submit');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const sessionToken = localStorage.getItem('admin_session_token');
      if (sessionToken) {
        await adminService.adminLogout(sessionToken);
        localStorage.removeItem('admin_session_token');
      }
      
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
      localStorage.removeItem('admin_session_token');
      window.location.href = '/';
    } finally {
      setIsLoggingOut(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'submit':
        return <SubmitResultsForm />;
      case 'manage':
        return <ManagePlayersTab />;
      case 'tools':
        return (
          <div className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-3 md:space-y-4">
                <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">Mass Submission</h3>
                <MassSubmissionForm />
              </div>
              <div className="space-y-3 md:space-y-4">
                <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">System Monitoring</h3>
                <SystemLogsViewer />
              </div>
            </div>
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">Knowledge Base Management</h3>
              <KnowledgeBaseUpload />
            </div>
          </div>
        );
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'daily':
        return <DailyAnalytics />;
      case 'database':
        return <DatabaseTools />;
      case 'users':
        return <UserManagement />;
      case 'blackbox':
        return <BlackBoxLogger />;
      default:
        return null;
    }
  };

  const TabButton = ({ tabName, label, icon: Icon, description }: { 
    tabName: AdminTab; 
    label: string; 
    icon: React.ElementType;
    description: string;
  }) => (
    <button
      onClick={() => {
        setActiveTab(tabName);
        if (isMobile) setMobileMenuOpen(false);
      }}
      className={cn(
        "group relative p-2 md:p-3 lg:p-4 rounded-lg md:rounded-xl transition-all duration-200",
        "border backdrop-blur-sm text-left w-full",
        activeTab === tabName
          ? "bg-gradient-to-br from-purple-600/20 to-blue-600/20 border-purple-500/50 shadow-lg shadow-purple-500/25"
          : "bg-gray-900/40 border-gray-700/50 hover:bg-gray-800/60 hover:border-gray-600/50"
      )}
    >
      <div className="flex items-start space-x-2 md:space-x-3">
        <div className={cn(
          "p-1.5 md:p-2 rounded-md md:rounded-lg transition-colors",
          activeTab === tabName
            ? "bg-purple-500/20 text-purple-400"
            : "bg-gray-700/50 text-gray-400 group-hover:bg-gray-600/50 group-hover:text-gray-300"
        )}>
          <Icon className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-semibold mb-0.5 transition-colors text-xs md:text-sm lg:text-base",
            activeTab === tabName ? "text-white" : "text-gray-300 group-hover:text-white"
          )}>
            {label}
          </h3>
          <p className="text-xs text-gray-400 group-hover:text-gray-300 leading-tight hidden md:block">
            {description}
          </p>
        </div>
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0b14] via-[#0f111a] to-[#1a1b2a] text-white">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 md:w-48 md:h-48 bg-purple-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 md:w-64 md:h-64 bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 p-2 md:p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-4 md:mb-6 lg:mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="p-1.5 md:p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-md md:rounded-lg">
                  <Shield className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                  <p className="text-gray-400 text-xs md:text-sm hidden md:block">Manage your platform with precision</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Mobile Menu Toggle */}
                {isMobile && (
                  <Button 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    variant="ghost" 
                    size="sm"
                    className="text-white/70 hover:text-white p-2"
                  >
                    {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                  </Button>
                )}
                
                {/* Logout Button */}
                {!isMobile && (
                  <Button 
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    variant="destructive" 
                    size="sm"
                    className="bg-red-600/20 border border-red-500/50 text-red-400 hover:bg-red-600/30"
                  >
                    <LogOut className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                  </Button>
                )}
              </div>
            </div>
          </header>

          <main className="space-y-3 md:space-y-4 lg:space-y-6">
            {/* Navigation */}
            <div className="space-y-2 md:space-y-3">
              <h2 className="text-base md:text-lg font-bold text-white text-center">Administrative Controls</h2>
              
              {/* Mobile Navigation Menu */}
              {isMobile && (
                <div className={cn(
                  "transition-all duration-300 overflow-hidden",
                  mobileMenuOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                )}>
                  <div className="space-y-2 p-3 bg-gray-900/40 backdrop-blur-xl border border-gray-700/50 rounded-xl">
                    <TabButton tabName="submit" label="Submit Results" icon={UploadCloud} description="Add or update player tier rankings" />
                    <TabButton tabName="manage" label="Manage Players" icon={Users} description="View and edit player accounts" />
                    <TabButton tabName="users" label="User Management" icon={UserCheck} description="Ban/unban players and moderation" />
                    <TabButton tabName="daily" label="Daily Analytics" icon={Calendar} description="Daily visits and user analytics" />
                    <TabButton tabName="analytics" label="System Analytics" icon={BarChart3} description="Platform insights and statistics" />
                    <TabButton tabName="database" label="Database Tools" icon={Database} description="Database management and maintenance" />
                    <TabButton tabName="blackbox" label="Black Box" icon={Terminal} description="Real-time system activity monitor" />
                    <TabButton tabName="tools" label="Admin Tools" icon={Wrench} description="Mass submission and system tools" />
                    
                    <Button 
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      variant="destructive" 
                      className="w-full bg-red-600/20 border border-red-500/50 text-red-400 hover:bg-red-600/30 mt-3"
                      size="sm"
                    >
                      <LogOut className="h-3 w-3 mr-1" />
                      {isLoggingOut ? 'Logging out...' : 'Logout'}
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Desktop Navigation Grid */}
              {!isMobile && (
                <div className="grid grid-cols-4 lg:grid-cols-8 gap-2 md:gap-3">
                  <TabButton tabName="submit" label="Submit" icon={UploadCloud} description="Add or update player rankings" />
                  <TabButton tabName="manage" label="Players" icon={Users} description="View and edit accounts" />
                  <TabButton tabName="users" label="Moderation" icon={UserCheck} description="Ban/unban players" />
                  <TabButton tabName="daily" label="Daily Stats" icon={Calendar} description="Daily analytics" />
                  <TabButton tabName="analytics" label="Analytics" icon={BarChart3} description="System insights" />
                  <TabButton tabName="database" label="Database" icon={Database} description="DB management" />
                  <TabButton tabName="blackbox" label="Black Box" icon={Terminal} description="Live system monitor" />
                  <TabButton tabName="tools" label="Tools" icon={Wrench} description="Admin utilities" />
                </div>
              )}
            </div>
            
            {/* Content Area */}
            <div className="relative">
              <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-700/50 rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6 shadow-2xl">
                {renderContent()}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
