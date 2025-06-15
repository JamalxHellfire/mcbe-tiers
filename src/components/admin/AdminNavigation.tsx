
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Users, 
  BarChart3, 
  Database,
  UserCheck,
  Terminal,
  UserCog,
  Shield
} from 'lucide-react';

export type AdminTab = 'submit' | 'console' | 'analytics' | 'database' | 'users' | 'applications';

interface AdminNavigationProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  userRole: string;
  visibleTabs: AdminTab[];
  isMobile: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const getVisibleTabs = (role: string): AdminTab[] => {
  switch (role) {
    case 'owner':
      return ['submit', 'console', 'analytics', 'database', 'users', 'applications'];
    case 'admin':
      return ['submit', 'console', 'analytics', 'database', 'users'];
    case 'moderator':
      return ['submit', 'analytics', 'console'];
    case 'tester':
      return ['submit'];
    default:
      return [];
  }
};

const AdminNavigation: React.FC<AdminNavigationProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  isMobile,
  mobileMenuOpen,
  setMobileMenuOpen
}) => {
  const visibleTabs = getVisibleTabs(userRole);

  const navCategories = [
    {
      title: "Content",
      icon: Users,
      tabs: [
        { id: 'submit' as AdminTab, label: 'Players & Results', icon: Users, description: 'Submit results and manage player accounts' }
      ]
    },
    {
      title: "Analytics",
      icon: BarChart3,
      tabs: [
        { id: 'analytics' as AdminTab, label: 'Analytics', icon: BarChart3, description: 'Overview, daily stats, and country data' }
      ]
    },
    {
      title: "Management",
      icon: Shield,
      tabs: [
        { id: 'users' as AdminTab, label: 'Users & Players', icon: UserCheck, description: 'Unified user and player management' },
        { id: 'applications' as AdminTab, label: 'Staff Apps', icon: UserCog, description: 'Staff applications and members' }
      ]
    },
    {
      title: "System",
      icon: Terminal,
      tabs: [
        { id: 'console' as AdminTab, label: 'System Console', icon: Terminal, description: 'Unified console with logs, monitoring & mass tools' },
        { id: 'database' as AdminTab, label: 'Database', icon: Database, description: 'Database management' }
      ]
    }
  ];

  const TabButton = ({ tab }: { tab: { id: AdminTab; label: string; icon: React.ElementType; description: string } }) => {
    if (!visibleTabs.includes(tab.id)) return null;
    
    return (
      <button
        onClick={() => {
          setActiveTab(tab.id);
          if (isMobile) setMobileMenuOpen(false);
        }}
        className={cn(
          "group relative p-2 md:p-3 rounded-lg transition-all duration-200",
          "border backdrop-blur-sm text-left w-full hover:scale-[1.02]",
          activeTab === tab.id
            ? "bg-gradient-to-br from-purple-600/20 to-blue-600/20 border-purple-500/50 shadow-lg shadow-purple-500/25"
            : "bg-gray-900/40 border-gray-700/50 hover:bg-gray-800/60 hover:border-gray-600/50"
        )}
      >
        <div className="flex items-start space-x-2 md:space-x-3">
          <div className={cn(
            "p-1.5 md:p-2 rounded-lg transition-colors",
            activeTab === tab.id
              ? "bg-purple-500/20 text-purple-400"
              : "bg-gray-700/50 text-gray-400 group-hover:bg-gray-600/50 group-hover:text-gray-300"
          )}>
            <tab.icon className="w-3 h-3 md:w-4 md:h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "font-semibold mb-1 transition-colors text-xs md:text-sm",
              activeTab === tab.id ? "text-white" : "text-gray-300 group-hover:text-white"
            )}>
              {tab.label}
            </h3>
            <p className="text-xs text-gray-400 group-hover:text-gray-300 leading-tight hidden md:block">
              {tab.description}
            </p>
          </div>
        </div>
      </button>
    );
  };

  if (isMobile) {
    return (
      <div className={cn(
        "transition-all duration-300 overflow-hidden",
        mobileMenuOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="space-y-3 p-3 bg-gray-900/40 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl">
          {navCategories.map((category) => {
            const visibleCategoryTabs = category.tabs.filter(tab => visibleTabs.includes(tab.id));
            if (visibleCategoryTabs.length === 0) return null;

            return (
              <div key={category.title} className="space-y-2">
                <div className="flex items-center space-x-2 mb-2">
                  <category.icon className="h-3 w-3 text-purple-400" />
                  <h4 className="text-xs font-semibold text-purple-400">{category.title}</h4>
                </div>
                <div className="space-y-1 pl-4 border-l border-gray-700/50">
                  {visibleCategoryTabs.map((tab) => (
                    <TabButton key={tab.id} tab={tab} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-700/50 rounded-xl p-3 md:p-4 shadow-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-3 md:gap-4">
        {navCategories.map((category) => {
          const visibleCategoryTabs = category.tabs.filter(tab => visibleTabs.includes(tab.id));
          if (visibleCategoryTabs.length === 0) return null;

          return (
            <div key={category.title} className="space-y-2 md:space-y-3">
              <div className="flex items-center space-x-2 pb-2 border-b border-gray-700/30">
                <div className="p-1 md:p-1.5 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-lg border border-purple-500/30">
                  <category.icon className="h-3 w-3 md:h-4 md:w-4 text-purple-400" />
                </div>
                <h3 className="text-sm md:text-base font-bold text-white">{category.title}</h3>
              </div>
              <div className="space-y-1 md:space-y-2">
                {visibleCategoryTabs.map((tab) => (
                  <TabButton key={tab.id} tab={tab} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminNavigation;
