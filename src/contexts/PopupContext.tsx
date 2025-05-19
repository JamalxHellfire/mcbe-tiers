
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Player, GameMode, TierLevel, playerService } from '@/services/playerService';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export interface TierAssignment {
  gamemode: GameMode;
  tier: TierLevel;
  points: number;
}

export interface ResultPopupData {
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

interface PopupContextType {
  popupData: ResultPopupData | null;
  showPopup: boolean;
  closePopup: () => void;
  setPopupDataFromPlayer: (player: Player, tierAssignments: TierAssignment[]) => void;
}

const PopupContext = createContext<PopupContextType>({
  popupData: null,
  showPopup: false,
  closePopup: () => {},
  setPopupDataFromPlayer: () => {},
});

export const usePopup = () => useContext(PopupContext);

export const PopupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [popupData, setPopupData] = useState<ResultPopupData | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  // Listen for result submissions
  useEffect(() => {
    const channel = supabase
      .channel('result-submissions')
      .on('broadcast', { event: 'result-submitted' }, (payload) => {
        const { player, tierAssignments } = payload;
        if (player && tierAssignments) {
          setPopupDataFromPlayer(player, tierAssignments);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Calculate combat rank based on total points
  const calculateCombatRank = (points: number) => {
    if (points >= 200 && points <= 250) {
      return {
        title: 'Combat General',
        points,
        color: 'text-yellow-400',
        effectType: 'gold-sparkle' as const,
      };
    } else if (points >= 150 && points < 200) {
      return {
        title: 'Combat Marshal',
        points,
        color: 'text-gray-300',
        effectType: 'silver-sparkle' as const,
      };
    } else if (points >= 75 && points < 150) {
      return {
        title: 'Combat Ace',
        points,
        color: 'text-amber-700',
        effectType: 'bronze-sparkle' as const,
      };
    } else if (points >= 25 && points < 75) {
      return {
        title: 'Combat Cadet',
        points,
        color: 'text-blue-400',
        effectType: 'blue-glow' as const,
      };
    } else {
      return {
        title: 'Combat Rookie',
        points,
        color: 'text-gray-400',
        effectType: 'grey-glow' as const,
      };
    }
  };

  const setPopupDataFromPlayer = (player: Player, tierAssignments: TierAssignment[]) => {
    // Calculate total combat points (from Crystal, Axe, Sword, Mace, SMP)
    const combatGamemodes: GameMode[] = ['Crystal', 'Axe', 'Sword', 'Mace', 'SMP'];
    const totalCombatPoints = tierAssignments
      .filter(assignment => combatGamemodes.includes(assignment.gamemode))
      .reduce((sum, assignment) => sum + assignment.points, 0);
    
    // Maximum possible points is 50 per gamemode × 5 gamemodes = 250
    const clampedPoints = Math.min(250, totalCombatPoints);
    
    // Calculate combat rank
    const combatRank = calculateCombatRank(clampedPoints);
    
    setPopupData({
      player,
      tierAssignments,
      combatRank,
      timestamp: new Date().toISOString(),
    });
    
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <PopupContext.Provider
      value={{
        popupData,
        showPopup,
        closePopup,
        setPopupDataFromPlayer,
      }}
    >
      {children}
    </PopupContext.Provider>
  );
};
