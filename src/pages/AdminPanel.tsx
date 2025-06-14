
import React, { useState } from 'react';
import { useAdminPanel } from '@/hooks/useAdminPanel';
import SubmitResultsForm from '@/components/admin/SubmitResultsForm';
import ManagePlayersTab from '@/components/admin/ManagePlayersTab';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
        return <div className="text-center text-gray-400">Admin Tools coming soon...</div>;
      default:
        return null;
    }
  };

  const TabButton = ({ tabName, label }: { tabName: AdminTab; label: string }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={cn(
        "py-2 px-4 rounded-md text-sm font-medium transition-colors",
        activeTab === tabName
          ? "bg-gray-800 text-white"
          : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#0f111a] text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <Button variant="destructive">Logout</Button>
        </header>

        <main>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Admin Controls</h2>
            <div className="bg-[#1A1B2A] border border-gray-700 rounded-lg p-2 flex gap-2">
              <TabButton tabName="submit" label="Submit Results" />
              <TabButton tabName="manage" label="Manage Players" />
              <TabButton tabName="tools" label="Admin Tools" />
            </div>
          </div>
          
          <div className="animate-fade-in">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
