
import React from 'react';
import { RankPopup as RankPopupComponent } from './RankBadgeSystem';
import type { RankInfo } from './RankBadgeSystem';

// Re-export for backward compatibility
interface RankPopupProps {
  rank: RankInfo;
  playerName: string;
  points: number;
  isOpen: boolean;
  onClose: () => void;
}

export const RankPopup: React.FC<RankPopupProps> = (props) => {
  return <RankPopupComponent {...props} />;
};
