
import React, { useState } from 'react';
import { adminService } from '@/services/adminService';
import { playerService } from '@/services/playerService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface AdminLoginFormProps {
  onLoginSuccess: () => void;
}

const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ onLoginSuccess }) => {
  const [pinInputValue, setPinInputValue] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pinInputValue) {
      toast.error('Please enter the admin PIN');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const isValid = await playerService.verifyAdminPIN(pinInputValue);
      
      if (isValid) {
        adminService.setAdmin(true);
        onLoginSuccess();
        toast.success('Admin access granted');
      } else {
        adminService.logAdminActivity(`Failed login attempt with PIN: ${pinInputValue}`);
        toast.error('Invalid PIN. Access denied.');
        setPinInputValue('');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      toast.error('Failed to validate admin access');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container max-w-md mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Admin Access
          </CardTitle>
          <CardDescription>
            Enter the admin PIN to continue
          </CardDescription>
        </CardHeader>
        <form onSubmit={handlePinSubmit}>
          <CardContent>
            <Input
              type="password"
              placeholder="Enter PIN"
              value={pinInputValue}
              onChange={(e) => setPinInputValue(e.target.value)}
              autoComplete="off"
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminLoginForm;
