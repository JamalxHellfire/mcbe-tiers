
/**
 * Formats a Minecraft avatar URL with proper fallback handling
 */
export const getAvatarUrl = (avatarUrl: string | null, javaUsername?: string | null): string => {
  // First try the stored avatar URL
  if (avatarUrl) {
    return avatarUrl;
  }
  
  // If we have a Java username, generate a URL
  if (javaUsername) {
    return `https://crafthead.net/avatar/${javaUsername}`;
  }
  
  // Default fallback
  return '/default-avatar.png';
};

/**
 * Handles avatar loading errors by setting a default image
 */
export const handleAvatarError = (event: React.SyntheticEvent<HTMLImageElement>) => {
  event.currentTarget.src = '/default-avatar.png';
};
