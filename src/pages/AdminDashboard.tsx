
import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LogOut, Users, Trophy, Database, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { PlayerManagement } from '@/components/admin/PlayerManagement';
import { MassRegistrationForm } from '@/components/admin/MassRegistrationForm';
import { ResultSubmissionForm } from '@/components/admin/ResultSubmissionForm';
import { GenerateDummyDataButton } from '@/components/admin/GenerateDummyDataButton';
import { Card } from '@/components/ui/card';

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
              className="flex items-center space-x-4"
            >
              <GenerateDummyDataButton />
              
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
                  Player Results
                </TabsTrigger>
                <TabsTrigger value="mass-register" className="flex items-center">
                  <Upload size={16} className="mr-2" />
                  Mass Register
                </TabsTrigger>
                <TabsTrigger value="database" className="flex items-center">
                  <Database size={16} className="mr-2" />
                  Database
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="players">
                <ResultSubmissionForm />
              </TabsContent>
              
              <TabsContent value="mass-register">
                <MassRegistrationForm />
              </TabsContent>
              
              <TabsContent value="database">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Database Management</h3>
                  <p className="text-white/70 mb-6">
                    This section allows you to generate test data or clear the database.
                    The "Generate 100 Dummy Players" button at the top of the page will create random test players with tier assignments.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-dark-surface p-4 rounded-lg border border-white/10">
                      <h4 className="font-medium mb-2">Player Database</h4>
                      <ul className="list-disc pl-5 text-sm text-white/70 space-y-1">
                        <li>All players are searchable via the global search</li>
                        <li>Only ranked players appear in tier lists</li>
                        <li>Points are automatically calculated based on tiers</li>
                        <li>Maximum 50 points per gamemode</li>
                      </ul>
                    </div>
                    <div className="bg-dark-surface p-4 rounded-lg border border-white/10">
                      <h4 className="font-medium mb-2">Tier System</h4>
                      <ul className="list-disc pl-5 text-sm text-white/70 space-y-1">
                        <li>HT1: 50 points - Highest Tier</li>
                        <li>LT1: 45 points</li>
                        <li>HT2: 40 points</li>
                        <li>LT2: 35 points</li>
                        <li>HT3: 30 points</li>
                      </ul>
                    </div>
                  </div>
                </Card>
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
