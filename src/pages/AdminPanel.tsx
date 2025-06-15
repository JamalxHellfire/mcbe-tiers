
import React, { useState } from 'react';
import { useAdminPanel } from '@/hooks/useAdminPanel';
import { SubmitResultsForm } from '@/components/admin/SubmitResultsForm';
import { ManagePlayersTab } from '@/components/admin/ManagePlayersTab';
import { MassSubmissionForm } from '@/components/admin/MassSubmissionForm';
import { SystemLogsViewer } from '@/components/admin/SystemLogsViewer';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { KnowledgeBaseUpload } from '@/components/admin/KnowledgeBaseUpload';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { UploadCloud, Users, Wrench, Settings, Shield, LogOut, BarChart3, Menu, X } from 'lucide-react';
import { adminService } from '@/services/adminService';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

type AdminTab = 'submit' | 'manage' | 'tools' | 'analytics';

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
      
      // Redirect to home page or login page
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Error",
        description: "Failed to logout properly, but session has been cleared.",
        variant: "destructive"
      });
      // Force logout anyway
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
          <div className="space-y-4 md:space-y-6 lg:space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
              <div className="space-y-3 md:space-y-4 lg:space-y-6">
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-2 md:mb-3 lg:mb-4">Mass Submission</h3>
                <MassSubmissionForm />
              </div>
              <div className="space-y-3 md:space-y-4 lg:space-y-6">
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-2 md:mb-3 lg:mb-4">System Monitoring</h3>
                <SystemLogsViewer />
              </div>
            </div>
            <div className="space-y-3 md:space-y-4 lg:space-y-6">
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-2 md:mb-3 lg:mb-4">Knowledge Base Management</h3>
              <KnowledgeBaseUpload />
            </div>
          </div>
        );
      case 'analytics':
        return <AnalyticsDashboard />;
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
        "group relative p-3 md:p-4 lg:p-6 rounded-xl md:rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1",
        "border backdrop-blur-sm text-left w-full",
        activeTab === tabName
          ? "bg-gradient-to-br from-purple-600/20 to-blue-600/20 border-purple-500/50 shadow-lg shadow-purple-500/25"
          : "bg-gray-900/40 border-gray-700/50 hover:bg-gray-800/60 hover:border-gray-600/50"
      )}
    >
      <div className="flex items-start space-x-2 md:space-x-3 lg:space-x-4">
        <div className={cn(
          "p-2 md:p-2.5 lg:p-3 rounded-lg md:rounded-xl transition-colors",
          activeTab === tabName
            ? "bg-purple-500/20 text-purple-400"
            : "bg-gray-700/50 text-gray-400 group-hover:bg-gray-600/50 group-hover:text-gray-300"
        )}>
          <Icon className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-semibold mb-0.5 md:mb-1 transition-colors text-sm md:text-base lg:text-lg",
            activeTab === tabName ? "text-white" : "text-gray-300 group-hover:text-white"
          )}>
            {label}
          </h3>
          <p className="text-xs md:text-sm text-gray-400 group-hover:text-gray-300 leading-tight">
            {description}
          </p>
        </div>
      </div>
      {activeTab === tabName && (
        <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-r from-purple-600/10 to-blue-600/10 animate-pulse" />
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0b14] via-[#0f111a] to-[#1a1b2a] text-white">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 bg-purple-600/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-blue-600/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] bg-gradient-to-r from-purple-600/3 to-blue-600/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 p-2 md:p-4 lg:p-6 xl:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-6 md:mb-8 lg:mb-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="space-y-1 md:space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className="p-2 md:p-2.5 lg:p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg md:rounded-xl">
                      <Shield className="h-5 w-5 md:h-6 md:w-6 lg:h-8 lg:w-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                        Admin Dashboard
                      </h1>
                      <p className="text-gray-400 text-sm md:text-base lg:text-lg hidden md:block">Manage your platform with precision and control</p>
                    </div>
                  </div>
                  
                  {/* Mobile Menu Toggle */}
                  {isMobile && (
                    <Button 
                      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                      variant="ghost" 
                      size="sm"
                      className="text-white/70 hover:text-white p-2"
                    >
                      {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                  )}
                </div>
                <p className="text-gray-400 text-sm md:hidden">Manage your platform with precision and control</p>
              </div>
              
              {/* Desktop Logout Button */}
              {!isMobile && (
                <Button 
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  variant="destructive" 
                  className="bg-red-600/20 border border-red-500/50 text-red-400 hover:bg-red-600/30 hover:text-red-300 transition-all duration-300 px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl backdrop-blur-sm disabled:opacity-50"
                >
                  <LogOut className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </Button>
              )}
            </div>
          </header>

          <main className="space-y-4 md:space-y-6 lg:space-y-8">
            {/* Navigation Cards */}
            <div className="space-y-3 md:space-y-4 lg:space-y-6">
              <div className="text-center space-y-1 md:space-y-2">
                <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white">Administrative Controls</h2>
                <p className="text-gray-400 text-sm md:text-base">Choose your administrative action</p>
              </div>
              
              {/* Mobile Navigation Menu */}
              {isMobile && (
                <div className={cn(
                  "transition-all duration-300 overflow-hidden",
                  mobileMenuOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
                )}>
                  <div className="space-y-3 p-4 bg-gray-900/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl">
                    <TabButton 
                      tabName="submit" 
                      label="Submit Results" 
                      icon={UploadCloud}
                      description="Add or update player tier rankings and results"
                    />
                    <TabButton 
                      tabName="manage" 
                      label="Manage Players" 
                      icon={Users}
                      description="View, edit, and manage player accounts"
                    />
                    <TabButton 
                      tabName="tools" 
                      label="Admin Tools" 
                      icon={Wrench}
                      description="Mass submission and system monitoring"
                    />
                    <TabButton 
                      tabName="analytics" 
                      label="Analytics" 
                      icon={BarChart3}
                      description="Platform insights and statistics"
                    />
                    
                    {/* Mobile Logout Button */}
                    <Button 
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      variant="destructive" 
                      className="w-full bg-red-600/20 border border-red-500/50 text-red-400 hover:bg-red-600/30 hover:text-red-300 transition-all duration-300 px-4 py-3 rounded-xl backdrop-blur-sm disabled:opacity-50 mt-4"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {isLoggingOut ? 'Logging out...' : 'Logout'}
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Desktop/Tablet Navigation Grid */}
              {!isMobile && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
                  <TabButton 
                    tabName="submit" 
                    label="Submit Results" 
                    icon={UploadCloud}
                    description="Add or update player tier rankings and results"
                  />
                  <TabButton 
                    tabName="manage" 
                    label="Manage Players" 
                    icon={Users}
                    description="View, edit, and manage player accounts"
                  />
                  <TabButton 
                    tabName="tools" 
                    label="Admin Tools" 
                    icon={Wrench}
                    description="Mass submission and system monitoring"
                  />
                  <TabButton 
                    tabName="analytics" 
                    label="Analytics" 
                    icon={BarChart3}
                    description="Platform insights and statistics"
                  />
                </div>
              )}
            </div>
            
            {/* Content Area */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-blue-600/5 rounded-2xl md:rounded-3xl blur-xl" />
              <div className="relative bg-gray-900/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl">
                <div className="animate-fade-in">
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
