
import { useState, useCallback } from 'react';
import { getPlayerRank } from '@/utils/rankUtils';

interface RankPopupState {
  isVisible: boolean;
  rank: string;
  playerName?: string;
  points?: number;
  previousRank?: string;
}

export function useRankBadgeSystem() {
  const [popupState, setPopupState] = useState<RankPopupState>({
    isVisible: false,
    rank: 'Rookie'
  });

  const showRankPopup = useCallback((
    playerName: string,
    currentPoints: number,
    previousPoints?: number
  ) => {
    const currentRank = getPlayerRank(currentPoints);
    const previousRank = previousPoints ? getPlayerRank(previousPoints) : null;
    
    // Only show popup if rank has changed or if it's a new achievement
    if (!previousRank || previousRank.title !== currentRank.title) {
      setPopupState({
        isVisible: true,
        rank: currentRank.title,
        playerName,
        points: currentPoints,
        previousRank: previousRank?.title
      });
    }
  }, []);

  const hideRankPopup = useCallback(() => {
    setPopupState(prev => ({ ...prev, isVisible: false }));
  }, []);

  const triggerRankBadge = useCallback((rank: string, playerName?: string, points?: number) => {
    setPopupState({
      isVisible: true,
      rank,
      playerName,
      points
    });
  }, []);

  return {
    popupState,
    showRankPopup,
    hideRankPopup,
    triggerRankBadge
  };
}
