
// Admin service for handling admin authentication and session management
const ADMIN_PIN = '1234'; // Set the admin PIN to 1234 as requested
const SESSION_KEY = 'mc_tiers_admin_session';
const SESSION_DURATION = 3600000; // 1 hour in milliseconds

interface AdminSession {
  isAdmin: boolean;
  expiresAt: number;
}

// Check if the user is an admin
export const isAdmin = (): boolean => {
  const session = getSession();
  if (!session) return false;
  
  return session.isAdmin && session.expiresAt > Date.now();
};

// Set admin status
export const setAdmin = (status: boolean): void => {
  const expiresAt = Date.now() + SESSION_DURATION;
  const session: AdminSession = {
    isAdmin: status,
    expiresAt
  };
  
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

// Check if the session has expired
export const checkExpiration = (): boolean => {
  const session = getSession();
  if (!session) return false;
  
  if (session.expiresAt <= Date.now()) {
    // Session has expired, clear it
    logoutAdmin();
    return false;
  }
  
  return session.isAdmin;
};

// Get the current session
export const getSession = (): AdminSession | null => {
  const sessionStr = localStorage.getItem(SESSION_KEY);
  if (!sessionStr) return null;
  
  try {
    return JSON.parse(sessionStr) as AdminSession;
  } catch (e) {
    return null;
  }
};

// Logout admin
export const logoutAdmin = (): void => {
  localStorage.removeItem(SESSION_KEY);
};

export const adminService = {
  isAdmin,
  setAdmin,
  checkExpiration,
  logoutAdmin
};

export default adminService;
