
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
  
  // Listen for Escape key to close popup
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showPopup) {
        closePopup();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [showPopup]);

  // Calculate combat rank based on total points
  const calculateCombatRank = (points: number, leaderboardPosition: number = 1) => {
    if (points >= 300) {
      return {
        title: 'Combat General',
        points,
        color: 'text-red-500',
        effectType: 'general',
        borderColor: 'border-red-500/50',
        icon: 'general-icon.svg',
        rankNumber: leaderboardPosition
      };
    } else if (points >= 200 && points < 300) {
      return {
        title: 'Combat Marshal',
        points,
        color: 'text-yellow-400',
        effectType: 'marshal',
        borderColor: 'border-yellow-400/50',
        icon: 'marshal-icon.svg',
        rankNumber: leaderboardPosition
      };
    } else if (points >= 100 && points < 200) {
      return {
        title: 'Combat Ace',
        points,
        color: 'text-gray-300',
        effectType: 'ace',
        borderColor: 'border-gray-300/50',
        icon: 'ace-icon.svg',
        rankNumber: leaderboardPosition
      };
    } else if (points >= 50 && points < 100) {
      return {
        title: 'Combat Cadet',
        points,
        color: 'text-blue-400',
        effectType: 'cadet',
        borderColor: 'border-blue-400/50',
        icon: 'cadet-icon.svg',
        rankNumber: leaderboardPosition
      };
    } else {
      return {
        title: 'Combat Rookie',
        points,
        color: 'text-white',
        effectType: 'rookie',
        borderColor: 'border-white/30',
        icon: 'rookie-icon.svg',
        rankNumber: leaderboardPosition
      };
    }
  };

  const setPopupDataFromPlayer = async (player: Player, tierAssignments: TierAssignment[]) => {
    try {
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
      
      // No toast notification as per requirements
    } catch (error) {
      // Silent error handling - no UI feedback as per requirements
      console.error("Error setting popup data:", error);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    // Allow animations to complete before clearing data
    setTimeout(() => {
      if (!showPopup) {
        setPopupData(null);
      }
    }, 300);
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
