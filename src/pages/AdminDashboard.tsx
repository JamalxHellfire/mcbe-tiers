
import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { PlayerManagement } from '@/components/admin/PlayerManagement';
import { PlayerSearch } from '@/components/admin/PlayerSearch';
import { ResultSubmissionForm } from '@/components/admin/ResultSubmissionForm';
import { StatsOverview } from '@/components/admin/StatsOverview';
import { useIsMobile } from '@/hooks/use-mobile';

const AdminDashboard = () => {
  const [selectedMode, setSelectedMode] = useState('overall');
  const [activeTab, setActiveTab] = useState('mass-register');
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Check if authenticated
  useEffect(() => {
    const adminAuth = localStorage.getItem('mcbe_admin_auth');
    const loginTime = localStorage.getItem('mcbe_admin_login_time');
    
    if (adminAuth !== 'true') {
      toast.error('Please login to access the admin dashboard');
      navigate('/admin');
      return;
    }
    
    // Check if session is expired (24 hours)
    if (loginTime) {
      const loginTimeMs = parseInt(loginTime);
      const currentTime = Date.now();
      const sessionDuration = currentTime - loginTimeMs;
      const twentyFourHours = 24 * 60 * 60 * 1000;
      
      if (sessionDuration > twentyFourHours) {
        localStorage.removeItem('mcbe_admin_auth');
        localStorage.removeItem('mcbe_admin_login_time');
        toast.error('Your session has expired. Please login again.');
        navigate('/admin');
      }
    }
  }, [navigate]);
  
  const handleModeChange = (mode: string) => {
    setSelectedMode(mode);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('mcbe_admin_auth');
    localStorage.removeItem('mcbe_admin_login_time');
    toast.success('Logged out successfully');
    navigate('/admin');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-dark">
      <Navbar 
        selectedMode={selectedMode} 
        onSelectMode={handleModeChange} 
        navigate={navigate} 
        activePage="admin" 
      />
      
      <main className="flex-grow p-4 md:p-8">
        <motion.div 
          className="w-full max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <motion.h1 
              className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-0"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Admin Dashboard
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button 
                onClick={handleLogout}
                variant="destructive"
                className="flex items-center"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-dark-surface/80 backdrop-blur-md rounded-xl border border-white/10 p-4 md:p-6"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6 bg-dark-surface/50 w-full md:w-auto overflow-x-auto flex whitespace-nowrap md:inline-flex">
                <TabsTrigger value="mass-register" className="px-3 md:px-4">Mass Register</TabsTrigger>
                <TabsTrigger value="submit-result" className="px-3 md:px-4">Submit Result</TabsTrigger>
                <TabsTrigger value="search-edit" className="px-3 md:px-4">Search & Edit</TabsTrigger>
                <TabsTrigger value="database-tools" className="px-3 md:px-4">Database Tools</TabsTrigger>
                <TabsTrigger value="stats" className="px-3 md:px-4">Stats Overview</TabsTrigger>
              </TabsList>
              
              <TabsContent value="mass-register" className="mt-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-3/5">
                    <PlayerManagement activeTab="mass-register" />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="submit-result" className="mt-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-3/5">
                    <ResultSubmissionForm />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="search-edit" className="mt-4">
                <PlayerSearch />
              </TabsContent>
              
              <TabsContent value="database-tools" className="mt-4">
                <PlayerManagement activeTab="database-tools" />
              </TabsContent>
              
              <TabsContent value="stats" className="mt-4">
                <StatsOverview />
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
