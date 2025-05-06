
import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { verifyAdminPin } from '@/api/supabase';
import { useIsMobile } from '@/hooks/use-mobile';

const Admin = () => {
  const [selectedMode, setSelectedMode] = useState('overall');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Check if already authenticated
  useEffect(() => {
    const adminAuth = localStorage.getItem('mcbe_admin_auth');
    if (adminAuth === 'true') {
      navigate('/admin/dashboard');
    }
  }, [navigate]);
  
  const handleModeChange = (mode: string) => {
    setSelectedMode(mode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!pin) {
      setError('Please enter a PIN');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Check if pin is correct - hardcoded to "1234" as requested
      const isValid = await verifyAdminPin(pin);
      
      if (isValid) {
        localStorage.setItem('mcbe_admin_auth', 'true');
        toast.success('Authentication successful!');
        navigate('/admin/dashboard');
      } else {
        setError('Access Denied: Invalid PIN');
        toast.error('Access Denied');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError('Authentication failed. Please try again later.');
      toast.error('Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-dark">
      <Navbar 
        selectedMode={selectedMode} 
        onSelectMode={handleModeChange} 
        navigate={navigate} 
        activePage="admin" 
      />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-dark-surface/90 border border-white/10 backdrop-blur-md p-6">
            <div className="text-center mb-6">
              <motion.h1 
                className="text-2xl font-bold text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Admin Access
              </motion.h1>
              <motion.p 
                className="text-white/60 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Enter your PIN to access the admin dashboard
              </motion.p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Input
                  type="password"
                  placeholder="Enter PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="bg-dark-surface/60 border-white/10 focus:border-white/30 text-white"
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Access Dashboard"}
                </Button>
              </motion.div>
            </form>
          </Card>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
