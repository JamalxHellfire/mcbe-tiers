
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
import AdminNavigation, { AdminTab } from '@/components/admin/AdminNavigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Shield, 
  LogOut, 
  Menu, 
  X,
  Trash2
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

type AdminTabType = AdminTab;

// Role-based tab visibility
const getVisibleTabs = (role: string): AdminTabType[] => {
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
  const [activeTab, setActiveTab] = useState<AdminTabType>(visibleTabs[0] || 'submit');
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
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-cyan-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 p-3 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
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
            {/* Navigation */}
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-lg md:text-xl font-bold text-white mb-2">Administrative Controls</h2>
                <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto"></div>
              </div>
              
              <AdminNavigation
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                userRole={userRole}
                visibleTabs={visibleTabs}
                isMobile={isMobile}
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
              />

              {/* Mobile Logout Button */}
              {isMobile && mobileMenuOpen && (
                <div className="p-4 bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl">
                  <Button 
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    variant="destructive" 
                    className="w-full bg-red-600/20 border border-red-500/50 text-red-400 hover:bg-red-600/30"
                    size="sm"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                  </Button>
                </div>
              )}
            </div>
            
            {/* Content Area */}
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
