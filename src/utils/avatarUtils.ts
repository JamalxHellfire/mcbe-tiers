
/**
 * Formats a Minecraft avatar URL using Visage Bust API as primary and Crafatar as fallback
 */
export const getAvatarUrl = async (ign: string, javaUsername?: string | null): Promise<string> => {
  // Use java username if provided, otherwise use IGN
  const username = javaUsername || ign;
  
  // Primary: Visage Bust API (3D renders) - centered bust
  try {
    const visageUrl = `https://visage.surgeplay.com/bust/128/${username}`;
    // Test if the image exists
    const response = await fetch(visageUrl, { method: 'HEAD' });
    if (response.ok) {
      return visageUrl;
    }
  } catch (error) {
    console.error('Visage API error:', error);
  }
  
  // Fallback 1: Try Mojang API + Crafatar for Java usernames
  if (javaUsername) {
    try {
      const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${javaUsername}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.id) {
          return `https://crafatar.com/avatars/${data.id}?size=128&overlay=true`;
        }
      }
    } catch (error) {
      console.error('Error fetching Java skin:', error);
    }
  }
  
  // Fallback 2: Crafatar with IGN
  return `https://crafatar.com/avatars/${username}?size=128&overlay=true`;
};

/**
 * Silent error handling for avatar loading failures
 */
export const handleAvatarError = (event: React.SyntheticEvent<HTMLImageElement>) => {
  try {
    event.currentTarget.src = '/default-avatar.png';
    event.currentTarget.style.opacity = '0.8';
  } catch (e) {
    // Silent fail
  }
};

/**
 * Cache for storing fetched avatar URLs
 */
export const avatarCache: Record<string, string> = {};

/**
 * Prefetch and cache an avatar to improve performance
 */
export const prefetchAvatar = async (ign: string, javaUsername?: string | null): Promise<void> => {
  try {
    if (avatarCache[ign]) return;
    
    const url = await getAvatarUrl(ign, javaUsername);
    
    const img = new Image();
    img.src = url;
    
    img.onload = () => {
      avatarCache[ign] = url;
    };
    
    img.onerror = () => {
      avatarCache[ign] = '/default-avatar.png';
    };
  } catch (e) {
    // Silent failure
  }
};
