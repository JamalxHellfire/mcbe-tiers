
import React from 'react';
import { Award } from 'lucide-react';

// Expand with additional rank icons as needed!
const rankIconMap: Record<string, React.ReactNode> = {
  'Combat Master': <Award />,
  // Example for custom in the future:
  // 'Combat Supreme': <YourCustomIcon />,
};

interface RankBadgeIconProps {
  rank: string;
  className?: string;
}

export function RankBadgeIcon({ rank, className = '' }: RankBadgeIconProps) {
  const icon = rankIconMap[rank] || null;
  if (!icon) return null;
  // Clone with sizing
  return React.cloneElement(icon as React.ReactElement, { className });
}
