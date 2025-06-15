import { supabase } from '@/integrations/supabase/client';

interface AdminApplication {
  id: string;
  discord: string;
  ip_address: string;
  secret_key: string;
  requested_role: string;
  submitted_at: string;
  status: 'pending' | 'approved' | 'denied';
  reviewed_at: string | null;
  reviewed_by: string | null;
}

interface AdminUser {
  id: string;
  approved_by: string;
  role: string;
  approved_at: string;
}

interface LoginResult {
  success: boolean;
  sessionToken?: string;
  error?: string;
  role?: string;
}

export const newAdminService = {
  async adminLogin(secretKey: string, ipAddress: string): Promise<LoginResult> {
    try {
      const { data: application, error: applicationError } = await supabase
        .from('admin_applications')
        .select('*')
        .eq('secret_key', secretKey)
        .eq('ip_address', ipAddress)
        .eq('status', 'pending')
        .single();

      if (applicationError) {
        console.error('Application fetch error:', applicationError);
        return { success: false, error: 'Invalid secret key or IP address.' };
      }

      if (!application) {
        return { success: false, error: 'No pending application found.' };
      }

      // Mark application as approved and get the requested role
      const requestedRole = application.requested_role;
      const applicationId = application.id;

      // Fetch the admin user to get the role
      const { data: adminUser, error: adminUserError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', applicationId)
        .single();

      if (adminUserError) {
        console.error('Admin user fetch error:', adminUserError);
        return { success: false, error: 'Failed to fetch admin user.' };
      }

      if (!adminUser) {
        return { success: false, error: 'Admin user not found.' };
      }

      const sessionToken = this.generateSessionToken();
      localStorage.setItem('admin_session_token', sessionToken);
      localStorage.setItem('admin_user_role', adminUser.role);

      return { success: true, sessionToken: sessionToken, role: adminUser.role };
    } catch (error: any) {
      console.error('Admin login error:', error);
      return { success: false, error: error.message };
    }
  },

  async validateSession(sessionToken: string): Promise<boolean> {
    const storedToken = localStorage.getItem('admin_session_token');
    return storedToken === sessionToken;
  },

  async getAdminRole(): Promise<string | null> {
    return localStorage.getItem('admin_user_role');
  },

  async clearAllAuthState(): Promise<void> {
    localStorage.removeItem('admin_session_token');
    localStorage.removeItem('admin_user_role');
  },

  generateSessionToken(): string {
    const randomBytes = new Uint8Array(32);
    window.crypto.getRandomValues(randomBytes);
    return Array.from(randomBytes).map(byte => byte.toString(16).padStart(2, '0')).join('');
  },

  async getPendingApplications(): Promise<AdminApplication[]> {
    try {
      const { data, error } = await supabase
        .from('admin_applications')
        .select('*')
        .eq('status', 'pending');

      if (error) {
        console.error('Fetch applications error:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Get pending applications error:', error);
      return [];
    }
  },

  async clearAllAdminSessions(): Promise<{ success: boolean; error?: string }> {
    try {
      // No direct way to invalidate sessions in localStorage, so this is a mock clear
      localStorage.removeItem('admin_session_token');
      localStorage.removeItem('admin_user_role');

      return { success: true };
    } catch (error: any) {
      console.error('Clear sessions error:', error);
      return { success: false, error: error.message };
    }
  },

  // Review application with role assignment
  async reviewApplicationWithRole(
    applicationId: string, 
    action: 'approve' | 'deny', 
    reviewerRole: string,
    assignedRole?: string
  ) {
    try {
      console.log(`Reviewing application ${applicationId} with action: ${action}, role: ${assignedRole}`);
      
      if (action === 'approve' && assignedRole) {
        // Type assertion to ensure role is valid
        const validRole = assignedRole as 'owner' | 'admin' | 'moderator' | 'tester';
        
        // Insert into admin_users table with proper role type
        const { error: insertError } = await supabase
          .from('admin_users')
          .insert({
            approved_by: 'owner', // Since only owners can review
            role: validRole,
            approved_at: new Date().toISOString()
          });

        if (insertError) {
          console.error('Insert error:', insertError);
          return { success: false, error: insertError.message };
        }
      }

      // Update application status
      const { error: updateError } = await supabase
        .from('admin_applications')
        .update({ 
          status: action === 'approve' ? 'approved' : 'denied',
          reviewed_at: new Date().toISOString(),
          reviewed_by: reviewerRole
        })
        .eq('id', applicationId);

      if (updateError) {
        console.error('Update error:', updateError);
        return { success: false, error: updateError.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Review application error:', error);
      return { success: false, error: error.message };
    }
  },
};
