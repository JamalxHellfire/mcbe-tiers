
import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { KeyRound, LogIn } from 'lucide-react';
import { verifyAdminPin } from '@/api/supabase';
import { useIsMobile } from '@/hooks/use-mobile';

const Admin = () => {
  const [pin, setPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMode, setSelectedMode] = useState('overall');
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Check if already authenticated
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
    
    if (!pin) {
      toast.error('Please enter admin PIN');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const isValid = await verifyAdminPin(pin);
      
      if (isValid) {
        localStorage.setItem('mcbe_admin_auth', 'true');
        localStorage.setItem('mcbe_admin_login_time', Date.now().toString());
        toast.success('Access granted. Welcome to the Admin Panel');
        navigate('/admin/dashboard');
      } else {
        toast.error('🚫 Invalid Admin Code. Access Denied.');
        console.log('Failed login attempt');
      }
    } catch (error) {
      console.error('Error verifying admin PIN:', error);
      toast.error('Failed to verify PIN. Please try again.');
    } finally {
      setIsSubmitting(false);
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
          <Card className="border border-white/10 bg-dark-surface/80 backdrop-blur-md shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-center flex justify-center items-center gap-2">
                <KeyRound className="text-yellow-500" />
                Admin Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Enter Admin PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="bg-dark-surface/50 border-white/10"
                    autoFocus
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
                  disabled={isSubmitting}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Verifying...' : 'Access Admin Panel'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
