
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { UserCheck, UserX, Clock, Users } from 'lucide-react';
import { newAdminService, AdminApplication } from '@/services/newAdminService';

interface ApplicationsManagerProps {
  userRole: string;
}

const ApplicationsManager: React.FC<ApplicationsManagerProps> = ({ userRole }) => {
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const data = await newAdminService.getPendingApplications();
      setApplications(data);
    } catch (error) {
      console.error('Fetch applications error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userRole === 'owner') {
      fetchApplications();
    }
  }, [userRole]);

  const handleReviewApplication = async (applicationId: string, action: 'approve' | 'deny') => {
    setIsLoading(true);
    try {
      const result = await newAdminService.reviewApplication(applicationId, action, userRole);
      
      if (result.success) {
        toast({
          title: `Application ${action === 'approve' ? 'Approved' : 'Denied'}`,
          description: `The application has been ${action === 'approve' ? 'approved' : 'denied'} successfully.`,
        });
        await fetchApplications();
      } else {
        toast({
          title: "Review Failed",
          description: result.error || `Failed to ${action} application`,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Review Error",
        description: `An error occurred while ${action}ing the application`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (userRole !== 'owner') {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400">Access denied. Only owners can manage applications.</div>
      </div>
    );
  }

  return (
    <div className="space-y-3 md:space-y-4">
      <div className="flex items-center space-x-2">
        <Users className="h-5 w-5 text-purple-400" />
        <h3 className="text-lg md:text-xl font-bold text-white">Admin Applications</h3>
      </div>

      <Card className="admin-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm md:text-base text-white">
            Pending Applications ({applications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {applications.map((application) => (
              <div 
                key={application.id} 
                className="p-3 md:p-4 bg-gray-800/40 rounded-lg border border-gray-700/40"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                      <span className="text-white font-medium">
                        {application.discord}
                      </span>
                      <span className="text-xs text-gray-400">
                        Applied for {application.requested_role}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-400">
                      <div>
                        <span className="font-medium">Role:</span> {application.requested_role}
                      </div>
                      <div>
                        <span className="font-medium">Applied:</span> {' '}
                        {new Date(application.submitted_at).toLocaleDateString()}
                      </div>
                      <div className="md:col-span-2">
                        <span className="font-medium">IP:</span> {application.ip_address}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 flex-shrink-0 ml-3">
                    <Button
                      onClick={() => handleReviewApplication(application.id, 'approve')}
                      disabled={isLoading}
                      className="admin-button bg-green-600/20 border border-green-500/50 text-green-400 hover:bg-green-600/30"
                      size="sm"
                    >
                      <UserCheck className="h-3 w-3 md:h-4 md:w-4" />
                    </Button>
                    
                    <Button
                      onClick={() => handleReviewApplication(application.id, 'deny')}
                      disabled={isLoading}
                      className="admin-button bg-red-600/20 border border-red-500/50 text-red-400 hover:bg-red-600/30"
                      size="sm"
                    >
                      <UserX className="h-3 w-3 md:h-4 md:w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {applications.length === 0 && (
              <div className="text-center py-6 text-gray-400">
                No pending applications found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationsManager;
