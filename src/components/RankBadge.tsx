
import React from 'react';
import { RankBadge as RankBadgeComponent, getRankByPoints, RANK_TIERS } from './RankBadgeSystem';
import type { RankInfo } from './RankBadgeSystem';

// Re-export everything from RankBadgeSystem for backward compatibility
export { getRankByPoints, RANK_TIERS };
export type { RankInfo };

interface RankBadgeProps {
  rank: RankInfo;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showGlow?: boolean;
  animated?: boolean;
  className?: string;
  onClick?: () => void;
}

export function RankBadge(props: RankBadgeProps) {
  return <RankBadgeComponent {...props} />;
}
