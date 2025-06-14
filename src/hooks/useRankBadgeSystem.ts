
import { useState, useCallback } from 'react';
import { RankInfo, getRankByPoints } from '@/components/RankBadge';

interface RankBadgeState {
  showPopup: boolean;
  currentRank: RankInfo | null;
  playerName: string;
  points: number;
}

export function useRankBadgeSystem() {
  const [state, setState] = useState<RankBadgeState>({
    showPopup: false,
    currentRank: null,
    playerName: '',
    points: 0
  });

  const showRankPopup = useCallback((playerName: string, points: number) => {
    const rank = getRankByPoints(points);
    setState({
      showPopup: true,
      currentRank: rank,
      playerName,
      points
    });
  }, []);

  const hideRankPopup = useCallback(() => {
    setState(prev => ({ ...prev, showPopup: false }));
  }, []);

  const getRankForPoints = useCallback((points: number) => {
    return getRankByPoints(points);
  }, []);

  return {
    ...state,
    showRankPopup,
    hideRankPopup,
    getRankForPoints
  };
}
