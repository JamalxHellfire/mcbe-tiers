
/**
 * Formats a Minecraft avatar URL with proper fallback handling
 * Uses Crafatar API to fetch skins with priority on Java usernames
 */
export const getAvatarUrl = async (ign: string, javaUsername?: string | null): Promise<string> => {
  // If Java username is provided, use the Mojang API to get UUID and then Crafatar for the skin
  if (javaUsername) {
    try {
      const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${javaUsername}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.id) {
          return `https://crafatar.com/avatars/${data.id}?size=160&overlay=true`;
        }
      }
    } catch (error) {
      console.error('Error fetching Java skin:', error);
      // Silently fall through to fallback options
    }
  }
  
  // Fallback to using the IGN directly with Crafatar API
  return `https://crafatar.com/avatars/${ign}?size=160&overlay=true`;
};

/**
 * Silent error handling for avatar loading failures
 */
export const handleAvatarError = (event: React.SyntheticEvent<HTMLImageElement>) => {
  try {
    event.currentTarget.src = '/default-avatar.png';
    event.currentTarget.style.opacity = '0.8'; // Slightly fade the fallback image
  } catch (e) {
    // Silent fail - no visual indication as per requirements
  }
};

/**
 * Cache for storing fetched avatar URLs
 * This helps improve performance for repeat views
 */
export const avatarCache: Record<string, string> = {};

/**
 * Prefetch and cache an avatar to improve performance
 */
export const prefetchAvatar = async (ign: string, javaUsername?: string | null): Promise<void> => {
  try {
    if (avatarCache[ign]) return;
    
    const url = await getAvatarUrl(ign, javaUsername);
    
    // Preload the image
    const img = new Image();
    img.src = url;
    
    // Store in cache when loaded
    img.onload = () => {
      avatarCache[ign] = url;
    };
    
    img.onerror = () => {
      // Silently use default
      avatarCache[ign] = '/default-avatar.png';
    };
  } catch (e) {
    // Silent failure - no UI indication as per requirements
  }
};
