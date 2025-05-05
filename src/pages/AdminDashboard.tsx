
import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LogOut, Users, Trophy, Newspaper } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { PlayerManagement } from '@/components/admin/PlayerManagement';
import { StaffManagement } from '@/components/admin/StaffManagement';
import { NewsManagement } from '@/components/admin/NewsManagement';

const AdminDashboard = () => {
  const [selectedMode, setSelectedMode] = useState('overall');
  const navigate = useNavigate();
  
  // Check if authenticated
  useEffect(() => {
    const adminAuth = localStorage.getItem('mcbe_admin_auth');
    if (adminAuth !== 'true') {
      toast.error('Please login to access the admin dashboard');
      navigate('/admin');
    }
  }, [navigate]);
  
  const handleModeChange = (mode: string) => {
    setSelectedMode(mode);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('mcbe_admin_auth');
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
            <Tabs defaultValue="players" className="w-full">
              <TabsList className="mb-6 bg-dark-surface/50">
                <TabsTrigger value="players" className="flex items-center">
                  <Trophy size={16} className="mr-2" />
                  Players
                </TabsTrigger>
                <TabsTrigger value="staff" className="flex items-center">
                  <Users size={16} className="mr-2" />
                  Staff
                </TabsTrigger>
                <TabsTrigger value="news" className="flex items-center">
                  <Newspaper size={16} className="mr-2" />
                  News
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="players">
                <PlayerManagement />
              </TabsContent>
              
              <TabsContent value="staff">
                <StaffManagement />
              </TabsContent>
              
              <TabsContent value="news">
                <NewsManagement />
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
