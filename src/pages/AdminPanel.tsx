
import React, { useState } from 'react';
import { useAdminPanel } from '@/hooks/useAdminPanel';
import { SubmitResultsForm } from '@/components/admin/SubmitResultsForm';
import { ManagePlayersTab } from '@/components/admin/ManagePlayersTab';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { UploadCloud, Users, Wrench, Settings, Shield, LogOut } from 'lucide-react';

type AdminTab = 'submit' | 'manage' | 'tools';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('submit');

  const renderContent = () => {
    switch (activeTab) {
      case 'submit':
        return <SubmitResultsForm />;
      case 'manage':
        return <ManagePlayersTab />;
      case 'tools':
        return (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <Settings className="h-16 w-16 text-purple-400 mx-auto animate-pulse" />
              <h3 className="text-2xl font-bold text-white">Admin Tools</h3>
              <p className="text-gray-400 max-w-md">Advanced administrative features coming soon. Stay tuned for powerful tools to manage your platform.</p>
            </div>
          </div>
        );
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
      onClick={() => setActiveTab(tabName)}
      className={cn(
        "group relative p-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1",
        "border backdrop-blur-sm text-left w-full",
        activeTab === tabName
          ? "bg-gradient-to-br from-purple-600/20 to-blue-600/20 border-purple-500/50 shadow-lg shadow-purple-500/25"
          : "bg-gray-900/40 border-gray-700/50 hover:bg-gray-800/60 hover:border-gray-600/50"
      )}
    >
      <div className="flex items-start space-x-4">
        <div className={cn(
          "p-3 rounded-xl transition-colors",
          activeTab === tabName
            ? "bg-purple-500/20 text-purple-400"
            : "bg-gray-700/50 text-gray-400 group-hover:bg-gray-600/50 group-hover:text-gray-300"
        )}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className={cn(
            "font-semibold mb-1 transition-colors",
            activeTab === tabName ? "text-white" : "text-gray-300 group-hover:text-white"
          )}>
            {label}
          </h3>
          <p className="text-sm text-gray-400 group-hover:text-gray-300">
            {description}
          </p>
        </div>
      </div>
      {activeTab === tabName && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/10 to-blue-600/10 animate-pulse" />
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0b14] via-[#0f111a] to-[#1a1b2a] text-white">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-600/3 to-blue-600/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                      Admin Dashboard
                    </h1>
                    <p className="text-gray-400 text-lg">Manage your platform with precision and control</p>
                  </div>
                </div>
              </div>
              <Button 
                variant="destructive" 
                className="bg-red-600/20 border border-red-500/50 text-red-400 hover:bg-red-600/30 hover:text-red-300 transition-all duration-300 px-6 py-3 rounded-xl backdrop-blur-sm"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </Button>
            </div>
          </header>

          <main className="space-y-8">
            {/* Navigation Cards */}
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-white">Administrative Controls</h2>
                <p className="text-gray-400">Choose your administrative action</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  description="Advanced administrative utilities"
                />
              </div>
            </div>
            
            {/* Content Area */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-blue-600/5 rounded-3xl blur-xl" />
              <div className="relative bg-gray-900/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
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
