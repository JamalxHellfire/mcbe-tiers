
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { adminService } from '@/services/adminService';
import { useToast } from '@/hooks/use-toast';
import { Shield, Lock } from 'lucide-react';

interface AdminAuthProps {
  onAuthSuccess: () => void;
}

export const AdminAuth: React.FC<AdminAuthProps> = ({ onAuthSuccess }) => {
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      toast({
        title: "PIN Required",
        description: "Please enter your admin PIN",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await adminService.adminLogin(pin);
      
      if (result.success && result.sessionToken) {
        localStorage.setItem('admin_session_token', result.sessionToken);
        toast({
          title: "Login Successful",
          description: "Welcome to the admin panel",
        });
        onAuthSuccess();
      } else {
        toast({
          title: "Login Failed",
          description: result.error || "Invalid PIN",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Error",
        description: "An error occurred during login",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0b14] via-[#0f111a] to-[#1a1b2a] flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 md:w-64 md:h-64 bg-purple-600/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-80 md:h-80 bg-blue-600/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <Card className="w-full max-w-md bg-gray-900/40 backdrop-blur-xl border-gray-700/50 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
            Admin Access
          </CardTitle>
          <CardDescription className="text-gray-400">
            Enter your admin PIN to access the dashboard
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="pin" className="text-sm font-medium text-gray-300">
                Admin PIN
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="pin"
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter admin PIN"
                  className="pl-10 bg-gray-800/50 border-gray-600/50 text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:ring-purple-500/25"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
              disabled={isLoading}
            >
              {isLoading ? 'Authenticating...' : 'Access Admin Panel'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
