
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
  Terminal,
  UserCog,
  Trash2
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

type AdminTab = 'submit' | 'manage' | 'tools' | 'analytics' | 'daily' | 'database' | 'users' | 'blackbox' | 'applications';

// Role-based tab visibility
const getVisibleTabs = (role: string): AdminTab[] => {
  switch (role) {
    case 'owner':
      return ['submit', 'manage', 'tools', 'analytics', 'daily', 'database', 'users', 'blackbox', 'applications'];
    case 'admin':
      return ['submit', 'manage', 'tools', 'analytics', 'daily', 'database', 'users', 'blackbox'];
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

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
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-lg border border-purple-500/30">
                    <UploadCloud className="h-5 w-5 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Mass Submission</h3>
                </div>
                <MassSubmissionForm />
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-lg border border-blue-500/30">
                    <Settings className="h-5 w-5 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">System Monitoring</h3>
                </div>
                <SystemLogsViewer />
              </div>
            </div>
            {userRole === 'owner' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-yellow-600/20 to-orange-600/20 rounded-lg border border-yellow-500/30">
                    <Shield className="h-5 w-5 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Knowledge Base Management</h3>
                </div>
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

  const TabButton = ({ tabName, label, icon: Icon, description }: { 
    tabName: AdminTab; 
    label: string; 
    icon: React.ElementType;
    description: string;
  }) => {
    if (!visibleTabs.includes(tabName)) return null;
    
    return (
      <button
        onClick={() => {
          setActiveTab(tabName);
          if (isMobile) setMobileMenuOpen(false);
        }}
        className={cn(
          "group relative p-3 lg:p-4 rounded-xl transition-all duration-300",
          "border backdrop-blur-sm text-left w-full transform hover:scale-[1.02]",
          activeTab === tabName
            ? "bg-gradient-to-br from-purple-600/30 to-blue-600/30 border-purple-400/60 shadow-xl shadow-purple-500/25 scale-[1.02]"
            : "bg-gray-900/50 border-gray-700/50 hover:bg-gray-800/70 hover:border-gray-600/60 hover:shadow-lg"
        )}
      >
        <div className="flex items-start space-x-3">
          <div className={cn(
            "p-2 rounded-lg transition-all duration-300",
            activeTab === tabName
              ? "bg-purple-500/30 text-purple-300 shadow-lg"
              : "bg-gray-700/50 text-gray-400 group-hover:bg-gray-600/50 group-hover:text-gray-300"
          )}>
            <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "font-semibold mb-1 transition-colors text-sm lg:text-base",
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0b14] via-[#0f111a] to-[#1a1b2a] text-white">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-cyan-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 p-3 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <header className="mb-6 lg:mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-lg">
                  <Shield className="h-6 w-6 lg:h-7 lg:w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                  <div className="flex items-center space-x-3 mt-1">
                    <p className="text-gray-400 text-sm md:text-base">
                      Role: <span className="text-purple-400 font-semibold">{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</span>
                    </p>
                    <div className="h-1 w-1 bg-gray-500 rounded-full"></div>
                    <p className="text-gray-500 text-xs md:text-sm">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Mobile Menu Toggle */}
                {isMobile && (
                  <Button 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    variant="ghost" 
                    size="sm"
                    className="text-white/70 hover:text-white p-2 hover:bg-gray-800/50 rounded-lg transition-all duration-200"
                  >
                    {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </Button>
                )}
                
                {/* Logout Button */}
                {!isMobile && (
                  <Button 
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    variant="destructive" 
                    size="sm"
                    className="bg-red-600/20 border border-red-500/50 text-red-400 hover:bg-red-600/30 hover:border-red-400/60 transition-all duration-200 shadow-lg hover:shadow-red-500/25"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                  </Button>
                )}
              </div>
            </div>
          </header>

          <main className="space-y-6 lg:space-y-8">
            {/* Enhanced Navigation */}
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-lg md:text-xl font-bold text-white mb-2">Administrative Controls</h2>
                <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto"></div>
              </div>
              
              {/* Mobile Navigation Menu */}
              {isMobile && (
                <div className={cn(
                  "transition-all duration-500 overflow-hidden",
                  mobileMenuOpen ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0"
                )}>
                  <div className="space-y-3 p-4 bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl">
                    <TabButton tabName="submit" label="Submit Results" icon={UploadCloud} description="Add or update player tier rankings" />
                    <TabButton tabName="manage" label="Manage Players" icon={Users} description="View and edit player accounts" />
                    <TabButton tabName="users" label="User Management" icon={UserCheck} description="Ban/unban players and moderation" />
                    <TabButton tabName="daily" label="Daily Analytics" icon={Calendar} description="Daily visits and user analytics" />
                    <TabButton tabName="analytics" label="System Analytics" icon={BarChart3} description="Platform insights and statistics" />
                    <TabButton tabName="database" label="Database Tools" icon={Database} description="Database management and maintenance" />
                    <TabButton tabName="blackbox" label="Black Box" icon={Terminal} description="Real-time system activity monitor" />
                    <TabButton tabName="applications" label="Applications" icon={UserCog} description="Review admin applications" />
                    <TabButton tabName="tools" label="Admin Tools" icon={Wrench} description="Mass submission and system tools" />
                    
                    <Button 
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      variant="destructive" 
                      className="w-full bg-red-600/20 border border-red-500/50 text-red-400 hover:bg-red-600/30 mt-4"
                      size="sm"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {isLoggingOut ? 'Logging out...' : 'Logout'}
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Desktop Navigation Grid */}
              {!isMobile && (
                <div className="grid grid-cols-3 lg:grid-cols-9 gap-3 lg:gap-4">
                  <TabButton tabName="submit" label="Submit" icon={UploadCloud} description="Add or update player rankings" />
                  <TabButton tabName="manage" label="Players" icon={Users} description="View and edit accounts" />
                  <TabButton tabName="users" label="Moderation" icon={UserCheck} description="Ban/unban players" />
                  <TabButton tabName="daily" label="Daily Stats" icon={Calendar} description="Daily analytics" />
                  <TabButton tabName="analytics" label="Analytics" icon={BarChart3} description="System insights" />
                  <TabButton tabName="database" label="Database" icon={Database} description="DB management" />
                  <TabButton tabName="blackbox" label="Black Box" icon={Terminal} description="Live system monitor" />
                  <TabButton tabName="applications" label="Applications" icon={UserCog} description="Review applications" />
                  <TabButton tabName="tools" label="Tools" icon={Wrench} description="Admin utilities" />
                </div>
              )}
            </div>
            
            {/* Enhanced Content Area */}
            <div className="relative">
              <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl lg:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl">
                <div className="relative">
                  {renderContent()}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
