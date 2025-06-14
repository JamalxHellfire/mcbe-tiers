
import React from 'react';
import { Award, Shield, Star, Crown, Zap, Trophy, Gem } from 'lucide-react';

// Map of rank titles to their corresponding icons
const rankIconMap: Record<string, React.ComponentType<any>> = {
  'Combat Grandmaster': Gem,
  'Combat Master': Crown,
  'Combat Ace': Star,
  'Combat Specialist': Shield,
  'Combat Cadet': Zap,
  'Combat Novice': Award,
  'Rookie': Trophy,
  // Legacy mappings for backwards compatibility
  'Combat General': Crown,
  'Combat Marshal': Shield,
  'Combat Sargent': Zap,
};

interface RankBadgeIconProps {
  rank: string;
  className?: string;
}

export function RankBadgeIcon({ rank, className = '' }: RankBadgeIconProps) {
  const IconComponent = rankIconMap[rank];
  
  if (!IconComponent) {
    return <Trophy className={className} />;
  }
  
  return <IconComponent className={className} />;
}
