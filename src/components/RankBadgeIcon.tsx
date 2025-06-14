
import React from 'react';
import { Award, Shield, Star, Crown, Zap } from 'lucide-react';

// Map of rank titles to their corresponding icons
const rankIconMap: Record<string, React.ComponentType<any>> = {
  'Combat Master': Award,
  'Combat General': Crown,
  'Combat Marshal': Shield,
  'Combat Ace': Star,
  'Combat Sargent': Zap,
  // Add more ranks as needed
};

interface RankBadgeIconProps {
  rank: string;
  className?: string;
}

export function RankBadgeIcon({ rank, className = '' }: RankBadgeIconProps) {
  const IconComponent = rankIconMap[rank];
  
  if (!IconComponent) {
    return null;
  }
  
  return <IconComponent className={className} />;
}
