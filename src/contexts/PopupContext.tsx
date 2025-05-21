
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Player, GameMode, TierLevel, playerService } from '@/services/playerService';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { getPlayerRank } from '@/utils/rankUtils';

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
    effectType: string;
    borderColor: string;
    icon: string;
    rankNumber: number;
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
  // Updated according to new rank thresholds from requirements
  const calculateCombatRank = (points: number, leaderboardPosition: number = 1) => {
    if (points >= 300) {
      return {
        title: 'Combat General',
        points,
        color: 'text-red-500',
        effectType: 'firestorm',
        borderColor: 'border-red-500/50',
        icon: 'general-icon.svg',
        rankNumber: leaderboardPosition
      };
    } else if (points >= 200 && points < 300) {
      return {
        title: 'Combat Marshal',
        points,
        color: 'text-yellow-400',
        effectType: 'lightning',
        borderColor: 'border-yellow-400/50',
        icon: 'marshal-icon.svg',
        rankNumber: leaderboardPosition
      };
    } else if (points >= 100 && points < 200) {
      return {
        title: 'Combat Ace',
        points,
        color: 'text-gray-300',
        effectType: 'silver',
        borderColor: 'border-gray-300/50',
        icon: 'ace-icon.svg',
        rankNumber: leaderboardPosition
      };
    } else if (points >= 50 && points < 100) {
      return {
        title: 'Combat Cadet',
        points,
        color: 'text-blue-400',
        effectType: 'blue',
        borderColor: 'border-blue-400/50',
        icon: 'cadet-icon.svg',
        rankNumber: leaderboardPosition
      };
    } else {
      return {
        title: 'Combat Rookie',
        points,
        color: 'text-white',
        effectType: 'white',
        borderColor: 'border-white/30',
        icon: 'rookie-icon.svg',
        rankNumber: leaderboardPosition
      };
    }
  };

  const setPopupDataFromPlayer = async (player: Player, tierAssignments: TierAssignment[]) => {
    // Calculate total combat points across all gamemodes
    const totalCombatPoints = tierAssignments.reduce(
      (sum, assignment) => sum + assignment.points, 0
    );
    
    // Get player's leaderboard position
    let leaderboardPosition = 1;
    try {
      const leaderboardPlayers = await playerService.getRankedPlayers();
      const playerIndex = leaderboardPlayers.findIndex(p => p.id === player.id);
      if (playerIndex !== -1) {
        leaderboardPosition = playerIndex + 1;
      }
    } catch (error) {
      console.error("Error fetching leaderboard position:", error);
    }
    
    // Calculate combat rank
    const combatRank = calculateCombatRank(totalCombatPoints, leaderboardPosition);
    
    setPopupData({
      player,
      tierAssignments,
      combatRank,
      timestamp: new Date().toISOString(),
    });
    
    setShowPopup(true);
    
    // Also show a toast notification
    toast.success("New player results submitted!", {
      description: `${player.ign} has been ranked as ${combatRank.title} with ${totalCombatPoints} points.`,
      duration: 5000,
    });
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
