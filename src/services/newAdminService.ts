import { supabase } from '@/integrations/supabase/client';

export interface AdminAuthResult {
  success: boolean;
  role?: string;
  needsOnboarding?: boolean;
  error?: string;
}

export interface OnboardingData {
  discord: string;
  requestedRole: string;
  secretKey: string;
}

export interface AdminApplication {
  id: string;
  discord: string;
  requested_role: string;
  status: string;
  secret_key: string;
  ip_address: string;
  submitted_at: string;
  reviewed_by?: string;
  reviewed_at?: string;
}

export interface AdminUser {
  id: string;
  ip_address: string;
  role: string;
  approved_by: string;
  approved_at: string;
  last_access: string;
}

// Thoroughly clear all authentication state, including Supabase
export const clearAllAuthState = (): void => {
  // Old code clears our custom keys...
  localStorage.removeItem('admin_session_token');
  localStorage.removeItem('new_admin_auth');
  localStorage.removeItem('admin_role');
  localStorage.removeItem('admin_ip');
  
  // Clear supabase and other auth-related storage
  Object.keys(localStorage).forEach(key => {
    if (
      key.includes('admin') ||
      key.includes('auth') ||
      key.startsWith('supabase.auth.') ||
      key.includes('sb-')
    ) {
      localStorage.removeItem(key);
    }
  });

  Object.keys(sessionStorage).forEach(key => {
    if (
      key.includes('admin') ||
      key.includes('auth') ||
      key.startsWith('supabase.auth.') ||
      key.includes('sb-')
    ) {
      sessionStorage.removeItem(key);
    }
  });

  // Clear cookies
  document.cookie.split(";").forEach(function(c) { 
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
  });
};

// Check if user has existing access based on IP
export const checkAdminAccess = async (): Promise<{ hasAccess: boolean; role?: string }> => {
  try {
    const { data, error } = await supabase.rpc('check_admin_access');
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      const result = data[0];
      return { hasAccess: result.has_access, role: result.user_role };
    }
    
    return { hasAccess: false };
  } catch (error) {
    console.error('Admin access check error:', error);
    return { hasAccess: false };
  }
};

// Helper to robustly poll checkAdminAccess multiple times
async function robustCheckAdminAccess(
  maxRetries = 8,
  baseDelayMs = 80
): Promise<{ hasAccess: boolean; role?: string }> {
  for (let i = 0; i < maxRetries; i++) {
    const res = await checkAdminAccess();
    if (res.hasAccess && res.role) return res;

    // Exponential backoff (min 80ms, max 1500ms)
    await new Promise((r) => setTimeout(r, Math.min(baseDelayMs * (2 ** i), 1500)));
  }
  return { hasAccess: false };
}

// Authenticate with password (now with robust check)
export const authenticateAdmin = async (password: string): Promise<AdminAuthResult> => {
  try {
    // Edge function for owner -- real IP logic now
    // Always clear state before login attempt to avoid limbo
    clearAllAuthState();

    const response = await fetch(
      "https://gpofewohvpggmmhgaqxj.functions.supabase.co/admin_owner_login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      }
    );

    const ownerResult = await response.json();

    if (ownerResult?.success && ownerResult?.role === "owner") {
      // Poll access up to 1.5s (8 retries)
      const check = await robustCheckAdminAccess();
      if (check.hasAccess && check.role === "owner") {
        // Optionally set token for session compatibility
        localStorage.setItem('admin_role', 'owner');
        return { success: true, role: "owner" };
      } else {
        return {
          success: false,
          error:
            "Owner login succeeded, but admin access was still denied after retry. Debug info: " +
            JSON.stringify(ownerResult) +
            " Access check: " +
            JSON.stringify(check),
        };
      }
    }

    // General admin password fallback as before
    const { data: configs, error } = await supabase
      .from('auth_config')
      .select('config_key, config_value');

    if (error) throw error;

    const generalPassword = configs?.find(c => c.config_key === 'general_password')?.config_value;

    if (password === generalPassword) {
      return { success: true, needsOnboarding: true };
    } else {
      return { success: false, error: 'Invalid password' };
    }
  } catch (error: any) {
    console.error('Admin authentication error:', error);
    return { success: false, error: error.message };
  }
};

// Submit onboarding application
export const submitOnboardingApplication = async (data: OnboardingData): Promise<{ success: boolean; error?: string }> => {
  try {
    const userIp = await getUserIP();
    
    const { error } = await supabase
      .from('admin_applications')
      .insert({
        discord: data.discord,
        requested_role: data.requestedRole as 'admin' | 'moderator' | 'tester',
        secret_key: data.secretKey,
        ip_address: userIp,
        status: 'pending'
      });

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Onboarding submission error:', error);
    return { success: false, error: error.message };
  }
};

// Clear all admin sessions (owner only)
export const clearAllAdminSessions = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    // Delete all admin users (this will force re-authentication)
    const { error } = await supabase
      .from('admin_users')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Clear sessions error:', error);
    return { success: false, error: error.message };
  }
};

// Get pending applications (owner only)
export const getPendingApplications = async (): Promise<AdminApplication[]> => {
  try {
    const { data, error } = await supabase
      .from('admin_applications')
      .select('*')
      .eq('status', 'pending')
      .order('submitted_at', { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Get applications error:', error);
    return [];
  }
};

// Approve/deny application (owner only)
export const reviewApplication = async (
  applicationId: string, 
  action: 'approve' | 'deny',
  reviewerRole: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    if (reviewerRole !== 'owner') {
      return { success: false, error: 'Only owners can review applications' };
    }

    // Get the application first
    const { data: application, error: fetchError } = await supabase
      .from('admin_applications')
      .select('*')
      .eq('id', applicationId)
      .single();

    if (fetchError) throw fetchError;

    if (action === 'approve') {
      // Add to admin_users table
      const { error: insertError } = await supabase
        .from('admin_users')
        .insert({
          ip_address: application.ip_address,
          role: application.requested_role,
          approved_by: 'owner',
          approved_at: new Date().toISOString()
        });

      if (insertError) throw insertError;
    }

    // Update application status
    const { error: updateError } = await supabase
      .from('admin_applications')
      .update({
        status: action === 'approve' ? 'approved' : 'denied',
        reviewed_by: 'owner',
        reviewed_at: new Date().toISOString()
      })
      .eq('id', applicationId);

    if (updateError) throw updateError;

    return { success: true };
  } catch (error: any) {
    console.error('Review application error:', error);
    return { success: false, error: error.message };
  }
};

// Get user IP (placeholder - in real app this would be server-side)
const getUserIP = async (): Promise<string> => {
  try {
    // In production, this should be handled server-side
    // For now, we'll use a placeholder IP
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  } catch (error) {
    return `fallback_${Date.now()}`;
  }
};

// Get all admin users (owner only)
export const getAdminUsers = async (): Promise<AdminUser[]> => {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('approved_at', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Get admin users error:', error);
    return [];
  }
};

export const newAdminService = {
  checkAdminAccess,
  authenticateAdmin,
  submitOnboardingApplication,
  getPendingApplications,
  reviewApplication,
  getAdminUsers,
  clearAllAuthState,
  clearAllAdminSessions
};
