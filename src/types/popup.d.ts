
import { GameMode, TierLevel, Player } from '@/services/playerService';

declare global {
  interface TierAssignment {
    gamemode: GameMode;
    tier: TierLevel;
    points: number;
  }
  
  interface ResultPopupData {
    player: Player;
    tierAssignments: TierAssignment[];
    combatRank: {
      title: string;
      points: number;
      color: string;
      effectType: 'gold-sparkle' | 'silver-sparkle' | 'bronze-sparkle' | 'blue-glow' | 'grey-glow';
    };
    timestamp: string;
  }
}
